---
layout: post
title: ElasticSearch学习笔记(五)索引模板
date: 2023-06-14 
category: elasticsearch
tags:
  - ElasticSearch 
---

​	

前面了解了索引的一些操作，特别是手动创建索引，但是批量和脚本化必然需要提供一种模板方式快速构建和管理索引，于是就有了索引模板(Index Template)的出现，它是一个可重用的定义自动索引配置的模板，它可以应用于新创建的索引。通过索引模板，我们可以在创建新索引时自动分配默认的映射、设置参数、添加别名等操作。这样能够使得新创建的索引遵循一致的规范，并且可以减少手动配置的时间和工作量。

下面是一个包含映射、别名和默认设置的简单索引模板示例：

```json
PUT _index_template/template_1
{
  "index_patterns": ["logs-*"],
  "template": {
    "settings": {
      "number_of_shards": 3,
      "number_of_replicas": 1,
      "refresh_interval":"1s"
    },
    "mappings": {
      "_source": {
        "enabled": true
      },
      "properties": {
        "user_id": {
          "type": "long"
        },
        "operate": {
          "type": "keyword"
        },
        "timestamp": {
          "type": "date",
          "format": "yyyy-MM-dd HH:mm:ss"
        }
      }
    },
    "aliases": {
      "logs": {}
    }
  }
}
```

- `index_patterns`：模板匹配规则是一个包含一个或多个模式的列表，这些模式用于匹配索引名称。可以使用通配符来匹配多个索引名称。这里，我们使用了通配符 "logs-*" 来匹配以 "logs-" 开头的所有索引模式。
- `settings`：模板设置。包括分片和副本数量、索引存储位置等。在这个例子中，我们定义了三个分片、一个副本、同时设置索引刷新时间间隔为1s。
- `mappings`：模板映射。映射定义了索引中字段的类型、分析器、搜索方式等。这里我们定义了三个字段:user_id,operate,timestamp。
- `aliases`：模板别名。别名可以用于重命名索引，或者将多个索引绑定到同一个别名下。

我们给上面的索引模板创建索引,同时添加一些测试数据

```json
#创建索引
PUT logs-20230613

#准备数据
POST /logs-20230613/_bulk
{ "index": {}}
{ "user_id": 1,"operate":"登录","timestamp": "2023-06-13 08:09:50" }
{ "index": {}}
{ "user_id": 1,"operate":"退出", "timestamp": "2023-06-13 09:09:50" }

```

我们可以通过索引来查询对应的文档数据

```json
GET logs-20230613/_search

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
      }
    ]
  }
}

```

在使用索引模板时，可以也通过修改模板来自动更新现有的索引。例如，如果要添加一个新字段，可以简单地修改索引模板并将其应用到现有索引。我们往前面的模板中增加一个`msg`字段，不用修改原有模板及索引直接执行一下命令

```json
PUT _index_template/template_1
{
  "index_patterns": ["logs-*"],
  "priority": 1,
  "template": {
    "settings": {
      "number_of_shards": 3,
      "number_of_replicas": 1,
      "refresh_interval":"1s"
    },
    "mappings": {
      "_source": {
        "enabled": true
      },
      "properties": {
        "user_id": {
          "type": "long"
        },
        "operate": {
          "type": "keyword"
        },
        "msg": {
          "type": "text"
        },
        "timestamp": {
          "type": "date",
          "format": "yyyy-MM-dd HH:mm:ss"
        }
      }
    },
    "aliases": {
      "logs": {}
    }
  }
}
```

我们再往索引`logs-20230613`中添加数据，数据中新增一个`msg`的数据

```json
POST /logs-20230613/_bulk
{ "index": {}}
{ "user_id": 1,"operate":"登录","msg":"成功","timestamp": "2023-06-13 10:09:50" }
{ "index": {}}
{ "user_id": 1,"operate":"修改用户信息","msg":"成功","timestamp": "2023-06-13 10:30:50" }
```

我们再来查询索引`logs-20230613`中的数据可以看到新的数据多了`msg`的字段

```json
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
      "value" : 4,
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
      }
    ]
  }
}

```

Elasticsearch 索引模板是一个强大的工具，可用于自动化索引管理、灵活查询规则、抽象共享模式以及简化数据仓库管理。使用索引模板可以提高数据处理的效率和质量，并使数据开发过程更加高效和可维护。
