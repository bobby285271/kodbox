<?php
class adminerPlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regist(){
		$this->hookRegist(array(
			'templateCommonHeader' => 'adminerPlugin.addMenu'
		));
	}
	public function addMenu(){
		$config = $this->getConfig();
		$menu = array(
			'name'		=> 'Adminer',
			'icon'		=> $this->appIcon(),
			'url'		=> $this->pluginApi,
			'target'	=> '_blank',
			'subMenu'	=> $config['menuSubMenu'],
			'use'		=> '1'
		);
		Action('admin/setting')->addMenu($menu);
	}
	public function index(){
		header('Location: '.$this->pluginHost.'adminer/index.php');
	}
}