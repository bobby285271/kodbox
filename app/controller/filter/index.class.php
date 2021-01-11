<?php
/*
 * @link http://kodcloud.com/
 * @author warlee | e-mail:kodcloud@qq.com
 * @copyright warlee 2014.(Shanghai)Co.,Ltd
 * @license http://kodcloud.com/tools/license/license.txt
 */

/**
 * 动作hook;
 */
class filterIndex extends Controller{
	function __construct() {
		parent::__construct();
	}
	public function init(){
		Action("filter.attachment")->bind();
		Action("filter.html")->bind();
		Action("filter.post")->check();
		Action("filter.userGroup")->check();
		Hook::trigger(strtolower(ACTION).'.before',array());
		Hook::bind('show_json',array($this,'eventAfter'));
	}

	public function eventAfter($data){
		if(!$data['code']) return $data;
		$returnData = Hook::trigger(strtolower(ACTION).'.after',$data);
		if(is_array($returnData)){
			$data = $returnData;
		}
		return $data;
	}	
}
