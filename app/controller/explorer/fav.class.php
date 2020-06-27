<?php 
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/

class explorerFav extends Controller{
	private $model;
	function __construct(){
		parent::__construct();
		$this->model  = Model('UserFav');
	}
	/**
	 * 获取收藏夹json
	 */
	public function get() {
		return $this->model->listView();
	}
	
	public function favAppend($data){
		$favList = $this->model->listData();
		$favList = array_to_keyvalue($favList,'path');
		foreach ($data as $type =>&$list) {
			if(!in_array($type,array('fileList','folderList','groupList'))) continue;
			foreach ($list as &$item){
				if(!isset($item['sourceInfo'])){
					$item['sourceInfo'] = array();
				}
				if( isset($favList[$item['path']]) ){
					$item['sourceInfo']['isFav'] = 1;
				}
				
				// 收藏文件;
				if($item['type'] == 'file'){
					unset($item['hasChildFile']);
					unset($item['hasChildFolder']);
					$item['ext'] = get_path_ext($item['name']);
				}
				
				// // driver路径收藏;
				// $info = KodIO::parse($item['path']);
				// if($info['type'] == KodIO::KOD_IO){
				// 	$storage = Model('Storage')->listData($info['id']);
				// 	$item['driver'] = strtolower($storage['driver']);
				// }
			}
		}
		// $data['favList'] = $favList;
		return $data;
	}

	/**
	 * 添加
	 */
	public function add(){
		$data = Input::getArray(array(
			"path"	=> array("check"=>"require"),
			"name"	=> array("check"=>"require"),
			"type"	=> array("check"=>"require","default"=>'folder'),
		));
		$pathInfo = KodIO::parse($data['path']);
		if($pathInfo['type'] == KodIO::KOD_SOURCE){
			$data['type'] = 'source';
			$data['path'] = $pathInfo['id'];
		}
		$res = $this->model->addFav($data['path'],$data['name'],$data['type']);
		$msg = !!$res ? LNG('explorer.addFavSuccess') : LNG('explorer.pathHasFaved');
		show_json($msg,!!$res);
	}

	/**
	 * 重命名
	 */
	public function rename() {
		$data = Input::getArray(array(
			"name"		=> array("check"=>"require"),
			"newName"	=> array("check"=>"require"),
		));
		$res = $this->model->rename($data['name'],$data['newName']);
		$msg = !!$res ? LNG('explorer.success') : LNG('explorer.repeatError');
		show_json($msg,!!$res);
	}
	
	/**
	 * 置顶
	 */
	public function moveTop() {
		$name = Input::get('name','require');
		$res = $this->model->moveTop($name);
		$msg = !!$res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
	}

	/**
	 * 置底
	 */
	public function moveBottom() {
		$name = Input::get('name','require');
		$res = $this->model->moveBottom($name);
		$msg = !!$res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
	}

	/**
	 * 删除
	 */
	public function del() {
		$name = Input::get('name','require');
		$res = $this->model->removeByName($name);
		$msg = !!$res ? LNG('explorer.delFavSuccess') : LNG('explorer.error');
		show_json($msg,!!$res);
	}
}
