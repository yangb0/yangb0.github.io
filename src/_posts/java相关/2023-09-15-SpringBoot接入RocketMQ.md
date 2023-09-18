---
layout: post
title: SpringBoot接入RocketMQ
date: 2023-09-15 
category: java
tags:
  - SpringBoot RocketMQ 
---


 RocketMQ 是一款开源的分布式消息中间件，用于处理大规模的消息流。本文将介绍如何在 Spring Boot 项目中接入 RocketMQ。

 <!-- more -->

# RocketMQ 简介

RocketMQ 是阿里巴巴开源的一款分布式消息中间件，它具有强大的功能，包括实现发布/订阅模式、消息顺序保障、分布式事务等。RocketMQ 的设计目标是支持大规模消息流，高可靠性，和可伸缩性。

## RocketMQ的优点

1. **稳定**：RocketMQ作为一款成熟、稳定的消息中间件，能够在高并发、大数据量的环境下保证消息的稳定传输和可靠处理。
2. **功能支持**：RocketMQ提供了丰富的功能支持，例如重试、死信机制、位点重置、定时延迟消息、事物消息、主从切换、权限控制等，可以满足不同业务场景的需求。
3. **性能**：RocketMQ具有高吞吐量、低延迟、高并发等特性，能够在短时间内处理大量消息，提高业务处理能力。
4. **系统解耦**：RocketMQ能够实现系统解耦，减少系统间的依赖关系，提高系统的可扩展性和稳定性。
5. **分布式事务**：RocketMQ支持分布式事务，能够保证数据的一致性和可靠性。
6. **监控和报警**：RocketMQ提供了完善的监控和报警机制，方便管理员及时发现和解决系统问题。
7. **开源社区**：RocketMQ是一个开源项目，拥有活跃的社区支持和广泛的用户群体，可以在社区中获取大量的经验和解决方案。

此外，RocketMQ的高吞吐率、顺序消息、延时消息、消息堆积、消息回溯等特性也使其在某些场景下表现优异，因此被广泛使用。

# Spring Boot 接入 RocketMQ

## 添加依赖

在你的 Spring Boot 项目中，首先需要将 RocketMQ 的依赖添加到你的 `pom.xml` 文件中。

```xml
<dependencies>  
    <dependency>  
        <groupId>org.apache.rocketmq</groupId>  
        <artifactId>rocketmq-spring-boot-starter</artifactId>  
        <version>2.2.3</version>  
    </dependency>  
</dependencies>
```

## 配置 RocketMQ

在 `application.yml` 文件中，添加 RocketMQ 的配置。以下是一个示例：

```yml
rocketmq:  
  name-server: 127.0.0.1:9876  
  producer:  
    group: my-producer-group
```

在此配置中，`name-server` 是 RocketMQ 的名称服务器地址，而 `producer.group` 是生产者组名。这些值需要根据你的实际环境进行更改。

## 生产者

创建一个 Java 类来作为消息的生产者。在此类中，注入 `RocketMQTemplate`，然后使用该模板来发送消息。以下是一个示例：

```java
import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Slf4j
@Component
public class MessageProducer {
    @Resource
    private RocketMQTemplate rocketMQTemplate;

    /**
     * 发送消息
     * @param topic 主题
     * @param message  消息体
     * @param <T>
     */
    public <T> void send(String topic,T message) {
        rocketMQTemplate.convertAndSend(topic, message);
    }
}
```

使用生产者发送消息

现在你可以在任何需要的地方使用 `MyProducer` 类来发送消息。例如，在一个服务类中：

```java
@Service  
public class MyService {  
    @Autowired  
    private MessageProducer messageProducer;  
      
    public void doSomething() {  
        // ... do some work ...  
        producer.send("my-topic", "my-message");  
    }  
}
```

## 消费者

创建消息的消费者，只需要实现`RocketMQListener`接口中的方法即可，代码如下：

```java
@Slf4j
@Component
@RocketMQMessageListener(topic = "my-topic", consumerGroup = "consumer-group")
public class NormalMsgConsumer implements RocketMQListener<String> {
    @Override
    public void onMessage(String message) {
        log.info("Receive message: {}",message);
    }
}
```

`@RocketMQMessageListener`注解用在消费者类上，指定当前类消费的主题。

> - `topic`：指定消费者的主题
> - `comsumerGroup`：指定消费者组（Consumer Group）名称，用于区分不同的消费者。