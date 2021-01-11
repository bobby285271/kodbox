<?php
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/

class explorerEditor extends Controller{
	function __construct()    {
		parent::__construct();
	}
	
	public function fileGet(){
		$data = Input::getArray(array(
			'path'		=> array('check'=>'require'),
			'base64'	=> array('default'=>''),
			'charset'	=> array('check'=>'require','default'=>''),
		));
		if(request_url_safe($data['path'])){
			return $this->urlFileGet($data['path']);
		}
		$pathInfo = IO::info($data['path']);
		if(!$pathInfo || $pathInfo['type'] == 'folder'){
			return show_json(LNG('common.pathNotExists'),false);
		}
		
		if($pathInfo['size'] >= 1024*1024*20){
			show_json(LNG('explorer.editor.fileTooBig'),false);
		}
		$content = IO::getContent($pathInfo['path']);
		// $content = IO::fileSubstr($data['path'],1024*1024*0.5,1024*1024*0.5);		
		if(isset($pathInfo['size']) && $pathInfo['size'] == 0){
			$content = '';//空文件处理;
		}
		$charset = strtolower($data['charset']);
		$charset = $charset ? $charset : get_charset($content);
		if ($charset !='' &&$charset !='utf-8' && 
			function_exists("mb_convert_encoding") ){
			$content = @mb_convert_encoding($content,'utf-8',$charset);
		}
		// $data['base64'] = '1';//
		if($data['base64']=='1'){
			$content = strrev(base64_encode($content));
		}
		$pathInfo['base64'] 	= $data['base64'];
		$pathInfo['content'] 	= $content;
		$pathInfo['charset'] 	= $charset;
		show_json($pathInfo);
	}

	private function urlFileGet($path){
		$urlInfo = parse_url_query($path);
		$displayName = rawurldecode($urlInfo['name']);
		$fileContents = file_get_contents($path);
		if(strlen($fileContents) >= 1024*1024*20){
			show_json(LNG('explorer.editor.fileTooBig'),false);
		}
		if(isset($this->in['charset']) && $this->in['charset']){
			$charset = strtolower($this->in['charset']);
		}else{
			$charset = get_charset($fileContents);
		}
		if ($charset !='' && $charset !='utf-8' && 
			function_exists("mb_convert_encoding")){
			$fileContents = @mb_convert_encoding($fileContents,'utf-8',$charset);
		}
		$data = array(
			'ext'			=> get_path_ext($displayName),
			'name'			=> iconv_app(get_path_this($displayName)),
			'path'			=> '',
			'pathDisplay'	=> "[" . trim($displayName, '/') . "]",
			'charset'		=> $charset,
			'base64'		=> $this->in['base64'] == '1' ?'1':'0',// 部分防火墙编辑文件误判问题处理
			'content'		=> $fileContents
		);
		if($data['base64']=='1'){
			$data['content'] = strrev(base64_encode($data['content']));
		}
		show_json($data);
	}
	
	public function fileSave(){
		$data = Input::getArray(array(
			'path'			=> array('check'=>'require'),
			'content'		=> array('default'=>''),
			'base64'		=> array('default'=>''),
			'charset'		=> array('default'=>''),
			'charsetSave' 	=> array('default'=>''),
		));
		$pathInfo = IO::info($data['path']);
		if(!$pathInfo) show_json(LNG('common.pathNotExists'),false);
		
		//支持二进制文件读写操作（base64方式）
		$content = $data['content'];
		if($data['base64'] == '1'){
			$content = base64_decode(strrev($content));//避免防火墙拦截部分关键字内容
		}
		$charset 	 = strtolower($data['charset']);
		$charsetSave = strtolower($data['charsetSave']);
		$charset  	 = $charsetSave ? $charsetSave : $charset;
		if ( $charset !='' && 
			 $charset != 'utf-8' && 
			 $charset != 'ascii' &&
			 function_exists("mb_convert_encoding")
			) {
			$content = @mb_convert_encoding($content,$charset,'utf-8');
		}
		$result = IO::setContent($data['path'],$content);
		$msg = $result ? LNG("explorer.saveSuccess") : LNG('explorer.saveError');
		show_json($msg,!!$result);
	}

	/*
	* 保存编辑器配置信息
	*/
	public function setConfig(){
		$optionKey = array_keys($this->config['editorDefault']);
		$data = Input::getArray(array(
			"key"	=> array("check"=>"in","param"=>$optionKey),
			"value"	=> array("check"=>"require"),
		));
		Model('UserOption')->set($data['key'],$data['value'],'editor');
		show_json(LNG('explorer.settingSuccess'));
	}	
}
