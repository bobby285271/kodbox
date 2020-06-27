<?php
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/

class explorerIndex extends Controller{
	private $model;
	public function __construct(){
		parent::__construct();
		$this->model = Model("Source");
	}
	public function pathInfo(){
		$fileList = json_decode($this->in['dataArr'],true);
		if(!$fileList){
			show_json(LNG('explorer.error'),false);
		}
		$result = array();
		for ($i=0; $i < count($fileList); $i++) {
			$result[] = $this->itemInfo($fileList[$i]);
		}
		if(count($fileList) == 1){
			$result = $result[0];
			$result = Model('SourceAuth')->authOwnerApply($result);
		}
		$data = !!$result ? $result : LNG('common.pathNotExists');
		show_json($data,!!$result);
	}
	private function itemInfo($item){
		$path = $item['path'];
		if($item['type'] == 'full'){
			$result = IO::infoFull($path);
		}else{
			$result = IO::infoWithChildren($path);
		}
		if(!$result) return false;
		if( $result['type'] == 'file' && 
			Action('explorer.auth')->fileCanRead($path)){
			$result['downloadPath'] = Action('explorer.share')->link($path);
		}
		$result['pathDisplay'] = $result['pathDisplay']? $result['pathDisplay']: $result['path'];
		return $result;
	}
	
	public function desktopApp(){
		$desktopApps = include(DATA_PATH.'system/desktop_app.php');
		$desktopApps['myComputer']['value'] = MY_HOME;
		foreach ($desktopApps as $key => &$item) {
			if($item['menuType'] == 'menu-default-open'){
				$item['menuType'] = 'menu-default';
			}
			if(!$GLOBALS['isRoot'] && $item['rootNeed']){
				unset($desktopApps[$key]);
			}
		}
		show_json($desktopApps);
	}

	/**
	 * 设置文档描述;
	 */
	public function setDesc(){
		$maxLength = 1000;
		$msg = LNG('explorer.descTooLong').'('.LNG('explorer.noMoreThan').$maxLength.')';
		$data = Input::getArray(array(
			'path'	=> array('check'=>'require'),
			'desc'	=> array('check'=>'length','param'=>array(0,$maxLength),'msg'=>$msg),
		));
		
		$result = false;
		$info   = IO::info($data['path']);
		if($info && $info['sourceID']){
			$result = $this->model->setDesc($info['sourceID'],$data['desc']);
		}
		// $msg = !!$result ? LNG('explorer.success') : LNG('explorer.error');
		show_json($data['desc'],!!$result);
	}
	
	/**
	 * 设置权限
	 */
	public function setAuth(){
		$data = Input::getArray(array(
			'path'	=> array('check'=>'require'),
			'auth'	=> array('check'=>'json','default'=>''),
			'action'=> array('check'=>'in','default'=>'','param'=>array('clearChildren','getData') ),
		));

		$result = false;
		$info   = IO::info($data['path']);
		if($info && $info['sourceID'] && $info['targetType'] == 'group'){//只能设置部门文档;
			if($data['action'] == 'getData'){
				$result = Model('SourceAuth')->getAuth($info['sourceID']);
				show_json($result);
			}
			
			//清空所有子文件(夹)的权限；
			if($data['action'] == 'clearChildren'){
				$result = Model('SourceAuth')->authClear($info['sourceID']);
			}else{
				$result = Model('SourceAuth')->setAuth($info['sourceID'],$data['auth']);
			}
		}
		$msg = !!$result ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$result);
	}
	
	public function pathAllowCheck($path){
		$notAllow = array('/', '\\', ':', '*', '?', '"', '<', '>', '|');
		$parse = KodIO::parse($path);
		if($parse['pathBase']){
			$path = $parse['param'];
		}
		$name = get_path_this($path);
		$checkName = str_replace($notAllow,'_',$name);
		if($name != $checkName){
		    show_json(LNG('explorer.charNoSupport').implode(',',$notAllow),false);
		}
		return;
	}
	
	public function mkfile(){
		$this->pathAllowCheck($this->in['path'],true);
		$tplPath = BASIC_PATH.'static/others/newfile-tpl/';
		$ext     = get_path_ext($this->in['path']);
		$tplFile = $tplPath.'newfile.'.$ext;
		$content = _get($this->in,'content','');
		if( isset($this->in['content']) ){
			if( _get($this->in,'base64') ){ //文件内容base64;
				$content = base64_decode($content);
			}
		}else if(@file_exists($tplFile)){
			$content = file_get_contents($tplFile);
		}
		$repeat = !empty($this->in['fileRepeat']) ? $this->in['fileRepeat']:REPEAT_SKIP;
		$result = IO::mkfile($this->in['path'],$content,$repeat);
		$msg = !!$result ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$result,$result);
	}
	public function mkdir(){
		$this->pathAllowCheck($this->in['path']);
		$repeat = !empty($this->in['fileRepeat']) ? $this->in['fileRepeat']:REPEAT_SKIP;
		$result = IO::mkdir($this->in['path'],$repeat);
		$msg = !!$result ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$result,$result);
	}
	public function pathRename(){
		$this->pathAllowCheck($this->in['newName']);
		$result = IO::rename($this->in['path'],$this->in['newName']);
		$msg = !!$result ? LNG('explorer.success') : LNG("explorer.pathExists");
		show_json($msg,!!$result,$result);
	}

	public function pathDelete(){
		$list = json_decode($this->in['dataArr'],true);
		$toRecycle = Model('UserOption')->get('recycleOpen');
		if( _get($this->in,'shiftDelete') == '1' ){
			$toRecycle = false;
		}
		$success=0;$error=0;
		$errorMsg = LNG('explorer.removeFail');
		foreach ($list as $val) {
			if($val['path'] == MY_DESKTOP){
				$error ++;
				$errorMsg = LNG('explorer.desktopDelError');
				continue;
			}
			$result = IO::remove($val['path'],$toRecycle);
			$result ? $success ++ : $error ++;
		}
		$code = $error === 0 ? true:false;
		$msg  = $code ? LNG('explorer.removeSuccess') : $errorMsg;
		if(!$code && $success > 0){
			$msg = $success.' '.LNG('explorer.success').', '.$error.' '.LNG('explorer.error');
		}
		show_json($msg,$code);
	}
	// 从回收站删除
	public function recycleDelete(){		
		if( _get($this->in,'all') ){
			Model('SourceRecycle')->remove(false);
		}else{
			$sourceId = $this->parseSource();
			Model('SourceRecycle')->remove($sourceId);
		}
		show_json(LNG('explorer.success'));
	}
	//回收站还原
	public function recycleRestore(){
		if(_get($this->in,'all')){
			Model('SourceRecycle')->restore(false);
		}else{
			$sourceId = $this->parseSource();
			Model('SourceRecycle')->restore($sourceId);
		}
		show_json(LNG('explorer.success'));
	}
	private function parseSource(){
		$list = json_decode($this->in['dataArr'],true);
		$result = array();
		foreach ($list as &$value) {
			$result[] = IO::getPath($value['path']);
		}
		return $result;
	}
	public function pathCopy(){
		Session::set(array(
			'pathCopyType'	=> 'copy',
			'pathCopy'		=> $this->in['dataArr'],
		));
		show_json(LNG('explorer.copySuccess'));
	}
	public function pathCute(){
		Session::set(array(
			'pathCopyType'	=> 'cute',
			'pathCopy'		=> $this->in['dataArr'],
		));
		show_json(LNG('explorer.cuteSuccess'));
	}
	public function pathCopyTo(){
		$this->pathPast('copy',$this->in['dataArr']);	
	}
	public function pathCuteTo(){
		$this->pathPast('cute',$this->in['dataArr']);	
	}
	public function clipboard(){
		if(isset($this->in['clear'])){
			Session::set('pathCopy', json_encode(array()));
			Session::set('pathCopyType','');
			return;
		}
		$clipboard = json_decode(Session::get('pathCopy'),true);
		if(!$clipboard){
			$clipboard = array();
		}
		show_json($clipboard,true,Session::get('pathCopyType'));
	}
	public function pathLog(){
		$sourceID = KodIO::sourceID($this->in['path']);
		$data = Model('SourceEvent')->listBySource($sourceID);
		show_json($data);
	}

	/**
	 * 复制或移动
	 */
	public function pathPast($copyType=false,$list=false){
		if(!$copyType){
			$copyType = Session::get('pathCopyType');
			$list     = Session::get('pathCopy');
			if($copyType == 'cute'){
				Session::set('pathCopy', json_encode(array()));
				Session::set('pathCopyType', '');
			}
		}

		$list = json_decode($list,true);
		$pathTo = $this->in['path'];
		if (count($list) == 0 || !$pathTo) {
			show_json(LNG('explorer.clipboardNull'),false);
		}
		
		$error = '';
		$repeat = Model('UserOption')->get('fileRepeat');
		$repeat = !empty($this->in['fileRepeat']) ? $this->in['fileRepeat'] :$repeat;
		$result = array();		
		for ($i=0; $i < count($list); $i++) {
			$thePath = $list[$i]['path'];
			if ($copyType == 'copy') {
				//复制到自己所在目录,则为克隆;
				$driver = IO::init($thePath);
				$father = $driver->getPathOuter($driver->pathFather($driver->path));
				$repeatType = $repeat;
				if(KodIO::clear($father) == KodIO::clear($pathTo) ){
					$repeatType = REPEAT_RENAME_FOLDER;
				}
				$result[] = IO::copy($thePath,$pathTo,$repeatType);
			}else{
				if($thePath == MY_DESKTOP){
					$error .= LNG('explorer.desktopDelError');
					continue;
				}
				$result[] = IO::move($thePath,$pathTo,$repeat);
			}
		}
		$msg= $copyType == 'copy'?LNG('explorer.pastSuccess').$error:LNG('explorer.cutePastSuccess').$error;
		$code = $error =='' ?true:false;
		show_json($msg,$code,$result);
	}

	/**
	 * 压缩下载
	 * @return void
	 */
	public function fileDownloadRemove(){
		$path = Input::get('path', 'require');
		$path = $this->pathCrypt($path,false);
		if(!$path || !IO::exist($path)) {
			show_json(LNG('common.pathNotExists'), false);
		}
		IO::fileOut($path,true);
		$dir = get_path_father($path);
		if(strstr($dir,TEMP_FILES)){
		    del_dir($dir);
		}
	}

	private function tmpZipName($dataArr){
		$files = array();
		foreach($dataArr as $item){
			$info	 = IO::info($item['path']);
			$files[] = IOArchive::tmpFileName($info);
		}
		sort($files);
		return md5(json_encode($files));
	}

	public function clearCache(){
		$maxTime = 3600*24;
		$list = IO::listPath(TEMP_FILES);
		$list = array_merge($list['fileList'],$list['folderList']);
		foreach($list as $item){
			if(time() - $item['modifyTime'] < $maxTime) continue;
			if(is_dir($item['path'])){
				del_dir($item['path']);
			}else{
				del_file($item['path']);
			}
		}
	}
	/**
	 * 多文件、文件夹压缩下载
	 * @return void
	 */
	public function zipDownload(){	
		ignore_timeout();
		$dataArr  = json_decode($this->in['dataArr'],true);
		$downName = $this->tmpZipName($dataArr);
		$zipCache = TEMP_FILES;mk_dir($zipCache);

		$zipPath = Cache::get($downName);
		if($zipPath && IO::exist($zipPath) ){
			show_json(LNG('explorer.zipSuccess'),true,$this->pathCrypt($zipPath));
		}

		$zipPath = $this->zip($zipCache.$downName . '/');
		Cache::set($downName, $zipPath, 3600*6);
		show_json(LNG('explorer.zipSuccess'),true,$this->pathCrypt($zipPath));
	}
	// 文件名加解密
	public function pathCrypt($path, $en=true){
		$pass = Model('SystemOption')->get('systemPassword').'encode';
		return $en ? Mcrypt::encode($path,$pass) : Mcrypt::decode($path,$pass);
	}

	/**
	 * 压缩
	 * @param string $zipPath
	 * @return void
	 */
	public function zip($zipPath=''){
		ignore_timeout();
		$dataArr  = json_decode($this->in['dataArr'],true);
		$fileType = Input::get('type', 'require','zip');
		$repeat   = Model('UserOption')->get('fileRepeat');
		$repeat   = !empty($this->in['fileRepeat']) ? $this->in['fileRepeat'] :$repeat;
		
		$zipFile = IOArchive::zip($dataArr, $fileType, $zipPath,$repeat);
		if($zipPath != '') return $zipFile;
		$info = IO::info($zipFile);
		$data = LNG('explorer.zipSuccess').LNG('explorer.file.size').":".size_format($info['size']);
		show_json($data,true,$zipFile);
	}
	/**
	 * 解压缩
	 * @return void
	 */
	public function unzip(){
		ignore_timeout();
		$data = Input::getArray(array(
			'path' => array('check' => 'require'),
			'pathTo' => array('check' => 'require'),
			'unzipPart' => array('check' => 'require', 'default' => '-1')
		));
		
		$repeat = Model('UserOption')->get('fileRepeat');
		$repeat = !empty($this->in['fileRepeat']) ? $this->in['fileRepeat'] :$repeat;
		IOArchive::unzip($data,$repeat);
		show_json(LNG('explorer.unzipSuccess'));
	}

	/**
	 * 查看压缩文件列表
	 * @return void
	 */
	public function unzipList(){
		$data = Input::getArray(array(
			'path' => array('check' => 'require'),
			'index' => array('check' => 'require', 'default' => '-1'),
			'download' => array('check' => 'require', 'default' => false),
			'name' => array('check' => 'require', 'default' => ''),
		));
		$list = IOArchive::unzipList($data);
		show_json($list);
	}

	public function fileDownload(){
		$this->in['download'] = 1;
		Hook::trigger('explorer.fileDownload', $this->in['path']);
		$this->fileOut();
	}
	//输出文件
	public function fileOut(){
		$path = $this->in['path'];
		if(!$path) return; 
		$isDownload = isset($this->in['download']) && $this->in['download'] == 1;
		if($isDownload && !Action('user.authRole')->authCanDownload()){
			show_json(LNG('explorer.noPermissionAction'),false);
		}
		if(isset($this->in['type']) && $this->in['type'] == 'image'){
			$info = IO::info($path);
			$imageThumb = array('jpg','png','jpeg','bmp');
			if ($info['size'] >= 1024*50 &&
				function_exists('imagecolorallocate') &&
				in_array($info['ext'],$imageThumb) 
			){
				return IO::fileOutImage($path,$this->in['width']);
			}
		}
		$this->updateLastOpen($path);
		IO::fileOut($path,$isDownload);
	}
	/*
	相对某个文件访问其他文件; 权限自动处理;支持source,分享路径,io路径,物理路径;
	path={source:1138926}/&add=images/as.png; path={source:1138926}/&add=as.png
	path={shareItem:123}/1138934/&add=images/as.png
	*/
	public function fileOutBy(){
		if(!$this->in['path']) return; 
		
		// 拼接转换相对路径;
		$io = IO::init($this->in['path']);
		$parent = $io->getPathOuter($io->pathFather($io->path));
		$find   = $parent.'/'.$this->in['add'];
		$find   = KodIO::clear(str_replace('./','/',$find));
		$info   = IO::infoFull($find);
		// pr($parent,$find,$info,IO::info($this->in['path']));exit;
		if(!$info || $info['type'] != 'file'){
			return show_json(LNG('common.pathNotExists'),false);
		}

		$dist = $info['path'];
		ActionCall('explorer.auth.canView',$dist);
		$this->updateLastOpen($dist);
		IO::fileOut($dist,false);
	}
	
	/**
	 * 打开自己的文档；更新最后打开时间
	 */
	private function updateLastOpen($path){
		$driver = IO::init($path);
		if($driver->pathParse['type'] != KodIO::KOD_SOURCE) return;

		$sourceID = $driver->pathParse['id'];
		$sourceInfo = $this->model->sourceInfo($sourceID);
		if( $sourceInfo['targetType'] == SourceModel::TYPE_USER && 
			$sourceInfo['targetID'] == USER_ID ){
			$data = array('viewTime' => time());
			$this->model->where(array('sourceID'=>$sourceID))->save($data);
		}
	}
	
	//通用保存
	public function fileSave(){
		if(!$this->in['path'] || !$this->in['path']) return; 
		$result = IO::setContent($this->in['path'],$this->in['content']);
		Hook::trigger("explorer.fileSaveStart",$this->in['path']);
		show_json($result,!!$result);
	}
	//通用预览
	public function fileView(){
	}

	//通用缩略图
	public function fileThumb(){
		Hook::trigger("explorer.fileThumbStart",$this->in['path']);
	}	
}