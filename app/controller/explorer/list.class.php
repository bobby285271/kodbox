<?php
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/

class explorerList extends Controller{
	private $model;
	public function __construct(){
		parent::__construct();
		$this->model = Model("Source");
	}
	public function path($thePath = false){
		$path     = $thePath ? $thePath : $this->in['path'];
		$pathInfo = KodIO::parse($path);
		$pathID   = $pathInfo['id'];		
		switch($pathInfo['type']){
			case KodIO::KOD_USER_FAV:			$data = Action('explorer.fav')->get();break;
			case KodIO::KOD_USER_RECYCLE:		$data = $this->model->listUserRecycle();break;
			case KodIO::KOD_USER_FILE_TAG:		$data = $this->model->listUserTag($pathID);break;
			case KodIO::KOD_USER_FILE_TYPE:		$data = $this->model->listPathType($pathID);break;
			case KodIO::KOD_USER_RECENT:		$data = $this->listRecent();break;
			case KodIO::KOD_GROUP_ROOT_SELF:	$data = $this->pathGroupSelf();break;
			case KodIO::KOD_USER_SHARE:			$data = Action('explorer.userShare')->myShare();break;
			case KodIO::KOD_USER_SHARE_TO_ME:	$data = Action('explorer.userShare')->shareToMe();break;
			case KodIO::KOD_SHARE_ITEM:			$data = Action('explorer.userShare')->sharePathList($pathInfo);break;
			case KodIO::KOD_BLOCK:				$data = $this->blockChildren($pathID);break;
			case KodIO::KOD_SEARCH:				$data = $this->listSearch($pathInfo);break;
			case KodIO::KOD_SOURCE:				$data = IO::listPath($path);break;
			case KodIO::KOD_IO:					$data = IO::listPath($path);break;
			default:$data = IO::listPath($path);break;
		}
		$this->dataParse($data,$path);
		$this->checkExist($data,$pathInfo);
		$this->pageParse($data);
		if($thePath) return $data;
		show_json($data);
	}
	
	// {search}/key=val@key2=value2;
	private function listSearch($pathInfo){
		if( !Action('user.authRole')->authCanSearch() ){
			show_json(LNG('explorer.noPermissionAction'),false);
		}
		$user = Session::get('kodUser');
		$paramCheck = array(
			'parentPath'=> 'require',
			'words'		=> 'require',
			"sizeFrom"	=> 'float',
			"sizeTo"	=> 'float',
			"timeFrom"	=> 'date',
			"timeTo"	=> 'date',
			'fileType'	=> 'require',//folder|ext;
			"createUser"=> 'require',
		);
		$pathInfo['param'] = trim($pathInfo['param'],'/');
		$paramIn = $this->parseSearch($pathInfo['param']);
		$param   = array();
		foreach ($paramCheck as $key => $checkType) {
			if( !isset($paramIn[$key]) ) continue;
			if( !Input::check($paramIn[$key],$checkType) ) continue;
			$param[$key] = $paramIn[$key];
			if($checkType == 'date'){
				$param[$key] = strtotime($paramIn[$key]);
			}
			//文件处理
			if($checkType == 'fileType' && $paramIn[$key] != 'folder'){
				$param[$key] = explode(',',$paramIn[$key]);
			}
		}

		if($param['parentPath']){
			$param['parentID'] = KodIO::sourceID($param['parentPath']);
		}
		if(!$param['parentID']){
			$param['parentID'] = $user['sourceInfo']['sourceID'];
		}
		$param['words'] = trim($param['words'], '/');
		$list = $this->model->listSearch($param);
		$list['searchParam'] = $paramIn;
		$list['searchParamParse'] = $param;
		return $list;
	}
	static function parseSearch($param){
		if(!$param) return array();
		$all    = explode('@',$param);
		$result = array();
		foreach ($all as $item) {
			if(!$item || !strstr($item,'=')) continue;
			$keyv = explode('=',$item);
			if(count($keyv) != 2 || !$keyv[0] || !$keyv[1]) continue;
			$value = trim(rawurldecode($keyv[1]));
			if(strlen($value) > 0 ){
				$result[$keyv[0]] = $value;
			}
		}
		return $result;
	}
	
	/**
	 * 最近文档；
	 * 仅限自己的文档；不分页；不支持排序；  最新修改时间 or 最新修改 or 最新打开 max top 100;
	 * 
	 * 最新自己创建的文件(上传or拷贝)
	 * 最新修改的，自己创建的文件	
	 * 最新打开的自己的文件 		
	 * 
	 * 资源去重；整体按时间排序【创建or上传  修改  打开】
	 */
	private function listRecent(){
		$list = array();
		$this->listRecentWith('createTime',$list);		//最近上传or创建
		$this->listRecentWith('modifyTime',$list);		//最后修改
		$this->listRecentWith('viewTime',$list);		//最后打开
		
		//合并重复出现的类型；
		foreach ($list as &$value) {
			$value['recentType'] = 'createTime';
			$value['recentTime'] = $value['createTime'];
			if($value['modifyTime'] > $value['recentTime']){
				$value['recentType'] = 'modifyTime';
				$value['recentTime'] = $value['modifyTime'];
			}
			if($value['viewTime'] > $value['recentTime']){
				$value['recentType'] = 'viewTime';
				$value['recentTime'] = $value['viewTime'];
			}
		}
		
		$list = array_sort_by($list,'recentTime',true);
		$listRecent = array_to_keyvalue($list,'sourceID');
		$result = array();
		if(!empty($listRecent)){
			$where  = array( 'sourceID'=>array('in',array_keys($listRecent)) );
			$result = $this->model->listSource($where);
		}
		$fileList = array_to_keyvalue($result['fileList'],'sourceID');
		// pr($fileList,$listRecent);exit;
		
		//保持排序，合并数据
		foreach ($fileList as $sourceID => &$value) {
			$item  = $listRecent[$sourceID];
			if(!$item){
				unset($fileList[$sourceID]);
				continue;
			}
			$value = array_merge($value,$item);
		}
		$result['fileList'] = array_values($fileList);
		// unset($result['pageInfo']);
		return $result;
	}
	private function listRecentWith($timeType,&$result){
		$where = array(
			'targetType'	=> SourceModel::TYPE_USER,
			'targetID'		=> USER_ID,
			'isFolder'		=> 0,
			'isDelete'		=> 0,
			'size'			=> array('>',0),
		);

		$maxNum = 50;	//最多150项
		$field  = 'sourceID,name,createTime,modifyTime,viewTime';
		$list   = $this->model->field($field)->where($where)
					->limit($maxNum)->order($timeType.' desc')->select();
		$list   = array_to_keyvalue($list,'sourceID');
		$result = array_merge($result,$list);
		$result = array_to_keyvalue($result,'sourceID');
	}
	private function pathGroupSelf(){//获取组织架构的用户和子组织；
		$groupInfo 	= Session::get("kodUser.groupInfo");
		$groupInfo 	= array_to_keyvalue($groupInfo,'groupID');//自己所在的组
		$group 		= array_remove_value(array_keys($groupInfo),'1');
		if(!$group) return array();
		
		$where = array("groupID"=>array('in',$group));
		$groupArry	 = Model('Group')->where($where)->select();
		$groupSource = $this->model->sourceRootGroup($group);
		$groupList 	 = array();
		
		foreach($groupArry as $key => $val){
			if($val['groupID'] == '1') continue; // 去除根部门
			$auth = $groupInfo[$val['groupID']]['auth'];
			$groupList[] = array(
				'name'      => $val['name'],
				'path' 		=> $groupSource[$val['groupID']],
				'isParent'	=> true,
				"sourceRoot"=> 'groupPath',	//为部门根目录
				'auth'		=> array(
					'authValue'	=> $auth['auth'],
					'authInfo'	=> $auth,
				)
			);
		}
		return $groupList;
	}
	
	
	private function pageParse(&$data){
		if(isset($data['pageInfo'])) return;
		$in = $this->in; $pageNum = 200; $page=1;
		$pageNumMax = 2000;
		$fileCount  = count($data['fileList']);
		$folderCount= count($data['folderList']);
		$totalNum	= $fileCount + $folderCount;
		$pageNum	= intval( isset($in['pageNum'])?$in['pageNum']:$pageNum);
		$pageNum	= $pageNum <= 5 ? 5 : ($pageNum >= $pageNumMax ? $pageNumMax : $pageNum);
		$pageTotal	= ceil( $totalNum / $pageNum);
		$page		= intval( isset($in['page'])?$in['page']:$page);
		$page		= $page <= 1 ? 1  : ($page >= $pageTotal ? $pageTotal : $page);
		$data['pageInfo'] = array(
			'totalNum'	=> $totalNum,
			'pageNum'	=> $pageNum,
			'page'		=> $page,
			'pageTotal'	=> $pageTotal,
		);
		if($pageTotal <= 1) return;

		$sort = $this->_parseOrder();
		$isDesc = $sort['desc'] == 'desc';
		$data['fileList'] 	= array_sort_by($data['fileList'],$sort['key'],$isDesc);
		$data['folderList'] = array_sort_by($data['folderList'],$sort['key'],$isDesc);
		
		$start = ($page-1) * $pageNum;
		$end   = $start + $pageNum;
		if( $end <= $folderCount){ // 文件夹范围内;
			$data['folderList'] = array_slice($data['folderList'],$start,$pageNum);
			$data['fileList'] 	= array();
		}else if($start >= $folderCount){ // 文件范围内;
			$data['folderList'] = array();
			$data['fileList'] 	= array_slice($data['fileList'],$start-$folderCount,$pageNum);
		}else{ // 各自占一部分;
			$folderNeed  = $folderCount - $start;
			$data['folderList'] = array_slice($data['folderList'],$start,$folderNeed);
			$data['fileList'] 	= array_slice($data['fileList'],0,$pageNum-($folderNeed) );
		}
	}
	private function _parseOrder(){
		$defaultField = Model('UserOption')->get('listSortField');
		$defaultSort  = Model('UserOption')->get('listSortOrder');
		$sortTypeArr  = array('up'=>'asc','down'=>'desc');
		$sortFieldArr = array(
			'name'			=> 'name',
			'size'			=> 'size',
			'type'			=> 'ext',
			'ext'			=> 'fileType',
			'createTime'	=> 'createTime',
			'modifyTime'	=> 'modifyTime'
		);
		$sortField    = Input::get("sortField",'in',$defaultField,array_keys($sortFieldArr));
		$sortType	  = Input::get("sortType", 'in',$defaultSort,array_keys($sortTypeArr));
		if( !in_array($sortField,array_keys($sortFieldArr)) ){
			$sortField = 'name';
		}
		if( !in_array($sortType,array_keys($sortTypeArr)) ){
			$sortField = 'up';
		}
		return array('key'=>$sortFieldArr[$sortField],'desc'=>$sortTypeArr[$sortType]);
	}
	
	/**
	 * 检查目录是否存在;
	 */
	private function checkExist($data,$pathInfo){
		$exist = true;
		switch($pathInfo['type']){
			case KodIO::KOD_SOURCE:
				$exist = !!$data['current'];
				if($exist && $data['current']['isDelete'] == '1'){
					show_json(LNG("explorer.pathInRecycle"),false);
				}
				break;
			case KodIO::KOD_SHARE_ITEM:
			case KodIO::KOD_IO:$exist = !!$data['current'];break;
			default:break;
		}
		if(!$exist){
			show_json(LNG('common.pathNotExists'),false);
		}
	}

	/**
	 * 递归处理数据；自动加入打开等信息
	 * 如果是纯数组: 处理成 {folderList:[],fileList:[],thisPath:xxx,current:''}
	 */
	private function dataParse(&$data,$path){
		if( !isset($data['folderList']) || 
			!is_array($data['folderList'])
		) { //处理成统一格式
			$listTemp = isset($data['fileList']) ? $data['fileList'] : $data;
			$data = array(
				"folderList" 	=> $listTemp ? $listTemp : array(),
				'fileList'		=> array()
			);
		}
		
		$data['thisPath'] = $path;
		$data['targetSpace'] = $this->targetSpace($data['current']);
		$data['current']  = IO::info($path,false);
		$data['current'] = Model('SourceAuth')->authOwnerApply($data['current']);
						
		foreach ($data['folderList'] as &$item) {
			if( isset($item['children']) ){
				$item['isParent'] = true;
				$this->dataParse($item['children'],$item['path']);
			}
			$item['type'] = isset($item['type']) ? $item['type'] : 'folder';
		}
		//$item['auth']['authValue']=0; 权限检测 
		$this->dataParseOexe($data['fileList']);
		$data['fileList']   = $this->dataFilterAuth($data['fileList']);
		$data['folderList'] = $this->dataFilterAuth($data['folderList']);
	}
	
	// 用户或部门空间尺寸;
	public function targetSpace($current){
		if(!$current || !isset($current['targetType'])){
			// return false;
			$current = array("targetType"=>'user','targetID'=>USER_ID);//用户空间;
		} 
		if($current['targetType'] == 'user'){
			$target = Model('User')->getInfo($current['targetID']);
		}else{
			$target = Model('Group')->getInfo($current['targetID']);
		}
		$result = array(
			'targetType'	=> $current['targetType'],
			'targetID' 		=> $current['targetID'],
			'targetName'	=> $target['name'],
			"sizeMax" 		=> $target['sizeMax']*1024*1024*1024,
    		"sizeUse" 		=> intval($target['sizeUse']),
		);
		return $result;
	}
	
	private function dataFilterAuth($list){
		if($GLOBALS['isRoot'] && $this->config["ADMIN_ALLOW_SOURCE"]) return $list;
		foreach ($list as $key => $item) {
			if( isset($item['targetType']) &&
				$item['targetType'] == 'user' && $item['targetID'] == USER_ID ){
				continue;
			}
			if( isset($item['auth']) &&
				is_array($item['auth']) && 
				$item['auth']['authValue'] == 0){
				unset($list[$key]);
			}
		}
		return array_values($list);
	}
	
	/**
	 * 追加应用内容信息;
	 * 限制处理个数； 处理速度: 20ms/个 
	 */
	private function dataParseOexe(&$list){
		$maxSize = 1024*1024*2;
		$index = 0;
		$maxLoad = 50;	//获取内容上限；
		if(count($list) >= 100){ //当列表过多时，获取少量应用内容；
			$maxLoad = 5;
		}
		foreach ($list as &$item) {
			if( $item['ext'] != 'oexe' || $item['size'] > $maxSize){
				continue;
			}
			if($index++ >= $maxLoad) break;
			$content = IO::getContent($item['path']);
			$item['oexeContent'] = json_decode($content);
		}
	}

	/**
	 * 根数据块
	 */
	private function blockRoot(){
		$blockList = array(
			'files'		=>	array('name'=>LNG('common.position'),'open'=>true),
			'tools'		=>	array('name'=>LNG('common.tools'),'open'=>true,'children'=>true),
			'fileType'	=>	array('name'=>LNG('common.fileType'),'open'=>false,'children'=>true),
			// 'fileTag'	=>	array('name'=>LNG('common.tag'),'open'=>false,'children'=>true),
			// 'driver'	=>	array('name'=>LNG('common.mount'),'open'=>false),
		);
		$result = array();		
		foreach ($blockList as $type => $item) {
			$block = array(
				"name"		=> $item['name'],
				"path"		=> '{block:'.$type.'}',
				"open"		=> $item['open'],
				"isParent"	=> true,
				"children"	=> $this->blockChildren($type),
			);
			$result[] = $block;
		}
		return $result;
	}
	
	/**
	 * 数据块数据获取
	 */
	private function blockChildren($type){
		$result = array();
		switch($type){
			case 'root':		$result = $this->blockRoot();break; //根
			case 'files': 		$result = $this->blockFiles();break;
			case 'tools': 		$result = $this->blockTools();break;
			case 'fileType': 	$result = $this->blockFileType();break;
			case 'fileTag': 	$result = $this->blockTags();break;
			case 'driver': 		$result = $this->blockDriver();break;
		}
		return $result;
	}
	
	/**
	 * 文件位置
	 * 收藏夹、我的网盘、公共网盘、我所在的部门
	 */
	private function blockFiles(){
		$groupRoot = '1';
		$groupInfo = Model('Group')->getInfo($groupRoot);
		$list = array(
			"fav"=>array(
				'name'      => LNG('explorer.toolbar.fav'),
				'path' 		=> KodIO::KOD_USER_FAV,
				'open'		=> false,
			),
			"my"=>array(
				'name'		=> LNG('explorer.toolbar.rootPath'),//我的网盘
				'path' 		=> KodIO::make(Session::get('kodUser.sourceInfo.sourceID')),
				'open'		=> true,
				"sourceRoot"=> 'userSelf',//文档根目录标记；前端icon识别时用：用户，部门
				'targetType'=> 'user','targetID' => USER_ID,
			),
			"rootGroup"=>array(
				'name'		=> $groupInfo['name'],//公共网盘
				'path' 		=> KodIO::make($groupInfo['sourceInfo']['sourceID']),
				'open'		=> false,
				"sourceRoot"=> 'groupPublic',
				'targetType'=> 'group','targetID' => $groupRoot,
			),
			"myGroup"=>array(
				'name'		=> LNG('explorer.toolbar.myGroup'),
				'path' 		=> KodIO::KOD_GROUP_ROOT_SELF,
				'open'		=> false,
			)
		);
		
		$groupInfo 	= Session::get("kodUser.groupInfo");
		$groupInfo 	= array_to_keyvalue($groupInfo,'groupID');//自己所在的组
		if( !$groupInfo[$groupRoot] ){
			unset($list['rootGroup']);
		}else{
			$auth = $groupInfo[$groupRoot]['auth'];
			$list['rootGroup']['auth'] = array("authValue"=>$auth['auth'],'authInfo'=>$auth);
		}
		//不归属于任何部门； 获只属于根部门则不显示我所在的部门；
		if(count($groupInfo) == 0 || (count($groupInfo) == 1 && $groupInfo[$groupRoot])  ){
			unset($list['myGroup']);
		}

		foreach ($list as &$item) {
			$item['isParent'] = true;
			if($item['open']){ //首次打开：默认展开的路径，自动加载字内容
				$item['children'] = $this->path($item['path']);
			}
		}
		return array_values($list);
	}
	
	/**
	 * 文件类型列表
	 */
	private function blockFileType(){
		$docType = KodIO::fileTypeList();
		$list	 = array();
		foreach ($docType as $key => $value) {
			$list[] = array(
				"name"	=> $value['name'],
				"path"	=> KodIO::makeFileTypePath($key),
				'ext'	=> $value['ext'],
				'extType' => $key,
			);
		}
		return $list;
	}
	
	/**
	 * 工具
	 */
	private function blockTools(){
		$list = array(
			array("name" => LNG('explorer.toolbar.recentDoc'), "path"=> KodIO::KOD_USER_RECENT),
			array("name" => LNG('explorer.toolbar.myShare'), "path"=> KodIO::KOD_USER_SHARE),
			array("name" => LNG('explorer.toolbar.shareToMe'), "path" => KodIO::KOD_USER_SHARE_TO_ME),
			array("name"=> LNG('explorer.toolbar.recycle'), "path"=> KodIO::KOD_USER_RECYCLE),
		);
		return $list;
	}
	
	/**
	 * 用户文件标签列表
	 */
	private function blockTags(){
		$tagList = Model("UserTag")->listData();
		$list = array();
		foreach ($tagList as $tag) {
			$style = $tag['style']? $tag['style'] : 'label-grey-normal';
			$list[] = array(
				"name"	=> $tag['name'],
				"path"	=> KodIO::makeFileTagPath($tag['id']),
				"icon"	=> 'tag-label label ' . $style,
			);
		}
		return $list;
	}
	
	/**
	 * 用户存储挂载列表
	 */
	private function blockDriver(){
		$list = array();
		return $list;
	}
}
