<?php

class VLCPlayerPlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regist(){
		$this->hookRegist(array(
			'user.commonJs.insert' => 'VLCPlayerPlugin.echoJs',
		));
	}
	public function echoJs(){
		$this->echoFile('static/main.js');
	}
}