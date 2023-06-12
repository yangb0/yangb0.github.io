---
layout: post
title: ElasticSearch学习笔记(五) 动态聚合
date: 2023-06-10 
category: elasticsearch
tags:
  - ElasticSearch 
---

​	

Elasticsearch 聚合（Aggregation）是 Elasticsearch 中用于处理搜索结果的重要工具之一。它可以帮助我们对搜索结果进行各种数据统计和分析，以便更好地理解搜索结果数据的特征和趋势。

## 什么是聚合？

聚合是 Elasticsearch 中用于处理搜索结果的重要工具。它可以对搜索结果进行各种数据统计和分析，比如按照价格、品牌、销量等各种数据维度进行分类和汇总，从而实现多维度、多条件的数据分析和展示效果。聚合可以适应不同的业务需求和场景，提供了丰富的聚合类型和选项，使得数据分析和展示更加灵活和可定制化。

## 聚合的类型

Elasticsearch 中支持的聚合类型包括以下几种：

### 1. Bucket 聚合

Bucket 聚合是一种根据某些条件将文档分为不同分组的聚合方式。常见的 Bucket 聚合包括：

- Term Aggregation：根据指定字段的值进行分组。
- Range Aggregation：根据指定范围进行分组，比如价格在 0~100、100~500 等。
- Date Histogram Aggregation：根据指定时间间隔进行分组。
- Geo Distance Aggregation：根据指定的位置信息和距离进行分组。

### 2. Metric 聚合

Metric 聚合是一种用于计算指标的聚合方式，常见的 Metric 聚合包括：

- Sum Aggregation：计算指定字段的总和。
- Avg Aggregation：计算指定字段的平均值。
- Max Aggregation：计算指定字段的最大值。
- Min Aggregation：计算指定字段的最小值。
- Stats Aggregation：同时计算指定字段的总数、平均值、最大值、最小值等多种指标。
- Percentiles Aggregation：计算指定字段的百分位数。

### 3. Pipeline 聚合

Pipeline 聚合是一种将多个聚合操作串联起来进行计算的聚合方式。它可以支持多层级的数据处理和分析，非常适合复杂数据分析场景下的使用。

## 聚合语法

Elasticsearch 的聚合语法基于 JSON 格式来进行定义和配置。一个聚合语句通常由以下几个部分组成：

- Aggregation Type：聚合类型，包括 Bucket 聚合、Metric 聚合和 Pipeline 聚合。
- Field：聚合的字段。
- Sub-Aggregations：子聚合。
- Options：聚合选项，比如排序、大小限制等。

例如，下面是一个简单的 Term 聚合的聚合语句：

```
{
  "aggs": {
    "category": {
      "terms": {
        "field": "category.keyword"
      }
    }
  }
}
```

该聚合语句将所有文档按照 category.keyword 字段进行分组，并计算每个分组的文档数。

## 动态聚合

动态聚合是 Elasticsearch 聚合技术中的一种，它允许我们根据请求参数动态生成聚合语句，并将其应用于搜索结果，以实现多维度、多条件的数据分析和展示。相比于静态聚合，动态聚合更加灵活和可定制化，可以适应不同的业务需求和场景。

动态聚合的实现方式基于 Elasticsearch 提供的查询 DSL，通过使用类似于 Mustache 模板的语法来动态生成聚合语句，然后将其应用于搜索结果。具体来说，动态聚合需要在请求参数中指定聚合类型、聚合字段、聚合选项等信息，然后将这些信息组合成一个聚合模板，通过解析模板和替换参数的方式生成聚合语句，最后将聚合语句应用于搜索结果。

### 示例

假设我们已经创建了一个名为 `product-test` 的商品索引，并且该索引中包含以下四个字段：

- 商品名称（name）
- 商品图片（image）
- 商品价格（price）
- 库存数量（quantity）

我们往索引里面准备一批数据

```
POST /product-test/_bulk
{ "index": { "_id": 1 }}
{ "name": "苹果12 Pro Max", "image": "https://images.com/iphone12promax.jpg", "price": 4000, "quantity": 50 }
{ "index": { "_id": 2 }}
{ "name": "Samsung Galaxy S21 Ultra", "image": "https://images.com/SamsungS21.jpg", "price": 5200, "quantity": 100 }
{ "index": { "_id": 3 }}
{ "name": "苹果14 Mini", "image": "https://images.com/iphone14mini.jpg", "price": 5999, "quantity": 200 }
{ "index": { "_id": 4 }}
{ "name": "苹果14 Pro Max", "image": "https://images.com/iphone12promax.jpg", "price": 8999, "quantity": 250 }
{ "index": { "_id": 5 }}
{ "name": "华为Mate 40 Pro", "image": "https://images.com/HuaweiMate40.jpg", "price": 5999, "quantity": 50 }
{ "index": { "_id": 6 }}
{ "name": "小米14", "image": "https://images.com/xiaomi14.jpg", "price": 5999, "quantity": 50 }
```

我们按照商品价格（price）范围的聚合,执行如下命令

```

POST /product-test/_search
{
  "query": {
    "match_all": {}
  },
  "aggs": {
    "dynamic_aggs": {
      "range": {
        "field": "price",
        "ranges": [
          {
            "from": 0,
            "to": 5000
          },
          {
            "from": 5001,
            "to": 8000
          },
          {
            "from": 8001,
            "to": 12000
          }
        ]
      }
    }
  }
}


```

我们搜索时候将价格分成了三个区间（0~5000、5001~8000、8001~12000），并计算每个区间内的文档数量。

返回结果

![image-20230612173921469](/assets/img/image-20230612173921469.png)

上述查询结果中，我们可以看到聚合操作的结果 `dynamic_aggs`。其中，每个区间的数量存储在 `doc_count` 字段中，表示该区间内有多少文档满足条件。



## 聚合的应用场景

聚合在 Elasticsearch 中具有广泛的应用场景，常见的应用场景包括：

- 数据分析：通过聚合功能进行数据统计和分析，比如按照价格、品牌、销量等各种数据维度进行分类和汇总，从而实现多维度、多条件的数据分析和展示效果。
- 搜索导航：聚合可以根据搜索结果中的关键词或属性值对搜索结果进行分组和聚合，从而实现搜索导航和筛选功能。
- 数据挖掘：聚合可以帮助我们发现数据中的模式和趋势，从而实现更加深入的数据挖掘和分析。
- 业务报表：通过聚合功能可以快速生成业务报表和分析结果，比如销售额、订单量等业务指标的统计和展示。

通过以上介绍，相信大家对 Elasticsearch 聚合的相关知识有了更深入的了解。在实际使用时，我们要根据具体的业务需求和场景来选择合适的聚合方式，并灵活运用动态聚合功能来实现更加精细化和个性化的数据分析和展示效果。
