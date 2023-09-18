(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{291:function(e,r,a){"use strict";a.r(r);var t=a(0),n=Object(t.a)({},function(){var e=this,r=e.$createElement,a=e._self._c||r;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"链码的安装及实例化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#链码的安装及实例化","aria-hidden":"true"}},[e._v("#")]),e._v(" 链码的安装及实例化")]),e._v(" "),a("h2",{attrs:{id:"安装链码"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安装链码","aria-hidden":"true"}},[e._v("#")]),e._v(" 安装链码")]),e._v(" "),a("p",[e._v("安装链码使用 install 命令：")]),e._v(" "),a("pre",[a("code",[e._v("#peer chaincode install -n mycc -v 1.0.0 -p github.com/chaincode/zall_serv/go\n")])]),e._v(" "),a("p",[e._v("参数说明：\n-n： 指定要安装的链码的名称\n-v： 指定链码的版本\n-p： 指定要安装的链码的所在路径")]),e._v(" "),a("h2",{attrs:{id:"实例化链码"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#实例化链码","aria-hidden":"true"}},[e._v("#")]),e._v(" 实例化链码")]),e._v(" "),a("p",[e._v("实例化链码使用 instantiate 命令：")]),e._v(" "),a("pre",[a("code",[e._v('   # peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mycc -v 1.0 -c \'{"Args":["init","a", "100", "b","200"]}\' -P "OR (\'Org1MSP.peer\',\'Org2MSP.peer\')"\n')])]),e._v(" "),a("p",[e._v("参数说明:\n-o： 指定Oderer服务节点地址\n--tls： 开启 TLS 验证\n--cafile： 指定 TLS_CA 证书的所在路径\n-n： 指定要实例化的链码名称，必须与安装时指定的链码名称相同\n-v： 指定要实例化的链码的版本号，必须与安装时指定的链码版本号相同\n-C： 指定通道名称\n-c： 实例化链码时指定的参数\n-P： 指定背书策略\n实例化完成后，用户即可向网络中发起交易。")]),e._v(" "),a("h1",{attrs:{id:"链码的使用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#链码的使用","aria-hidden":"true"}},[e._v("#")]),e._v(" 链码的使用")]),e._v(" "),a("h2",{attrs:{id:"查询链码"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#查询链码","aria-hidden":"true"}},[e._v("#")]),e._v(" 查询链码")]),e._v(" "),a("p",[e._v("查询链码使用 query 命令实现：")]),e._v(" "),a("pre",[a("code",[e._v('# peer chaincode query -C $CHANNEL_NAME -n mycc -c \'{"Args":["query","a"]}\'\n')])]),e._v(" "),a("p",[e._v("参数说明：\n-n： 指定要调用的链码名称\n-C： 指定通道名称\n-c 指定调用链码时所需要的参数")]),e._v(" "),a("h2",{attrs:{id:"调用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#调用","aria-hidden":"true"}},[e._v("#")]),e._v(" 调用")]),e._v(" "),a("p",[e._v("调用链码使用 invoke 命令实现：")]),e._v(" "),a("pre",[a("code",[e._v('    # peer chaincode invoke -o orderer.example.com:7050  --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem  -C $CHANNEL_NAME -n mycc -c \'{"Args":["invoke","a","b","10"]}\'\n')])]),e._v(" "),a("p",[e._v("参数说明：")]),e._v(" "),a("p",[e._v("-o： 指定orderer节点地址\n--tls： 开启TLS验证\n--cafile： 指定TLS_CA证书路径\n-n: 指定链码名称\n-C： 指定通道名称\n-c： 指定调用链码的所需参数")])])},[],!1,null,null,null);r.default=n.exports}}]);