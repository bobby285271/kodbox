kodReady.push(function(){
	Events.bind('explorer.kodApp.before',function(appList){
		appList.push({
			name:"DPlayer",
			title:LNG['Plugin.default.DPlayer'],
			ext:"{{config.fileExt}},magnet",
			sort:"{{config.fileSort}}",
			icon:'{{pluginHost}}static/images/icon.png',
			callback:function(path,ext,name){
				var vedio = {
					url:core.path2url(path,true),
					name:name,
					path:path,
					ext:ext,
					autoSubtitle:"{{config.subtitle}}",
				};
				var appStatic = "{{pluginHost}}static/";
				requireAsync(appStatic+'page.js',function(play){
					play(appStatic,vedio);
				});
			}
		});
	});
	
	// 磁力链接支持播放; magnet文件扩展名,内容为磁力链接url;
	$.addStyle(".x-item-icon.x-magnet{background-image:url('{{staticPath}}images/file_icon/icon_file/utorrent.png');}");
});
