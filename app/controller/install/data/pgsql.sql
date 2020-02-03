-- dump by kodbox 

DROP TABLE IF EXISTS "comment";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_comment_seq";
CREATE TABLE "comment" (
  "commentID" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_comment_seq'),
  "pid" bigint(20) unsigned NOT NULL,
  "userID" bigint(20) unsigned NOT NULL,
  "targetType" smallint(5) unsigned NOT NULL,
  "targetID" bigint(20) unsigned NOT NULL,
  "content" text NOT NULL,
  "praiseCount" integer unsigned NOT NULL,
  "commentCount" integer unsigned NOT NULL,
  "status" tinyint(3) unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  "createTime" integer unsigned NOT NULL,
  PRIMARY KEY ("commentID")
);
-- comments:
COMMENT ON COLUMN "public"."comment"."commentID" IS '评论id';
COMMENT ON COLUMN "public"."comment"."pid" IS '该评论上级ID';
COMMENT ON COLUMN "public"."comment"."userID" IS '评论用户id';
COMMENT ON COLUMN "public"."comment"."targetType" IS '评论对象类型1分享2文件3文章4......';
COMMENT ON COLUMN "public"."comment"."targetID" IS '评论对象id';
COMMENT ON COLUMN "public"."comment"."content" IS '评论内容';
COMMENT ON COLUMN "public"."comment"."praiseCount" IS '点赞统计';
COMMENT ON COLUMN "public"."comment"."commentCount" IS '评论统计';
COMMENT ON COLUMN "public"."comment"."status" IS '状态 1正常 2异常 3其他';
COMMENT ON COLUMN "public"."comment"."modifyTime" IS '最后修改时间';
COMMENT ON COLUMN "public"."comment"."createTime" IS '创建时间';
COMMENT ON TABLE "public"."comment" IS '通用评论表';
-- index comment:
CREATE INDEX "idx_comment_pid" ON "public"."comment" ("pid");
CREATE INDEX "idx_comment_userID" ON "public"."comment" ("userID");
CREATE INDEX "idx_comment_targetType" ON "public"."comment" ("targetType");
CREATE INDEX "idx_comment_targetID" ON "public"."comment" ("targetID");
CREATE INDEX "idx_comment_praiseCount" ON "public"."comment" ("praiseCount");
CREATE INDEX "idx_comment_commentCount" ON "public"."comment" ("commentCount");
CREATE INDEX "idx_comment_modifyTime" ON "public"."comment" ("modifyTime");
CREATE INDEX "idx_comment_createTime" ON "public"."comment" ("createTime");

DROP TABLE IF EXISTS "comment_meta";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_comment_meta_seq";
CREATE TABLE "comment_meta" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_comment_meta_seq'),
  "commentID" bigint(20) unsigned NOT NULL,
  "key" varchar(255) NOT NULL,
  "value" text NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("commentID","key")
);
-- comments:
COMMENT ON COLUMN "public"."comment_meta"."commentID" IS '评论id';
COMMENT ON COLUMN "public"."comment_meta"."key" IS '字段key';
COMMENT ON COLUMN "public"."comment_meta"."value" IS '字段值';
COMMENT ON COLUMN "public"."comment_meta"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."comment_meta"."modifyTime" IS '最后修改';
COMMENT ON TABLE "public"."comment_meta" IS '评论表扩展字段';
-- index comment_meta:
CREATE INDEX "idx_comment_meta_commentID" ON "public"."comment_meta" ("commentID");
CREATE INDEX "idx_comment_meta_key" ON "public"."comment_meta" ("key");

DROP TABLE IF EXISTS "comment_praise";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_comment_praise_seq";
CREATE TABLE "comment_praise" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_comment_praise_seq'),
  "commentID" bigint(20) unsigned NOT NULL,
  "userID" integer unsigned NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("commentID","userID")
);
-- comments:
COMMENT ON COLUMN "public"."comment_praise"."id" IS 'ID';
COMMENT ON COLUMN "public"."comment_praise"."commentID" IS '评论ID';
COMMENT ON COLUMN "public"."comment_praise"."userID" IS '用户ID';
COMMENT ON COLUMN "public"."comment_praise"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."comment_praise"."modifyTime" IS '修改时间';
COMMENT ON TABLE "public"."comment_praise" IS '评论点赞表';
-- index comment_praise:
CREATE INDEX "idx_comment_praise_commentID" ON "public"."comment_praise" ("commentID");
CREATE INDEX "idx_comment_praise_userID" ON "public"."comment_praise" ("userID");
CREATE INDEX "idx_comment_praise_modifyTime" ON "public"."comment_praise" ("modifyTime");
CREATE INDEX "idx_comment_praise_createTime" ON "public"."comment_praise" ("createTime");

DROP TABLE IF EXISTS "group";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_group_seq";
CREATE TABLE "group" (
  "groupID" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_group_seq'),
  "name" varchar(255) NOT NULL,
  "parentID" bigint(20) unsigned NOT NULL,
  "parentLevel" varchar(1000) NOT NULL,
  "extraField" varchar(100) DEFAULT NULL,
  "sort" integer unsigned NOT NULL,
  "sizeMax" double unsigned NOT NULL,
  "sizeUse" bigint(20) unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  "createTime" integer unsigned NOT NULL,
  PRIMARY KEY ("groupID")
);
-- comments:
COMMENT ON COLUMN "public"."group"."groupID" IS '群组id';
COMMENT ON COLUMN "public"."group"."name" IS '群组名';
COMMENT ON COLUMN "public"."group"."parentID" IS '父群组id';
COMMENT ON COLUMN "public"."group"."parentLevel" IS '父路径id; 例如:  ,2,5,10,';
COMMENT ON COLUMN "public"."group"."extraField" IS '扩展字段';
COMMENT ON COLUMN "public"."group"."sort" IS '排序';
COMMENT ON COLUMN "public"."group"."sizeMax" IS '群组存储空间大小(GB) 0-不限制';
COMMENT ON COLUMN "public"."group"."sizeUse" IS '已使用大小(byte)';
COMMENT ON COLUMN "public"."group"."modifyTime" IS '最后修改时间';
COMMENT ON COLUMN "public"."group"."createTime" IS '创建时间';
COMMENT ON TABLE "public"."group" IS '群组表';
-- index group:
CREATE INDEX "idx_group_name" ON "public"."group" ("name");
CREATE INDEX "idx_group_parentID" ON "public"."group" ("parentID");
CREATE INDEX "idx_group_createTime" ON "public"."group" ("createTime");
CREATE INDEX "idx_group_modifyTime" ON "public"."group" ("modifyTime");
CREATE INDEX "idx_group_order" ON "public"."group" ("sort");
CREATE INDEX "idx_group_parentLevel" ON "public"."group" ("parentLevel");

DROP TABLE IF EXISTS "group_meta";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_group_meta_seq";
CREATE TABLE "group_meta" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_group_meta_seq'),
  "groupID" bigint(20) unsigned NOT NULL,
  "key" varchar(255) NOT NULL,
  "value" text NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("groupID","key")
);
-- comments:
COMMENT ON COLUMN "public"."group_meta"."id" IS '自增id';
COMMENT ON COLUMN "public"."group_meta"."groupID" IS '部门id';
COMMENT ON COLUMN "public"."group_meta"."key" IS '存储key';
COMMENT ON COLUMN "public"."group_meta"."value" IS '对应值';
COMMENT ON COLUMN "public"."group_meta"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."group_meta"."modifyTime" IS '最后修改时间';
COMMENT ON TABLE "public"."group_meta" IS '用户数据扩展表';
-- index group_meta:
CREATE INDEX "idx_group_meta_groupID" ON "public"."group_meta" ("groupID");
CREATE INDEX "idx_group_meta_key" ON "public"."group_meta" ("key");

DROP TABLE IF EXISTS "io_file";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_io_file_seq";
CREATE TABLE "io_file" (
  "fileID" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_io_file_seq'),
  "name" varchar(255) NOT NULL,
  "size" bigint(20) unsigned NOT NULL,
  "ioType" integer unsigned NOT NULL,
  "path" varchar(255) NOT NULL,
  "hashSimple" varchar(100) NOT NULL,
  "hashMd5" varchar(100) NOT NULL,
  "linkCount" integer unsigned NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("fileID")
);
-- comments:
COMMENT ON COLUMN "public"."io_file"."fileID" IS '自增id';
COMMENT ON COLUMN "public"."io_file"."name" IS '文件名';
COMMENT ON COLUMN "public"."io_file"."size" IS '文件大小';
COMMENT ON COLUMN "public"."io_file"."ioType" IS 'io的id';
COMMENT ON COLUMN "public"."io_file"."path" IS '文件路径';
COMMENT ON COLUMN "public"."io_file"."hashSimple" IS '文件简易hash(不全覆盖)；hashSimple';
COMMENT ON COLUMN "public"."io_file"."hashMd5" IS '文件hash, md5';
COMMENT ON COLUMN "public"."io_file"."linkCount" IS '引用次数;0则定期删除';
COMMENT ON COLUMN "public"."io_file"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."io_file"."modifyTime" IS '最后修改时间';
COMMENT ON TABLE "public"."io_file" IS '文档存储表';
-- index io_file:
CREATE INDEX "idx_io_file_size" ON "public"."io_file" ("size");
CREATE INDEX "idx_io_file_path" ON "public"."io_file" ("path");
CREATE INDEX "idx_io_file_hash" ON "public"."io_file" ("hashSimple");
CREATE INDEX "idx_io_file_linkCount" ON "public"."io_file" ("linkCount");
CREATE INDEX "idx_io_file_createTime" ON "public"."io_file" ("createTime");
CREATE INDEX "idx_io_file_ioType" ON "public"."io_file" ("ioType");
CREATE INDEX "idx_io_file_hashMd5" ON "public"."io_file" ("hashMd5");

DROP TABLE IF EXISTS "io_source";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_io_source_seq";
CREATE TABLE "io_source" (
  "sourceID" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_io_source_seq'),
  "sourceHash" varchar(20) NOT NULL,
  "targetType" tinyint(3) unsigned NOT NULL,
  "targetID" bigint(20) unsigned NOT NULL,
  "createUser" bigint(20) unsigned NOT NULL,
  "modifyUser" bigint(20) unsigned NOT NULL,
  "isFolder" tinyint(4) unsigned NOT NULL,
  "name" varchar(255) NOT NULL,
  "fileType" varchar(10) NOT NULL,
  "parentID" bigint(20) unsigned NOT NULL,
  "parentLevel" varchar(1000) NOT NULL,
  "fileID" bigint(20) unsigned NOT NULL,
  "isDelete" tinyint(4) unsigned NOT NULL,
  "size" bigint(20) unsigned NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  "viewTime" integer unsigned NOT NULL,
  PRIMARY KEY ("sourceID")
);
-- comments:
COMMENT ON COLUMN "public"."io_source"."sourceHash" IS ' id的hash';
COMMENT ON COLUMN "public"."io_source"."targetType" IS '文档所属类型 (0-sys,1-user,2-group)';
COMMENT ON COLUMN "public"."io_source"."targetID" IS '拥有者对象id';
COMMENT ON COLUMN "public"."io_source"."createUser" IS '创建者id';
COMMENT ON COLUMN "public"."io_source"."modifyUser" IS '最后修改者';
COMMENT ON COLUMN "public"."io_source"."isFolder" IS '是否为文件夹(0否,1是)';
COMMENT ON COLUMN "public"."io_source"."name" IS '文件名';
COMMENT ON COLUMN "public"."io_source"."fileType" IS '文件扩展名，文件夹则为空';
COMMENT ON COLUMN "public"."io_source"."parentID" IS '父级资源id，为0则为部门或用户根文件夹，添加用户部门时自动新建';
COMMENT ON COLUMN "public"."io_source"."parentLevel" IS '父路径id; 例如:  ,2,5,10,';
COMMENT ON COLUMN "public"."io_source"."fileID" IS '对应存储资源id,文件夹则该处为0';
COMMENT ON COLUMN "public"."io_source"."isDelete" IS '是否删除(0-正常 1-已删除)';
COMMENT ON COLUMN "public"."io_source"."size" IS '占用空间大小';
COMMENT ON COLUMN "public"."io_source"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."io_source"."modifyTime" IS '最后修改时间';
COMMENT ON COLUMN "public"."io_source"."viewTime" IS '最后访问时间';
COMMENT ON TABLE "public"."io_source" IS '文档数据表';
-- index io_source:
CREATE INDEX "idx_io_source_targetType" ON "public"."io_source" ("targetType");
CREATE INDEX "idx_io_source_targetID" ON "public"."io_source" ("targetID");
CREATE INDEX "idx_io_source_createUser" ON "public"."io_source" ("createUser");
CREATE INDEX "idx_io_source_isFolder" ON "public"."io_source" ("isFolder");
CREATE INDEX "idx_io_source_fileType" ON "public"."io_source" ("fileType");
CREATE INDEX "idx_io_source_parentID" ON "public"."io_source" ("parentID");
CREATE INDEX "idx_io_source_parentLevel" ON "public"."io_source" ("parentLevel");
CREATE INDEX "idx_io_source_fileID" ON "public"."io_source" ("fileID");
CREATE INDEX "idx_io_source_isDelete" ON "public"."io_source" ("isDelete");
CREATE INDEX "idx_io_source_size" ON "public"."io_source" ("size");
CREATE INDEX "idx_io_source_modifyTime" ON "public"."io_source" ("modifyTime");
CREATE INDEX "idx_io_source_createTime" ON "public"."io_source" ("createTime");
CREATE INDEX "idx_io_source_viewTime" ON "public"."io_source" ("viewTime");
CREATE INDEX "idx_io_source_modifyUser" ON "public"."io_source" ("modifyUser");

DROP TABLE IF EXISTS "io_source_auth";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_io_source_auth_seq";
CREATE TABLE "io_source_auth" (
  "id" integer unsigned NOT NULL DEFAULT nextval('kodcloud_io_source_auth_seq'),
  "sourceID" bigint(20) unsigned NOT NULL,
  "targetType" tinyint(4) unsigned NOT NULL,
  "targetID" bigint(20) unsigned NOT NULL,
  "authID" integer unsigned NOT NULL,
  "authDefine" integer NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id")
);
-- comments:
COMMENT ON COLUMN "public"."io_source_auth"."id" IS '自增id';
COMMENT ON COLUMN "public"."io_source_auth"."sourceID" IS '文档资源id';
COMMENT ON COLUMN "public"."io_source_auth"."targetType" IS '分享给的对象,1用户,2部门';
COMMENT ON COLUMN "public"."io_source_auth"."targetID" IS '所属对象id';
COMMENT ON COLUMN "public"."io_source_auth"."authID" IS '权限组id；自定义权限则为0';
COMMENT ON COLUMN "public"."io_source_auth"."authDefine" IS '自定义权限，4字节占位';
COMMENT ON COLUMN "public"."io_source_auth"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."io_source_auth"."modifyTime" IS '最后修改时间';
COMMENT ON TABLE "public"."io_source_auth" IS '文档权限表';
-- index io_source_auth:
CREATE INDEX "idx_io_source_auth_sourceID" ON "public"."io_source_auth" ("sourceID");
CREATE INDEX "idx_io_source_auth_userID" ON "public"."io_source_auth" ("targetType");
CREATE INDEX "idx_io_source_auth_groupID" ON "public"."io_source_auth" ("targetID");
CREATE INDEX "idx_io_source_auth_auth" ON "public"."io_source_auth" ("authID");
CREATE INDEX "idx_io_source_auth_authDefine" ON "public"."io_source_auth" ("authDefine");

DROP TABLE IF EXISTS "io_source_event";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_io_source_event_seq";
CREATE TABLE "io_source_event" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_io_source_event_seq'),
  "sourceID" bigint(20) unsigned NOT NULL,
  "sourceParent" bigint(20) unsigned NOT NULL,
  "userID" bigint(20) unsigned NOT NULL,
  "type" varchar(255) NOT NULL,
  "desc" text NOT NULL,
  "createTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id")
);
-- comments:
COMMENT ON COLUMN "public"."io_source_event"."id" IS '自增id';
COMMENT ON COLUMN "public"."io_source_event"."sourceID" IS '文档id';
COMMENT ON COLUMN "public"."io_source_event"."sourceParent" IS '文档父文件夹id';
COMMENT ON COLUMN "public"."io_source_event"."userID" IS '操作者id';
COMMENT ON COLUMN "public"."io_source_event"."type" IS '事件类型';
COMMENT ON COLUMN "public"."io_source_event"."desc" IS '数据详情，根据type内容意义不同';
COMMENT ON COLUMN "public"."io_source_event"."createTime" IS '创建时间';
COMMENT ON TABLE "public"."io_source_event" IS '文档事件表';
-- index io_source_event:
CREATE INDEX "idx_io_source_event_sourceID" ON "public"."io_source_event" ("sourceID");
CREATE INDEX "idx_io_source_event_sourceParent" ON "public"."io_source_event" ("sourceParent");
CREATE INDEX "idx_io_source_event_userID" ON "public"."io_source_event" ("userID");
CREATE INDEX "idx_io_source_event_eventType" ON "public"."io_source_event" ("type");
CREATE INDEX "idx_io_source_event_createTime" ON "public"."io_source_event" ("createTime");

DROP TABLE IF EXISTS "io_source_history";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_io_source_history_seq";
CREATE TABLE "io_source_history" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_io_source_history_seq'),
  "sourceID" bigint(20) unsigned NOT NULL,
  "userID" bigint(20) unsigned NOT NULL,
  "fileID" bigint(20) unsigned NOT NULL,
  "size" bigint(20) NOT NULL,
  "detail" varchar(1024) NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id")
);
-- comments:
COMMENT ON COLUMN "public"."io_source_history"."id" IS '自增id';
COMMENT ON COLUMN "public"."io_source_history"."sourceID" IS '文档资源id';
COMMENT ON COLUMN "public"."io_source_history"."userID" IS '用户id, 对部门时此id为0';
COMMENT ON COLUMN "public"."io_source_history"."fileID" IS '当前版本对应存储资源id';
COMMENT ON COLUMN "public"."io_source_history"."size" IS '文件大小';
COMMENT ON COLUMN "public"."io_source_history"."detail" IS '版本描述';
COMMENT ON COLUMN "public"."io_source_history"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."io_source_history"."modifyTime" IS '最后修改时间';
COMMENT ON TABLE "public"."io_source_history" IS '文档历史记录表';
-- index io_source_history:
CREATE INDEX "idx_io_source_history_sourceID" ON "public"."io_source_history" ("sourceID");
CREATE INDEX "idx_io_source_history_userID" ON "public"."io_source_history" ("userID");
CREATE INDEX "idx_io_source_history_fileID" ON "public"."io_source_history" ("fileID");
CREATE INDEX "idx_io_source_history_createTime" ON "public"."io_source_history" ("createTime");

DROP TABLE IF EXISTS "io_source_meta";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_io_source_meta_seq";
CREATE TABLE "io_source_meta" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_io_source_meta_seq'),
  "sourceID" bigint(20) unsigned NOT NULL,
  "key" varchar(255) NOT NULL,
  "value" text NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("sourceID","key")
);
-- comments:
COMMENT ON COLUMN "public"."io_source_meta"."id" IS '自增id';
COMMENT ON COLUMN "public"."io_source_meta"."sourceID" IS '文档id';
COMMENT ON COLUMN "public"."io_source_meta"."key" IS '存储key';
COMMENT ON COLUMN "public"."io_source_meta"."value" IS '对应值';
COMMENT ON COLUMN "public"."io_source_meta"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."io_source_meta"."modifyTime" IS '最后修改时间';
COMMENT ON TABLE "public"."io_source_meta" IS '文档扩展表';
-- index io_source_meta:
CREATE INDEX "idx_io_source_meta_sourceID" ON "public"."io_source_meta" ("sourceID");
CREATE INDEX "idx_io_source_meta_key" ON "public"."io_source_meta" ("key");

DROP TABLE IF EXISTS "io_source_recycle";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_io_source_recycle_seq";
CREATE TABLE "io_source_recycle" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_io_source_recycle_seq'),
  "targetType" tinyint(3) unsigned NOT NULL,
  "targetID" bigint(20) unsigned NOT NULL,
  "sourceID" bigint(20) unsigned NOT NULL,
  "userID" bigint(20) unsigned NOT NULL,
  "parentLevel" varchar(1000) NOT NULL,
  "createTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id")
);
-- comments:
COMMENT ON COLUMN "public"."io_source_recycle"."id" IS '自增id';
COMMENT ON COLUMN "public"."io_source_recycle"."targetType" IS '文档所属类型 (0-sys,1-user,2-group)';
COMMENT ON COLUMN "public"."io_source_recycle"."targetID" IS '拥有者对象id';
COMMENT ON COLUMN "public"."io_source_recycle"."sourceID" IS '文档id';
COMMENT ON COLUMN "public"."io_source_recycle"."userID" IS '操作者id';
COMMENT ON COLUMN "public"."io_source_recycle"."parentLevel" IS '文档上层关系;冗余字段,便于统计回收站信息';
COMMENT ON COLUMN "public"."io_source_recycle"."createTime" IS '创建时间';
COMMENT ON TABLE "public"."io_source_recycle" IS '文档回收站';
-- index io_source_recycle:
CREATE INDEX "idx_io_source_recycle_sourceID" ON "public"."io_source_recycle" ("sourceID");
CREATE INDEX "idx_io_source_recycle_userID" ON "public"."io_source_recycle" ("userID");
CREATE INDEX "idx_io_source_recycle_createTime" ON "public"."io_source_recycle" ("createTime");
CREATE INDEX "idx_io_source_recycle_parentLevel" ON "public"."io_source_recycle" ("parentLevel");
CREATE INDEX "idx_io_source_recycle_targetType" ON "public"."io_source_recycle" ("targetType");
CREATE INDEX "idx_io_source_recycle_targetID" ON "public"."io_source_recycle" ("targetID");

DROP TABLE IF EXISTS "share";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_share_seq";
CREATE TABLE "share" (
  "shareID" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_share_seq'),
  "title" varchar(255) NOT NULL,
  "shareHash" varchar(50) NOT NULL,
  "userID" bigint(20) unsigned NOT NULL,
  "sourceID" bigint(20) unsigned NOT NULL,
  "isLink" tinyint(4) unsigned NOT NULL,
  "isShareTo" tinyint(4) unsigned NOT NULL,
  "password" varchar(255) NOT NULL,
  "timeTo" integer unsigned NOT NULL,
  "numView" integer unsigned NOT NULL,
  "numDownload" integer unsigned NOT NULL,
  "options" varchar(1000) NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("shareID")
);
-- comments:
COMMENT ON COLUMN "public"."share"."shareID" IS '自增id';
COMMENT ON COLUMN "public"."share"."title" IS '分享标题';
COMMENT ON COLUMN "public"."share"."shareHash" IS 'shareid';
COMMENT ON COLUMN "public"."share"."userID" IS '分享用户id';
COMMENT ON COLUMN "public"."share"."sourceID" IS '用户数据id';
COMMENT ON COLUMN "public"."share"."isLink" IS '是否外链分享；默认为0';
COMMENT ON COLUMN "public"."share"."isShareTo" IS '是否为内部分享；默认为0';
COMMENT ON COLUMN "public"."share"."password" IS '访问密码,为空则无密码';
COMMENT ON COLUMN "public"."share"."timeTo" IS '到期时间,0-永久生效';
COMMENT ON COLUMN "public"."share"."numView" IS '预览次数';
COMMENT ON COLUMN "public"."share"."numDownload" IS '下载次数';
COMMENT ON COLUMN "public"."share"."options" IS 'json 配置信息;是否可以下载,是否可以上传等';
COMMENT ON COLUMN "public"."share"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."share"."modifyTime" IS '最后修改时间';
COMMENT ON TABLE "public"."share" IS '分享数据表';
-- index share:
CREATE INDEX "idx_share_userID" ON "public"."share" ("userID");
CREATE INDEX "idx_share_createTime" ON "public"."share" ("createTime");
CREATE INDEX "idx_share_modifyTime" ON "public"."share" ("modifyTime");
CREATE INDEX "idx_share_path" ON "public"."share" ("sourceID");
CREATE INDEX "idx_share_sid" ON "public"."share" ("shareHash");
CREATE INDEX "idx_share_public" ON "public"."share" ("isLink");
CREATE INDEX "idx_share_timeTo" ON "public"."share" ("timeTo");
CREATE INDEX "idx_share_numView" ON "public"."share" ("numView");
CREATE INDEX "idx_share_numDownload" ON "public"."share" ("numDownload");
CREATE INDEX "idx_share_isShareTo" ON "public"."share" ("isShareTo");

DROP TABLE IF EXISTS "share_to";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_share_to_seq";
CREATE TABLE "share_to" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_share_to_seq'),
  "shareID" bigint(20) unsigned NOT NULL,
  "targetType" tinyint(4) unsigned NOT NULL,
  "targetID" bigint(20) unsigned NOT NULL,
  "authID" integer unsigned NOT NULL,
  "authDefine" integer NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id")
);
-- comments:
COMMENT ON COLUMN "public"."share_to"."id" IS '自增id';
COMMENT ON COLUMN "public"."share_to"."shareID" IS '分享id';
COMMENT ON COLUMN "public"."share_to"."targetType" IS '分享给的对象,1用户,2部门';
COMMENT ON COLUMN "public"."share_to"."targetID" IS '所属对象id';
COMMENT ON COLUMN "public"."share_to"."authID" IS '权限组id；自定义权限则为0';
COMMENT ON COLUMN "public"."share_to"."authDefine" IS '自定义权限，4字节占位';
COMMENT ON COLUMN "public"."share_to"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."share_to"."modifyTime" IS '最后修改时间';
COMMENT ON TABLE "public"."share_to" IS '分享给指定用户(协作)';
-- index share_to:
CREATE INDEX "idx_share_to_shareID" ON "public"."share_to" ("shareID");
CREATE INDEX "idx_share_to_userID" ON "public"."share_to" ("targetType");
CREATE INDEX "idx_share_to_targetID" ON "public"."share_to" ("targetID");
CREATE INDEX "idx_share_to_authDefine" ON "public"."share_to" ("authDefine");
CREATE INDEX "idx_share_to_authID" ON "public"."share_to" ("authID");

DROP TABLE IF EXISTS "system_log";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_system_log_seq";
CREATE TABLE "system_log" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_system_log_seq'),
  "sessionID" varchar(128) NOT NULL,
  "userID" bigint(20) unsigned NOT NULL,
  "type" varchar(255) NOT NULL,
  "desc" text NOT NULL,
  "createTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id")
);
-- comments:
COMMENT ON COLUMN "public"."system_log"."sessionID" IS 'session识别码，用于登陆时记录ip,UA等信息';
COMMENT ON COLUMN "public"."system_log"."userID" IS '用户id';
COMMENT ON COLUMN "public"."system_log"."type" IS '日志类型';
COMMENT ON COLUMN "public"."system_log"."desc" IS '详情';
COMMENT ON COLUMN "public"."system_log"."createTime" IS '创建时间';
COMMENT ON TABLE "public"."system_log" IS '系统日志表';
-- index system_log:
CREATE INDEX "idx_system_log_userID" ON "public"."system_log" ("userID");
CREATE INDEX "idx_system_log_type" ON "public"."system_log" ("type");
CREATE INDEX "idx_system_log_createTime" ON "public"."system_log" ("createTime");
CREATE INDEX "idx_system_log_sessionID" ON "public"."system_log" ("sessionID");

DROP TABLE IF EXISTS "system_option";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_system_option_seq";
CREATE TABLE "system_option" (
  "id" integer unsigned NOT NULL DEFAULT nextval('kodcloud_system_option_seq'),
  "type" varchar(50) NOT NULL,
  "key" varchar(255) NOT NULL,
  "value" text NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("key","type")
);
-- comments:
COMMENT ON COLUMN "public"."system_option"."type" IS '配置类型';
COMMENT ON COLUMN "public"."system_option"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."system_option"."modifyTime" IS '最后更新时间';
COMMENT ON TABLE "public"."system_option" IS '系统配置表';
-- index system_option:
CREATE INDEX "idx_system_option_createTime" ON "public"."system_option" ("createTime");
CREATE INDEX "idx_system_option_modifyTime" ON "public"."system_option" ("modifyTime");

DROP TABLE IF EXISTS "system_session";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_system_session_seq";
CREATE TABLE "system_session" (
  "id" integer unsigned NOT NULL DEFAULT nextval('kodcloud_system_session_seq'),
  "sign" varchar(128) NOT NULL,
  "userID" bigint(20) unsigned NOT NULL,
  "content" text NOT NULL,
  "expires" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  "createTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("sign")
);
-- comments:
COMMENT ON COLUMN "public"."system_session"."sign" IS 'session标识';
COMMENT ON COLUMN "public"."system_session"."userID" IS '用户id';
COMMENT ON COLUMN "public"."system_session"."content" IS 'value';
COMMENT ON COLUMN "public"."system_session"."expires" IS '过期时间';
COMMENT ON COLUMN "public"."system_session"."modifyTime" IS '修改时间';
COMMENT ON COLUMN "public"."system_session"."createTime" IS '创建时间';
COMMENT ON TABLE "public"."system_session" IS 'session';
-- index system_session:
CREATE INDEX "idx_system_session_userID" ON "public"."system_session" ("userID");
CREATE INDEX "idx_system_session_expires" ON "public"."system_session" ("expires");
CREATE INDEX "idx_system_session_modifyTime" ON "public"."system_session" ("modifyTime");

DROP TABLE IF EXISTS "user";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_user_seq";
CREATE TABLE "user" (
  "userID" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_user_seq'),
  "name" varchar(255) NOT NULL,
  "roleID" integer unsigned NOT NULL,
  "email" varchar(255) NOT NULL,
  "phone" varchar(20) NOT NULL,
  "nickName" varchar(255) NOT NULL,
  "avatar" varchar(255) NOT NULL,
  "sex" tinyint(4) unsigned NOT NULL,
  "password" varchar(100) NOT NULL,
  "sizeMax" double unsigned NOT NULL,
  "sizeUse" bigint(20) unsigned NOT NULL,
  "status" tinyint(3) unsigned NOT NULL,
  "lastLogin" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  "createTime" integer unsigned NOT NULL,
  PRIMARY KEY ("userID")
);
-- comments:
COMMENT ON COLUMN "public"."user"."userID" IS '自增id';
COMMENT ON COLUMN "public"."user"."name" IS '登陆用户名';
COMMENT ON COLUMN "public"."user"."roleID" IS '用户角色';
COMMENT ON COLUMN "public"."user"."email" IS '邮箱';
COMMENT ON COLUMN "public"."user"."phone" IS '手机';
COMMENT ON COLUMN "public"."user"."nickName" IS '昵称';
COMMENT ON COLUMN "public"."user"."avatar" IS '头像';
COMMENT ON COLUMN "public"."user"."sex" IS '性别 (0女1男)';
COMMENT ON COLUMN "public"."user"."password" IS '密码';
COMMENT ON COLUMN "public"."user"."sizeMax" IS '群组存储空间大小(GB) 0-不限制';
COMMENT ON COLUMN "public"."user"."sizeUse" IS '已使用大小(byte)';
COMMENT ON COLUMN "public"."user"."status" IS '用户启用状态 0-未启用 1-启用';
COMMENT ON COLUMN "public"."user"."lastLogin" IS '最后登陆时间';
COMMENT ON COLUMN "public"."user"."modifyTime" IS '最后修改时间';
COMMENT ON COLUMN "public"."user"."createTime" IS '创建时间';
COMMENT ON TABLE "public"."user" IS '用户表';
-- index user:
CREATE INDEX "idx_user_name" ON "public"."user" ("name");
CREATE INDEX "idx_user_email" ON "public"."user" ("email");
CREATE INDEX "idx_user_status" ON "public"."user" ("status");
CREATE INDEX "idx_user_modifyTime" ON "public"."user" ("modifyTime");
CREATE INDEX "idx_user_lastLogin" ON "public"."user" ("lastLogin");
CREATE INDEX "idx_user_createTime" ON "public"."user" ("createTime");
CREATE INDEX "idx_user_nickName" ON "public"."user" ("nickName");
CREATE INDEX "idx_user_phone" ON "public"."user" ("phone");
CREATE INDEX "idx_user_sizeUse" ON "public"."user" ("sizeUse");

DROP TABLE IF EXISTS "user_fav";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_user_fav_seq";
CREATE TABLE "user_fav" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_user_fav_seq'),
  "userID" bigint(20) unsigned NOT NULL,
  "tagID" integer unsigned NOT NULL,
  "name" varchar(255) NOT NULL,
  "path" varchar(255) NOT NULL,
  "type" varchar(20) NOT NULL,
  "sort" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  "createTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id")
);
-- comments:
COMMENT ON COLUMN "public"."user_fav"."userID" IS '用户id';
COMMENT ON COLUMN "public"."user_fav"."tagID" IS '标签id,收藏则为0';
COMMENT ON COLUMN "public"."user_fav"."name" IS '收藏名称';
COMMENT ON COLUMN "public"."user_fav"."path" IS '收藏路径,tag时则为sourceID';
COMMENT ON COLUMN "public"."user_fav"."type" IS 'source/path';
COMMENT ON COLUMN "public"."user_fav"."sort" IS '排序';
COMMENT ON COLUMN "public"."user_fav"."modifyTime" IS '最后修改时间';
COMMENT ON COLUMN "public"."user_fav"."createTime" IS '创建时间';
COMMENT ON TABLE "public"."user_fav" IS '用户文档标签表';
-- index user_fav:
CREATE INDEX "idx_user_fav_createTime" ON "public"."user_fav" ("createTime");
CREATE INDEX "idx_user_fav_userID" ON "public"."user_fav" ("userID");
CREATE INDEX "idx_user_fav_name" ON "public"."user_fav" ("name");
CREATE INDEX "idx_user_fav_sort" ON "public"."user_fav" ("sort");
CREATE INDEX "idx_user_fav_tagID" ON "public"."user_fav" ("tagID");
CREATE INDEX "idx_user_fav_path" ON "public"."user_fav" ("path");
CREATE INDEX "idx_user_fav_type" ON "public"."user_fav" ("type");

DROP TABLE IF EXISTS "user_group";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_user_group_seq";
CREATE TABLE "user_group" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_user_group_seq'),
  "userID" bigint(20) unsigned NOT NULL,
  "groupID" bigint(20) unsigned NOT NULL,
  "authID" integer unsigned NOT NULL,
  "sort" integer unsigned NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("userID","groupID")
);
-- comments:
COMMENT ON COLUMN "public"."user_group"."userID" IS '用户id';
COMMENT ON COLUMN "public"."user_group"."groupID" IS '群组id';
COMMENT ON COLUMN "public"."user_group"."authID" IS '在群组内的权限';
COMMENT ON COLUMN "public"."user_group"."sort" IS '在该群组的排序';
COMMENT ON COLUMN "public"."user_group"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."user_group"."modifyTime" IS '最后修改时间';
COMMENT ON TABLE "public"."user_group" IS '用户群组关联表(一对多)';
-- index user_group:
CREATE INDEX "idx_user_group_userID" ON "public"."user_group" ("userID");
CREATE INDEX "idx_user_group_groupID" ON "public"."user_group" ("groupID");
CREATE INDEX "idx_user_group_groupRole" ON "public"."user_group" ("authID");
CREATE INDEX "idx_user_group_sort" ON "public"."user_group" ("sort");

DROP TABLE IF EXISTS "user_meta";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_user_meta_seq";
CREATE TABLE "user_meta" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_user_meta_seq'),
  "userID" bigint(20) unsigned NOT NULL,
  "key" varchar(255) NOT NULL,
  "value" text NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("userID","key")
);
-- comments:
COMMENT ON COLUMN "public"."user_meta"."id" IS '自增id';
COMMENT ON COLUMN "public"."user_meta"."userID" IS '用户id';
COMMENT ON COLUMN "public"."user_meta"."key" IS '存储key';
COMMENT ON COLUMN "public"."user_meta"."value" IS '对应值';
COMMENT ON COLUMN "public"."user_meta"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."user_meta"."modifyTime" IS '最后修改时间';
COMMENT ON TABLE "public"."user_meta" IS '用户数据扩展表';
-- index user_meta:
CREATE INDEX "idx_user_meta_userID" ON "public"."user_meta" ("userID");
CREATE INDEX "idx_user_meta_metaKey" ON "public"."user_meta" ("key");

DROP TABLE IF EXISTS "user_option";
CREATE SEQUENCE IF NOT EXISTS "kodcloud_user_option_seq";
CREATE TABLE "user_option" (
  "id" bigint(20) unsigned NOT NULL DEFAULT nextval('kodcloud_user_option_seq'),
  "userID" bigint(20) unsigned NOT NULL,
  "type" varchar(50) NOT NULL,
  "key" varchar(255) NOT NULL,
  "value" text NOT NULL,
  "createTime" integer unsigned NOT NULL,
  "modifyTime" integer unsigned NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("userID","key","type")
);
-- comments:
COMMENT ON COLUMN "public"."user_option"."id" IS '自增id';
COMMENT ON COLUMN "public"."user_option"."userID" IS '用户id';
COMMENT ON COLUMN "public"."user_option"."type" IS '配置类型,全局配置类型为空,编辑器配置type=editor';
COMMENT ON COLUMN "public"."user_option"."key" IS '配置key';
COMMENT ON COLUMN "public"."user_option"."value" IS '配置值';
COMMENT ON COLUMN "public"."user_option"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."user_option"."modifyTime" IS '最后修改时间';
COMMENT ON TABLE "public"."user_option" IS '用户数据配置表';
-- index user_option:
CREATE INDEX "idx_user_option_userID" ON "public"."user_option" ("userID");
CREATE INDEX "idx_user_option_key" ON "public"."user_option" ("key");
CREATE INDEX "idx_user_option_type" ON "public"."user_option" ("type");

