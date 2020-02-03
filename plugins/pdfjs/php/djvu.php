<!DOCTYPE html>
<html dir="ltr" mozdisallowselectionprint moznomarginboxes>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="google" content="notranslate">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title><?php echo $fileName;?></title>
		<link rel="stylesheet" href="<?php echo $this->pluginHost;?>static/Djvu/style.css">
		<script type="text/javascript" src="<?php echo $this->pluginHost;?>static/Djvu/render.js"></script>
	</head>
	<body>
		<div id="djvuContainer"></div>
		<script type="text/javascript">
			var DJVU_CONTEXT = {file: "<?php echo $fileUrl;?>",background: "#404040"};
		</script>
	</body>
</html>