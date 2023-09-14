---
layout: post
title: elasticsearch搜索建议详解
date: 2023-07-06 
category: elasticsearch
tags:
  - ElasticSearch 
---
Elasticsearch搜索建议功能是一种自动补全和建议相关搜索词的功能，它通过分析已有的搜索关键词和文档内容，提供用户可能感兴趣的搜索建议。下面是关于Elasticsearch搜索建议功能的详细说明：

概念： 搜索建议（Search Suggest）是Elasticsearch提供的一种搜索提示功能，它能够通过分析文档和用户的搜索历史，提供相关的搜索建议给用户。搜索建议可以分为两种类型：补全建议（Completion Suggester）和短语建议（Phrase Suggester）。补全建议用于自动补全用户的输入，短语建议用于提供与用户输入相关的短语或句子。

用途：

1. 提升用户体验：搜索建议可以帮助用户快速找到他们想要的内容，提升搜索的准确性和效率。
2. 提供相关搜索词：搜索建议可以根据用户的搜索历史和文档内容，提供与用户输入相关的搜索建议，帮助用户发现新的搜索词。

使用场景： 搜索建议功能在各种应用中都有广泛的应用场景，例如电子商务网站的搜索提示、新闻网站的关键词建议、搜索引擎的搜索建议等。

完整示例：

1. 创建索引： 首先，我们需要创建一个索引，并定义一个字段用于存储搜索建议的数据。例如，我们创建一个名为"products"的索引，其中包含一个名为"suggest"的字段，用于存储搜索建议的数据。

```
PUT /products 
{ "mappings": { "properties": { "suggest": { "type": "completion" } } } }
```



1. 添加文档： 接下来，我们添加一些文档到索引中，并为每个文档的"suggest"字段提供搜索建议的数据。

PUT /products/_doc/1 { "name": "iPhone 12", "suggest": { "input": ["iPhone", "Apple iPhone", "iPhone 12"], "weight": 10 } }

PUT /products/_doc/2 { "name": "Samsung Galaxy S21", "suggest": { "input": ["Samsung", "Galaxy", "Samsung Galaxy", "Galaxy S21"], "weight": 8 } }

1. 搜索建议： 现在，我们可以使用搜索建议功能来获取与用户输入相关的搜索建议。

POST /products/_search { "suggest": { "product-suggest": { "prefix": "i", "completion": { "field": "suggest" } } } }

在上面的示例中，我们搜索以"i"开头的搜索建议。Elasticsearch将返回与用户输入相关的搜索建议。

以上就是关于Elasticsearch搜索建议功能的详细说明，包括概念、用途、使用场景和完整示例。通过搜索建议功能，可以提升用户体验，提供相关的搜索词，并在各种应用中有广泛的应用场景。