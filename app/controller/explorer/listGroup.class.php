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
		$groupInfo  = array_sort_by($groupInfo,'groupID');
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
		$group 		= array_remove_value(array_keys($groupInfo),1);
		if(!$group) return array();

		$groupSource = $this->model->sourceRootGroup($group);
		$groupSource = array_to_keyvalue($groupSource,'targetID');
		$result = array();
		foreach($groupInfo as $group){ // 保持部门查询结构的顺序;
			$groupID = $group['groupID'];
			if($groupID == '1') continue; // 去除根部门
			if(!isset($groupSource[$groupID])) continue;
			
			$pathInfo = $groupSource[$groupID];			
			// $pathInfo['name'] = '['.$pathInfo['name'].']';
			$pathInfo['sourceRoot'] = 'groupPath';
			$pathInfo['pathDisplay']= $pathInfo['groupPathDisplay'];
			if(!$pathInfo['auth']){
				$pathInfo['auth'] = Model("SourceAuth")->authDeepCheck($pathInfo['sourceID']);
			}
			if(!$GLOBALS['isRoot']){
				if( !$pathInfo['auth'] || $pathInfo['auth']['authValue'] == 0){ // 放过-1; 打开通路;
					continue;// 没有权限;
				}
			}
			$result[] = $pathInfo;
		}
		// pr($result,$groupInfo,$groupSource);exit;
		return $result;
	}
	
	/**
	 * 部门根目录;罗列子部门;
	 */
	public function groupChildAppend(&$data){
		$pathInfo = $data['current'];
		if(!$this->groupChildAppendCheck($pathInfo)) return;
		if(!$this->enableListGroup($pathInfo['targetID'])) return;
		$groupID = $pathInfo['targetID'];
		$groupList  = $this->modelGroup->where(array('parentID'=>$groupID))->select();
	
		$data['groupList'] = $this->groupArray($groupList);
		$data['pageInfo']['totalNum'] += count($data['groupList']);
		// pr($groupList,$data,$groupListItem);exit;
	}
	
	//是否追加子部门检测; 部门根目录;分页第一页;
	private function groupChildAppendCheck($pathInfo){
		if(!$pathInfo || $pathInfo['targetType'] != 'group') return false;

		//不是根目录
		$parents = $this->model->parentLevelArray($pathInfo['parentLevel']);
		if(count($parents) != 0) return false;

		// 第一页才罗列;
		$page = intval($this->in['page']);
		$page = $page >= 1? $page:1;
		if($page !=1) return false;
		
		return true;
	}

	public function pathGroupAuth($groupID){
		return $this->pathGroupAuthMake($groupID);
	}
	public function pathGroupAuthMake($groupID){
		$groupInfo  = $this->modelGroup->getInfoSimple($groupID);//101
		$selfGroup 	= Session::get("kodUser.groupInfo");
		$selfGroup 	= array_to_keyvalue($selfGroup,'groupID');//自己所在的组
		$parents = $this->model->parentLevelArray($groupInfo['parentLevel']);
		$parents = array_reverse($parents);
		foreach ($parents as $id) {
			if($id == '1') return false;// 根部门;
			if(isset($selfGroup[$id])){
				return array(
					'authValue' => intval($selfGroup[$id]['auth']['auth']),
					'authInfo'  => $selfGroup[$id]['auth'],
				);
			}
		}
		// return false;
		return Model("SourceAuth")->authDeepCheck($groupInfo['sourceInfo']['sourceID']);
	}

	/**
	 * 用户根目录,部门根目录操作检测
	 * 不允许: 重命名,删除,复制,剪切,下载,分享
	 */
	public function pathRootCheck($action){
		$disable = array(
			'path' 	=> array(
				'explorer.index.pathRename',
				'explorer.userShare.add',
				'explorer.userShare.get',
				'explorer.userShare.edit',
			),
			'dataArr'=> array(
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
		
		$info = IO::infoSimple($path);
		if($info['targetType'] != SourceModel::TYPE_GROUP) return false;
		if($info['targetType'] != SourceModel::TYPE_USER)  return false;
		if($info['parentID'] =='0') return true;//部门根目录,用户根目录;
		// if(!$info || $info['targetType'] != 'group') return false;
		return false;
	}
	
}