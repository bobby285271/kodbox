<?php

class userView extends Controller{
	public function __construct(){
		parent::__construct();
	}
	public function options(){
		$user = Session::get("kodUser");
		if( isset($user['metaInfo'])) unset($user['metaInfo']);
		if( isset($this->config['settings']['language']) ){
			$this->config['settingAll']['language'] = array();
		}
		$options = array(
			"kod"	=> array(
				'systemOS'		=> $this->config['systemOS'],
				'phpVersion'	=> PHP_VERSION,
				'appApi'		=> rtrim(APP_HOST,'/').'/index.php?',
				'ENV_DEV'		=> !!STATIC_DEV,
				'staticPath'	=> STATIC_PATH,
				'version'		=> KOD_VERSION,
				'channel'		=> INSTALL_CHANNEL,
			),
			"user"	=> array(
				'userID'		=> defined('USER_ID') ? USER_ID : '',
				'myhome'    	=> defined('MY_HOME') ? MY_HOME : '',
				'desktop'   	=> defined('MY_DESKTOP') ? MY_DESKTOP : '',
				'isRoot'		=> $GLOBALS['isRoot'],
				'info'			=> $user,
				'role'			=> Action('user.authRole')->userRoleAuth(),
				'config'		=> $user ? Model('UserOption')->get(): $this->config['settingDefault'],
				'editorConfig'	=> $user ? Model('UserOption')->get(false,'editor'): $this->config['editorDefault'],
				'isRootAllow'	=> $this->config["ADMIN_ALLOW_IO"],
			),
			"system" => array(
				'settings'		=> $this->config['settings'],
				'all'			=> $this->config['settingAll'],
				'options'		=> array(),
			),
			"io"	=> KodIO::typeList(),
			"lang"	=> I18n::getType(),
		);

		if($user){//空间大小信息;
			$options['user']['targetSpace'] = array(
				"sizeMax" => intval($user['sizeMax']) * 1024*1024*1024,
				"sizeUse" => intval($user['sizeUse']),
			);
			$options['user']['role'] = $options['user']['role']['roleList'];
			if(!$options['user']['config']){
				$options['user']['config'] = $this->config['settingDefault'];
			}
			if(!$options['user']['editorConfig']){
				$options['user']['editorConfig'] = $this->config['editorDefault'];
			}
		}
		if($GLOBALS['isRoot']){
			$options['kod']['WEB_ROOT']   = WEB_ROOT;
			$options['kod']['BASIC_PATH'] = BASIC_PATH;
		}
		$options = Hook::filter('user.view.options.before',$options);
		show_json($options);
	}
	
	public function lang(){
		if($this->in['_t']) return;
		$result = array(
			"list"	=> I18n::getAll(),
			"lang"	=> I18n::getType(),
		);
		show_json($result);
	}
	
	public function plugins(){
		ob_get_clean();
		header("Content-Type: application/javascript; charset=utf-8");
		echo 'var kodReady=[];';
		Hook::trigger('user.commonJs.insert');
		$useTime = sprintf('%.4f',mtime() - TIME_FLOAT);
		echo "\n/* time={$useTime} */\n";
	}
	
	// 计划任务触发;
	public function call(){
		http_close();
		ActionCall('explorer.index.clearCache');
		Cache::clearTimeout();
	}
	
	public function parseUrl($link){
		if(!trim($link)) return '';
		if(substr($link,0,4) == 'http') return $link;
		if(substr($link,0,2) == './') {
			$link = substr($link,2);
		}
		return APP_HOST . $link;
	}
	
	
	// 验证码-登录、注册、找回密码、个人设置
	public function checkCode() {
		$captcha = new MyCaptcha(4);
		Session::set('checkCode', $captcha->getString());
	}

	// 发送（消息）验证码-注册、找回密码
	public function sendCode(){
		Action('user.regist')->sendMsgCode();
	}
	public function qrcode() {
		$url = $this->in['url'];
		if (function_exists('imagecolorallocate')) {
			ob_get_clean();
			QRcode::png($this->in['url']);
		} else {
			header('location: http://qr.topscan.com/api.php?text=' . rawurlencode($url));
		}
	}
	public function sess2(){
        $res = Session::get('abc');
        var_dump($res);exit;
    }
}