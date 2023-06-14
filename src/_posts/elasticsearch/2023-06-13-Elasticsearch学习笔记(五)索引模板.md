---
layout: post
title: ElasticSearch学习笔记(五)索引模板
date: 2023-06-13 
category: elasticsearch
tags:
  - ElasticSearch 
---

​	

前面了解了索引的一些操作，特别是手动创建索引，但是批量和脚本化必然需要提供一种模板方式快速构建和管理索引，于是就有了索引模板(Index Template)的出现，它是一个可重用的定义自动索引配置的模板，它可以应用于新创建的索引。通过索引模板，我们可以在创建新索引时自动分配默认的映射、设置参数、添加别名等操作。这样能够使得新创建的索引遵循一致的规范，并且可以减少手动配置的时间和工作量。





下面是一个包含映射、别名和默认设置的简单索引模板示例：

```
PUT _index_template/template_1
{
  "index_patterns": ["logs-*"],
  "priority": 1,
  "template": {
    "settings": {
      "number_of_shards": 3,
      "number_of_replicas": 1
    },
    "mappings": {
      "_source": {
        "enabled": true
      },
      "properties": {
        "timestamp": {
          "type": "date",
          "format": "yyyy-MM-dd HH:mm:ss"
        },
        "message": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword"
            }
          }
        },
        "user_id": {
          "type": "long"
        }
      }
    },
    "aliases": {
      "logs": {}
    }
  }
}
```

在上面的例子中，我们使用了以下三个关键属性：

- `index_patterns`：定义此模板适用于哪些索引模式。这里，我们使用了通配符 "logs-*" 来匹配以 "logs-" 开头的所有索引模式。
- `template`：包含要应用于新索引的设置及其默认值。在这个例子中，我们定义了三个分片和一个副本、启用了 _source 字段、定义了时间戳、消息和用户 ID 字段。我们还指定了一个别名 "logs"。
- `priority`：定义此模板的优先级。这里，我们将其设置为1，以确保它是一个高优先级的模板。

在使用索引模板时，可以通过修改模板来自动更新现有的索引。例如，如果要添加一个新字段，可以简单地修改索引模板并将其应用到现有索引。
