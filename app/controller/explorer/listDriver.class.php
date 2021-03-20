<?php
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/
class explorerListDriver extends Controller{
	public function __construct(){
		parent::__construct();
	}
	
	/**
	 * 用户存储挂载列表
	 */
	public function get(){
		if($GLOBALS['isRoot']) return $this->rootList();
		return false;//普通用户挂载暂不支持;
	}
	
	
	private function rootList(){
		$dataList = Model('Storage')->listData();
		$list = array();
		if($this->config['systemOS']=='windows'){
			$check = 'CDEFGHIJKLMNOPQRSTUVWXYZ';
			for($i=0;$i<strlen($check);$i++){
				$this->driverMake($list,"$check[$i]:/");
			}
		}else{
			$this->driverOthers($list);
		}
		
		foreach ($dataList as $item) {
			$list[] = array(
				"name"			=> $item['name'],
				"path"			=> '{io:'.$item['id'].'}/',
				"size"			=> $item['sizeUse'],
				"driverSpace"	=> $item['sizeMax']*1024*1024*1024,
				"driverDefault" => $item['default'],
				"icon" 			=> 'io-'.strtolower($item['driver']),
				'isParent'		=> true,
			);
		}
		return $list;
	}

		
	public function parsePathIO($info,$current=false){
		if(substr($info['path'],0,4) != '{io:') return $info;
		static $driverList = false;
		if ($driverList === false) {
			$list = Model('Storage')->driverListSystem();
			$driverList = array_to_keyvalue($list,'id');
		}
		if(!$driverList) return $info;
		
		$isFavPath = false;
		if(is_array($current) && isset($current['path'])){
			$isFavPath = trim($current['path'],'/') == KodIO::KOD_USER_FAV;
		}
		
		$parse = KodIO::parse($info['path']);
		$storage = $driverList[$parse['id']];
		if(!$storage) return $info;

		$info['isReadable']  = true;
		$info['isWriteable'] = true;
		$info['ioType'] = $storage['driver'];
		$info['pathDisplay'] = str_replace($parse['pathBase'],$storage['name'],$info['path']);

		// 根目录;
		if( !trim($parse['param'],'/') || $isFavPath ){
			$info['name'] = $storage['name'];
			if($isFavPath){
			    $info['name'] = $info['sourceInfo']['favName'];
			}
			$info['icon'] = 'io-'.strtolower($storage['driver']);
			if(isset($storage['config']['domain'])){
				$info['ioDomain'] = $storage['config']['domain'];
			}
			if(isset($storage['config']['bucket'])){
				$info['ioBucket'] = $storage['config']['bucket'];
			}
			if(isset($storage['config']['basePath'])){
				$info['ioBasePath'] = $storage['config']['basePath'];
			}
		}
		// pr($storage,$parse,$info,$driverList);exit;
		return $info;
	}
	public function parsePathChildren($info,$current){
		if($info['type'] == 'file' || isset($info['hasFolder']) ) return $info;	
		$ioAllow = array('Local','MinIO');// 'Local','MinIO'
		$pathParse = KodIO::parse($current['path']);
		$isLocal = $pathParse['type'] ? false:true;
		$isIoAllow = in_array($current['ioType'],$ioAllow);
		if($pathParse['type'] == KodIO::KOD_BLOCK && $pathParse['id'] != 'driver') return $info;

		$infoMore = array('hasFolder'=>true,'hasFile'=> true);
		if($isLocal || $isIoAllow){
			$infoMore = IO::has($info['path'],1);
		}else if($pathParse['type'] == KodIO::KOD_USER_FAV){
			$itemParse = KodIO::parse($info['path']);
			if(!$itemParse['type']){
				$infoMore = IO::has($info['path'],1);
			}
		}
		$info['hasFolder']  = $infoMore['hasFolder'];
		$info['hasFile']  	= $infoMore['hasFile'];
		return $info;
	}

	
	private function driverOthers(&$list){
		if(!function_exists("shell_exec")){
			return $this->driverMake($list,"/");
		}
		$rows = explode("\n", shell_exec('df -l'));
		array_shift($rows);array_pop($rows);
		foreach ($rows as $row) {
			$item = preg_split("/[\s]+/", $row);
			$path = $item[count($item)-1];
			if(!strstr($item[0],'/dev/')) continue;
			if($path == '/private/var/vm') continue; //虚拟内存;
			$this->driverMake($list,$path);
		}
	}
	private function driverMake(&$list,$path){
		if(!file_exists($path)) return;
		$total  = @disk_total_space($path);
		$list[] = array(
			"name"			=> LNG('admin.storage.driver')."($path)",
			"path"			=> $path,
			"size"			=> $total - @disk_free_space($path),
			"driverSpace"	=> $total,
			"icon" 			=> 'io-driver',
			'isParent'		=> true,
		);
	}
}