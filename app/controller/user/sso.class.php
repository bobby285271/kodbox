<?php

/**
 * 共享账号登录;支持限定账户,部门,权限组;
 * 
 * 同服务器引入调用;
 * include('config/config.php'); 
 * Action('user.sso')->checkAuth('key','xxx');
 * 
 * 
 * 通用远程调用
 */
class userSso extends Controller{
	public function __construct(){
		parent::__construct();
	}

	// 引入代码调用;
	public function check($appName,$authValue=''){
		$result = $this->checkAuth($appName,$authValue);
		if($result === true) return array(1,Action('user.index')->accessToken());
		$login = APP_HOST.'#user/login&link='.rawurlencode(this_url()).'&msg='.$result;
		header('Location:'.$login);exit;
	}
	private function checkAuth($appName,$authValue=''){
		Action('user.index')->init();
		if(!Session::get('kodUser.userID')) return '[API LOGIN]';
		if(!$authValue){
			$plugin = Model("Plugin")->loadList($appName);
			if (!$plugin || $plugin['status'] == 0){
				return $appName.' '.LNG('admin.plugin.disabled');
			}
			$authValue = $plugin['config']['pluginAuth'];
		}
		if(!Action('user.AuthPlugin')->checkAuthValue($authValue)){
			return LNG('user.loginNoPermission');
		}
		return true;
	}

	
	
	// 第三方通过url调用请求;
	public function apiCheckToken(){
		if($this->checkAuth($_GET['appName'],$_GET['authValue']) === true){
			echo "[ok]";
		}
	}
	// -> login&apiLogin => 第三方app&token=accessToken;
	public function apiLogin(){
		$result = $this->checkAuth($_GET['appName'],$_GET['authValue']);
		$callbackUrl = $_GET['callbackUrl'];
		if($result === true){
			$token = Action('user.index')->accessToken();
			$callbackUrl = $this->urlRemoveKey($callbackUrl,'kodTokenApi');
			if(strstr($callbackUrl,'?')){
				$callbackUrl = $callbackUrl.'&kodTokenApi='.$token;
			}else{
				$callbackUrl = $callbackUrl.'?kodTokenApi='.$token;
			}
			// pr($callbackUrl,$token);exit;
			header('Location:'.$callbackUrl);exit;
		}
		
		$link = APP_HOST.'#user/login&link='.rawurlencode($callbackUrl).'&callbackToken=1&msg='.$result;
		header('Location:'.$link);exit;
	}
	
	private function urlRemoveKey($url,$key){
		$parse = parse_url($url);
		parse_str($parse['query'],$get);
		unset($get[$key]);
		$query = http_build_query($get);
		$query = $query ? '?'.$query : '';
		return $parse['scheme'].'://'.$parse['host'].$parse['path'].$query;
	}
}