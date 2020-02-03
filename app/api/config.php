<?php

@set_time_limit(3600);
@ini_set("max_execution_time",3600);
@ini_set('memory_limit','500M');//
@ini_set('session.cache_expire',1800);
@error_reporting(E_ALL^E_NOTICE^E_DEPRECATED);

define('BASIC_PATH',str_replace('\\','/',dirname(dirname(dirname(__FILE__)))).'/');
if (file_exists(BASIC_PATH.'config/setting_user.php')) {
	include_once(BASIC_PATH.'config/setting_user.php');
}