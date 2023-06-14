---
layout: post
title: ElasticSearch学习笔记(六)索引别名
date: 2023-06-15 
category: elasticsearch
tags:
  - ElasticSearch 
---

​	

前面了解了Elasticsearch索引模板的概念，今天我们学习一下Elasticsearch中的别名（Alias）

前面我们创建模板的时候指定了别名,我们直接使用前面的索引模板创建索引,同时添加一些测试数据

```json
#创建索引
PUT logs-20230614

#准备数据

POST /logs-20230614/_bulk
{ "index": {}}
{ "user_id": 2,"operate":"登录", "timestamp": "2023-06-14 08:09:50" }
{ "index": {}}
{ "user_id": 2,"operate":"退出", "timestamp": "2023-06-14 09:09:50" }
```

我们可以通过单个索引来查询对应的文档数据

```json
GET logs-20230614/_search

#返回结果
{
  "took" : 0,
  "timed_out" : false,
  "_shards" : {
    "total" : 3,
    "successful" : 3,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "logs-20230614",
        "_type" : "_doc",
        "_id" : "Et6yuIgBA6ekKo2Ikb-e",
        "_score" : 1.0,
        "_source" : {
          "user_id" : 2,
          "operate" : "登录",
          "timestamp" : "2023-06-14 08:09:50"
        }
      },
      {
        "_index" : "logs-20230614",
        "_type" : "_doc",
        "_id" : "E96yuIgBA6ekKo2Ikb-e",
        "_score" : 1.0,
        "_source" : {
          "user_id" : 2,
          "operate" : "退出",
          "timestamp" : "2023-06-14 09:09:50"
        }
      }
    ]
  }
}
```

我们也可以通过别名`logs`来查询多个索引的数据

```json
GET logs/_search

#返回结果
{
  "took" : 0,
  "timed_out" : false,
  "_shards" : {
    "total" : 9,
    "successful" : 9,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 6,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "logs-20230613",
        "_type" : "_doc",
        "_id" : "EN6yuIgBA6ekKo2Ihb-8",
        "_score" : 1.0,
        "_source" : {
          "user_id" : 1,
          "operate" : "登录",
          "timestamp" : "2023-06-13 08:09:50"
        }
      },
      {
        "_index" : "logs-20230613",
        "_type" : "_doc",
        "_id" : "Ed6yuIgBA6ekKo2Ihb-8",
        "_score" : 1.0,
        "_source" : {
          "user_id" : 1,
          "operate" : "退出",
          "timestamp" : "2023-06-13 09:09:50"
        }
      },
      {
        "_index" : "logs-20230614",
        "_type" : "_doc",
        "_id" : "Et6yuIgBA6ekKo2Ikb-e",
        "_score" : 1.0,
        "_source" : {
          "user_id" : 2,
          "operate" : "登录",
          "timestamp" : "2023-06-14 08:09:50"
        }
      },
      {
        "_index" : "logs-20230613",
        "_type" : "_doc",
        "_id" : "Fd7PuIgBA6ekKo2Itb_i",
        "_score" : 1.0,
        "_source" : {
          "user_id" : 1,
          "operate" : "修改用户信息",
          "msg" : "成功",
          "timestamp" : "2023-06-13 10:30:50"
        }
      },
      {
        "_index" : "logs-20230613",
        "_type" : "_doc",
        "_id" : "FN7PuIgBA6ekKo2Itb_i",
        "_score" : 1.0,
        "_source" : {
          "user_id" : 1,
          "operate" : "登录",
          "msg" : "成功",
          "timestamp" : "2023-06-13 10:09:50"
        }
      },
      {
        "_index" : "logs-20230614",
        "_type" : "_doc",
        "_id" : "E96yuIgBA6ekKo2Ikb-e",
        "_score" : 1.0,
        "_source" : {
          "user_id" : 2,
          "operate" : "退出",
          "timestamp" : "2023-06-14 09:09:50"
        }
      }
    ]
  }
}
```

通过上面的例子，我们可以看到：查询别名`logs`的数据的时候同时返回了索引`logs-20230613`和`logs-20230614`的数据。别名实际上就是一个指向一个或多个索引的指针，它可以用于简化查询，为索引进行重命名，便于管理和版本控制等。



以下是一些常见的别名操作：

1. 添加别名：使用 _aliases API 可以将一个或多个索引添加到新的别名中，例如：

```
POST /_aliases
{
  "actions": [
    { "add": { "index": "my_index", "alias": "my_alias" } }
  ]
}
```

在上面的例子中，我们将 "my_index" 添加到新别名 "my_alias" 中，如果该别名不存在，则会自动创建它。

1. 删除别名：要删除别名，请使用 _aliases API 并指定要移除的别名和索引名称，例如：

```
POST /_aliases
{
  "actions": [
    { "remove": { "index": "my_index", "alias": "my_alias" } }
  ]
}
```

以上命令将从别名 "my_alias" 中移除 "my_index"，如果别名不再映射到任何索引，则该别名将被删除。

1. 更新别名：要将现有别名更新为新的索引，请使用 _aliases API 并指定要添加和删除的索引，例如：

```
POST /_aliases
{
  "actions": [
    { "add": { "index": "new_index", "alias": "my_alias" } },
    { "remove": { "index": "old_index", "alias": "my_alias" } }
  ]
}
```

在上面的例子中，我们将 "new_index" 添加到 "my_alias" 中，并将 "old_index" 从别名中移除。

1. 灰度发布：别名还可以用于实现平滑的索引版本升级。具体来说，我们可以使用别名分配新版本的索引，并逐步移除旧版本的索引，例如：

```
POST /_aliases
{
  "actions": [
    { "add": { "index": "new_index", "alias": "my_alias" } },
    { "remove": { "index": "old_index", "alias": "my_alias" } }
  ]
}
```

在上面的例子中，我们添加了新索引 "new_index" 到别名 "my_alias" 中，并逐步将旧索引 "old_index" 从别名中移除。

以下是使用别名的常见用途:

1. 灰度发布：当我们需要对当前正在使用的索引进行升级或更改时，可以使用别名来实现平滑过渡。具体做法是，将新版本的索引添加到别名中，并逐步从别名中移除旧版本。这样，我们可以平滑地切换到新的索引版本，同时避免数据重复或丢失。
2. 搜索路由：别名可以将多个相关联的索引捆绑在一起，并在查询时自动路由到它们中的正确索引。例如，如果我们有一个分布式索引集群，其中包含多个具有相同数据结构的索引，可以通过一个别名进行搜索并向各个节点发送查询请求。
3. 数据备份：使用别名的另一个常见用途是实现数据备份和恢复。具体来说，我们可以建立一个别名，将需要备份的索引添加到其中，并将别名导出为独立的文件。在需要恢复数据时，只需将备份文件导入并将其作为别名即可。
4. 提高查询效率：在某些场景下，需要对多个索引进行查询或分组。通过使用别名，可以将多个索引组合成一个虚拟索引，从而简化查询操作，提高查询效率。
5. 实现索引的分组和组合：别名的灵活性还表现在可以对索引进行分组和组合。例如，可以将一个时间段内的所有索引组合成一个虚拟索引，从而方便地查询这个时间段内的所有数据。
