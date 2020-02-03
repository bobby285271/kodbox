<?php
/**
 * 计划任务
 */
class adminAutoTask extends Controller {
	const OPTION_TYPE = 'autoTask';
	function __construct()    {
		parent::__construct();
		$this->model = Model('SystemTask');
	}
	
    public function get(){
        $result = $this->model->listData();
		show_json($result,true);
    }

    /**
	 * 计划任务数据添加
	 * 
	 * 执行kod方法;执行参数;  
	 * 每天,xx:xx
	 * 每N天xx:xx; 每天xx:xx; 每小时xx分; 每x分钟; 
	 */
    public function add(){
        $data = Input::getArray(array(
			"name"			=> array("check"=>"require"),	//名称
			"repeatTime"	=> array("check"=>"number"),	//间隔n秒
			"fromTime"		=> array("check"=>"number"),	//开始执行时间
			"enable"		=> array("default"=>"1"),		//是否启用
			"system"		=> array("default"=>"0"),		//系统默认;只能开启关闭，不能删除
			"event"			=> array("default"=>""),		//执行内容
			"param"			=> array("default"=>""),		//执行参数
		));
		$result = $this->model->add($data);
		$msg = !!$result ? LNG('explorer.success') : LNG('explorer.repeatError');
		show_json($msg,!!$result);
	}
	
	/**
	 * 更新任务信息
	 */
	public function edit(){
		$data = Input::getArray(array(
			"id"    		=> array("check"=>"number"),
			"name"			=> array("check"=>"require"),	//名称
			"repeatTime"	=> array("check"=>"require"),	//间隔n秒
			"fromTime"		=> array("check"=>"require"),	//开始执行时间
			"enable"		=> array("default"=>null),		//是否启用
			"system"		=> array("default"=>null),		//系统默认;只能开启关闭，不能删除
			"event"			=> array("default"=>null),		//执行内容
			"param"			=> array("default"=>null),		//执行参数
		));
		$result = $this->model->update($data['id'],$data);
		$msg = !!$result ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$result);
	}

	/**
	 * 启动|关闭某个任务
	 */
    public function enable(){
		$data = Input::getArray(array(
			"id"    	=> array("check"=>"number"),
			"enable"	=> array("check"=>"bool"),
		));
		$result = $this->model->enable($data['id'],(bool)$data['enable']);
		$msg = !!$result ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$result);
	}	
	/**
	 * 删除计划任务
	 */
    public function remove(){
		$id = Input::get('id','int');
		$result = $this->model->remove($id);
		$msg = !!$result ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$result);
	}
	
	/**
	 * 手动立即执行某个任务
	 */
    public function run(){
		$id = Input::get('id','int');
		$tasks  = Model("SystemTask")->listData();
		$tasks = array_to_keyvalue($tasks,'id');
        if($tasks && isset($tasks[$id])){
            $result = $this->taskRunEvent($tasks[$id]);
		}
		$msg = !!$result ? LNG('explorer.success') : LNG('explorer.error');
		show_json($msg,!!$result);
	}
		
	/**
	 * 启动计划任务；中断http请求；
	 */
    public function taskStart(){
        $taskKey = 'systemTask.taskRun';
        $info = $GLOBALS['config']['task'];
        $task = Model('SystemOption')->get($taskKey,OPTION_TYPE);
        if($task == 'run' || !$info['switch']) return;
        http_close();
        Model('SystemOption')->set($taskKey,'run',OPTION_TYPE);
        while(true){
            sleep($info['interval']);
            $this->taskRun();
        }
	}
	
	/**
	 * 遍历计划任务，找到该执行的任务进行执行
	 */
    public function taskRun(){
        $switch = Model('SystemOption')->get('systemTask.switch',OPTION_TYPE);
        $tasks  = Model("SystemTask")->listData();
        if(!$switch || !$tasks) return;

        $count = count($tasks);
        for($i = 0; $i < $count; $i++){
            $task = $tasks[$i];
            if($task['enable'] && $task['lastRun'] + $task['repeatTime'] >= time() ){
                $this->taskRunEvent($task);
            }
        }
	}    
	
	/**
	 * 计划任务执行
	 * 
	 * 任务类型$task['event']
	 * eval			// 执行php代码
	 * urlRequest	// 请求url
	 * command		// 执行shell脚本代码
	 * 其他			// 执行方法；event为具体类或函数方法；param为执行参数；
	 */
    private function taskRunEvent($task){
        switch ($task['event']) {
            case 'eval' :$result = eval($task['param']);break;
			case 'urlRequest':$result = url_request($task['param']);break;
			case 'command':$result = shell_exec($task['param']);break;
            default:$result = Hook::apply($task['event'],$task['param']);break;
        }
        Model("SystemTask")->run($task['id']);
        $log = array("msg"=>$task['name'],"result"=>$result);
		Model("SystemLog")->add("timingTask",$log);
		return true;
    }
}