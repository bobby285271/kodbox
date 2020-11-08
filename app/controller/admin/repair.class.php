<?php
/**
 * 计划任务
 */
class adminRepair extends Controller {
	function __construct()    {
		parent::__construct();
	}
	
	// File表中,io不存在的文件进行处理;（被手动删除的）
	public function fileClear(){
		http_close();
		Model("File")->refreshData(); //应用计数重置;
	}

	// source对应fileID 不存在处理;
	public function sourceClear(){
		http_close();
		$modelSource = Model("Source");
		$modelFile   = Model("File");
		$list = $modelSource->select();
		$notExist = 0;
		$task = new Task("sourceClear",'',count($list));
		foreach ($list as $item) {
			if($item['isFolder'] == '0' && !$modelFile->find($item['fileID'])){
				$notExist ++;
				$task->task['currentTitle'] = $notExist .'个不存在';
				write_log($item['fileID'],'test');
				$modelSource->remove($item['sourceID'],false);
			}
			$task->update(1);
		}
		$task->end();
	}
		
	public function resetFileHash(){
		$model = Model('File');
		$listFile = $model->select();
		$task = new Task("resetFileHash",'',count($listFile));
		foreach ($listFile as $file) {
			$task->update(1);
			if(!$file['hashSimple'] || !$file['hashMd5']){
				$data = array('hashSimple'=>IO::hashSimple($file['path']) );
				if(!$file['hashMd5']){
				    $data['hashMd5'] = IO::hashMd5($file['path']);
				}
				$model->where(array('fileID'=>$file['fileID']))->save($data);
			}
		}
		$task->end();
		show_json(count($listFile));
	}

	// file表中存在, source表中不存在的进行清除;
	public function fileSourceClear(){
		// // Source; 历史记录表等;
		// $modelSource = Model("Source");
		// $modelFile   = Model("File");
		// $list	  = $modelFile->select();
		// $notExist = 0;
		// http_close();
		
		// $task = new Task("fileClearCheck",'',count($list));
		// foreach ($list as $item) {
		// 	$where = array("fileID"=>$item['fileID']);
		// 	if(!$modelSource->where($where)->find()){
		// 		$notExist ++;
		// 		$task->task['currentTitle'] = $item['fileID'].';'.$notExist .'个不存在';
		// 		IO::remove($item['path']);
		// 		$modelFile->where($where)->delete();
		// 	}
		// 	$task->update(1);
		// }
	}
}