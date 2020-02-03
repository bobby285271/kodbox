define(function(require, exports) {
	var playStart = function(vedioInfo){
		var $target = createDialog(vedioInfo.name);
		var typeArr = {
			'f4v' : 'flv',
			'f4a' : 'flv',
			'm4a' : 'mp3',
			'aac' : 'mp3',
			'ogg' : 'oga',
		};
		var type = typeArr[vedioInfo.ext] || vedioInfo.ext;
		var playerOption = {
			container:$target.get(0),
			preload: 'none',
			theme:'#f60',
			loop: false,
			autoplay:true,
			lang: 'zh-cn',
			//flv仅支持 H.264+AAC编码 https://github.com/Bilibili/flv.js/issues/47
			video: {
				url:vedioInfo.url,
				type:type
			},
			contextmenu: [
				{
					text: 'kodcloud官网',
					link: 'https://kodcloud.com/'
				}
			]
		};
		new DPlayer(playerOption);
	}
	var createDialog = function(title,ext){
		var size  = {width:'70%',height:'60%'};
		if(ext == 'mp3'){
			size  = {width:'320px',height:'420px'};
		}
		var dialog = $.dialog({
			simple:true,
			ico:core.icon('mp4'),
			title:title,
			width:size.width,
			height:size.height,
			content:'<div class="Dplayer"></div>',
			resize:true,
			padding:0,
			fixed:true,
			close:function(){}
		});
		dialog.DOM.wrap.addClass('dplayer-dialog');
		return dialog.DOM.wrap.find(".Dplayer");
	}

	var playReady = function(appStatic,vedioInfo){
		requireAsync([
			appStatic+'DPlayer/lib/flv.min.js',
			appStatic+'DPlayer/lib/hls.min.js',
			appStatic+'DPlayer/lib/dash.all.min.js',
			appStatic+'DPlayer/DPlayer.min.css',
			appStatic+'DPlayer/DPlayer.min.js',
			],function(){
			playStart(vedioInfo);
		});
	}
	return playReady;
});
