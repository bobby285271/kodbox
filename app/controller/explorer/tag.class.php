<?php 
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/

/**
 * 标签管理：增删改查、置顶置底；
 * listData();				//tag列表 
 * add();					//tag添加   [参数]:name/style
 * edit();					//重命名Tag [参数]:tagID,name/style
 * remove();				//删除tag 	[参数]:tagID
 * moveTop();				//置顶 		[参数]:tagID
 * moveBottom();			//置底 		[参数]:tagID
 * resetSort();				//重置排序，更具id的顺序重排; [参数]:tagList:逗号隔开的id
 * -------
 * sourceAddToTag();		//添加文档到tag [参数]:tagID/sourceID
 * sourceResetTag();		//重置某个文档所在的tag [参数]:tagList:逗号隔开的id/sourceID
 * sourceRemoveFromTag();	//将文档从某个tag中移除 [参数]:tagID/sourceID
 */
class explorerTag extends Controller{
	private $model;
	function __construct(){
		parent::__construct();
		$this->model  		= Model('UserTag');
		$this->modelSource  = Model('UserTagSource');
	}
	/**
	 * tag列表
	 */
	public function get() {
		$result = $this->model->listData();
		show_json($result);
	}

	/**
	 * tag添加
	 */
	public function add(){
		$data = Input::getArray(array(
			"name"		=> array("check"=>"require"),
			"style"		=> array('check'=>"require"),
		));
		$res = $this->model->add($data['name'],$data['style']);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.repeatError');
		show_json($msg,!!$res);
	}

	/**
	 * 重命名Tag
	 */
	public function edit() {
		$data = Input::getArray(array(
			"tagID"		=> array("check"=>"int"),
			"name"		=> array('default'=>null),
			"style"		=> array("check"=>"require"),
		));
		$res = $this->model->update($data['tagID'],$data);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.repeatError');
		show_json($msg,!!$res);
	}
	
	/**
	 * 删除tag
	 */
	public function remove(){
		$tagID = Input::get('tagID',"int");
		$res = $this->model->remove($tagID);
		$this->modelSource->removeByTag($tagID);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
	}
	
	/**
	 * 置顶
	 */
	public function moveTop() {
		$tagID = Input::get('tagID',"int");
		$res = $this->model->moveTop($tagID);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
	}

	/**
	 * 置底
	 */
	public function moveBottom() {
		$tagID = Input::get('tagID',"int");
		$res = $this->model->moveBottom($tagID);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
	}
	/**
	 * 重置排序，更具id的顺序重排;
	 */
	public function resetSort() {
		$tagID = Input::get('tagList',"require");
		$tagArray = explode(',',$tagID);
		if(!$tagArray) {
			show_json(LNG('explorer.error'),false);
		}
		$res = $this->model->resetSort($tagArray);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
	}

	
	
	//======== tag关联资源管理 =========
	
	//添加文档到tag;
	public function sourceAddToTag(){
		$data = Input::getArray(array(
			"tagID"		=> array("check"=>"int"),
			"sourceID"	=> array("check"=>"int"),
		));
		$res = $this->modelSource->addToTag($data['sourceID'],$data['tagID']);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.repeatError');
		show_json($msg,!!$res);
	}
	//重置某个文档所在的tag
	public function sourceResetTag(){
		$data = Input::getArray(array(
			"tagList"	=> array("check"=>"require"),
			"sourceID"	=> array("check"=>"int"),
		));
		$tagArray = explode(',',$data['tagList']);
		if(!$tagArray) {
			show_json(LNG('explorer.error'),false);
		}
		
		$this->modelSource->removeBySource($data['sourceID']);
		for ($i=0; $i < count($tagArray); $i++) {
			$this->modelSource->addToTag($data['sourceID'],$tagArray[$i]);
		}
		show_json(LNG('explorer.success'));
	}
	
	//将文档从某个tag中移除
	public function sourceRemoveFromTag(){
		$data = Input::getArray(array(
			"tagID"		=> array("check"=>"int"),
			"sourceID"	=> array("check"=>"int"),
		));
		$res = $this->modelSource->removeFromTag($data['sourceID'],$data['tagID']);
		$msg = $res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
	}
}
