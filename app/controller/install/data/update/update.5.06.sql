ALTER TABLE `system_log`
CHANGE `sessionID` `sessionID` varchar(128) NOT NULL COMMENT 'session识别码，用于登陆时记录ip,UA等信息' AFTER `id`;