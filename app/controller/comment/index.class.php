<?php

/*
 * @link http://kodcloud.com/
 * @author warlee | e-mail:kodcloud@qq.com
 * @copyright warlee 2014.(Shanghai)Co.,Ltd
 * @license http://kodcloud.com/tools/license/license.txt
 */

class commentIndex extends Controller {
	public function __construct(){
		parent::__construct();
		$this->model = Model("Comment");
	}

	/**
	 * 添加评论
	*/
	public function addComment(){
		$data = Input::getArray(array(
			"targetType"    => array("check"=>"email"),
			"targetID"      => array("check"=>"require"),
			"title"         => array("default"=>""),
			"content"       => array("check"=>"require"),
			"pid"           => array("default"=>0),
		));
		$data['userID'] = USER_ID;
		$result = $this->model->addComment($data);
		show_json($result,true);
	}

	/**
	 * 删除评论
	*/
	public function remove(){
		$id = Input::get("id","number");
		$result = $this->model->remove($id);
		show_json($result,true);
	}

	/**
	 * 点赞or取消赞
	*/
	public function prasise(){
		$id = Input::get("id","number");
		$result = $this->model->prasise($id);
		show_json($result,true);
	}

	/**
	 * 编辑
	*/
	public function edit(){
		$data = Input::getArray(array(
			"id"		=> array("check"=>"number"),
			"content"	=> array("check"=>"require"),
		));
		$result = $this->model->edit($data['id'],$data['content']);
		show_json($result,true);
	}

	/**
	 * 评论列表
	 * 
	 * 通用请求参数:sortField|sortType; page|pageNum
	 * CommentModel::TYPE_SHARE|TYPE_SOURCE|TYPE_USER|TYPE_GROUP
	 */
	public function listData(){
		$data = Input::getArray(array(
			"targetType"	=> array("check"=>"number"),
			"targetID"		=> array("check"=>"number"),
		));
		return $this->model->listData($data['targetType'],$data['targetID']);
	}

	/**
	 * 评论子评论
	 */
	public function listChildren(){
		$id = Input::get("id","number");
		return $this->model->listChildren($id);
	}
}