define(function(require, exports) {
	var getImageArr = function(filePath,name){
		var $file    = $("[data-path="+hashEncode(filePath)+"]");
		var $images  = $file.parent().find(".file .picture");
		var itemsArr = [];
		var index 	 = 0;
		var makeItem = function(filePath,name,$dom){
			itemsArr.push([
				[
					core.pathImage(filePath,250),
					core.pathImage(filePath,1200),
					core.pathImage(filePath,false)
				],
				htmlEncode(name || ''),
				[0,0],
				''
			]);
		}
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
	
	//播放幻灯片时，删除图片.
	var removeImageRequest = function(path,callback){
		callback();
	};
	var removeImage = function(){
		var index = parseInt($('#PV_Control #PV_Items .current').attr('number'));
		var path = myPicasa.arrItems[index][0][2];
		removeImageRequest(path,function(){
			if(myPicasa.arrItems.length <=1){
				return myPicasa.close();
			}
			myPicasa.arrItems.splice(index,1);
			if(index >= myPicasa.arrItems.length -1){
				index = myPicasa.arrItems.length -1
			}
			myPicasa.play(myPicasa.arrItems,index);
		});
	}
	var imageRotate = function(rotate){
		var index = parseInt($('#PV_Control #PV_Items .current').attr('number'));
		var path = myPicasa.arrItems[index][0][2];
		ui.pathOperate.imageRotate(path,rotate,function(){
			var imgSrc = function(img){
				var str = '&picture='+UUID();
				return img.indexOf('?') == -1 ? img+'?a=1'+str : img+str
			}
			var $img = $('[data-path='+pathHashEncode(path)+']').find('img');
			var imageSmall = imgSrc(myPicasa.arrItems[index][0][0]);
			var imgageBig = imgSrc(myPicasa.arrItems[index][0][1]);
			
			$("#PV_Items .current img").attr('src',imageSmall);
			$img.attr('src',imageSmall);
			$img.attr('data-original',imageSmall);
			myPicasa.resetImage(imgageBig,imageSmall);
		});
	}
	var loadImageBefore = function(){
	    var index = parseInt($('#PV_Control #PV_Items .current').attr('number'));
		var path = myPicasa.arrItems[index][0][2];
		var $action = $("#PV_rotate_Left,#PV_rotate_Right,#PV_Btn_Remove");
		if(path.substr(0,4) == 'http'){
		    $action.addClass('hidden');
		}else{
		    $action.removeClass('hidden');
		}
	};
	
	return function(path,ext,name,appStatic){
		requireAsync([
			appStatic+'picasa/style/style.css',
			appStatic+'picasa/picasa.js'
		],function(){
			if(!window.myPicasa){
				myPicasa = new Picasa();
				myPicasa.removeImage = removeImage;
				myPicasa.imageRotate = imageRotate;
				myPicasa.loadImageBefore = loadImageBefore;
			}
			var images = getImageArr(path,name);
			myPicasa.play(images.items,images.index);
			setTimeout(() => {
				$('#PicasaView').attr('tabindex','10').focus();
			},100);
		});
	};
	
});

