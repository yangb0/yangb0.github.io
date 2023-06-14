---
layout: post
title: ElasticSearch学习笔记(九) 聚合查询之Metric
date: 2023-06-17 
category: elasticsearch
tags:
  - ElasticSearch 
---

​	Elasticsearch的Metric聚合主要用于统计在某个字段中的最大、最小、平均数、和、标准差等数值型数据统计指标。下面让我们详细介绍Metric聚合的使用方法，并给出一个完整的示例。

## Metric聚合

Metric聚合是用于计算数值型数据统计指标的一类聚合方法。它可以计算一些统计数据，如最大值，最小值，平均值和加和等，以便对搜索结果进行分析。

以下是Metric聚合常用的几种类型：

- `avg`：计算某个字段的平均值。
- `max`：计算某个字段的最大值。
- `min`：计算某个字段的最小值。
- `sum`：计算某个字段值的和。
- `cardinality`：计算某个字段的基数（即唯一值的数量）。
- `stats`：计算某个字段的平均值、最小值、最大值和总和。
- `extended_stats`：计算某个字段的平均值、最小值、最大值、总和以及标准差和方差。

使用Metric聚合需要构造一个聚合对象，它由两个部分组成：聚合名称和聚合类型。

例如，我们可以通过以下方式创建一个名为 "average_price" 的聚合，用于计算商品价格的平均值：

```
{
  "aggs": {
    "average_price": {
      "avg": {
        "field": "price"
      }
    }
  }
}
```

这个聚合将统计所有匹配查询条件的文档集中商品价格（即字段 "price"）的平均值，并将结果保存到名为 "average_price" 的桶(bucket)中。

## 完整示例

下面是一个完整的示例，它将根据不同用户在不同时间段内访问的页面进行统计，并返回每一个用户每天平均访问的页面数量，以及每个时间段内访问量最大的前10个页面。

首先，假设我们有这样一个索引，记录了所有用户的访问记录：

```
PUT /log_index
{
  "mappings": {
    "properties": {
      "user_id": {"type": "keyword"},
      "page_url": {"type": "keyword"},
      "timestamp": {"type": "date"}
    }
  }
}
```

然后，我们需要向索引中添加一些数据，用于测试聚合操作。以下是一些典型的访问记录，它们包括用户ID、访问页面的URL以及时间戳：

```
POST /log_index/_doc
{
  "user_id": "user1",
  "page_url": "/product/123",
  "timestamp": "2023-06-01T10:00:00"
}

POST /log_index/_doc
{
  "user_id": "user1",
  "page_url": "/blog/456",
  "timestamp": "2023-06-01T11:00:00"
}

POST /log_index/_doc
{
  "user_id": "user1",
  "page_url": "/product/789",
  "timestamp": "2023-06-02T10:00:00"
}

POST /log_index/_doc
{
  "user_id": "user2",
  "page_url": "/blog/789",
  "timestamp": "2023-06-02T12:00:00"
}

POST /log_index/_doc
{
  "user_id": "user2",
  "page_url": "/product/123",
  "timestamp": "2023-06-03T09:00:00"
}

POST /log_index/_doc
{
  "user_id": "user2",
  "page_url": "/product/456",
  "timestamp": "2023-06-03T15:00:00"
}
```

接下来，我们可以使用以下查询来计算每个用户每天平均访问的页面数量，并返回每个时间段内访问量最大的前10个页面：

```
POST /log_index/_search
{
  "size": 0,
  "aggs": {
    "user_page_stats": {
      "composite": {
        "sources": [
          {"user_id": {"terms": {"field": "user_id.keyword"}}},
          {"date": {"date_histogram": {"field": "timestamp", "interval": "day"}}}
        ]
      },
      "aggs": {
        "page_count": {
          "cardinality": {
            "field": "page_url.keyword"
          }
        },
        "top_pages": {
          "terms": {
            "field": "page_url.keyword",
            "size": 10
          }
        }
      }
    }
  }
}
```

在这个查询中，我们首先使用 `composite` 聚合按照用户ID和日期对访问记录进行分组。其中 `"date_histogram"` 表示将时间戳按照天进行划分。

然后，我们在 `"user_page_stats"` 桶中添加了两个子聚合：

- `"page_count"` 子聚合使用 `cardinality` 聚合计算每个用户在每天访问的不同页面数量。
- `"top_pages"` 子聚合使用 `terms` 聚合计算每个时间段内访问量最大的前10个页面。

执行以上查询后，返回的结果如下所示：

```
{
  ...
  "aggregations": {
    "user_page_stats": {
      "buckets": [
        {
          "key": {
            "user_id": "user1",
            "date": 16804
          },
          "doc_count": 2,
          "page_count": {
            "value": 2
          },
          "top_pages": {
            "buckets": [
              {
                "key": "/product/123",
                "doc_count": 1
              },
              {
                "key": "/blog/456",
                "doc_count": 1
              }
            ]
          }
        },
        {
          "key": {
            "user_id": "user1",
            "date": 16805
          },
          "doc_count": 1,
          "page_count": {
            "value": 1
          },
          "top_pages": {
            "buckets": [
              {
                "key": "/product/789",
                "doc_count": 1
              }
            ]
          }
        },
        {
          "key": {
            "user_id": "user2",
            "date": 16805
          },
          "doc_count": 1,
          "page_count": {
            "value": 1
          },
          "top_pages": {
            "buckets": [
              {
                "key": "/blog/789",
                "doc_count": 1
              }
            ]
          }
        },
        {
          "key": {
            "user_id": "user2",
            "date": 16806
          },
          "doc_count": 2,
          "page_count": {
            "value": 2
          },
          "top_pages": {
            "buckets": [
              {
                "key": "/product/123",
                "doc_count": 1
              },
              {
                "key": "/product/456",
                "doc_count": 1
              }
            ]
          }
        }
      ]
    }
  }
}
```

根据返回结果可以看出，这个查询实现了我们的需求。例如，针对用户 "user1"，在日期 "2023-06-01"，他访问了2个不同的页面（"/product/123" 和 "/blog/456"），在日期 "2023-06-02"，他访问了1个不同的页面（"/product/789"）。而在每个日期内，他访问量最大的前10个页面，也被正确地计算了出来。

这个示例展示了如何使用Metric聚合对Elasticsearch中的数据进行分析和统计。需要注意的是，具体的聚合方式和参数取决于我们的需求和数据特征。
