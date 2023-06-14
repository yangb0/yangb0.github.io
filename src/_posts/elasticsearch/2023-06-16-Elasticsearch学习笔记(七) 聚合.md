---
layout: post
title: ElasticSearch学习笔记(七) 聚合
date: 2023-06-16 
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

- Terms：按照文档中某个字段进行分组，类似于 SQL 中的 group by 语句。
- Range：按照某个范围将文档进行分组，比如按照价格区间分组。
- Date Histogram：按照日期进行分组，比如按照月份或者年份分组。
- Geo Distance：按照地理距离进行分组。
- Filters：按照多个条件进行分组。

### 2. Metric 聚合

Metric 聚合是一种用于计算指标的聚合方式，例如平均值、求和、最大值、最小值以及标准差等。常见的 Metric 聚合包括：

- `avg` 聚合：计算数值型字段的平均值。
- `sum` 聚合：计算数值型字段的总和。
- `max` 聚合：找出数值型字段中的最大值。
- `min` 聚合：找出数值型字段中的最小值。
- `stats` 聚合：计算数值型字段的统计信息，包括平均值、总和、最大值、最小值和样本数等。
- `extended_stats` 聚合：在 `stats` 聚合的基础上，还计算标准差和方差等更详细的统计信息。
- `cardinality` 聚合：计算某个字段中不同值的数量。
- `percentiles` 聚合：计算数值型字段的百分位数（例如中位数、四分位数等）。
- `percentile_ranks` 聚合：计算数值型字段的百分位数排名。这个聚合操作可以用于确定一个值在整个数据集中的排名。
- `value_count` 聚合：计算某个字段非空值的数量。

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

### 示例

假设我们已经创建了一个名为 `product-test` 的商品索引，并且该索引中包含以下四个字段：

- 商品名称（name）
- 品牌(brand)
- 商品图片（image）
- 商品价格（price）
- 库存数量（quantity）

我们往索引里面准备一批数据

```
POST /product-test/_bulk
{ "index": { "_id": 1 }}
{ "name": "苹果12 Pro Max","brand":"apple", "image": "https://images.com/iphone12promax.jpg", "price": 4000, "quantity": 50 }
{ "index": { "_id": 2 }}
{ "name": "Samsung Galaxy S21 Ultra","brand":"三星", "image": "https://images.com/SamsungS21.jpg", "price": 6200, "quantity": 100 }
{ "index": { "_id": 3 }}
{ "name": "苹果14 Mini", "brand":"apple","image": "https://images.com/iphone14mini.jpg", "price": 6999, "quantity": 200 }
{ "index": { "_id": 4 }}
{ "name": "苹果14 Pro Max", "brand":"apple","image": "https://images.com/iphone12promax.jpg", "price": 8999, "quantity": 250 }
{ "index": { "_id": 5 }}
{ "name": "华为Mate 40 Pro", "brand":"华为","image": "https://images.com/HuaweiMate40.jpg", "price": 5999, "quantity": 50 }
{ "index": { "_id": 6 }}
{ "name": "小米14", "brand":"小米","image": "https://images.com/xiaomi14.jpg", "price": 5999, "quantity": 50 }
```

我们使用terms(相当于SQL中的group by语句)将所有数据按照品牌分组,执行一下命令

```
POST /product-test/_search
{
  "aggs": {
    "brand_bucket":{
       "terms": {         
       "field": "brand"    
     }
    }
  }
}
```

- `"aggs"`：表示聚合操作，用于指定需要对哪些字段进行分析。
- `"brand_bucket"`：聚合操作的名称，可以自定义。在这个示例中，我们使用了 `terms` 聚合操作，将文档根据 `brand` 字段进行分组，然后对每个品牌出现的文档数量进行计数。

返回结果

![image-20230613113011178](/assets/img/image-20230613113011178.png)

上述查询结果中，我们可以看到聚合操作的结果 `brand_bucket`，其中 `buckets` 数组内包含了所有的计数信息，包括品牌名称 (`key`) 和出现的文档数量 (`doc_count`)。



## 聚合的应用场景

聚合在 Elasticsearch 中具有广泛的应用场景，常见的应用场景包括：

- 数据分析：通过聚合功能进行数据统计和分析，比如按照价格、品牌、销量等各种数据维度进行分类和汇总，从而实现多维度、多条件的数据分析和展示效果。
- 搜索导航：聚合可以根据搜索结果中的关键词或属性值对搜索结果进行分组和聚合，从而实现搜索导航和筛选功能。
- 数据挖掘：聚合可以帮助我们发现数据中的模式和趋势，从而实现更加深入的数据挖掘和分析。
- 业务报表：通过聚合功能可以快速生成业务报表和分析结果，比如销售额、订单量等业务指标的统计和展示。

通过以上介绍，相信大家对 Elasticsearch 聚合的相关知识有了更深入的了解。在实际使用时，我们要根据具体的业务需求和场景来选择合适的聚合方式，并灵活运用动态聚合功能来实现更加精细化和个性化的数据分析和展示效果。
