kodReady.push(function () {
	var isAllow = parseInt("{{isAllow}}");
	Events.bind("admin.leftMenu.before",function(menuList){
		menuList.push({
			title:LNG['webdav.meta.name'],
			icon:"icon-hard-drive1",
			link:"admin/storage/webdav",
			after:'admin/storage/index',//after/before; 插入菜单所在位置;
			sort:100,
			pluginName:"{{pluginName}}",
		});
	});
	
	Events.bind("user.leftMenu.before",function(menuList){
		if(!isAllow) return;
		menuList.push({
			title:LNG['webdav.meta.name'],
			icon:"icon-hard-drive1",
			link:"setting/user/webdav",
			pluginName:"{{pluginName}}",
			sort:100,
			fileSrc:'{{pluginHost}}static/user.js',
		});
	});
	
	// 管理员后台,开启后立即使用;
	var reloadKey = 'window.webdav.reload.goto';
	$(document).delegate('.goto-connect-webdav','click',function(e){
		var $form = $(e.target).parents('.panel-form-body');
		var link = G.kod.APP_HOST+'#setting/user/webdav';
		var leftMenu = $(".admin-page").data("root.leftMenu");
		if(!leftMenu || !leftMenu.adminModel) return;

		$form.find('.form-save-button').trigger('click');
		var checkOpen = function(result){
			if(!result || !result.data) return;
			if(result.data.isOpen.value == '1'){
				//已经开启则直接跳转
				if(isAllow){ 
					Tips.close();
					window.location.href = link;
					return;
				}
				// 之前未开启,则刷新页面后跳转;
				Cookie.set(reloadKey,link);
				window.location.reload();
			}else{
				Tips.tips(LNG['webdav.config.isOpen']+'?');
			}
		}
		setTimeout(function(){
			leftMenu.adminModel.pluginGetConfig({app:'webdav'},checkOpen);
		},300);
	});
	
	//自动跳转;
	var locationTo = Cookie.get(reloadKey);
	if(locationTo){
		Cookie.del(reloadKey);
		window.location.href = locationTo;
	}
});