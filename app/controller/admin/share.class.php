<?php
// 数据备份
class adminShare extends Controller{
	private $model;
	function __construct()    {
		parent::__construct();
		$this->model = Model('Share');
    }

    // 分享列表
    public function get(){
        $data = Input::getArray(array(
            'timeFrom'  => array('default' => null),
            'timeTo'    => array('default' => null),
            'type'      => array('default' => ''),
            'userID'    => array('default' => ''),
        ));
        $res = $this->model->listAll($data);
        if(empty($res)) show_json(array());
        show_json($res);
    }

    // 取消分享
    public function remove(){
        $data = Input::getArray(array(
            'id'        => array('check' => 'require'),
            'userID'    => array('check' => 'require'),
        ));
        $res = $this->model->remove($data['id'], $data['userID']);
        $msg = $res ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$res);
    }

}