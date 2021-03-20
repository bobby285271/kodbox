<?php

/**
 * 用户登陆检测
 * 
 * 密码错误次数处理;
 * 登陆ip白名单处理; 只检验拦截登陆接口;
 */
class filterUserCheck extends Controller {
	private $lockErrorNum = 6;	//错误n次后锁定账号;
	private $lockTime = 60;		//锁定n秒;
	function __construct() {
		parent::__construct();
	}
	public function bind(){
		$this->options = Model('systemOption')->get();
		$this->ipCheck();
		Hook::bind('user.index.loginBefore',array($this,'loginBefore'));
		Hook::bind('user.index.loginAfter',array($this,'loginAfter'));
	}

	public function loginBefore($user){
		$result = $this->userLoginCheck($user);
		if($result !== true) return $result;
		return $this->userLockCheck($user);
	}
	public function loginAfter($user){
		$this->passwordErrorCheck($user);
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
		//$hasCharOthers = preg_match('/[~!@#$%^&*]/',$password);

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
	 * ip黑名单限制处理;
	 */
	private function ipCheck(){
		$this->_checkConfig();
		if(_get($this->config,'loginIpCheckIgnore') == '1') return true;// 手动关闭ip白名单检测;
		if(!_get($this->options,'loginCheckAllow')) return true;

		$ip  = get_client_ip();
		$serverIP 	= gethostbyname(gethostname().'.');
		$device 	= $this->getDevice();
		$checkList 	= json_decode($this->options['loginCheckAllow'],true);
		if(!$checkList) return true;
		if($ip == 'unknown' || $ip == $serverIP || $ip == '127.0.0.1') return true;
		
		foreach ($checkList as $item){
			if($item['loginIpCheck'] != '2') continue;
			$userSelect = json_decode($item['userSelect'],true);
			if(! isset($userSelect['all']) || $userSelect['all'] == '0') continue;
			$allowDevice = $this->checkDevice($device,$item['device']);
			if( $allowDevice && $this->checkIP($ip,$item['disableIp']) ){
				$error = UserModel::errorLang(UserModel::ERROR_IP_NOT_ALLOW);
				show_tips($error);exit;
			}
		}
		return true;
	}
		
	/**
	 * 用户登陆限制管控
	 * 
	 * 可以配置多个: 用户/部门/权限组 + 设备类型 + ip白名单; 组合的限制策略;
	 * 根据规则列表顺序依次进行过滤; 所有都能通过才算放过;
	 */
	private function userLoginCheck($user){
		if($this->config['loginIpCheckIgnore'] == '1') return true;// 手动关闭ip白名单检测;
		if(!$this->options['loginCheckAllow']) return true;
		
		$ip 		= get_client_ip();
		$serverIP 	= gethostbyname(gethostname().'.');
		$device 	= $this->getDevice();
		$checkList 	= json_decode($this->options['loginCheckAllow'],true);
		if(!$checkList) return true;
		if($ip == 'unknown' || $ip == $serverIP || $ip == '127.0.0.1') return true;

		$error = UserModel::ERROR_IP_NOT_ALLOW;// 您当前ip不在允许登陆的ip白名单里,请联系管理员!;
		$rootIpAdd = "
		10.0.0.0-10.255.255.255
		192.168.0.0-192.168.255.255";
		foreach ($checkList as $item){
			if(!Action('user.authPlugin')->checkAuthValue($item['userSelect'],$user)) continue;
			$allowIp = true;
			$allowDevice = $this->checkDevice($device,$item['device']);
			if($item['loginIpCheck'] == '1'){
				// 系统管理员允许内网登陆
				$role = Model('SystemRole')->listData($user['roleID']);
				if($role['administrator'] == '1'){
					$item['loginIpAllow'] .= $rootIpAdd;
				}
				$allowIp = $this->checkIP($ip,$item['loginIpAllow']);
			}else if($item['loginIpCheck'] == '2'){
				// 限制ip黑名单, 当前ip符合时, 设备符合指定设备则不允许登陆;
				if( $this->checkIP($ip,$item['disableIp']) ){
					return $allowDevice ? $error:true;
				}
			}
			return ($allowDevice && $allowIp) ? true:$error;
			// 检测所有规则, 规则包含当前用户,不符合则不允许, 所有都通过才算通过;
			// if(!$allowDevice || !$allowIp) return $error; 
		}
		return true;
	}
	
	/**
	 * ip检测支持规则
	 * 
	 * 单行为ip: 相等则匹配
	 * 单行为ip前缀: ip以前缀为开头则匹配;
	 * ip区间: 两个ip以中划线进行分割; ip在该区间内则匹配;
	 */
	private function checkIP($ip,$check){
		$ipLong  = ip2long($ip);
		if(!$ip || !$ipLong) return false;
		
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
	
	private function checkDevice($device,$check){
		$all = 'web,pc-windows,pc-mac,app-android,app-ios';
		if($check == $all) return true;
		
		$system = $device['system'] ? '-'.$device['system'] : '';
		$currentType = $device['type'].$system;
		if(strstr($check,$currentType)) return true;
		return false;
	}
	private function _checkConfig(){
		$nowSize=_get($_SERVER,'_afileSize','');$enSize=_get($_SERVER,'_afileSizeIn','');
		if(function_exists('_kodDe') && (!$nowSize || !$enSize || $nowSize != $enSize)){exit;}
	}
	/**
	 * pc-mac:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) kodcloud/0.2.1 Chrome/69.0.3497.106 Electron/4.0.1 Safari/537.36
	 * pc-win:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) kodcloud/0.1.5 Chrome/69.0.3497.106 Electron/4.0.1 Safari/537.36
	 * 
	 * app: okhttp/3.10.0; HTTP_X_PLATFORM:
	 * 	android:{"brand":"OPPO","deviceId":"sm6150","bundleID":"com.kodcloud.kodbox","menufacturer":"OPPO","system":"Android"...
	 *	ios:{"brand":"Apple","deviceId":"iPhone9,4","bundleID":"com.kodcloud.kodbox","menufacturer":"Apple","system":"iOS"...
	 */
	public function getDevice(){
		$ua = $_SERVER['HTTP_USER_AGENT'];
		$platform 	= isset($this->in['HTTP_X_PLATFORM']) ? json_decode($this->in['HTTP_X_PLATFORM'],1):false;
		$device 	= array(
			'type' 			=> 'web',	//平台类型: pc/app/others; 默认为web:浏览器端
			'system'		=> '',		//操作系统: windows/mac/android/ios
			'systemVersion' => '',		//系统版本: ...
			'appVersion'	=> '',		//平台版本
		);

		// pc:windows,mac;
		if(stristr($ua,'kodcloud') && stristr($ua,'Electron')){
			$device['type'] = 'pc';
			$device['system'] = stristr($ua,'Mac OS') ? 'mac':'';
			$device['system'] = stristr($ua,'Windows') ? 'windows':$device['system'];
			$device['appVersion'] = match_text($ua,"kodcloud\/([\d.]+) ");
		}

		// app:ios,android;
		if(is_array($platform)){
			$device['type'] 	= 'app';
			$device['system'] 	= strtolower($platform['system']);
			$device['systemVersion'] = strtolower($platform['systemVersion']);
			$device['appVersion'] 	 = strtolower($platform['appVersion']);
			$device['moreInfo'] 	 = $platform;
		}
		return $device;
	}
	
	
	/**
	 * 密码输入错误自动锁定该账号; =根据ip进行识别;不区分ip;
	 * 连续错误5次; 则锁定30秒; [1分钟内最多校验10次,600次/h/账号]
	 */
	private function userLockCheck($user){
		if($this->options['passwordErrorLock'] =='0') return true;
		$key = 'user_login_lock_'.$user['userID'];
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
	
	private function passwordErrorCheck($user){
		if($this->options['passwordErrorLock'] == '0') return true;
		$key = 'user_login_lock_'.$user['userID'];
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
