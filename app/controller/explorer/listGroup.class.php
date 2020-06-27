<?php
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/
class explorerListGroup extends Controller{
	public function __construct(){
		parent::__construct();
		$this->model = Model("Source");
		$this->modelGroup = Model('Group');
	}

	public function groupSelf($pathInfo){//获取组织架构的用户和子组织；
		$groupInfo 	= Session::get("kodUser.groupInfo");
		return $this->groupArray($groupInfo);
	}
	
	// 是否允许罗列部门的子部门;
	private function enableListGroup($groupID){
		$option = Model('SystemOption')->get();
		if( !isset($option['groupListChild']) ) return true;
		
		$listGroup = $option['groupListChild']=='1';
		if(!$listGroup) return false;
		if($groupID == '1'){
			return $option['groupRootListChild']=='1';
		}
		return true;
	}
	
	// 根据多个部门信息,构造部门item;
	private function groupArray($groupInfo){
		$groupInfo 	= array_to_keyvalue($groupInfo,'groupID');//自己所在的组
		$group 		= array_remove_value(array_keys($groupInfo),'1');
		if(!$group) return array();

		$where = array("groupID"=>array('in',$group));
		$groupArry	 = Model('Group')->where($where)->select();
		$groupSource = $this->model->sourceRootGroup($group);
		$groupList 	 = array();

		foreach($groupArry as $val){
			$groupID = $val['groupID'];
			if($groupID == '1') continue; // 去除根部门
			$auth = $this->pathGroupAuthMake($val['parentLevel'].$groupID.',');
			if(!$GLOBALS['isRoot']){
				if( !$auth || $auth['authValue'] == 0){
					continue;// 没有权限;
				}
			}
			
			$groupList[] = array(
				'name'      		=> '['.$val['name'].']',
				'path' 				=> $groupSource[$groupID],
				'isParent'			=> true,
				"sourceRoot"		=> 'groupPath',	//为部门根目录
				'type'				=> 'folder',
				'hasChildFolder'	=> true,
				'hasChildFile'		=> true,
				
				'size'				=> $val['sizeUse'],
				'createTime'		=> $val['createTime'],
				'modifyTime'		=> $val['modifyTime'],
				'groupParentLevel'	=> $val['parentLevel'],
				'groupParentID'		=> $val['parentID'],
				'groupID'			=> $val['groupID'],
				'auth'				=> $auth,
			);
		}
		$this->pathGroupAppendPath($groupList);
		// pr($groupList);exit;
		return $groupList;
	}
	
	
	/**
	 * 部门根目录;罗列子部门;
	 */
	public function groupChildAppend($data){
		$pathInfo = $data['current'];
		if(!$this->groupChildAppendCheck($pathInfo)) return $data;
		if(!$this->enableListGroup($pathInfo['targetID'])) return $data;
		$groupID = $pathInfo['targetID'];
		$groupList  = $this->modelGroup->where(array('parentID'=>$groupID))->select();

		$groupListItem  =  $this->groupArray($groupList);		
		$data['groupList']  = $groupListItem;
		$data['pageInfo']['totalNum'] += count($groupListItem);
		// pr($pathInfo,$data,$groupListItem);exit;
		return $data;
	}
	
	//是否追加子部门检测; 部门根目录;分页第一页;
	private function groupChildAppendCheck($pathInfo){
		if(!$pathInfo || $pathInfo['targetType'] != 'group') return false;

		//不是根目录
		$parents = $this->model->parentLevelArray($pathInfo['parentLevel']);
		if(count($parents) != 0) return false;

		// 不是第一页;
		$page = intval($this->in['page']);
		$page = $page >= 1? $page:1;
		if($page !=1) return false;
		
		// 企业网盘;不罗列子部门;
		// if($pathInfo['targetID'] == '1') return false;
		return true;
	}

	/**
	 * 部门列表追加部门上下层级关系;
	 */
	private function pathGroupAppendPath(&$list){
		$pathNameArray = array();
		foreach ($list as &$item) {
			$pathNameArray[$item['groupID']] = $item['name'];//缓存一部分目录名
			$parents = $this->model->parentLevelArray($item['groupParentLevel']);
			foreach ($parents as $theID) {
				if(!isset($pathNameArray[$theID])){
					$pathNameArray[$theID] = 0;
				}
			}
		}
		//需要查询文档名称的id列表
		$needSelectID = array();
		foreach ($pathNameArray as $key => $value) {
			if(!$value){
				$needSelectID[] = $key;
			}
		}
		if($needSelectID){
			//查询并依次整理相关文档的名称；
			$where = array("groupID"=>array("in",$needSelectID));
			$sourceInfo = $this->modelGroup->field("groupID,name")->where($where)->select();
			$sourceName = array_to_keyvalue($sourceInfo,'groupID','name');
			$pathNameArray = array_merge_index($pathNameArray,$sourceName);//array_merge 会重建key序号
		}
		//拼接为地址
		foreach ($list as &$item) {
			$parents = $this->model->parentLevelArray($item['groupParentLevel']);
			$path = '';
			foreach ($parents as $theID) {
				if(isset($pathNameArray[$theID])){
					$path .= '['.$pathNameArray[$theID].']/';
				}
			}
			$path .= '['.$item['name'].']';
			$item['pathDisplay'] = str_replace('//','/',$path);
			if($item['auth']){
				$item['isWriteable'] = AuthModel::authCheckEdit($item['auth']['authValue']);
				$item['isReadable']  = AuthModel::authCheckView($item['auth']['authValue']);
			}
		}
		// pr($list,$needSelectID,$pathNameArray);exit;
	}

	public function pathGroupAuth($groupID){
		$groupInfo = $this->modelGroup->getInfoSimple($groupID);//101
		return $this->pathGroupAuthMake($groupInfo['parentLevel']);
	}
	public function pathGroupAuthMake($parentLevel){
		$selfGroup 	= Session::get("kodUser.groupInfo");
		$selfGroup 	= array_to_keyvalue($selfGroup,'groupID');//自己所在的组
		$parents = $this->model->parentLevelArray($parentLevel);
		$parents = array_reverse($parents);
		foreach ($parents as $id) {
			if($id == '1') return false;// 根部门;
			if(isset($selfGroup[$id])){
				return array(
					'authValue' => $selfGroup[$id]['auth']['auth'],
					'authInfo' => $selfGroup[$id]['auth'],
				);
			}
		}
		return false;
	}

	/**
	 * 用户根目录,部门根目录操作检测
	 * 不允许: 重命名,删除,复制,剪切,下载,分享
	 */
	public function pathRootCheck($action){
		$disable = array(
			'path' 		=> array(
				'explorer.index.pathRename',
				'explorer.userShare.add',
				'explorer.userShare.get',
				'explorer.userShare.edit',
			),
			'dataArr'	=> array(
				'explorer.index.pathDelete',
				'explorer.index.pathCopy',
				'explorer.index.pathCute',
				'explorer.index.pathCopyTo',
				'explorer.index.pathCuteTo',
				'explorer.index.zipDownload'
			),
		);
		foreach ($disable as $type=>$medhods) {
			$disable[$type] = array();
			foreach ($medhods as $item) {
				$disable[$type][] = strtolower($item);
			}
		}
		
		$allAction = array_merge($disable['path'],$disable['dataArr']);
		if(!in_array($action,$allAction)) return;
		
		$isGroupRoot = false;
		$errorAdd = '';
		if(in_array($action,$disable['path'])){
			$isGroupRoot = $this->pathIsRoot($this->in['path']);
		}else{
			$data = json_decode($this->in['dataArr'],true);
			if(is_array($data)){
				foreach ($data as $item) {
					$isGroupRoot = $this->pathIsRoot($item['path']);
					if($isGroupRoot){
						$errorAdd = '['.$item['name'].'],';
						break;
					}
				}
			}
		}
		if(!$isGroupRoot) return;
		return show_json($errorAdd.LNG('explorer.pathNotSupport'),false);
	}
	// 检测目录是否为部门根目录;
	private function pathIsRoot($path){
		$parse = KodIO::parse($path);
		if($parse['type'] != KodIO::KOD_SOURCE) return false;
		
		$info = IO::info($path);
		if($info['parentID'] =='0') return true;//部门根目录,用户根目录;
		// if(!$info || $info['targetType'] != 'group') return false;
		return false;
	}
	
}