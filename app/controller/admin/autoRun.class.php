<?php 
/**
 * 自动执行
 */
class adminAutoRun extends Controller {
	function __construct()    {
		parent::__construct();
	}

	public function index(){
        $this->logBind();
    }
    public function logBind(){
        // 退出时在请求出记录，其他在出执行结果后记录
        if(ACTION == 'user.index.logout'){
            $user = Session::get('kodUser');
            $data = array(
                'code' => true,
                'data' => array('userID' => $user['userID'], 'name' => $user['name'])
            );
            return $this->log($data);
        }
        Hook::bind('show_json','admin.AutoRun.log');
    }

    public function log($data){
        if(!$data || !$data['code']) return false;
        if(empty($data['data']) || !is_array($data['data'])){
            $data['data'] = array('data' => $data['data']);
        }
        ActionCall('admin.log.log',$data['data']);
    }
}