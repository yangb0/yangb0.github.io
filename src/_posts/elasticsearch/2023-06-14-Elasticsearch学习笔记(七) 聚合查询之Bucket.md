---
layout: post
title: ElasticSearch学习笔记(六) 聚合之Bucket详解
date: 2023-06-14 
category: elasticsearch
tags:
  - ElasticSearch 
---

​	

Elasticsearch 聚合（Aggregation）是 Elasticsearch 中用于处理搜索结果的重要工具之一。它可以帮助我们对搜索结果进行各种数据统计和分析，以便更好地理解搜索结果数据的特征和趋势。

当我们需要对 Elasticsearch 中的文档集合进行分组计算时，就需要使用到 Bucket（桶）聚合。Bucket 聚合是 Elasticsearch 中一种基于文档集合进行切分的聚合方式，它将文档集合分成多个 bucket，并对每个 bucket 进行计算和分析。

Bucket 聚合可以按照文档的字段值、时间范围、地理位置等多种方式来进行切分，并提供丰富的聚合操作来计算每个 bucket 的指标。

下面我们使用一个商品索引的数据来演示几种常用的Bucket聚合用法

```
#准备索引及数据
PUT /product-test
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "brand":{
        "type": "keyword"
      },
      "image": {
        "type": "keyword"
      },
      "price": {
        "type": "float"
      },
      "quantity": {
        "type": "integer"
      }
    }
  }
}

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



## terms 聚合

terms 聚合将文档集合按照指定字段的值进行分组。

例如，我们对商品索引中的品牌字段进行 Terms 聚合，得到每个分类下的商品库存总量。

``` json
POST /product-test/_search
{
  "size":0,
  "aggs": {
    "brand_bucket":{
       "terms": {         
       "field": "brand"    
     },
     "aggs":{
       "total_quantity": {
          "sum": {
            "field": "quantity"
          }
        }
     }
    }
  }
}
```

返回结果

``` json
{
  "took" : 59,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 6,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "brand_bucket" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "apple",
          "doc_count" : 3,
          "total_quantity" : {
            "value" : 500.0
          }
        },
        {
          "key" : "三星",
          "doc_count" : 1,
          "total_quantity" : {
            "value" : 100.0
          }
        },
        {
          "key" : "华为",
          "doc_count" : 1,
          "total_quantity" : {
            "value" : 50.0
          }
        },
        {
          "key" : "小米",
          "doc_count" : 1,
          "total_quantity" : {
            "value" : 50.0
          }
        }
      ]
    }
  }
}

```

在结果中，我们可以看到按照品牌字段进行划分，得到了4个品牌的聚合结果，同时将每个品牌的库存总量一起返回了出来。

## range 聚合

range 聚合将文档集合按照指定范围进行分组。

例如，我们可以使用下面的查询语句将商品索引中所有文档按照指定价格分为三个区间，并返回每个区间中文档的库存数量的和：

``` json
POST /product-test/_search
{
  "size":0,
  "aggs": {
    "price_range":{
       "range": {         
       "field": "price"  ,
       "ranges": [
          {
            "from":0,
            "to": 5000
          },
          {
            "from": 5001,
            "to": 8000
          },
          {
            "from": 8001
          }
        ]
     },
     "aggs":{
       "total_quantity": {
          "sum": {
            "field": "quantity"
          }
        }
     }
    }
  }
}
```

返回结果

```json
{
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
      "value" : 6,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "price_range" : {
      "buckets" : [
        {
          "key" : "0.0-5000.0",
          "from" : 0.0,
          "to" : 5000.0,
          "doc_count" : 1,
          "total_quantity" : {
            "value" : 50.0
          }
        },
        {
          "key" : "5001.0-8000.0",
          "from" : 5001.0,
          "to" : 8000.0,
          "doc_count" : 4,
          "total_quantity" : {
            "value" : 400.0
          }
        },
        {
          "key" : "8001.0-*",
          "from" : 8001.0,
          "doc_count" : 1,
          "total_quantity" : {
            "value" : 250.0
          }
        }
      ]
    }
  }
}

```

可以看到，按照商品价格指定范围进行划分，得到了三个聚合结果，每个聚合结果表示一个价格区间内的商品数量和库存总和。



## histogram 聚合

histogram 聚合操作会根据指定的某个字段的数值范围对文档集合进行分组。

例如，我们可以使用下面的查询语句将商品索引中所有文档按照价格分组,每个分组的范围为2000：

``` json
POST /product-test/_search
{
  "size":0,
  "aggs": {
    "price_histogram":{
       "histogram": {         
       "field": "price",     
       "interval": 2000     
     }
    }
  }
}
```

返回结果

``` json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 6,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "price_histogram" : {
      "buckets" : [
        {
          "key" : 4000.0,
          "doc_count" : 3
        },
        {
          "key" : 6000.0,
          "doc_count" : 2
        },
        {
          "key" : 8000.0,
          "doc_count" : 1
        }
      ]
    }
  }
}

```

可以看到，按照商品价格区间进行划分，得到了三个聚合结果，每个聚合结果表示一个价格区间内的商品数量。

## ip_range 聚合

ip_range 聚合将文档集合按照 IP 地址范围进行分组。

例如，我们可以使用下面的查询语句将 `ip_address` 索引中所有文档按照 IP 地址的范围分为两个区间，并返回每个区间中文档的数量：

``` json
GET /ip_address/_search
{
  "size": 0,
  "aggs": {
    "ip_ranges": {
      "ip_range": {
        "field": "ip_address",
        "ranges": [
          {
            "from": "10.0.0.0",
            "to": "10.255.255.255"
          },
          {
            "from": "192.168.0.0",
            "to": "192.168.255.255"
          }
        ]
      }
    }
  }
}
```

## geohash_grid 聚合

geohash_grid 聚合将地理坐标转换为 geohash，并按照 geohash 前缀进行分组。

例如，我们可以使用下面的查询语句将 `location` 索引中所有文档按照经纬度进行划分，返回每个 geohash 前缀中文档的数量：

``` json
GET /location/_search
{
  "size": 0,
  "aggs": {
    "locations": {
      "geohash_grid": {
        "field": "coordinates",
        "precision": 5
      }
    }
  }
}
```

## filters 聚合

filters 聚合根据指定条件对文档集合进行分组。

例如，我们可以使用下面的查询语句将商品索引中品牌为'apple' 的数据统计出来并计算库存总和：

``` json
POST /product-test/_search
{
  "size":0,
  "aggs": {
    "brand_filter":{
       "filters": {         
        "filters": {
          "apple":{
            "term": {
              "brand": "apple"
            }
          }
        }    
     },
     "aggs": {
       "total_quantity": {
         "sum": {
           "field": "quantity"
         }
       }
     }
    }
  }
}
```

返回结果

``` json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 6,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "brand_filter" : {
      "buckets" : {
        "apple" : {
          "doc_count" : 3,
          "total_quantity" : {
            "value" : 500.0
          }
        }
      }
    }
  }
}

```



## significant_terms 聚合

significant_terms 聚合用于找出一个文档集合中比其他文档集合更加显著的词语或短语。

例如，我们可以使用下面的查询语句在 `news` 索引中所有文档的 `content` 字段中找出最具有显著性的词语或短语：

``` json
GET /news/_search
{
  "size": 0,
  "aggs": {
    "significant_terms": {
      "significant_terms": {
        "field": "content"
      }
    }
  }
}
```

Bucket 聚合操作还可以通过嵌套方式进行组合使用，以实现更复杂的数据分析和计算。
