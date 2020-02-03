<?php
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/

//配置数据,可在setting_user.php中添加变量覆盖,升级后不会被替换
$config['settings'] = array(
	'downloadUrlTime'	=> 0,			 //下载地址生效时间，按秒计算，0代表不限制
	'apiLoginTonken'	=> '',			 //设定则认为开启服务端api通信登录，同时作为加密密匙
	'paramRewrite'		=> false,		 //开启url 去除? 直接跟参数
	
	'upload' => array(
		'chunkSize'			=> 0.5,			 // MB 分片上传大小设定;需要小于php.ini上传限制的大小
		'threads'			=> 10,			 // 上传并发数;部分低配服务器上传失败则将此设置为1
		'igNoreName'		=> '',			 // 忽略的文件名,不区分大小写; 逗号隔开,例如: .DS_Store,Thumb.db
		'chunkRetry'		=> 5,			 // 分片上传失败,重传次数;针对每个分片;
		'sendAsBinary'		=> 0,			 // 以二进制方式上传;后端服务器以php://input接收;0则为传统方式上传 $_FILE;
		'httpSendFile'		=> false,		 //调用webserver下载 http://www.laruence.com/2012/05/02/2613.html; 
											//https://www.lovelucy.info/x-sendfile-in-nginx.html	
		'downloadSpeed'		=> 0,			// 下载限速;MB/s*1024*1024; 0代表不限制	
	),
	
	'staticPath'		=> "./static/",	//静态文件目录,可以配置到cdn;
	'kodApiServer'		=> "https://api.kodcloud.com/?", //QQ微信登陆/邮件发送/插件-列表等
);

$config["ADMIN_ALLOW_IO"] = 1;		//其他部门or用户目录操作开关，仅限管理员
$config["ADMIN_ALLOW_SOURCE"] = 1;	//物理路径操作开关，仅限管理员

// windows upload threads;兼容不支持并发的服务器
if($config['systemOS'] == 'windows'){
	$config['settings']['upload']['threads'] = 1;
}
// windows iis bin上传有限制
if(strstr($_SERVER['SERVER_SOFTWARE'],'-IIS')){
	$config['settings']['upload']['sendAsBinary'] = 0;
}

// database/file/redis/memcached
$config['cache'] = array(
	'sessionType'	=> 'file',	//缓存方式 database/file/redis/memcached
	'sessionTime'	=> 3600,
    'cacheType'		=> 'file',	//缓存方式 database/file/redis/memcached
	'lockTimeout'	=> 5,		//并发锁获取超时时间
	'cacheTime'		=> 3600*5,	//缓存默认时间;
	    
    'file'	=> array('path' => TEMP_PATH.'_cache/'),
    'redis' => array(
        'host' => '127.0.0.1',
		'port' => 6379,
		// 'timeout'  => 20, 		// 连接超时时间
		// 'auth' 	  => '',  		// 密码
		// 'pconnect' => true,  	// 是否持久链接;
		// 'servers'  => array('10.10.10.1:8001','10.10.10.2:8001'), //集群方式连接;有则忽略host/port
    ),
    'memcached' => array(
        'host' 	   => '127.0.0.1',
		'port' 	   => 11211,
		// 'servers'=> array('10.10.10.1:8001','10.10.10.2:8001'), // 集群方式连接;有则忽略host/port
    ),
);
$config['databaseDefault'] = array(
	/* 数据库设置 */
	'DB_TYPE'               => 'mysql',     // 数据库类型
	'DB_HOST'               => 'localhost', // 服务器地址
	'DB_NAME'               => '',          // 数据库名
	'DB_USER'               => '',      	// 用户名
	'DB_PWD'                => '',          // 密码
	'DB_PORT'               => '',        	// 端口
	
	'DB_PREFIX'             => '',    		// 数据库表前缀
	'DB_CHARSET'            => 'utf8',      // 数据库编码默认采用utf8
	'DB_SQL_LOG'            => false,		// SQL执行错误日志记录	
	'DB_FIELDS_CACHE'       => false,		// 启用字段缓存
	'DB_SQL_BUILD_CACHE'    => false, 		// 数据库查询的SQL创建缓存

	// 数据库集群模式配置;
	'DB_DEPLOY_TYPE'        => 0, 			// 数据库部署方式:0 集中式(单一服务器),1 分布式(主从服务器)
	'DB_RW_SEPARATE'        => false,       // 数据库读写是否分离 主从式有效
	'DB_MASTER_NUM'         => 1, 			// 读写分离后 主服务器数量
	'DB_SLAVE_NO'           => 0, 			// 指定从服务器序号; 开启集群和主从分离,默认host第一个为master;
	
	
	/* 主从分离,一主多从集群;
	'DB_TYPE'               => 'mysql',
	'DB_HOST'               => '10.10.10.1,10.10.10.2', // 多个数据服务器;
	'DB_NAME'               => 'db1,db2',           	// 全都一样则一个;否则和host的server个数一致,逗号隔开;
	'DB_USER'               => 'user',      			// 同上
	'DB_PWD'                => 'passowrd',       		// 同上
	'DB_PORT'               => '3306',      			// 同上
	
	'DB_DEPLOY_TYPE'        => 1,		//集群模式
	'DB_RW_SEPARATE'        => true,	//读写分离;为false则无差别随机读写
	'DB_MASTER_NUM'         => 1,
	'DB_SLAVE_NO'           => '',
	*/
);

$config['settings']['appType'] = array(
	array('type' => 'tools','name' => 'explorer.app.groupTools','class' => 'icon-suitcase'),
	array('type' => 'game','name' => 'explorer.app.groupGame','class' => 'icon-dashboard'),
	array('type' => 'movie','name' => 'explorer.app.groupMovie','class' => 'icon-film'),
	array('type' => 'music','name' => 'explorer.app.groupMusic','class' => 'icon-music'),
	array('type' => 'life','name' => 'explorer.app.groupLife','class' => 'icon-map-marker'),
	array('type' => 'others','name' => 'common.others','class' => 'icon-ellipsis-horizontal'),
);

$config['defaultPlugins'] = array(
	'adminer','DPlayer','imageExif','jPlayer','officeLive','photoSwipe','picasa','pdfjs',
	'simpleClock','toolsCommon','VLCPlayer','webodf','yzOffice',
);

//初始化系统配置
$config['settingSystemDefault'] = array(
	'systemPassword'	=> rand_string(20),
	'systemName'		=> "kodbox",
	'systemDesc'		=> "——可道云.资源管理器",
	'systemNameType' 	=> 'text',// image/text
	'systemLogo' 		=> './static/images/common/logo.png',
	'systemLogoMenu' 	=> './static/images/common/logo-kod.png',
	'adminTheme' 		=> 'black',// black/white 
	
	'pathHidden'		=> "Thumb.db,.DS_Store,.gitignore,.git",//目录列表隐藏的项
	'autoLogin'			=> "0",			// 是否自动登录；登录用户为guest
	'needCheckCode'		=> "0",			// 登录是否开启验证码；默认关闭
	'firstIn'			=> "explorer",	// 登录后默认进入[explorer desktop]
	// 'regist'			=> "",
	'globalIcp'			=> "",
	'globalCss'			=> "",
	'globalHtml'		=> "",

	'newUserApp'		=> "trello,一起写office,微信,365日历,石墨文档,ProcessOn,计算器,icloud,OfficeConverter",
	'newUserFolder'		=> "我的文档,我的图片,我的音乐,其他",
	'newGroupFolder'	=> "共享资源,文档,其他",	// 新建分组默认建立文件夹
	'desktopFolder'		=> '桌面',					// 桌面文件夹别名
	'groupRootName'		=> '企业网盘',				// 企业组织架构根节点
	
	'versionType'		=> "A",			// 版本
	'rootListUser'		=> 0,			// 组织架构根节点展示群组内用户
	'rootListGroup'		=> 0,			// 组织架构根节点展示子群组
	'csrfProtect'		=> 0, 		 	// 开启csrf保护
	'currentVersion'	=> KOD_VERSION, // 当前版本
	'orderSort'         => 'desc',      // sort字段排序方式;默认从大到小

	'wallpageDesktop'	=> "1,2,3,4,5,6,7,8,9,10,11,12,13",
	'wallpageLogin'		=> "2,3,6,8,9,11,12",
	'emailType'			=> "0",			// 邮件方式
	'email'				=> "",			// 自定义邮箱服务器配置信息
	
	'regist'			=> array(			// 用户注册
		"openRegist"		=> "0",			// 开放注册
		"checkRegist" 		=> "0",			// 注册审核
		"sizeMax" 			=> "0",			// 默认空间大小
		"roleID" 			=> "2",			// 默认角色
		"groupInfo" 		=> '{"1":"2"}',	// 默认部门
		"allowPhone"		=> "1",			// 允许手机号绑定,找回密码;
		"loginWith"			=> array('qq', 'weixin'),
	),

	'menu'	=> array(		//初始化默认菜单配置
		array('name'=>'desktop','type'=>'system','url'=>'desktop','target'=>'_self','use'=>'1'),
		array('name'=>'explorer','type'=>'system','url'=>'explorer','target'=>'_self','use'=>'1'),
		array('name'=>'editor','type'=>'system','url'=>'editor','target'=>'_self','use'=>'1')
	),
);


//新用户初始化默认配置
$config['settingDefault'] = array(
	'listType'			=> "icon",		// list||icon||split
	'listSortField'		=> "name",		// name||size||ext||mtime
	'listSortOrder'		=> "up",		// asc||desc
	'fileIconSize'		=> "80",		// 图标大小
	'animateOpen'		=> "1",			// dialog动画
	'soundOpen'			=> "0",			// 操作音效
	'theme'				=> "win10",		// app theme [mac,win7,win10,metro,metro_green,alpha]
	'wall'				=> "8",			// wall picture
	"fileRepeat"		=> "replace",	// rename,replace,skip
	"recycleOpen"		=> "1",			// 1 | 0 代表是否开启
	'kodAppDefault'		=> '',			// 
	"fileIconSizeDesktop"=> '80',		// 桌面图标大小
	'resizeConfig'		=> 
		'{"filename":250,"filetype":80,"filesize":80,"filetime":215,"editorTreeWidth":200,"explorerTreeWidth":200}',
	'imageThumb'		=> 1,
	'fileSelect'		=> 1,
);
$config['editorDefault'] = array(
	'fontSize'		=> '14px',
	'theme'			=> 'tomorrow',
	'autoWrap'		=> 1,		//自适应宽度换行
	'autoComplete'	=> 1,
	'functionList' 	=> 1,
	"tabSize"		=> 4,
	"softTab"		=> 1,
	"displayChar"	=> 0,		//是否显示特殊字符
	"fontFamily"	=> "Menlo",	//字体
	"keyboardType"	=> "ace",	//ace vim emacs
	"autoSave"		=> 0,		//自动保存
);

// 文档类型筛选；分页
$config['documentType'] = array(
	"doc" => array(
		"name"		=> '文档',	//file-type: file-type-doc
		"ext"		=> "txt,md,pdf,ofd,doc,docx,xls,xlsx,ppt,pptx,xps,pps,ppsx,ods,odt,odp,docm,dot,dotm,xlsb,xlsm,mht,djvu,wps,dpt,csv,et,ett,pages,numbers,key,dotx,vsd,vsdx,mpp",
	),
	"image" => array(
		"name"		=> '图片',
		"ext"		=> "jpg,png,gif,jpeg,bmp,ico,svg,webp",
	),	
	"music" => array(
		"name"		=> '音乐',
		"ext"		=> "mp3,wav,wma,m4a,ogg,flac,aac",
	),
	"movie" => array(
		"name"		=> '视频',
		"ext"		=> "mp4,flv,rmvb,avi,mkv,mov,f4v,mpeg,mpg,vob,wmv,ogv,webm,3gp,mts,m2ts,m4v,mpe,3g2,asf",
	),
	"zip" => array(
		"name"		=> '压缩包',
		"ext"		=> "zip,gz,rar,iso,tar",
	),
	"others" => array(
		"name"		=> '其他',
		"ext"		=> "",
	),
);

// 多选项总配置	
// http://blog.sina.com.cn/s/blog_7981f91f01012wm7.html
// http://monsoongale.iteye.com/blog/1044431
$config['settingAll'] = array(
	'language' => array(
		"zh-CN"	=>	array("简体中文","简体中文","Simplified Chinese"),
		"zh-TW"	=>	array("繁體中文","繁體中文","Traditional Chinese"),
		"en"	=>	array("English","英语","English"),
		"ar"	=>	array("العربية","'阿拉伯语","Arabic"),
		"bn"	=>	array("বাংলা","孟加拉语","Bengali"),
		"de"	=>	array("Deutsch","德语","German"),
		"es"	=>	array("Español","西班牙语","Spanish"),
		"fr"	=>	array("Français","法语","French"),
		"hi"	=>	array("हिन्दी","印地语","Hindi"),
		"id"	=>	array("Bahasa Indonesia","印尼语","Indonesian"),
		"it"	=>	array("Italiano","意大利语","Italian"),
		"ja"	=>	array("日本語","日语","Japanese"),
		"ko"	=>	array("한국어","韩语","Korean"),
		"pl"	=>	array("Polski","波兰语","Polish"),
		"pt"	=>	array("Português","葡萄牙语","Portuguese"),
		"ru"	=>	array("Русский язык","俄语","Russian"),
		"ta"	=>	array("த‌மிழ்","泰米尔语","Tamil"),
		"th"	=>	array("ภาษาไทย","泰语","Thai"),
		"tr"	=>	array("Türkçe","土耳其语","Turkish"),
		"uk"	=>	array("Українська","乌克兰语","Ukrainian"),
		"vi"	=>	array("Tiếng Việt","越南语","Vietnamese"),
				
		//"bg"	=>	array("Български","保加利亚语","Bulgarian"),
		// "ca"	=>	array("Català","加泰罗尼亚语","Catalan"),
		// "cs"	=>	array("Čeština","捷克语","Czech"),
		// "da"	=>	array("Dansk","丹麦语","Danish"),//
		// "el"	=>	array("Ελληνικά","希腊语","Greek"),
		// "et"	=>	array("Eesti","爱沙尼亚语","Estonian"),
		// "fi"	=>	array("suomen","芬兰语","Finnish"),
		// "fa"	=>	array("فارسی","波斯语","Persian"),
		// "gl"	=>	array("Galego","加利西亚语","Galician"),
		// "hr"	=>	array("Hrvatski","克罗地亚语","Croatian"),
		// "hu"	=>	array("Magyar","匈牙利语","Hungarian"),
		// "lt"	=>	array("Lietuvių","立陶宛语","Lithuanian"),
		// "mn"	=>	array("mn","蒙古","Mongolia"),
		// "nl"	=>	array("Nederlands","荷兰语","Dutch"),
		// "no"	=>	array("Norsk","挪威语","Norwegian"),
		// "ro"	=>	array("Limba Română","罗马尼亚语","Romanian"),
		// "si"	=>	array("සිංහල","僧伽罗语","Sinhala"),
		// "sk"	=>	array("Slovenčina","捷克斯洛伐克语","Czechoslovakia"),
		// "sl"	=>	array("Slovenski","斯洛文尼亚语'","Slovenian"),
		// "sr"	=>	array("Српски","塞尔维亚语","Serbian"),
		// "sv"	=>	array("Svenska","瑞典语","Swedish"),
		// "uz"	=>	array("O'zbekiston","乌兹别克语","Uzbek-cyrillic"),
	),//de el fi fr nl pt	d/m/Y H:i
	
	'theme'		=> "mac,win10,win7,metro,metro_green,metro_purple,metro_pink,metro_orange,alpha_image,alpha_image_sun,alpha_image_sky,diy",
	'codeTheme'	=> "chrome,clouds,crimson_editor,eclipse,github,kuroir,solarized_light,tomorrow,xcode,ambiance,monokai,idle_fingers,pastel_on_dark,solarized_dark,twilight,tomorrow_night_blue,tomorrow_night_eighties",
	'codeFont'	=> 'Source Code Pro,Consolas,Courier,DejaVu Sans Mono,Liberation Mono,Menlo,Monaco,Monospace',
);



/**
 * 无需登录检测权限检测配置;
 * 大小写无关；统一转为小写进行了判断
 * 
 * 支持：通配和全配；模块.控制器.方法;
 * user.* 			 代表user模块下所有控制器
 * user.index.*  	 代表user模块下index控制器
 * user.index.login  代表user模块下index控制器的login方法；
 */
$config['authNotNeedLogin'] = array(
	'test.*',
	'user.index.*',
	'user.bind.*',
	'user.regist.*',
	'user.view.*',
	'explorer.share.*',
	'install.*',		// 安装/更新
	'plugin.*',			//插件排除，权限单独检测;
);

/**
 * 用户可以访问的方法白名单，不需要用户角色身份检测;需要全部配置
 * $authAllowAction和$roleAction中包含的内容;不在定义中的一律不允许访问；
 */
$config['authAllowAction'] = array(
	'explorer.tag.get',
	'explorer.fav.get',
	'explorer.index.pathInfo',
	'explorer.lightApp.get',
	'explorer.list.path','explorer.index.desktopApp',
	'explorer.userShare.get',
	'explorer.userShare.myShare',
	
	//临时，搜索分享中使用; 设置用户权限or设置用户部门；
	'admin.role.get','admin.job.get','admin.auth.get',
	'admin.member.get','admin.member.getByID','admin.member.search',
	'admin.group.get','admin.group.getByID','admin.group.search',
);

/**
 * 角色：拦截点对应的控制器方法；
 * key为角色权限；value为数组 key(控制器)=>value(对应到方法，多个用逗号隔开)
 */
$config['authRoleAction']= array(
	'explorer.add'			=> array('explorer.index'=>'mkdir,mkfile'),
	'explorer.upload'		=> array('explorer.upload'=>'fileUpload'),
	'explorer.view'			=> array('explorer.index'=>'fileOut,unzipList','explorer.editor'=>'fileGet','explorer.fileView'=>'index,open'),
	'explorer.download'		=> array('explorer.index'=>'zipDownload,fileDownloadRemove'),
	'explorer.share'		=> array('explorer.userShare'=>'add,edit,del'),
	'explorer.remove'		=> array('explorer.index'=>'pathDelete,recycleDelete,recycleRestore'),
	'explorer.edit'			=> array('explorer.index'=>'setDesc,setAuth,fileSave,pathRename,zip,unzip',
									 'explorer.editor'=>'fileSave',
									 'explorer.history'=>'get,remove,clear,rollback,setDetail,fileOut'),
	'explorer.move'			=> array('explorer.index'=>'pathCopy,pathCute,pathCopyTo,pathCuteTo,pathPast,clipboard'),
	'explorer.serverDownload'=> array('explorer.upload'=>'serverDownload'),
	'explorer.search'		=> array(''),
	'explorer.unzip'		=> array('explorer.index'=>'unzip,unzipList'),
	'explorer.zip'			=> array('explorer.index'=>'zip,zipDownload'),
	
	'user.edit'				=> array(
		'user.setting'	=> 'setConfig,setUserInfo,setHeadImage,uploadHeadImage',
		'user.bind'		=> 'bindApi',
	),
	'user.fav' => array(
		'explorer.fav'=>'add,rename,moveTop,moveBottom,del',
		'explorer.tag'=>'add,edit,remove,moveTop,moveBottom,resetSort,sourceAddToTag,sourceResetTag,sourceRemoveFromTag',
	),
	
	'admin.index.dashboard'	=> array('admin.analysis'=>'summary,list,trend'),
	'admin.index.setting'	=> array('admin.setting'=>'get,set,clearCache,phpInfo'),
	'admin.index.loginLog'	=> array('admin.log'=>'loginLogList'),
	'admin.index.log'		=> array('admin.log'=>'get,typelist'),
	'admin.index.server'	=> array('admin.'),
	
	'admin.role.list'		=> array('admin.role'=>'get'),
	'admin.role.edit'		=> array('admin.role'=>'add,edit,remove,sort'),
	'admin.job.list'		=> array('admin.job'=>'get'),
	'admin.job.edit'		=> array('admin.job'=>'add,edit,remove,sort'),

	'admin.member.list'		=> array(
		'admin.member' 	=> 'get,getByID,search',
		'admin.group' 	=> 'get,getByID,search'
	),
	'admin.member.userEdit'	=> array('admin.member'=>'add,edit,remove,status,addGroup,removeGroup'),
	'admin.member.groupEdit'=> array('admin.group'=>'add,edit,remove'),
	
	'admin.auth.list'		=> array('admin.auth'=>'get'),
	'admin.auth.edit'		=> array('admin.auth'=>'add,edit,remove,sort'),
	
	//插件管理；轻应用归属到插件；
	'admin.plugin.list'		=> array('admin.plugin'=>'appList'),
	'admin.plugin.edit'		=> array(
		'admin.plugin'		=>'getConfig,setConfig,changeStatus,install,unInstall',
		'explorer.lightApp'	=>'add,edit,del'
	),

	'admin.storage.list'	=> array('admin.storage'=>'get'),
	'admin.storage.edit'	=> array('admin.storage'=>'add,edit,remove'),

	'admin.autoTask.list'	=> array('admin.autoTask'=>'get'),
	'admin.autoTask.edit'	=> array('admin.autoTask'=>'add,edit,enable,remove,run,taskStart,taskRun,taskRunEvent'),
);