## 版本：`Version 1.2.9`
- 下载：https://github.com/ajaxorg/ace-builds/tags
- 插件：https://github.com/ajaxorg/ace/wiki/Extensions


#### js压缩
/ace-src.js => ace.js
http://tool.oschina.net/jscompress/ 

## 优化修改
### 1. iframe鼠标选中超出失去焦点：

修改ace.js 在 `if (isAllSelected(text)) {`中加入判断;两处
`if(text.value == PLACEHOLDER) return;//add by warlee; Safari等 iframe允许事件冒泡后选中异常问题`

### 2. 中文自动换行过早问题(当成了单词)
```
修改ace.js this.$computeWrapSplits 函数
if (split > minSplit) {
    addSplit(++split);
    continue;
} 
改为==>  
//addy by warlee 
if (split > minSplit) {
	//避免死循环
    if(oldLength == displayLength - lastSplit){break;}
    oldLength = displayLength - lastSplit;
    if(tokens[split] == CHAR_EXT || tokens[split-1] == CHAR_EXT){
    	addSplit(split++)
    }else{
    	addSplit(++split);
    }
    continue;
}

while 前面加入定义 (var indent = 0;后)：var oldLength = 0;

this.$getDisplayTokens 函数  0x1100 && isFullWidth(c) 后面
arr.push(CHAR, CHAR_EXT); 改为==> arr.push(SPACE, CHAR_EXT);

```
### 3. 多光标输入中文，丢失光标问题
```
<!--修改ace.js -->
<!--this.showComposition 函数；最前面加入判断-->
<!--    if(this.session.selection.rangeCount>1){return;}//warlee-->

<!--this.$checkMultiselectChange 函数；加入判断-->
<!--    return;//warlee 直接返回；不清空多光标；牺牲了多光标自动补全的功能，让位多光标中文输入-->
```
### 5.鼠标中键多光标选择支持
```
修改ace.js 
function onMouseDown 后加入如下判断 鼠标中建=>等价左键加alt
if(button == 1){button = 0;alt = true;}//add by warlee;鼠标中键多光标选择
```

### 6. 含未知字符时会导致光标位置错误
```
123123
修改 ace.js 方法: this.$renderToken
$renderToken => replaceFunc 修改字符匹配逻辑
```
### 7.php文件、html文件；混合代码注释出错
修改 ext-emmet.js
混合代码注释 php 注释出错为 <!-- aa  -->
```
// toggle_comment: {"mac": "command+/", "win": "ctrl+/"},
注释emmet对toggle_comment的覆盖
```

### 8. ios输入中文异常问题
修改 ace.js 
ace/keyboard/textinput_ios 的onCompositionUpdate方法

```
val = rtrim(ltrim(trim(val),'aa'),'a a');//add by warlee;ios 输入中文

var r = host.selection.getRange();
            r.end = {row:r.end.row,column:r.end.column+val.length};//add by warlee;
// host.selection.clearSelection();// changed by warlee;
```



## 编辑器增强


### 1.重写搜索控件  
ext-searchboxKod.js

### 2.重命名php相关文件
mode-php.js,  =>  mode-phhp.js,
php_worker.js =>  phhp_worker.js

### 3.php格式化扩展
ext-beautify.js 修改解决关键字语法错误;升级时保留
ace.js 修改MAX_TOKEN_COUNT=2000 为 500000;

emmet.min.js 的_. 方法与loash冲突；修改代码，进行闭包处理；导出全局变量 emmet;