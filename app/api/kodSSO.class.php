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
include('config.php');
class KodSSO{
	private $ssoKey = 'KOD_SESSION_SSO';
	public function __construct(){		
		// Action('user.index')->init();
		$this->ssoID = $_COOKIE[$this->ssoKey];
		if(!$this->ssoID){
			$this->ssoID = mt_srand(microtime()*10000).microtime()*10000;
		}
		setCookie($this->ssoKey, $this->ssoID, time()+3600,'/',false,false,false);
		$this->session = Cache::get($this->ssoID);
		$this->session = $this->session ? $this->session : array();
	}

	public function checkAuth($appName,$authValue){
		$userID   = Session::get('kodUser.userID');
		$apiToken = $userID.json_encode($authValue);
		//检测是否已存在且校验通过; 用户登录名,权限都一致
		if($userID && $this->session[$appName] &&
			$this->session[$appName] === $apiToken ){
			return true;
		}
		
		//检测权限;
		if(Action('user.AuthPlugin')->checkAuthValue($authValue)){
			$this->session[$appName] = $apiToken;
			Cache::set($this->ssoID,$this->session);
			return;
		}
		unset($this->session[$appName]);
		Cache::set($this->ssoID,$this->session);
		
		$login = APP_HOST.'#user/login&link='.rawurlencode(this_url());
		if($userID){
			$login .= '&msg=' . LNG('user.loginNoPermission');
		}		
		header('Location:'.$login);exit;
	}
	public function checkAuthPlugin($appName){
		$plugin = Model("Plugin")->loadList($appName);
		if (!$plugin || $plugin['status'] == 0){
			show_tips($appName.LNG('admin.plugin.disabled'),false);
			return false;
		}
		$this->checkAuth($appName,$plugin['config']['pluginAuth']);
	}
}