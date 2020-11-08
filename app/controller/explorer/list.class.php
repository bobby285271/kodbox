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
		$path     = $path != '/' ? rtrim($path,'/') : '/';//路径保持统一;
		$path 	  = $this->checkDesktop($path);
		$pathParse= KodIO::parse($path);
		switch($pathParse['type']){
			case KodIO::KOD_USER_FAV:			$data = Action('explorer.fav')->get();break;
			case KodIO::KOD_USER_RECYCLE:		$data = $this->model->listUserRecycle();break;
			case KodIO::KOD_USER_FILE_TAG:		$data = $this->model->listUserTag($pathParse['id']);break;
			case KodIO::KOD_USER_FILE_TYPE:		$data = $this->model->listPathType($pathParse['id']);break;
			case KodIO::KOD_USER_RECENT:		$data = $this->listRecent();break;
			case KodIO::KOD_GROUP_ROOT_SELF:	$data = Action('explorer.listGroup')->groupSelf($pathParse);break;
			case KodIO::KOD_USER_SHARE:			$data = Action('explorer.userShare')->myShare();break;
			case KodIO::KOD_USER_SHARE_TO_ME:	$data = Action('explorer.userShare')->shareToMe();break;
			case KodIO::KOD_SHARE_ITEM:			$data = Action('explorer.userShare')->sharePathList($pathParse);break;
			case KodIO::KOD_SHARE_LINK:			$data = Action('explorer.share')->pathList();break;
			case KodIO::KOD_SEARCH:				$data = Action('explorer.listSearch')->listSearch($pathParse);break;
			case KodIO::KOD_BLOCK:				$data = $this->blockChildren($pathParse['id']);break;
			case KodIO::KOD_SOURCE:				$data = IO::listPath($path);break;
			case KodIO::KOD_IO:					$data = IO::listPath($path);break;
			default:$data = IO::listPath($path);break;
		}
		$data = $this->parseData($data,$path);
		$data = Hook::filter('explorer.list.path.parse',$data);

		if($thePath) return $data;
		show_json($data);
	}
	public function parseData(&$data,$path){
		$pathParse= KodIO::parse($path);
		$this->parseAuth($data,$path);
		$this->checkExist($data,$pathParse);
		$this->pageParse($data);
		$this->parseDataHidden($data);
		$data = Action('explorer.listGroup')->groupChildAppend($data);
		$data = Action('explorer.fav')->favAppend($data);
		$this->pageReset($data);
		
		//pr_trace();exit;
		return $data;
	}	
	
	// 桌面文件夹自动检测;不存在处理;
	private function checkDesktop($path){
		if($path !== MY_DESKTOP) return $path;
		if(IO::info($path)) return MY_DESKTOP;//存在则不处理;
		
		$desktopName = LNG('explorer.toolbar.desktop');
		$model  = Model("Source");
		$find   = IO::fileNameExist(MY_HOME,$desktopName);
		$rootID = KodIO::sourceID(MY_HOME);
		if(!$find){
			$find = $model->mkdir($rootID,$desktopName);
		}
		$model->metaSet($find,'desktop','1');
		$model->metaSet($rootID,'desktopSource',$find);
		Model('User')->cacheFunctionClear('getInfo',USER_ID);
		return KodIO::make($find);
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

	private function pageParse(&$data){
		if(isset($data['pageInfo'])) return;
		$in = $this->in; $pageNum = 3000; $page=1; //webdav列表处理;
		$pageNumMax = 5000;
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
	private function pageReset(&$data){
		if(!isset($data['pageInfo'])) return;
		$group = isset($data['groupList']) ? count($data['groupList']) : 0;
		$total = count($data['fileList']) + count($data['folderList']) + $group;
		$pageInfo = $data['pageInfo'];
		if(	$pageInfo['page'] == 1 && $pageInfo['pageTotal'] == 1){
			$data['pageInfo']['totalNum'] = $total;
		}

		// 某一页因为权限全部过滤掉内容, 则加大每页获取条数;
		if(	$total == 0 && $pageInfo['totalNum'] != 0 && $pageInfo['pageTotal'] > 1 ){
			$this->in['pageNum'] = $pageInfo['pageNum'] * 2;
			if($this->in['pageNum'] < 500){
				$this->in['pageNum'] = 500;
			}
			$newData = $this->path($this->in['path']);
			show_json($newData);
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
				if($data['thisPath'] == '{source:0}/') return;
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
	public function pathCurrent($path,$loadInfo = true){
		$info 	 = KodIO::parse($path);
		$driver  = IO::init($path);
		$current = false;
		if($loadInfo){
			$current = IO::info($path,false);
		}else if(!$driver){
			$current = array('exists'=>false,'type'=>'folder');
		}else if(!$info['type'] && $driver->getType() == 'local'){
			// 其他网络存储不在此获取信息; 收藏夹列表;
			$current = IO::info($path,false);
			if(!$current){ //不存在;
				$current = array('exists'=>false);
			}
		}
		$current = Model('SourceAuth')->authOwnerApply($current);
		// pr($loadInfo,$current,$path);exit;

		if(!$current){
			$current = $this->ioInfo($info['type']);
			if($info['type'] == KodIO::KOD_BLOCK){
				$list = $this->blockItems();
				$current = array(
					'name' 	=> $list[$info['id']]['name'],
					'icon'	=> 'block-item',
				);
				$current['name'] = $current['name'] ? $current['name']:'root';
			}else if($info['type'] == KodIO::KOD_USER_FILE_TYPE){
				$list = $this->blockFileType();
				$current = $list[$info['id']];
				$current['name'] = LNG('common.fileType').' - '.$current['name'];
			}else if($info['type'] == KodIO::KOD_USER_FILE_TAG){
				$list = Action('explorer.tag')->tagList();
				$current = $list[$info['id']];
				$current['name'] = LNG('common.tag').' - '.$current['name'];
			}else if($info['type'] == KodIO::KOD_SEARCH){
			}
		}

		if($info['type'] == KodIO::KOD_IO ){
			$storage = Model('Storage')->listData($info['id']);
			if($storage){
				$current['icon'] = 'io-'.strtolower($storage['driver']);
				$current['pathDisplay'] = str_replace($info['pathBase'],$storage['name'],$current['path']);
				if( !strstr(trim($current['pathDisplay'],'/'),'/') ){
					$current['name'] = $storage['name'];
				}
			}
		}
		$current['path'] = $path;
		return $current;
	}

	/**
	 * 递归处理数据；自动加入打开等信息
	 * 如果是纯数组: 处理成 {folderList:[],fileList:[],thisPath:xxx,current:''}
	 */
	private function parseAuth(&$data,$path){
		if( !isset($data['folderList']) || 
			!is_array($data['folderList'])
		) { //处理成统一格式
			$listTemp = isset($data['fileList']) ? $data['fileList'] : $data;
			$data = array(
				"folderList" 	=> $listTemp ? $listTemp : array(),
				'fileList'		=> array()
			);
		}
		$path = rtrim($path,'/').'/';
		$data['current']  = $this->pathCurrent($path);
		$data['thisPath'] = $path;
		$data['targetSpace'] = $this->targetSpace($data['current']);		
		foreach ($data['folderList'] as &$item) {
			if( isset($item['children']) ){
				$item['isParent'] = true;
				$this->parseAuth($item['children'],$item['path']);
			}
			$item['type'] = isset($item['type']) ? $item['type'] : 'folder';
		}
		//$item['auth']['authValue']=0; 权限检测 
		$this->dataParseOexe($data['fileList']);
		$data['fileList']   = $this->dataFilterAuth($data['fileList']);
		$data['folderList'] = $this->dataFilterAuth($data['folderList']);
	}
	
	// 显示隐藏文件处理; 默认不显示隐藏文件;
	private function parseDataHidden(&$data){
		if(Model('UserOption')->get('displayHideFile') == '1') return;
		$pathHidden = Model('SystemOption')->get('pathHidden');
		$pathHidden = explode(',',$pathHidden);
		$hideNumber = 0;
		foreach ($data as $type =>$list) {
			if(!in_array($type,array('fileList','folderList'))) continue;
			$result = array();
			foreach ($list as $item){
				if(substr($item['name'],0,1) == '.') continue;
				if(in_array($item['name'],$pathHidden)) continue;
				$result[] = $item;
			}
			$data[$type] = $result;
			$hideNumber  += count($list) - count($result);
		}
		// 总文件数; 只减去当前页;暂不处理多页情况;
		// if(is_array($data['pageInfo']) && $hideNumber > 0){
		// 	$data['pageInfo']['totalNum'] -= $hideNumber;
		// }
	}

	
	// 用户或部门空间尺寸;
	public function targetSpace($current){
		if(	$current['auth'] &&
			$current['auth']['authValue'] == -1 ){
			return false;
		}
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
				$item['targetType'] == 'user' &&
				$item['targetID'] == USER_ID ){
				continue;
			}
			if( isset($item['targetType']) && 
				(!$item['auth'] || $item['auth']['authValue'] == 0 ) // 不包含-1,构建通路;
			){
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
		$list = $this->blockItems();
		if(!$this->pathEnable('fileType')){unset($list['fileType']);}
		if(!$GLOBALS['isRoot'] || !$this->pathEnable('driver')){unset($list['driver']);}
		if(!$this->pathEnable('fileTag')){unset($list['fileTag']);}
		$result = array();
		foreach ($list as $type => $item) {
			$block = array(
				"name"		=> $item['name'],
				"path"		=> '{block:'.$type.'}/',
				"open"		=> $item['open'],
				"icon"		=> 'block-item',
				"isParent"	=> true,
				"children"	=> $this->blockChildren($type),
			);
			if($block['children'] === false) continue;
			$result[] = $block;
		}
		return $result;
	}
	private function blockItems(){
		$list = array(
			'files'		=>	array('name'=>LNG('common.position'),'open'=>true),
			'tools'		=>	array('name'=>LNG('common.tools'),'open'=>true,'children'=>true),
			'fileType'	=>	array('name'=>LNG('common.fileType'),'open'=>false,'children'=>true),
			'fileTag'	=>	array('name'=>LNG('common.tag'),'open'=>false,'children'=>true),
			'driver'	=>	array('name'=>LNG('common.mount').' (admin)','open'=>false),
		);
		return $list;
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
			case 'fileTag': 	$result = Action('explorer.tag')->tagList();break;
			case 'driver': 		$result = Action("explorer.listDriver")->get();break;
		}
		return array_values($result);
	}
	
	/**
	 * 文件位置
	 * 收藏夹、我的网盘、公共网盘、我所在的部门
	 */
	private function blockFiles(){
		$groupRoot = '1';
		$groupInfo = Model('Group')->getInfo($groupRoot);
		$list = array(
			"fav"=> $this->ioInfo(KodIO::KOD_USER_FAV),
			"my"=>array(
				'name'			=> LNG('explorer.toolbar.rootPath'),//我的网盘
				'path' 			=> KodIO::make(Session::get('kodUser.sourceInfo.sourceID')),
				'open'			=> true,
				"sourceRoot"	=> 'userSelf',//文档根目录标记；前端icon识别时用：用户，部门
				'targetType'	=> 'user',
				'targetID' 		=> USER_ID,
			),
			"rootGroup"=>array(
				'name'			=> $groupInfo['name'],//公共网盘
				'path' 			=> KodIO::make($groupInfo['sourceInfo']['sourceID']),
				"sourceRoot"	=> 'groupPublic',
				'targetType'	=> 'group',
				'targetID' 		=> $groupRoot,
			),
			"myGroup"=> $this->ioInfo(KodIO::KOD_GROUP_ROOT_SELF),
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
		
		if(!$this->pathEnable('myFav')){unset($list['fav']);}
		if(!$this->pathEnable('my')){unset($list['my']);}
		if(!$this->pathEnable('rootGroup')){unset($list['rootGroup']);}
		if(!$this->pathEnable('myGroup')){unset($list['myGroup']);}
		return array_values($list);
	}
	
	private function pathEnable($type){
		$model  = Model('SystemOption');
		$option = $model->get();
		if( !isset($option['treeOpen']) ) return true;
		
		// 单独添加driver情况;更新后处理;  单独加入文件类型开关,则根据flag标记;自动处理;
		// my,myFav,myGroup,rootGroup,recentDoc,fileType,fileTag,driver
		$checkFlag = false;
		$checkType = array(
			'treeOpenMy' 		=> 'my',
			'treeOpenMyGroup' 	=> 'myGroup',
			'treeOpenFileType' 	=> 'fileType',
			'treeOpenFileTag' 	=> 'fileTag',
			'treeOpenRecentDoc' => 'recentDoc',
			
			'treeOpenDriver' 	=> 'driver',
			'treeOpenFav'		=> 'myFav',
			'treeOpenRootGroup'	=> 'rootGroup',
		);
		foreach ($checkType as $keyType=>$key){
			if( $option[$keyType] !='ok'){
				$model->set($keyType,'ok');
				$model->set('treeOpen',$option['treeOpen'].','.$key);
				$result = true;
				$option = $model->get();
			}
		}
		if($result) return true;
		
		$allow = explode(',',$option['treeOpen']);
		return in_array($type,$allow);
	}
	
	/**
	 * 文件类型列表
	 */
	private function blockFileType(){
		$docType = KodIO::fileTypeList();
		$list	 = array();
		foreach ($docType as $key => $value) {
			$list[$key] = array(
				"name"		=> $value['name'],
				"path"		=> KodIO::makeFileTypePath($key),
				'ext'		=> $value['ext'],
				'extType'	=> $key,
				'icon' 		=> 'userFileType-'.$key,
			);
		}
		return $list;
	}
	
	/**
	 * 工具
	 */
	private function blockTools(){
		$list = $this->ioInfo(array(
			KodIO::KOD_USER_RECENT,
			KodIO::KOD_USER_SHARE,
			KodIO::KOD_USER_SHARE_TO_ME,
			KodIO::KOD_USER_RECYCLE,
		));
		if(!$this->pathEnable('recentDoc')){
			unset($list[KodIO::KOD_USER_RECENT]);
		}
		return array_values($list);
	}

	private function ioInfo($pick){
		$list = array(
			KodIO::KOD_USER_FAV			=> LNG('explorer.toolbar.fav'),
			KodIO::KOD_GROUP_ROOT_SELF	=> LNG('explorer.toolbar.myGroup'),
			KodIO::KOD_USER_RECENT		=> LNG('explorer.toolbar.recentDoc'),
			KodIO::KOD_USER_SHARE		=> LNG('explorer.toolbar.myShare'),
			KodIO::KOD_USER_SHARE_TO_ME	=> LNG('explorer.toolbar.shareToMe'),
			KodIO::KOD_USER_RECYCLE		=> LNG('explorer.toolbar.recycle'),
			KodIO::KOD_SEARCH			=> LNG('common.search'),
		);
		$result = array();
		foreach ($list as $key => $name){
			$result[$key] = array(
				"name"	=> $name, 
				"path"	=> $key.'/',
				"icon"	=> trim(trim($key,'{'),'}')
			);
		}
		if(is_string($pick)){
			return $result[$pick];
		}else if(is_array($pick)){
			$pickArr = array();
			foreach ($pick as $value) {
				$pickArr[$value] = $result[$value];
			}
			return $pickArr;
		}		
		return $result;	
	}
	
}
