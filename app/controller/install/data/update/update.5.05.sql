ALTER TABLE `io_source_recycle`
ADD `targetType` tinyint unsigned NOT NULL COMMENT '文档所属类型 (0-sys,1-user,2-group)' AFTER `id`,
ADD `targetID` bigint(20) unsigned NOT NULL COMMENT '拥有者对象id' AFTER `targetType`;
ALTER TABLE `io_source_recycle` ADD INDEX `targetType` (`targetType`), ADD INDEX `targetID` (`targetID`);

ALTER TABLE `user` CHANGE `sizeMax` `sizeMax` double unsigned NOT NULL DEFAULT '0' COMMENT '群组存储空间大小(GB) 0-不限制' AFTER `password`;
ALTER TABLE `group` CHANGE `sizeMax` `sizeMax` double unsigned NOT NULL DEFAULT '0' COMMENT '群组存储空间大小(GB) 0-不限制' AFTER `sort`;

ALTER TABLE `io_file` ADD INDEX `hashMd5` (`hashMd5`);
ALTER TABLE `io_source_history` CHANGE `desc` `detail` varchar(1024) NOT NULL DEFAULT '' COMMENT '版本描述' AFTER `name`;
ALTER TABLE `io_source_history` ADD `size` bigint NOT NULL DEFAULT '0' COMMENT '文件大小' AFTER `name`;


-------5.013-----兼容sqlite;程序中处理默认值;

ALTER TABLE `comment`
CHANGE `pid` `pid` bigint(20) unsigned NOT NULL COMMENT '该评论上级ID' AFTER `commentID`,
CHANGE `praiseCount` `praiseCount` int(11) unsigned NOT NULL COMMENT '点赞统计' AFTER `content`,
CHANGE `commentCount` `commentCount` int(11) unsigned NOT NULL COMMENT '评论统计' AFTER `praiseCount`,
CHANGE `status` `status` tinyint(3) unsigned NOT NULL COMMENT '状态 1正常 2异常 3其他' AFTER `commentCount`;

ALTER TABLE `comment_meta`
CHANGE `createTime` `createTime` int(11) unsigned NOT NULL COMMENT '创建时间' AFTER `value`,
CHANGE `modifyTime` `modifyTime` int(11) unsigned NOT NULL COMMENT '最后修改' AFTER `createTime`;

ALTER TABLE `group`
CHANGE `parentID` `parentID` bigint(20) unsigned NOT NULL COMMENT '父群组id' AFTER `name`,
CHANGE `parentLevel` `parentLevel` varchar(1000) COLLATE 'utf8_general_ci' NOT NULL COMMENT '父路径id; 例如:  ,2,5,10,' AFTER `parentID`,
CHANGE `extraField` `extraField` varchar(100) COLLATE 'utf8_general_ci' NULL COMMENT '扩展字段' AFTER `parentLevel`,
CHANGE `sort` `sort` int(11) unsigned NOT NULL COMMENT '排序' AFTER `extraField`,
CHANGE `sizeMax` `sizeMax` double unsigned NOT NULL COMMENT '群组存储空间大小(GB) 0-不限制' AFTER `sort`;

ALTER TABLE `io_file`
CHANGE `name` `name` varchar(255) COLLATE 'utf8_general_ci' NOT NULL COMMENT '文件名' AFTER `fileID`,
CHANGE `size` `size` bigint(20) unsigned NOT NULL COMMENT '文件大小' AFTER `name`,
CHANGE `hashSimple` `hashSimple` varchar(100) COLLATE 'utf8_general_ci' NOT NULL COMMENT '文件简易hash(不全覆盖)；hashSimple' AFTER `path`,
CHANGE `hashMd5` `hashMd5` varchar(100) COLLATE 'utf8_general_ci' NOT NULL COMMENT '文件hash, md5' AFTER `hashSimple`,
CHANGE `linkCount` `linkCount` int(11) unsigned NOT NULL COMMENT '引用次数;0则定期删除' AFTER `hashMd5`;

ALTER TABLE `io_source`
CHANGE `sourceHash` `sourceHash` varchar(20) COLLATE 'utf8_general_ci' NOT NULL COMMENT ' id的hash' AFTER `sourceID`,
CHANGE `targetType` `targetType` tinyint(3) unsigned NOT NULL COMMENT '文档所属类型 (0-sys,1-user,2-group)' AFTER `sourceHash`,
CHANGE `isFolder` `isFolder` tinyint(4) unsigned NOT NULL COMMENT '是否为文件夹(0否,1是)' AFTER `modifyUser`,
CHANGE `fileType` `fileType` varchar(10) COLLATE 'utf8_general_ci' NOT NULL COMMENT '文件扩展名，文件夹则为空' AFTER `name`,
CHANGE `parentLevel` `parentLevel` varchar(1000) COLLATE 'utf8_general_ci' NOT NULL COMMENT '父路径id; 例如:  ,2,5,10,' AFTER `parentID`,
CHANGE `fileID` `fileID` bigint(20) unsigned NOT NULL COMMENT '对应存储资源id,文件夹则该处为0' AFTER `parentLevel`,
CHANGE `isDelete` `isDelete` tinyint(4) unsigned NOT NULL COMMENT '是否删除(0-正常 1-已删除)' AFTER `fileID`,
CHANGE `size` `size` bigint(20) unsigned NOT NULL COMMENT '占用空间大小' AFTER `isDelete`;

ALTER TABLE `io_source_auth`
CHANGE `targetType` `targetType` tinyint(4) unsigned NOT NULL COMMENT '分享给的对象,1用户,2部门' AFTER `sourceID`,
CHANGE `authID` `authID` int(11) unsigned NOT NULL COMMENT '权限组id；自定义权限则为0' AFTER `targetID`,
CHANGE `authDefine` `authDefine` int(11) NOT NULL COMMENT '自定义权限，4字节占位' AFTER `authID`;

ALTER TABLE `io_source_history`
CHANGE `userID` `userID` bigint(20) unsigned NOT NULL COMMENT '用户id, 对部门时此id为0' AFTER `sourceID`,
CHANGE `fileID` `fileID` bigint(20) unsigned NOT NULL COMMENT '当前版本对应存储资源id' AFTER `userID`,
DROP `name`,
CHANGE `size` `size` bigint(20) NOT NULL COMMENT '文件大小' AFTER `fileID`,
CHANGE `detail` `detail` varchar(1024) COLLATE 'utf8_general_ci' NOT NULL COMMENT '版本描述' AFTER `size`;

ALTER TABLE `io_source_recycle` CHANGE `parentLevel` `parentLevel` varchar(1000) COLLATE 'utf8_general_ci' NOT NULL COMMENT '文档上层关系;冗余字段,便于统计回收站信息' AFTER `userID`;

ALTER TABLE `share`
CHANGE `isLink` `isLink` tinyint(4) unsigned NOT NULL COMMENT '是否外链分享；默认为0' AFTER `sourceID`,
CHANGE `isShareTo` `isShareTo` tinyint(4) unsigned NOT NULL COMMENT '是否为内部分享；默认为0' AFTER `isLink`,
CHANGE `password` `password` varchar(255) COLLATE 'utf8_general_ci' NOT NULL COMMENT '访问密码,为空则无密码' AFTER `isShareTo`,
CHANGE `timeTo` `timeTo` int(11) unsigned NOT NULL COMMENT '到期时间,0-永久生效' AFTER `password`,
CHANGE `numView` `numView` int(11) unsigned NOT NULL COMMENT '预览次数' AFTER `timeTo`,
CHANGE `numDownload` `numDownload` int(11) unsigned NOT NULL COMMENT '下载次数' AFTER `numView`;

ALTER TABLE `share_to`
CHANGE `targetType` `targetType` tinyint(4) unsigned NOT NULL COMMENT '分享给的对象,1用户,2部门' AFTER `shareID`,
CHANGE `authID` `authID` int(11) unsigned NOT NULL COMMENT '权限组id；自定义权限则为0' AFTER `targetID`,
CHANGE `authDefine` `authDefine` int(11) NOT NULL COMMENT '自定义权限，4字节占位' AFTER `authID`;

ALTER TABLE `system_log`
CHANGE `userID` `userID` bigint(20) unsigned NOT NULL COMMENT '用户id' AFTER `sessionID`;
ALTER TABLE `system_option`
CHANGE `type` `type` varchar(50) COLLATE 'utf8_general_ci' NOT NULL COMMENT '配置类型' AFTER `id`;
ALTER TABLE `system_session`
CHANGE `userID` `userID` bigint(20) unsigned NOT NULL COMMENT '用户id' AFTER `sign`;

ALTER TABLE `user`
CHANGE `email` `email` varchar(255) COLLATE 'utf8_general_ci' NOT NULL COMMENT '邮箱' AFTER `roleID`,
CHANGE `phone` `phone` varchar(20) COLLATE 'utf8_general_ci' NOT NULL COMMENT '手机' AFTER `email`,
CHANGE `nickName` `nickName` varchar(255) COLLATE 'utf8_general_ci' NOT NULL COMMENT '昵称' AFTER `phone`,
CHANGE `avatar` `avatar` varchar(255) COLLATE 'utf8_general_ci' NOT NULL COMMENT '头像' AFTER `nickName`,
CHANGE `sex` `sex` tinyint(4) unsigned NOT NULL COMMENT '性别 (0女1男)' AFTER `avatar`,
CHANGE `sizeMax` `sizeMax` double unsigned NOT NULL COMMENT '群组存储空间大小(GB) 0-不限制' AFTER `password`,
CHANGE `sizeUse` `sizeUse` bigint(20) unsigned NOT NULL COMMENT '已使用大小(byte)' AFTER `sizeMax`;

ALTER TABLE `user_fav`
CHANGE `tagID` `tagID` int(11) unsigned NOT NULL COMMENT '标签id,收藏则为0' AFTER `userID`,
CHANGE `name` `name` varchar(255) COLLATE 'utf8_general_ci' NOT NULL COMMENT '收藏名称' AFTER `tagID`,
CHANGE `path` `path` varchar(255) COLLATE 'utf8_general_ci' NOT NULL COMMENT '收藏路径,tag时则为sourceID' AFTER `name`,
CHANGE `type` `type` varchar(20) COLLATE 'utf8_general_ci' NOT NULL COMMENT 'source/path' AFTER `path`,
CHANGE `sort` `sort` int(11) unsigned NOT NULL COMMENT '排序' AFTER `type`;

ALTER TABLE `user_group`
CHANGE `sort` `sort` int(11) unsigned NOT NULL COMMENT '在该群组的排序' AFTER `authID`,
CHANGE `createTime` `createTime` int(11) unsigned NOT NULL COMMENT '创建时间' AFTER `sort`,
CHANGE `modifyTime` `modifyTime` int(11) unsigned NOT NULL COMMENT '最后修改时间' AFTER `createTime`;

ALTER TABLE `user_option`
CHANGE `type` `type` varchar(50) COLLATE 'utf8_general_ci' NOT NULL COMMENT '配置类型,全局配置类型为空,编辑器配置type=editor' AFTER `userID`;