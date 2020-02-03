<?php 

class adminLog extends Controller{
    public $actionList = array();
	function __construct() {
        parent::__construct();
        $this->model = Model('SystemLog');
    }

    /**
     * 操作类型列表
     * this.actions()
     * @return void
     */
    public function typeList(){
        $typeList = $this->model->allTypeList();
        show_json($typeList);
    }

	/**
     * 日志列表
     * @return void
     */
    public function get(){
        $data = Input::getArray(array(
            'startTime' => array('check' => 'require'),
            'endTime' => array('check' => 'require'),
            'type' => array('default' => ''),
        ));
        $res = $this->model->get($data);
        if(empty($res)) show_json(array());
        show_json($res['list'], true, $res['pageInfo']);
    }

    /**
     * 记录日志
     * @param boolean $data
     * @return void
     */
    public function log($data=false){
        $actionList = array(
            'user.index.logout',
            'user.index.loginSubmit'
        );
        $ip = get_client_ip();
        // 操作日志
        if(!in_array(ACTION, $actionList)){
            $params = $this->in;
            unset($params['URLremote'], $params[str_replace(".", "/", ACTION)]);
            if(ACTION == 'explorer.upload.fileUpload' && !empty($params['chunk'])) return;  // 分片上传只记录一次
            $params['ip'] = $ip;
            return $this->model->addLog(ACTION, $params);
        }
        // 退出日志
        if(ACTION == 'user.index.logout'){
            $data['ip'] = $ip;
            return $this->model->addLog(ACTION, $data);
        }
        // 登录日志
        $data = array(
            'is_wap' => is_wap(),
            'ip' => $ip,
            'ua' => isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : ''
        );
        return $this->model->addLog(ACTION, $data);
    }
}