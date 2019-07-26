---
layout: post
title: fabric链码的使用
date: 2019-07-26 
category: fabric
tags:
  - fabric
  - 区块链
  

---

# 链码的安装及实例化

## 安装链码
   
   安装链码使用 install 命令：

    #peer chaincode install -n mycc -v 1.0.0 -p github.com/chaincode/zall_serv/go

  参数说明：
    -n： 指定要安装的链码的名称
    -v： 指定链码的版本
    -p： 指定要安装的链码的所在路径
    
## 实例化链码

   实例化链码使用 instantiate 命令：

       # peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mycc -v 1.0 -c '{"Args":["init","a", "100", "b","200"]}' -P "OR ('Org1MSP.peer','Org2MSP.peer')"

  参数说明:
  -o： 指定Oderer服务节点地址
  --tls： 开启 TLS 验证
  --cafile： 指定 TLS_CA 证书的所在路径
  -n： 指定要实例化的链码名称，必须与安装时指定的链码名称相同
  -v： 指定要实例化的链码的版本号，必须与安装时指定的链码版本号相同
  -C： 指定通道名称
  -c： 实例化链码时指定的参数
  -P： 指定背书策略
  实例化完成后，用户即可向网络中发起交易。
  
  
# 链码的使用
    
## 查询链码

 查询链码使用 query 命令实现：

    # peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["query","a"]}'
 
 参数说明：
 -n： 指定要调用的链码名称
 -C： 指定通道名称
 -c 指定调用链码时所需要的参数
 

## 调用

 调用链码使用 invoke 命令实现：

        # peer chaincode invoke -o orderer.example.com:7050  --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem  -C $CHANNEL_NAME -n mycc -c '{"Args":["invoke","a","b","10"]}'
 参数说明：
 
 -o： 指定orderer节点地址
 --tls： 开启TLS验证
 --cafile： 指定TLS_CA证书路径
 -n: 指定链码名称
 -C： 指定通道名称
 -c： 指定调用链码的所需参数