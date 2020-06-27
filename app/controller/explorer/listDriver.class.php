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
				"driver" 		=> strtolower($item['driver']),
				"driverDefault" => $item['default'],
				'isParent'		=> true,
			);
		}
		return $list;
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
			"driver" 		=> 'driver',
			'isParent'		=> true,
		);
	}
}