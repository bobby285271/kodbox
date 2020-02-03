<?php

class pdfjsPlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regist(){
		$this->hookRegist(array(
			'user.commonJs.insert' => 'pdfjsPlugin.echoJs',
		));
	}
	public function echoJs(){
		$this->echoFile('static/app/main.js');
	}
	public function index(){
		$fileUrl  = $this->filePathLink($this->in['path']).'&name=/'.$this->in['name'];
		$fileName = $this->in['name'].' - '.LNG('common.copyright.name').LNG('common.copyright.powerBy');
		if( in_array($this->in['ext'],array('pdf','djvu','ofd')) ){
			include($this->pluginPath.'/php/'.$this->in['ext'].'.php');
		}
	}
}