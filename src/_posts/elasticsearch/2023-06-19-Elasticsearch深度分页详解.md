---
layout: post
title: ElasticSearch深度分页问题详解
date: 2023-06-18 
category: elasticsearch
tags:
  - ElasticSearch 
---

对于许多需要处理大数据量的业务场景而言，分页查询是一项十分重要的功能。Elasticsearch 作为目前流行的开源搜索引擎，在数据检索方面也提供了丰富的分页查询支持。

# 基本分页查询

在 Elasticsearch 中进行基本的分页查询，通常使用 `from` 和 `size` 两个参数，它们分别表示从第几条数据开始查询和查询多少条数据。具体来说，`from` 表示要跳过的文档数量，而 `size` 表示每页返回的文档数量。下面是一个简单的例子：

```
GET /my_index/_search
{
    "from": 0,
    "size": 10,
    "query": {
        "match_all": {}
    }
}
```

上述查询将会返回从第 0 条开始的 10 条数据。在进行一些数据量不是特别大的查询时这种方式是比较简单实用的。但是当我们数据量比较大需要查询10000条以后的数据时Elasticsearch会返回错误信息。

将上面命令中的`from`改为10000执行会返回以下信息

```json
"error" : {
    "root_cause" : [
      {
        "type" : "illegal_argument_exception",
        "reason" : "Result window is too large, from + size must be less than or equal to: [10000] but was [10010]. See the scroll api for a more efficient way to request large data sets. This limit can be set by changing the [index.max_result_window] index level setting."
      }
    ],
    "type" : "search_phase_execution_exception",
    "reason" : "all shards failed",
    ......
```

出现以上问题是因为Elasticsearch限制了深度分页，在 Elasticsearch 中，`max_result_window` 参数用于限制查询结果的最大返回数量。默认情况下，`max_result_window` 的值为 10000，即查询结果最多只能返回 10000 条数据。如果查询结果的数量超过这个限制，则 Elasticsearch 会抛出异常并拒绝查询请求。

 我们可以通过指定`max_result_window`来解决上面的问题,例如:

```json
PUT /my_index/_settings
{ 
    "index" : { 
        "max_result_window" : 20000
    }
}
```

但是这样并不能解决根本问题，如果我们只是修改`max_result_window`参数，当数据量越来越大，分页也越来越深，达到一定数据量的时候Elasticsearch可能会出现OOM的问题。

## 为什么会出现OOM问题?

首先Elasticsearch是分布式的，数据分布在各个节点上，当某个节点接收到客户端查询请求的时候，它会把请求广播到其他节点，接收客户端请求的这个节点称之为请求节点（requesting node），它负责收集汇总其他节点的数据。当一个节点接收到分页查询请求时，它会将请求转发给其它节点，然后等待其它节点返回自己所要求的文档结果。当所有分片的文档结果都返回后，节点会对这些结果进行排序，最后返回按照 `from` 和 `size` 参数指定的数量的文档结果。如果一次查询的结果集非常大，那么每个节点都需要对大量的文档结果进行排序和加载到内存中，容易出现内存溢出的问题。
