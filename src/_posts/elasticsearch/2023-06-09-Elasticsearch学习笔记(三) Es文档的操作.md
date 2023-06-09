---
layout: post
title: ElasticSearch学习笔记(三) Es文档基础操作
date: 2023-06-09 
category: elasticsearch
tags:
  - ElasticSearch 
---

​	前面了解了Elasticsearch的安装及索引的基本操作。今天我们开始了解Elasticsearch文档的一些基础操作。

## 什么是文档

在Elasticsearch中，文档是索引的基本单位。一个文档代表了一个JSON对象，它包含了一个或多个字段，每个字段有一个字段名和一个字段值。一个索引可以包含多个文档，每个文档都有一个唯一的ID。

## 获取文档

要获取文档数据，需要向Elasticsearch发送一个HTTP请求，请求方法为`GET`，

请求路径为`/{index}/_search`，其中`index`表示索引名称。不添加任何参数执行该请求后，默认会返回10条该索引下的文档数据。

也可以通过query指定查询条件，通过from 和size字段来指定分页条件。例如：以下请求可以获取name为手机的商品数据，从第0个开始，取前10个。

```
GET /product-test/_search
{
  "from":0,
  "size":10,
  "query":{
    "match": {
      "name": "XX"
    }
  }
}
```

## 创建文档

要创建一个文档，需要向Elasticsearch发送一个HTTP请求，请求方法为`POST`，请求路径为`/{index}/_doc`，其中`index`表示索引名称。请求体为一个JSON对象，代表了要创建的文档内容。例如，以下请求可以创建一个商品文档：

```
POST /product-test/_doc
{
  "name": "手机",
  "image": "http://example.com/1.jpg",
  "price": 1999,
  "quantity": 100
}
```

执行该请求后，Elasticsearch会返回一个JSON对象，包含了创建的文档的相关信息，例如文档的版本号、是否创建成功，同时会返回该文档的"_id"(如下图)。

![image-20230609105029445](/assets/img/image-20230609105029445.png)

在Elasticsearch中，每个文档都有一个唯一的标识符，称为"_id"，它用于标识和引用文档。 "_id"是文档的一部分，它可以在创建文档时指定，也可以由Elasticsearch自动生成。

当使用索引API将文档添加到索引中时，可以提供一个"_id"值，如果未提供，则Elasticsearch会自动生成一个"_id"值。 文档的"_id"一旦被分配，就不能更改。

要查找或更新文档，必须知道文档的"_id"。 可以使用GET API通过"_id"检索特定文档，也可以使用UPDATE API更新具有特定"_id"的文档。

如果我们想创建文档的时候指定"_id"的值,可以通过 PUT  {index}/_doc/{id} 来指定"_id"。

```
PUT /product-test/_doc/1
{
  "name": "电脑",
  "image": "https://image.com/1.jpg",
  "price": 5999.99,
  "quantity": 100
}
```

执行 `GET /product-test/_search` 会返回如下图所示。我们发现name为"电脑"的文档"_id"为我们指定的值。

![image-20230609110306368](/assets/img/image-20230609110306368.png)

## 根据_id获取文档

如果想根据文档"_id"来获取：请求路径为`/{index}/_doc/{id}`，其中`index`表示索引名称，`id`表示文档ID。执行该请求后，Elasticsearch会返回一个JSON对象，包含了要获取的文档的内容。例如，以下请求可以获取ID为`1`的商品文档：

```
GET /product-test/_doc/1
```

执行该请求后，Elasticsearch会返回一个JSON对象，包含了ID为`1`的商品文档的内容。

## 更新文档

要更新一个文档，需要向Elasticsearch发送一个HTTP请求，请求方法为`POST`或`PUT`，请求路径为`/{index}/_doc/{id}`，其中`index`表示索引名称，`id`表示文档ID。请求体为一个JSON对象，代表了要更新的文档内容。例如，以下请求可以将ID为`1`的商品文档的价格更新为`1899`：

```
POST /product-test/_doc/1
{
  "doc": {
    "price": 6888
  }
}
```

执行该请求后，Elasticsearch会返回一个JSON对象，包含了更新的文档的相关信息，例如文档的版本号、是否更新成功等。

## 删除文档

要删除一个文档，需要向Elasticsearch发送一个HTTP请求，请求方法为`DELETE`，请求路径为`/{index}/_doc/{id}`，其中`index`表示索引名称，`id`表示文档ID。执行该请求后，Elasticsearch会删除指定的文档。例如，以下请求可以删除ID为`1`的商品文档：

```
DELETE /product-test/_doc/1
```

执行该请求后，Elasticsearch会返回一个JSON对象，包含了删除的文档的相关信息，例如是否删除成功等。

## 总结

本篇博客介绍了Elasticsearch7的文档基础操作，包括创建文档、更新文档、获取文档和删除文档。在实际使用中，我们可以根据具体需求进行相应的操作，例如搜索、聚合等。熟练掌握这些操作可以帮助我们更好地使用Elasticsearch进行数据分析和搜索。
