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
	
	public function resetFileHash(){
		$model = Model('File');
		$listFile = $model->field('*')->select();
		foreach ($listFile as $file) {
			if(!$file['hashSimple'] || !$file['hashMd5']){
				$data = array('hashSimple'=>IO::hashSimple($file['path']) );
				if(!$file['hashMd5']){
				    $data['hashMd5'] = IO::hashMd5($file['path']);
				}
				$model->where(array('fileID'=>$file['fileID']))->save($data);
			}
		}
		show_json(count($listFile));
	}
	
	public function clearCache() {
		Cache::deleteAll();
		del_dir(TEMP_PATH);
		mk_dir(TEMP_PATH . 'log');
	}
}
