<!DOCTYPE>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<meta name="google" content="notranslate">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title><?php echo $fileName;?></title>

	<script src="<?php echo $this->pluginHost;?>static/ofd/jquery.min.js"></script>
	<script src="<?php echo $this->pluginHost;?>static/ofd/jszip.min.js"></script>
	<script src="<?php echo $this->pluginHost;?>static/ofd/jszip-utils.min.js"></script>
	<script src="<?php echo $this->pluginHost;?>static/ofd/jstree/jstree.min.js"></script>
	<link   href="<?php echo $this->pluginHost;?>static/ofd/jstree/jstree.min.css" rel="stylesheet">
	<link   href="<?php echo $this->pluginHost;?>static/ofd/style.css" rel="stylesheet">
	<script>var ofdFile = "<?php echo $fileUrl;?>";</script>
	<!--[if IE]>
		<script type="text/javascript" src="<?php echo $this->pluginHost;?>static/ofd/jszip-utils-ie.min.js"></script>
	<![endif]-->
</head>
<body>
	<div id='ofdviewer'>
		<div id='ofdviewer-toolbar' class='viewerToolbar'>
			<div id='toolbar-left' class='toolbar-left'>
				<div class="showSideViewButton" title="显示大纲"> </div>
				<div class='showTagsButton' title='语义树'></div>
			</div>

			<div id='toolbar-center' class='toolbar-center'>
				<!-- <a class="rotate" id='rotateButton' title="旋转"></a> -->
				<a class="pageUp" id='pageUpButton' title="上一页"></a>
				<a class="pageDown" id='pageDownButton' title="下一页"></a>
				<input id="pageNumb" class='pageNumb' type="text">
				<span id="pageTotalNumb" class='pageTotalNum'></span>
				<a class="zoomIn" id='zoomInButton' title="放大"></a>
				<a class="zoomOut" id='zoomOutButton' title="缩小"></a>
				<select id="zoomValue" class="zoomValue" title="缩放">
					<option value='-1' selected="selected">自动缩放</option>
					<option value="0.5">50%</option>
					<option value="0.6">60%</option>
					<option value="0.7">70%</option>
					<option value="0.8">80%</option>
					<option value="0.9">90%</option>
					<option value="1.0">100%</option>
					<option value="1.1">110%</option>
					<option value="1.2">120%</option>
					<option value="1.3">130%</option>
					<option value="1.4">140%</option>
					<option value="1.5">150%</option>
				</select>
				<input id="search" class="search" readonly="true">
				<div class='searchImage'><img src="<?php echo $this->pluginHost;?>static/ofd/img/search.png"></div>
			</div>
			<div id='toolbar-right' class='toolbar-right'>
				<div id="openFile" class="openFile" title="打开文件"></div>
				<div id="cropButton" class="cropButton" title="区域打印"></div>
				<div id="btnPrint" class='printButton' title="打印"></div>
			</div>
		</div>
		<img id="printArea" style="display:none">
		<input type="file" id="localFile" accept=".ofd" style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;" />
		<div id='toolbarplaceholder' style="height:30px"></div>
		<div id="contentContainer" class='contentContainer'></div>
		<div id='sideviewcontainer' class='sideviewcontainer' style='display:none'>
			<div id='outlineContainer'></div>
			<div id="customTagContainer"></div>
		</div>
	</div>
	<div id="printContainer" class="printContainer"></div>
	<script src="<?php echo $this->pluginHost;?>static/ofd/ofd.js"></script>
</body>
</html>
