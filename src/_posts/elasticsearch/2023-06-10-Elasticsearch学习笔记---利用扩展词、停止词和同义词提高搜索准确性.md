---
layout: post
title: ElasticSearch学习笔记(五) 利用扩展词、停止词和同义词提高搜索准确性
date: 2023-06-10 
category: elasticsearch
tags:
  - ElasticSearch 
---

Elasticsearch是一款强大的搜索和分析引擎，具备高效、稳定、可伸缩等特性。但在处理海量数据时，搜索过程可能会遇到性能问题或搜索结果不够准确的情况。为此，针对Elasticsearch搜索结果进行优化就成为了非常关键的任务。在中文搜索的时候我们可以使用合适的扩展词、停止词和同义词来提高搜索的准确性。

扩展词和停止词我们都可以在ik分词的插件目录中配置

- 修改IKAnalyzer.cfg.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
    <comment>IK Analyzer 扩展配置</comment>
    <!--用户可以在这里配置自己的扩展字典 -->
    <entry key="ext_dict">ext_main.dic</entry>
     <!--用户可以在这里配置自己的扩展停止词字典-->
    <entry key="ext_stopwords">stopword.dic</entry>
    <!--用户可以在这里配置远程扩展字典 -->
    <!-- <entry key="remote_ext_dict">words_location</entry> -->
    <!--用户可以在这里配置远程扩展停止词字典-->
    <!-- <entry key="remote_ext_stopwords">words_location</entry> -->
</properties>
```

修改本地配置，每一次修改都需要重启Elasticsearch服务才会生效。我们也可以配置成远程的自定义词库，或者使用数据库加载的方式来通过一些代码实现热更新。

## 扩展词

扩展词是指在分词时添加一些额外的词语，例如特定的品牌名称、产品型号或关键字等。对于这些具有特殊含义的词语，如果不将它们作为单独的分词处理，则可能会导致搜索结果的误差或缺失。通过将这些词语添加到ik分词器的扩展词典中，可以优化分词效果，提高搜索结果的可靠性。

如修改ext_main.dic文件添加如下内容

```
苹果
三星
红米
```



## 停止词

停止词是指在搜索过程中应该被忽略的常见词语，例如“的”、“是”、“一”等。由于这些词语出现频率较高但没有实际意义，如果将其纳入搜索范围，则会增加搜索时间和成本，而且可能会干扰搜索结果的准确性。因此，将这些词语添加到ik分词器的停止词词典中，可以减少搜索时间和成本，提高搜索结果的可靠性。

如修改stopword.dic文件添加如下内容

```
的
是
一
```

在这个设置中，我们使用了一个名为“stop_filter”的停止词过滤器，并将其添加到了ik分词器的过滤器列表中。在使用查询时，elasticsearch会自动忽略停止词，从而减少搜索时间和成本，并提高搜索结果的可靠性。

## 同义词

同义词是指在语义上和搜索关键词相近或等同的词语。例如，在搜索“手机”时，可能会出现类似“智能手机”、“电话”等同义词词语，如果这些同义词没有被正确处理，则可能导致搜索结果的误差或缺失。通过添加同义词过滤器，可以将文本中的同义词统一替换为一个主要关键词，从而优化搜索效果。

具体操作如下：

- 在elasticsearch的安装目录下创建一个名为“analysis”的目录，用于存放同义词文件。
- 创建一个名为synonyms.txt的文件，并将需要添加的同义词添加到文件中，例如：

```
手机,电话
苹果,iphone
```

- 将同义词文件路径添加到ik分词器设置中：

```
{
  "index": {
    "analysis": {
      "analyzer": {
        "ik_syno_analyzer": {
          "tokenizer": "ik_max_word",
          "filter": [
            "synonym_filter",
            "stop_filter",
            "ext_words_filter"
          ]
        }
      },
      "filter": {
        "synonym_filter": {
          "type": "synonym",
          "synonyms_path": "analysis/synonyms.txt"
        }
      }
    }
  }
}
```

在这个设置中，我们使用了一个名为“synonym_filter”的同义词过滤器，并将其添加到了ik分词器的过滤器列表中。在使用查询时，elasticsearch会自动将同义词替换为主要关键词，从而统一搜索语义，提高搜索结果的准确性和召回率。

除了上述三种技术之外，还有许多其他的搜索优化手段，如缓存、索引结构优化、查询优化等。在实际应用中，需要综合考虑各种因素，选择合适的工具和技术手段，以提高搜索效率和准确性。

总之，利用扩展词、停止词和同义词可以有效地优化Elasticsearch搜索结果。在实际应用中，需要根据具体业务需求进行调整和优化，以提高搜索效率和准确性。
