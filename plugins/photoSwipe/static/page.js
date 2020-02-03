define(function(require, exports) {
	var getImageArr = function(filePath,name){
		var itemsArr = [];
		var index 	 = 0;
		var makeItem = function(filePath,name,$dom){
			itemsArr.push({
				src:core.pathImage(filePath,1200),
				msrc:core.pathImage(filePath,250),
				trueImage:core.pathImage(filePath,false),
				title:htmlEncode(name || ''),
				w:0,h:0,
				$dom:$dom
			});
		}
		
		var $file    = $("[data-path="+hashEncode(filePath)+"]");
		var $images  = $file.parent().find(".file .picture");
		if($images.length > 0){
			$images.each(function(i){
				var $curFile = $(this).parents('.file');
				var curPath  = hashDecode($curFile.attr('data-path'));
				makeItem(curPath,$curFile.attr('data-name'),$(this).find('img'));
				if(curPath == filePath){
					index = i;
				}
			});
		}else{
			makeItem(filePath,name,false);
		}
		// console.log(7777,$images,itemsArr);
		return {items:itemsArr,index:index};
	};
	
	var initView = function(path,ext,name,photoSwipeTpl){
		var imageList = getImageArr(path,name);
		if($('.pswp_content').length == 0){
			$(photoSwipeTpl).appendTo('body');
			$('.pswp__caption__center').css({"text-align":"center"});
		}
		if($('.pswp').hasClass('pswp--open')) return;
		var options = {
			focus: true,
			index: 0,
			bgOpacity:0.8,
			maxSpreadZoom:5,
			closeOnScroll:false,
			shareEl: true,
			shareButtons: [
				{id:'open', label:"查看原图", url:'{{raw_image_url}}', download:false},
				{id:'download', label:LNG['common.download'], url:'{{raw_image_url}}&download=1', download:true}
			],
			getImageURLForShare: function( shareButtonData ) {
				return gallery.currItem.trueImage || '';
			},
			showHideOpacity:false,
			showAnimationDuration: 300,
			hideAnimationDuration: 300,
			fullscreenEl : true,
			getThumbBoundsFn: function(index) {
				var item = imageList.items[index];
				if(!item || !item.$dom || item.$dom.length == 0){//目录切换后没有原图
					return {x:$(window).width()/2,y:$(window).height()/2,w:1,h:1};
				}
				var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
				var rect = $(item.$dom).get(0).getBoundingClientRect();
				return {x:rect.left,y:rect.top + pageYScroll,w:rect.width,h:rect.height};
			}
		};
		options.index = imageList.index;
		var gallery = new PhotoSwipe($('.pswp').get(0),PhotoSwipeUI_Default,imageList.items,options);
		gallery.loadFinished = false;
		gallery.listen('gettingData', function(index, item) {
			if (item.w < 1 || item.h < 1) {
				var img = new Image(); 
				img.onload = function() {
					item.w = this.width;
					item.h = this.height;
					gallery.updateSize(true);
				}
				img.src = item.src;
			}

			//打开图片，加载动画起始位置
			if(!gallery.loadFinished){
				var rect = options.getThumbBoundsFn(index);
				item.w = rect.w * 25;
				item.h = rect.h * 25;
				gallery.loadFinished = true;
			}
		});
		gallery.init();
	};

	//http://dimsemenov.com/plugins/royal-slider/gallery/
	//http://photoswipe.com/documentation/faq.html
	return function(path,ext,name,appStatic,appStaticDefault){
		requireAsync([
			appStaticDefault+'PhotoSwipe/photoSwipe.html',
			appStatic+'PhotoSwipe/photoswipe.min',
			appStatic+'PhotoSwipe/photoswipe-ui-default.min',
			appStatic+'PhotoSwipe/photoswipe.css',
			appStatic+'PhotoSwipe/default-skin/default-skin.css',
		],function(photoSwipeTpl){
			initView(path,ext,name,photoSwipeTpl);
		});
	};
});