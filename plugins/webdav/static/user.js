ClassBase.define({
	init: function(param){
		this.initParentView(param);
		this.initFormView(this.formData());
	},
	formData:function(){
		var address   = G.kod.APP_HOST+'index.php/plugin/webdav/kodbox/';
		var pluginApi = API_HOST+'plugin/webdav/download';
		return {
			"formStyle":{"hideSave":"1",className:"form-box-title-block "},
			"detailAddress":{
				"type":"html",
				"display":"<b>webdav "+LNG['common.address']+"</b>",
				"value":"<input type='text' value='"+address+"' readonly style='width:70%;' />\
				<span class='input-title input-title-right kui-btn' action='copy'><i class='font-icon icon-copy'></i>"+LNG['explorer.copy']+"</span>"
			},
			"help":{
				"display":"<b>"+LNG['webdav.help.title']+"</b>","value":
				"<div class='info-alert info-alert-green align-left can-select can-right-menu p-10 pl-30'>\
				<h6><i class='icon-windows font-icon ml--25 mr-5'></i>"+LNG['webdav.help.windows']+".\
				<p class='info-alert info-alert-green align-left mt-10'>"+LNG['webdav.help.windowsTips']+
				";  <a href='"+pluginApi+"' target='_blank' class='btn btn-sm btn-default' style='border-radius:3px;'>"+LNG['common.download']+"</a></p></h6><hr/>\
				<h6><i class='icon-apple font-icon ml--25 mr-5'></i>"+LNG['webdav.help.mac']+"</h6>\
				<h6><i class='icon-linux font-icon ml--25 mr-5'></i>"+LNG['webdav.help.others']+"</h6>\
				</div>"
			},
			
			"detail":{
				"display":"<b>"+LNG['common.tipsDesc']+"</b>","value":
				"<div class='info-alert info-alert-grey p-10 align-left can-select can-right-menu'>\
				<li>"+LNG['webdav.meta.desc']+"</li><hr/>\
				<li>"+LNG['webdav.tips.uploadUser']+"</li>\
				<li>"+LNG['webdav.tips.auth']+"\
				</div>"
			},
		}
	}
});