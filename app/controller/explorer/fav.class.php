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
		$list = $this->model->listView();
		$list = $this->_checkExists($list);
		// pr($list);exit;
		return $list;
	}
	
	private function _checkExists($list){
		foreach ($list as &$item) {
			if(!isset($item['sourceInfo'])){
				$item['sourceInfo'] = array();
			}
			$item['sourceInfo']['isFav']   = 1;
			$item['sourceInfo']['favName'] = $item['name'];
			if( $item['type'] == 'source' && $item['sourceID']){
				$item['type'] = $item['isFolder'] == '1' ? 'folder':'file';
				$item['path'] = KodIO::make($item['path']);
				continue;
			}
			if( $item['type'] == 'source' ){
				// 文件不存在处理;
				$item['type']   = 'folder';
				$item['exists'] = false;
				$item['path']   = KodIO::make($item['path']);
			}else{
				$info = Action('explorer.list')->pathCurrent($item['path'],false);
				unset($info['name']);
				$item = array_merge($item,$info);
				if($item['type'] == 'file'){
					$item['ext'] = get_path_ext($item['name']);
				}else if(!isset($item["hasChildFolder"])){
					$item["hasChildFolder"] = true;
					$item["hasChildFile"] = true;
				}
			}
		}
		// pr($list);exit;
		return $list;
	}
	
	// 是否在收藏夹处理;
	public function favAppend($data){
		$favList = $this->model->listData();
		$favList = array_to_keyvalue($favList,'path');
		foreach ($data as $type =>&$list) {
			if(!in_array($type,array('fileList','folderList','groupList'))) continue;
			foreach ($list as $key=>$item){
				$list[$key] = $this->favAppendItem($item,$favList);
			}
		}
		$data['current'] = $this->favAppendItem($data['current'],$favList);
		// $data['favList'] = $favList;
		// pr($data,$favList);exit;
		return $data;
	}
	private function favAppendItem($item,$favList){
		if(!isset($item['sourceInfo'])){
			$item['sourceInfo'] = array();
		}
		$path 	 = $item['path'];$favItem = false;
		$favItem = isset($favList[$path]) ? $favList[$path]:$favItem;
		$path 	 = rtrim($item['path'],'/');
		$favItem = isset($favList[$path]) ? $favList[$path]:$favItem;
		$path 	 = rtrim($item['path'],'/').'/';
		$favItem = isset($favList[$path]) ? $favList[$path]:$favItem;
		
		if( $favItem ){
			$item['sourceInfo']['isFav'] = 1;
			$item['sourceInfo']['favName'] = $favItem['name'];
		}
		// $item['$favItem'] = $favItem;
		// 收藏文件;
		if($item['type'] == 'file'){
			unset($item['hasChildFile']);
			unset($item['hasChildFolder']);
			$item['ext'] = get_path_ext($item['name']);
		}
		return $item;
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
