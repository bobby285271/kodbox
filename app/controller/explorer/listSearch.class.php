<?php
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/
class explorerListSearch extends Controller{
	public function __construct(){
		parent::__construct();
		$this->model = Model("Source");
	}
	
	// {search}/key=val@key2=value2;
	public function listSearch($pathInfo){
		$param = array();$paramIn=array();$sourceInfo= array();
		$this->parseParam($pathInfo,$param,$paramIn,$sourceInfo);
		$list = $this->model->listSearch($param);
		$this->parseShareList($list,$sourceInfo);

		$list['searchParam']  = $paramIn;
		$list['searchParent'] = $sourceInfo;
		return $list;
	}

	private function parseParam($pathInfo,&$param,&$paramIn,&$sourceInfo){
		if( !Action('user.authRole')->authCanSearch() ){
			show_json(LNG('explorer.noPermissionAction'),false);
		}
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
		$param['words'] = trim($param['words'], '/');
		$path = $param['parentPath'];
		if(!$path){
			$user = Session::get('kodUser');
			$param['parentID'] = $user['sourceInfo']['sourceID'];
			$sourceInfo = IO::info(KodIO::make($param['parentID']));
			return;
		}

		Action('explorer.auth')->canView($path); //权限检测;
		$parse = KodIO::parse($path);
		if($parse['type'] == KodIO::KOD_SHARE_ITEM){
			$shareID  	= $parse['id'];
			$sourceID 	= trim($parse['param'],'/');
			$sourceInfo = Action("explorer.userShare")->sharePathInfo($shareID,$sourceID);
			if(!$sourceInfo){
				show_json(LNG('explorer.noPermissionAction'),false);
			}
		}else if($parse['type'] == KodIO::KOD_SOURCE){
			$sourceInfo = IO::info($path);
		}
		$param['parentID'] = $sourceInfo['sourceID'];
	}
	private function parseShareList(&$list,$sourceInfo){
		if(!$sourceInfo['shareUser']) return;
		$share = Action("explorer.userShare");
		$shareInfo	= Model('Share')->getInfo($sourceInfo['shareID']);
		// pr($shareInfo,$sourceInfo);exit;

		foreach ($list as $key => &$keyList) {
			if($key != 'folderList' && $key != 'fileList' ) continue;
			foreach ($keyList as &$source) {
				$source = $share->_shareItemeParse($source,$shareInfo);
			}
		}
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
}