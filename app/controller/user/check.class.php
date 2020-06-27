<?php

/**
 * 用户登陆检测
 * 
 * 密码错误次数处理;
 * 登陆ip白名单处理; 只检验拦截登陆接口;
 */
class userCheck extends Controller {
	private $lockErrorNum = 5;	//10; 错误n次后锁定账号;
	private $lockTime = 30;		//60; 锁定n秒;
	function __construct() {
		$this->options = Model('systemOption')->get();
		parent::__construct();
	}
	
	public function loginBefore($name,$password){
		$result = $this->userIpCheck();
		if($result !== true) return $result;
		return $this->userLockCheck($name);
	}
	public function loginAfter($name,$userInfo){
		$this->passwordErrorCheck($name,$userInfo);
	}
	
	/**
	 * 密码强度校验;
	 * 
	 * none:不限制,默认;
	 * strong: 中等强度, 长度大于6; 必须同时包含英文和数字;
	 * strongMore: 高强度, 长度大于6; 必须同时包含数字,大写英文,小写英文;
	 * 
	 * 检测点: 用户注册;用户修改密码;管理员添加用户;管理员修改用户;导入用户;
	 * 前端点: 登陆成功后:如果密码规则不匹配当前强度,则提示修改密码;[提示点:注册密码,修改密码,编辑用户设置密码,添加用户设置密码]
	 */
	public function password($password,$out=false){
		$type = $this->options['passwordRule'];
		if( !$type || $type == 'none') return true;
		$length			= strlen($password);
		$hasNumber 		= preg_match('/\d/',$password);
		$hasChar   		= preg_match('/[A-Za-z]/',$password);
		$hasCharBig 	= preg_match('/[A-Z]/',$password);
		$hasCharSmall  	= preg_match('/[a-z]/',$password);
		$hasCharOthers 	= preg_match('/[~!@#$%^&*]/',$password);

		if( $type == 'strong' && $length >= 6 && $hasNumber && $hasChar){
			return true;
		}else if( $type == 'strongMore' && $length >= 6 && $hasNumber && $hasCharBig && $hasCharSmall){
			return true;
		}
		return false;
	}
	public function passwordTips(){
		$type = $this->options['passwordRule'];
		$desc = array(
			'strong'	 => LNG('admin.setting.passwordRuleStrongDesc'),
			'strongMore' => LNG('admin.setting.passwordRuleStrongMoreDesc')
		);
		$error = LNG('user.passwordCheckError');
		$errorMore = isset($desc[$type]) ? ";<br/>".$desc[$type]:'';
		return show_json($error.$errorMore,false);
	}
	
	/**
	 * 用户登陆ip白名单;
	 */
	private function userIpCheck(){
		if($this->options['loginIpCheck'] != '1') return true;
		if($this->config['loginIpCheckIgnore'] == '1') return true;// 手动关闭ip白名单检测;
		$ip = get_client_ip();
		$serverIP = gethostbyname(gethostname().'.');
		if($ip == 'unknown' || $serverIP == $ip) return true;

		$allow = $this->options['loginIpAllow']."
		127.0.0.10
		10.0.0.0-10.255.255.255
		192.168.0.0-192.168.255.255";
		
		if($this->ipCheck($ip,$allow)) return true;
		return UserModel::ERROR_IP_NOT_ALLOW;// 您当前ip不在允许登陆的ip白名单里,请联系管理员!;
	}
	
	/**
	 * ip检测支持规则
	 * 
	 * 单行为ip: 相等则匹配
	 * 单行为ip前缀: ip以前缀为开头则匹配;
	 * ip区间: 两个ip以中划线进行分割; ip在该区间内则匹配;
	 */
	private function ipCheck($ip,$check){
		$ipLong  = ip2long($ip);
		$allowIp = explode("\n",trim($check));
		foreach ($allowIp as $line) {
			$line = trim($line);
			if(!$line) continue;
			if( $ip == $line ) return true;
			if( count(explode('.',$line)) != 4 &&
				substr($ip,0,strlen($line)) == $line ){
				return true;
			}
			
			$ipRange = explode('-',$line);
			if(count($ipRange) != 2) continue;
			if( $ipLong >= ip2long($ipRange[0]) && 
				$ipLong <= ip2long($ipRange[1]) ){
				return true;
			}
		}
		return false;
	}
	
	
	/**
	 * 密码输入错误自动锁定该账号; =根据ip进行识别;不区分ip;
	 * 连续错误5次; 则锁定30秒; [1分钟内最多校验10次,600次/h/账号]
	 */
	private function userLockCheck($name){
		if($this->options['passwordErrorLock'] =='0') return true;
		$key = 'user_login_lock_'.$name;
		$arr = Cache::get($key);		

		// $item = is_array($arr) && is_array($arr[$ip]) ? $arr[$ip]:array();
		$item = is_array($arr)?$arr:array(); //不区分ip;
		if( count($item) >= $this->lockErrorNum && 
			time() - $item[count($item)-1] <= $this->lockTime
		){
			return UserModel::ERROR_USER_LOGIN_LOCK;
		}
		return true;
	}
	
	private function passwordErrorCheck($name,$user){
		if($this->options['passwordErrorLock'] =='0') return true;
		$key = 'user_login_lock_'.$name;
		$arr = Cache::get($key);
		$arr = is_array($arr) ? $arr:array();
		
		// $item = is_array($arr) && is_array($arr[$ip]) ? $arr[$ip]:array();
		$item = $arr; //不区分ip;get_client_ip();
		if(is_array($user)){
			Cache::remove($key);
		}else{
			if(count($item) >= $this->lockErrorNum){
				$item = array();
			}
			$item[] = time();
			$arr = $item;//不区分ip;			
			Cache::set($key,$arr,600);
		}
	}
}
