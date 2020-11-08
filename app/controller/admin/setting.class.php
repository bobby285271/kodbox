<?php

/*
 * @link http://kodcloud.com/
 * @author warlee | e-mail:kodcloud@qq.com
 * @copyright warlee 2014.(Shanghai)Co.,Ltd
 * @license http://kodcloud.com/tools/license/license.txt
 */

class adminSetting extends Controller {
	function __construct() {
		parent::__construct();
	}

	public function get(){
		$data = Model('SystemOption')->get();
		$data = array_merge($this->config['settingSystemDefault'],$data);
		$removeKey = array(
			'versionLicense','versionUser','versionHashUser','versionHash',
			'systemSecret','systemPassword','deviceUUID',
		);
		foreach ($removeKey as $key) {
			unset($data[$key]);
		}
		show_json($data);
	}
	//管理员  系统设置全局数据
	public function set() {
		$data = json_decode($this->in['data'], true);
		if (!$data) {
			show_json(LNG('explorer.error'), false);
		}
		$setting = array();
		foreach ($data as $key => $value) {
			$setting[$key] = $value;
		}
		
		$postMax = get_post_max();
		if($setting['chunkSize']*1024*1024  >= $postMax){
			$sizeTips = ($postMax/(1024*1024)) .'MB';
			show_json(LNG('admin.setting.transferChunkSizeDescError1').
			":$sizeTips,<br/>".LNG('admin.setting.transferChunkSizeDescError2'),false);
		}

		Model('SystemOption')->set($setting);
		show_json(LNG('explorer.success'));
	}
	
	/**
	 * 发送邮件测试-用户注册功能设置
	 */
	public function mailTest() {
		$data = Input::getArray(array(
			'host'		 => array('check' => 'require'),
			'email'		 => array('check' => 'require'),
			'password'	 => array('check' => 'require'),
			'address'	 => array('check' => 'require')
		));
		$data['test'] = 1;
		$data['emailType'] = 1;
		$data['subject'] = LNG('user.emailVerify') . '-' . LNG('common.test');
		$data['content'] = array('type' => 'code', 'data' => array());

		$res = Action('user.bind')->sendEmail('email_test', $data);
		if (!$res['code']) {
			show_json(LNG('user.sendFail') . ': ' . $res['data'], false);
		}
		show_json(LNG('user.sendSuccess'), true);
	}
	
	/**
	 * 动态添加菜单;
	 */
	public function addMenu($options,$menu=array()){
		$menus = &$options['system']['options']['menu'];
		$menusKeys = array_to_keyvalue($menus,'name');
		if( isset($menusKeys[$menu['name']]) ) return $options;

		$menus[] = $menu;$menuNum = 0;
		foreach ($menus as &$theMenu) {
			if(!isset($theMenu['subMenu']) || $theMenu['subMenu'] == '0'){
				$menuNum += 1;
			}
			// 一级目录最多5个;超出自动添加到子目录; 前端自适应处理
			// if($menuNum >= 5){$theMenu['subMenu'] = 1;}
		}
		return $options;
	}

	public function clearCache() {
		Cache::deleteAll();
		http_close();
		del_dir(TEMP_PATH);
		mk_dir(TEMP_PATH . 'log');
		AutoTask::restart();//停止计划任务; (再次访问自动开启)
	}

	/**
	 * 缓存配置检测
	 */
	public function cacheCheck(){
		$type = Input::get('type','in',null,array('redis','memcached'));
		$config = Input::getArray(array(
			"{$type}Host" => array('check'=>'require', 'aliasKey'=>'host'),
			"{$type}Port" => array('check'=>'require', 'aliasKey'=>'port')
		));
		
		$className = "Cache".ucfirst($type);
		$cache = new $className($config,3);
		$cache->set('cacheCheck','ok');
		if($cache->get('cacheCheck') != 'ok') {
			show_json(sprintf(LNG('admin.install.cacheError'),"{$type}"), false);
		}
		show_json(LNG('explorer.success'));
	}
	public function cacheGet(){
		$cache = Model('SystemOption')->get('systemCache');
		$cache = json_decode($cache, true);
		if(!$cache) {
			$cache = $GLOBALS['config']['cache'];
		}
		show_json($cache);
	}
	/**
	 * 缓存配置切换保存
	 */
	public function cacheSave(){
		$type = Input::get('cacheType','in',null,array('file','redis','memcached'));
		if(in_array($type, array('redis','memcached'))) {
			$config = Input::getArray(array(
				"{$type}Host" => array('check'=>'require', 'aliasKey'=>'host'),
				"{$type}Port" => array('check'=>'require', 'aliasKey'=>'port')
			));
			$className = "Cache".ucfirst($type);
			$cache = new $className($config,3);
			$cache->set('cacheCheck','ok');
			if($cache->get('cacheCheck') != 'ok') {
				show_json(sprintf(LNG('admin.install.cacheError'),"{$type}"), false);
			}
		}
		// 1.存入数据库
		$cache = $GLOBALS['config']['cache'];
		$cache['sessionType'] = $cache['cacheType'] = $type;
		if($type != 'file') {
			$config = Input::getArray(array(
				"{$type}Host" => array('check'=>'require', 'aliasKey'=>'host'),
				"{$type}Port" => array('check'=>'require', 'aliasKey'=>'port')
			));
			$cache[$type] = $config;
		}
		Model('SystemOption')->set('systemCache', $cache);

		// 2.更新setting_user.php
		$file = BASIC_PATH . 'config/setting_user.php';
		$text = array(
			PHP_EOL . PHP_EOL,
            "\$config['cache']['sessionType'] = '{$type}';",
            "\$config['cache']['cacheType'] = '{$type}';"
		);
		if($type != 'file'){
			$text[] = "\$config['cache']['{$type}']['host'] = '".$config['host']."';";
			$text[] = "\$config['cache']['{$type}']['port'] = '".$config['port']."';";
		}
		$content = implode(PHP_EOL, $text);
		if(!file_put_contents($file, $content, FILE_APPEND)) {
            show_json(LNG('explorer.error'), false);
		}
		Cache::deleteAll();
		show_json(LNG('explorer.success'));
	}
}
