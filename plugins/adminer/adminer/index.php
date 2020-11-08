<?php

// 登陆认证;
include('../../../app/api/KodSSO.class.php');
KodSSO::check('adminer');


// X-Frame-Options 去除不允许ifram限制;
function adminer_object() {
	class AdminerSoftware extends Adminer {
		function headers() {
			// header("X-Frame-Options: SameOrigin");
			header("X-XSS-Protection: 0");
			return false;
		}
	}
	return new AdminerSoftware();
}
include('./adminer.php.txt');