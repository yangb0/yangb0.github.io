---
layout: post
title: ElasticSearch学习笔记(四) IK分词
date: 2023-06-10 
category: elasticsearch
tags:
  - ElasticSearch 
---

​	前面了解了Elasticsearch中对索引及文档的基本操作。今天了解Es中非常重要的一个概念:分词。在 Elasticsearch  中，中文分词的首选分词器是 ik 分词器。在本文中，我们将介绍如何使用 ik 分词器将商品名称（name）字段进行分词，并详细介绍分词过程及结果等。

## 一、ik分词简介

ik分词是一个中文分词器，是基于lucene开发的开源项目，可以通过Elasticsearch的插件方式集成到Elasticsearch中。相对于其他分词器，ik分词的特点在于：

1. 更加细致的切分能力
2. 支持自定义词典
3. 支持拼音转换
4. 支持多种分词模式

由于ik分词具有良好的中文分词效果，因此在Elasticsearch中使用ik分词插件进行搜索的应用非常广泛。

## 二、安装 ik 分词器插件

首先，我们需要安装 ik 分词器插件。进入github中ik分词器的源码地址里下载，https://github.com/medcl/elasticsearch-analysis-ik。我们需要根据Es的版本下载对应的分词包。这里我们下载的是v7.11.2：

![image-20230609114242346](/assets/img/image-20230609114242346.png)

由于前面我们使用Docker安装Elasticsearch时已经将Es的plugins目录映射出来了，这里我们只需要将分词包放到映射出来的plugins目录中，重启 Elasticsearch即可生效。



## 三、使用介绍

### 1.分词模式介绍

ik分词器有两种分词模式：ik_max_word和ik_smart模式。

- "ik_smart"：是一种比较快速的分词算法，它会尽可能地将文本切分成一个个意义明确的词语。但是可能会出现一些有歧义的结果。
- "ik_max_word"：是一种更加细致、准确的分词算法，它不仅会将文本切分成一个个意义明确的词语，还会考虑到词语之间的关联性，以保证最大化整体语义的准确性。但是“ik_max_word”分词算法相比于“ik_smart”分词算法在效率上有所降低。

因此，如果你对分词效率有要求，并且可以容忍一定的歧义性结果，可以选择使用“ik_smart”分词算法；如果你更注重分词的准确性，可以选择使用“ik_max_word”分词算法。

<p style="color: red;">最佳实践：两种分词器使用的最佳实践是：索引时用ik_max_word，在搜索时用ik_smart。即：索引时最大化的将文章内容分词，搜索时更精确的搜索到想要的结果。</p>

### 2.使用示例

在创建商品索引product-test时，需要在商品名称字段上指定使用ik分词器。具体做法如下：

```
PUT /product-test
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "ik_max_word"
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
```

在上述代码中，我们使用了ik_max_word分词器来对商品名称进行分词处理。为了验证商品名称已经正确地使用了ik_max_word分词器进行了分词处理，我们可以通过以下命令获取商品名称字段的分词结果：

```
POST /product-test/_analyze
{
  "analyzer": "ik_max_word",
  "text": "苹果手机 XR 64G"
}
```

执行上述命令后，我们可以得到如下的分词结果：

```
{
  "tokens" : [
    {
      "token" : "苹果",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "CN_WORD",
      "position" : 0
    },
    {
      "token" : "苹",
      "start_offset" : 0,
      "end_offset" : 1,
      "type" : "CN_WORD",
      "position" : 1
    },
    {
      "token" : "果",
      "start_offset" : 1,
      "end_offset" : 2,
      "type" : "CN_WORD",
      "position" : 2
    },
    {
      "token" : "手机",
      "start_offset" : 2,
      "end_offset" : 4,
      "type" : "CN_WORD",
      "position" : 3
    },
    {
      "token" : "手",
      "start_offset" : 2,
      "end_offset" : 3,
      "type" : "CN_WORD",
      "position" : 4
    },
    {
      "token" : "机",
      "start_offset" : 3,
      "end_offset" : 4,
      "type" : "CN_WORD",
      "position" : 5
    },
    {
      "token" : "xr",
      "start_offset" : 5,
      "end_offset" : 7,
      "type" : "ENGLISH",
      "position" : 6
    },
    {
      "token" : "64g",
      "start_offset" : 8,
      "end_offset" : 11,
      "type" : "LETTER",
      "position" : 7
    },
    {
      "token" : "64",
      "start_offset" : 8,
      "end_offset" : 10,
      "type" : "ARABIC",
      "position" : 8
    },
    {
      "token" : "g",
      "start_offset" : 10,
      "end_offset" : 11,
      "type" : "ENGLISH",
      "position" : 9
    }
  ]
}

```

从分词结果可以看出，商品名称被成功地切分成了若干个词汇。

为了演示如何通过分词搜索商品名称，我们往索引中添加一些数据。

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

我们可以使用以下代码来进行搜索：

```
GET /product-test/_search
{
  "query": {
    "match": {
      "name": "苹果"
    }
  }
}
```

执行上述命令后，我们可以得到如下的搜索结果：

```
{
  "took" : 0,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 4.0781574,
    "hits" : [
      {
        "_index" : "product-test",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 4.0781574,
        "_source" : {
          "name" : "苹果14 Mini",
          "image" : "https://images.com/iphone14mini.jpg",
          "price" : 5999,
          "quantity" : 200
        }
      },
      {
        "_index" : "product-test",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 3.761748,
        "_source" : {
          "name" : "苹果12 Pro Max",
          "image" : "https://images.com/iphone12promax.jpg",
          "price" : 4000,
          "quantity" : 50
        }
      },
      {
        "_index" : "product-test",
        "_type" : "_doc",
        "_id" : "4",
        "_score" : 3.761748,
        "_source" : {
          "name" : "苹果14 Pro Max",
          "image" : "https://images.com/iphone12promax.jpg",
          "price" : 8999,
          "quantity" : 250
        }
      }
    ]
  }
}

```

从搜索结果可以看出，通过使用ik_max_word分词器对商品名称进行分词处理后，我们可以轻松地将商品名称包含“苹果”的商品搜索出来。 同样 当我们搜索 “14” 的时候 ，我们会把“小米14”、“苹果14 Mini”、“苹果14 Pro Max”的结果搜索出来。

