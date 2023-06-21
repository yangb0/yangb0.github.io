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

# 为什么会出现OOM问题?

Elasticsearch是分布式的，数据分布在各个节点上，当某个节点接收到客户端查询请求的时候，它会把请求广播到其他节点，接收客户端请求的这个节点称之为请求节点（requesting node），它负责收集汇总其他节点的数据。当一个节点接收到分页查询请求时，它会将请求转发给其它节点，然后等待其它节点返回自己所要求的文档结果。当所有分片的文档结果都返回后，节点会对这些结果进行排序，最后返回按照 `from` 和 `size` 参数指定的数量的文档结果。如果一次查询的结果集非常大，那么每个节点都需要对大量的文档结果进行排序和加载到内存中，容易出现内存溢出的问题。

# Scroll API 分页查询

为了满足深度分页的场景，Elasticsearch提供了scroll的方式进行分页读取。scroll分页类似关系型数据库中的cursor(游标)，初次查询时会将所有复核搜索条件的数据的_id排序后存储在上下文，类似于快照，同时在返回结果中会返回一个`_scroll_id`字段。在之后的每次查询通过scroll_id访问快照实现快速查询需要的数据，有效降低查询和存储的性能损耗。

## 初始化scroll查询：

初次请求，要在url中的search后加上`scroll=1m，这个scroll=1m（1m代表1分钟），是缓存时间，客户端可以根据查询数据数量自定义缓存的时间`

```json
POST /my_index/_search?scroll=1m
{
    "size": 10,
    "query": {
        "match_all": {}
    }
}

#返回结果
{
  "_scroll_id" : "FGluY2x1ZGVfY29udGV4dF91dWlkDXF1ZXJ5QW5kRmV0Y2gBFnlUcmE2RjhmUmQ2Y3VNVmt3eUJVYkEAAAAAAApx6RZHSE9UajhIUFRiT0JoMmhkVV9JcFV3",
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1024,
      "relation" : "gte"
    },
    "max_score" : 1.0,
    "hits" : [
      ...
    ]
  }
}
```

## 使用scroll_id滚动下一页

使用每次得到的这个`_scroll_id`值，继续请求下一页，每次请求最好都带上scroll=1m刷新过期时间，以防超时报错，直到所有的结果都被读取：

```json
POST /_search/scroll
{
    "scroll": "1m",
    "scroll_id": "FGluY2x1ZGVfY29udGV4dF91dWlkDXF1ZXJ5QW5kRmV0Y2gBFnlUcmE2RjhmUmQ2Y3VNVmt3eUJVYkEAAAAAAApx6RZHSE9UajhIUFRiT0JoMmhkVV9JcFV3"
}
```

过了缓存时间会抛出如下异常
 Elasticsearch exception [type=search_context_missing_exception, reason=No search context found for id [3344636]

## 清除scroll

这个`_scroll_id`在Elasticsearch的服务端是有缓存数量限制的，默认最大500，如果请求量大于这个值，会报错。因此除了自然过期之外，我们在处理完成本次请求后一般手动清除掉`_scroll_id`缓存，及早释放资源

```json
DELETE /_search/scroll
{
	"scroll_id": "FGluY2x1ZGVfY29udGV4dF91dWlkDXF1ZXJ5QW5kRmV0Y2gBFnlUcmE2RjhmUmQ2Y3VNVmt3eUJVYkEAAAAAAApx6RZHSE9UajhIUFRiT0JoMmhkVV9JcFV3"
}
```

Scroll API 极其适用于需要大量数据的情况，例如在数据分析、日志监控等场景下。使用 Scroll API 不需要重复查询，并且您可以轻松地处理所有数据子集。缺点是这种方法需要更多的计算资源进行分页，因为Elasticsearch必须跟踪查询结果并保留状态。同时由于使用了快照的机制，对于实时变化的数据使用Scroll API可能无法体现数据的变化。

# search_after分页

使用Scroll API进行分页时存在实时性问题，Elasticsearch提供了一种更高效的替代方案`search_after`分页。使用 `search_after` 时，您需要指定排序字段，在检索下一页时，您需要提供上一页的最后一条记录的值，然后检索值大于 `search_after` 参数的下一页结果。

为了找到每一页最后一条数据，每个文档必须有一个全局唯一值，可以使用` _id` 作为全局唯一值，但是只要能表示其唯一性就可以。
具体使用方式如下：

```json
GET /my_index/_search
{
  "query": {
    "match_all": {}
  },
  "size": 10,
  "sort": [
    {
      "_id": "asc"
    }
  ]
}
```


这样我们会得到一个数据列表，我们取列表中最后一条数据的`_id`当做`search_after`参数：

```json
GET /my_index/_search
{
  "query": {
    "match_all": {}
  },
  "size": 10,
  "search_after":["VLJetHgBgBLvM6lrIFqW"],
  "sort": [
    {
      "_id": "asc"
    }
  ]
}
```


这样虽然能排序，但是使用起来不太友好，尤其是当文档中有时间字段时，查出来的数据以时间来衡量是乱糟糟的，因为你是根据`_id`排序的，而`_id`是随机字符串，没啥规律。其实我们可以根据多字段排序，比如先根据时间戳排序，当时间戳一样时再根据唯一字段`_id`排序，这样会大大提高用户体验，查询语法如下：

```json
GET /my_index/_search
{
  "query": {
    "match_all": {}
  },
  "size": 10,
  "sort": [
    {
      "timeline": "desc",
      "_id": "asc"
    }
  ]
}

GET /my_index/_search
{
  "query": {
    "match_all": {}
  },
  "size": 10,
  "search_after":[1617932029578, "VLJetHgBgBLvM6lrIFqW"],
  "sort": [
    {
      "timeline": "desc",
      "_id": "asc"
    }
  ]
}
```



`search_after`不是自由跳转到随机页面而是并行滚动多个查询的解决方案。它与Scroll API非常相似，但与它不同，`search_after`参数是无状态的，它始终针对最新版本的搜索器进行解析。因此，排序顺序可能会发生变化，具体取决于索引的更新和删除。
