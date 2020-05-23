<?php 
 return array (
  0 => 'id',
  1 => 'sessionID',
  2 => 'userID',
  3 => 'type',
  4 => 'desc',
  5 => 'createTime',
  '_autoinc' => true,
  '_pk' => 'id',
  '_type' => 
  array (
    'id' => 'bigint(20) unsigned',
    'sessionID' => 'varchar(128)',
    'userID' => 'bigint(20) unsigned',
    'type' => 'varchar(255)',
    'desc' => 'text',
    'createTime' => 'int(11) unsigned',
  ),
);