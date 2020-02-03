<?php

class adminStorage extends Controller {
    public function __construct() {
        parent::__construct();
        $this->model = Model('Storage');
	}

    public function get() {
		$result = $this->model->listData();
		show_json($result,true);
	}

	/**
	 * 存储配置信息
	 */
	public function getConfig(){
		$id = Input::get('id','int');
		$res = $this->model->getConfig($id);
		show_json($res,true);
	}

	/**
	 * 添加用户
	 */
	public function add() {
		$data = Input::getArray(array(
			"name" 		=> array("check"=>"require"),
			"sizeMax" 	=> array("check"=>"require","default"=>0),
			"driver" 	=> array("check"=>"require"),
			"default" 	=> array("check"=>"require","default"=>0),
			"system" 	=> array("check"=>"bool","default"=>0),
			"config" 	=> array("check"=>"require"),
		));
		$res = $this->model->add($data);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
	}

	/**
	 * 编辑 
	 */
	public function edit() {
		$data = Input::getArray(array(
			"id"		=> array("check"=>"int"),
			"name" 		=> array("check"=>"require","default"=>null),
			"sizeMax" 	=> array("check"=>"require","default"=>null),
			"driver" 	=> array("check"=>"require","default"=>null),
			"default" 	=> array("check"=>"require","default"=>0),
			"config" 	=> array("check"=>"require","default"=>null),
		));
		$res = $this->model->update($data['id'],$data);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
	}

	/**
	 * 删除
	 */
	public function remove() {
		$id = Input::get('id','int');
		$res = $this->model->remove($id);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
	}
}
