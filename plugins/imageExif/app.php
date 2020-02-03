<?php

class imageExifPlugin extends PluginBase{
	function __construct(){
		parent::__construct();

		//扩展缺失提示
		if( !function_exists('exif_read_data')){
			$this->appPackage();
			$this->packageData['configItem'] = array(
				"sep001" => '<div class="alert alert-danger m-30">'.LNG('imageExif.Config.missLib').'</div>',
			);
		}
	}
	public function regist(){
		$this->hookRegist(array(
			'user.commonJs.insert'	=> 'imageExifPlugin.echoJs',
			// 'explorer.share.image'	=> 'imageExifPlugin.imageCheck',
			// 'explorer.index.image'	=> 'imageExifPlugin.imageCheck',
		));
	}
	public function echoJs(){
		if( !function_exists('exif_read_data')){
			return;
		}
		//$this->echoFile('static/main.js');
	}
	public function getExif(){
		$path = $this->filePath($this->in['path']);
		$localFile = $this->pluginLocalFile($path);
		$exif = @exif_read_data($localFile);
		del_file($localFile);
		show_json($exif,!!$exif);
	}

	//根据Orientation 自动旋转图片
	//http://blog.csdn.net/ouyangtianhan/article/details/29825885
	//https://gxnotes.com/article/126807.html
	//https://zhuanlan.zhihu.com/p/25216999
	public function imageCheck(){
		if( !function_exists('exif_read_data')){
			return;
		}
		$path = $this->filePath($this->in['path']);
		$localFile = $this->pluginLocalFile($path);

		$exif = @exif_read_data($localFile);
		if(!file_exists($localFile) || 
			!$exif || 
			!isset($exif['Orientation']) || 
			$exif['Orientation'] < 3
		){
			del_file($localFile);
			return;
		}

		$img = ImageThumb::image($localFile);
		if(!$img) return;
		$ort = $exif['Orientation'];
		if($ort == 5 || $ort == 6){
			$img = imagerotate($img, 270, null);
		}
		if($ort == 3 || $ort == 4){
			$img = imagerotate($img, 180, null);
		}
		if($ort == 7 || $ort == 8){
			$img = imagerotate($img, 90, null);
		}
		if($ort == 4 || $ort == 5 || $ort == 7){
			imageflip($img,IMG_FLIP_HORIZONTAL);
		}
		$ext = get_path_ext($this->fileInfo['name']);
		$imagefun = 'image'.($ext=='jpg'?'jpeg':$ext);
		$res = $imagefun($img, $localFile);
		imagedestroy($img);

		$this->pluginCacheFileSet($path, file_get_contents($localFile));
		del_file($localFile);
	}
}
