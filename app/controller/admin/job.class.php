<?php
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/

//职位管理
class adminJob extends Controller{
	private $model;
	function __construct()    {
		parent::__construct();
		$this->model = Model('UserJob');
	}

	/**
	 * 根据所在部门获取用户列表
	 */
	public function get() {
		$result = $this->model->listData();
		show_json($result,true);
	}
	
	/**
	 * 添加用户
	 */
	public function add() {
		$data = Input::getArray(array(
			"name" 		=> array("check"=>"require"),
			"desc" 		=> array("default"=>""),
		));
		$res = $this->model->add($data['name'],$data['desc']);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.error') . '! ' . LNG('explorer.pathExists');
		show_json($msg,!!$res);
	}
	
	/**
	 * 编辑 
	 */
	public function edit() {
		$data = Input::getArray(array(
			"id"		=> array("check"=>"int"),
			"name" 		=> array("check"=>"require"),
			"desc" 		=> array("default"=>""),
		));
		$res = $this->model->update($data['id'],$data['name'],$data['desc']);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.error') . '! ' . LNG('explorer.pathExists');
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
	
	/**
	 * 排序：上移、下移
	 */
	public function sort() {
		$data = Input::getArray(array(
			"id"		=> array("check"=>"int"),
			"sort" 		=> array("check"=>"require","default"=>''),
		));
		$res = $this->model->sort($data['id'], $data['sort']);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
	}
}
