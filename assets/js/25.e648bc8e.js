(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{302:function(s,e,t){"use strict";t.r(e);var a=t(0),r=Object(a.a)({},function(){var s=this,e=s.$createElement,t=s._self._c||e;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("p",[s._v("前段时间使用了8年的老电脑坏掉正式退役了,购买了新的电脑需要重新搭建本地开发环境。想着需要安装MySQL、Redis、Nginx、MQ、Elasticsearch等等，有时候学习新技术又需要安装其他服务。如果都在本机安装，安装起来会比较麻烦,同时电脑也会变得越来越卡，而且很多学习性的应用，学习一段时间后后面也用不到了，即使卸载后还是会有很多残留的文件需要清理。联想到公司的项目都是使用容器化部署,于是想到了Docker，我们可以将需要的应用以容器化的方式在本地启动，这样需要的时候以Docker启动,不用的时候停掉或者直接删掉也不会留下残留的文件，用起来就方便多了。")]),s._v(" "),t("h1",{attrs:{id:"使用docker好处："}},[t("a",{staticClass:"header-anchor",attrs:{href:"#使用docker好处：","aria-hidden":"true"}},[s._v("#")]),s._v(" 使用Docker好处：")]),s._v(" "),t("ol",[t("li",[s._v("环境隔离：Docker在Windows上可以创建独立的容器，每个容器都有自己的文件系统、运行时环境和依赖项。这意味着你可以将不同的开发环境隔离开来，避免互相干扰和冲突。例如，你可以在同一台Windows机器上同时运行多个容器，每个容器专门用于一个特定的应用程序或服务。")]),s._v(" "),t("li",[s._v("简化配置：通过将应用程序及其依赖项打包到Docker镜像中，你可以快速部署和配置开发环境。无需手动安装软件、配置环境变量等繁琐步骤，只需使用Dockerfile定义所需的环境设置，然后通过Docker命令构建和运行容器即可。")]),s._v(" "),t("li",[s._v("跨平台性：Docker是一种跨平台的容器化技术，可在不同操作系统上运行，包括Windows、Linux和macOS。这意味着你可以在Windows上构建和运行Docker容器，然后将其迁移到其他操作系统上，而无需重新配置和调整开发环境。")]),s._v(" "),t("li",[s._v("快速复制和共享：使用Docker，你可以轻松地复制和共享开发环境。通过将整个应用程序及其依赖项打包为一个Docker镜像，其他开发人员可以简单地拉取该镜像并在其本地环境中运行，无需再次进行配置和安装。")]),s._v(" "),t("li",[s._v("弹性扩展：当需要进行横向扩展时，Docker可以方便地创建多个相同的容器，并使用负载均衡等技术将流量分发到这些容器上。这使得你可以根据需求快速扩展应用程序的容量，以满足用户或业务的增长。")])]),s._v(" "),t("h1",{attrs:{id:"docker安装"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#docker安装","aria-hidden":"true"}},[s._v("#")]),s._v(" Docker安装")]),s._v(" "),t("p",[s._v("由于我使用的是Windows11家庭版的系统，所以我这边只介绍Windows的安装步骤😂")]),s._v(" "),t("h2",{attrs:{id:"_1-准备工作"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-准备工作","aria-hidden":"true"}},[s._v("#")]),s._v(" 1.准备工作")]),s._v(" "),t("p",[s._v("安装WSL")]),s._v(" "),t("ol",[t("li",[t("p",[s._v("用管理员的身份打开Windows PowerShell")]),s._v(" "),t("div",{staticClass:"language-powershell extra-class"},[t("pre",{pre:!0,attrs:{class:"language-powershell"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#启动WSL")]),s._v("\ndism"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exe "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("online "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("enable"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("feature "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("featurename:Microsoft"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("Windows"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("Subsystem"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("Linux "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("all\n"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("norestart\n启动虚拟机功能\ndism"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exe "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("online "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("enable"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("feature "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("featurename:VirtualMachinePlatform "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("all "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("norestart\n")])])]),t("p",[s._v("在这个安装过程中，可能会出现要你重启的情况，按照提示操作即可。")])]),s._v(" "),t("li",[t("p",[s._v("安装WSL")]),s._v(" "),t("p",[s._v("下载"),t("a",{attrs:{href:"https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi",target:"_blank",rel:"noopener noreferrer"}},[s._v("WSL"),t("OutboundLink")],1),s._v("并安装（由于是图形化的,这里就不详细说明安装步骤了）。")])])]),s._v(" "),t("p",[s._v("3.设置默认的WSL版本")]),s._v(" "),t("div",{staticClass:"language-powershell extra-class"},[t("pre",{pre:!0,attrs:{class:"language-powershell"}},[t("code",[s._v("wsl "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("--")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("set")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("default"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("version 2\n")])])]),t("h2",{attrs:{id:"_2-安装docker-desktop"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-安装docker-desktop","aria-hidden":"true"}},[s._v("#")]),s._v(" 2.安装Docker Desktop")]),s._v(" "),t("p",[t("a",{attrs:{href:"https://www.docker.com/",target:"_blank",rel:"noopener noreferrer"}},[s._v("下载Docker Desktop"),t("OutboundLink")],1),s._v(" 并安装（由于是图形化的,这里就不详细说明安装步骤了）。")]),s._v(" "),t("h2",{attrs:{id:"_3-配置镜像源"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-配置镜像源","aria-hidden":"true"}},[s._v("#")]),s._v(" 3.配置镜像源")]),s._v(" "),t("p",[s._v("设置国内镜像源（这里就不解释了，你懂的🤫）")]),s._v(" "),t("p",[s._v("点击「设置」按钮，在左侧选择「Docker Engine」，在右侧配置框中添加如下配置：")]),s._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[s._v("  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"registry-mirrors"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"https://docker.mirrors.ustc.edu.cn"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"https://cr.console.aliyun.com/"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"https://registry.docker-cn.com"')]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])])]),t("p",[t("img",{attrs:{src:"/assets/img/1694596073342.jpg",alt:"1694596073342.jpg"}})]),s._v(" "),t("h1",{attrs:{id:"运行服务"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#运行服务","aria-hidden":"true"}},[s._v("#")]),s._v(" 运行服务")]),s._v(" "),t("p",[s._v("这里以MySQL为例，简单介绍一下使用docker启动服务。")]),s._v(" "),t("p",[s._v("打开Windows PowerShell，输入命令")]),s._v(" "),t("div",{staticClass:"language-shell extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("docker pull mysql:8.0.29\n")])])]),t("p",[s._v("等待下载安装完成即可，大概有400多M,可能需要下载几分钟。")]),s._v(" "),t("p",[s._v("下载完成后，输入如下命令查看")]),s._v(" "),t("div",{staticClass:"language-shell extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("docker images\n")])])]),t("p",[t("img",{attrs:{src:"/assets/img/1694597717557.jpg",alt:"1694597717557.jpg"}})]),s._v(" "),t("p",[s._v("接着我们就可以通过docker启动MySQL服务了，输入如下命令即可")]),s._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("docker run  --name mysql  -d -p 3306:3306  mysql:8.0.29\n")])])]),t("p",[s._v("打开Docker Desktop 可以看到MySQL服务已启动成功")]),s._v(" "),t("p",[t("img",{attrs:{src:"/assets/img/1694597717557.jpg",alt:"1694597717557.jpg"}})]),s._v(" "),t("p",[s._v("当然这样我们只是简单的启动MySQL,如果想将数据持久化，方便后期迁移，我们需要将MySQL的配置及数据文件映射到宿主机中。")]),s._v(" "),t("p",[s._v("在Docker Desktop中将启动的容器删掉,打开Windows PowerShell 使用如下命令启动MySQL。")]),s._v(" "),t("div",{staticClass:"language-shell extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("docker run --restart=always --name mysql --privileged=true -d -p 3306:3306 -v D:\\Docker\\MySQL\\conf\\my.cnf:/etc/mysql/my.cnf -v D:\\Docker\\MySQL\\logs:/logs -v D:\\Docker\\MySQL\\data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0.29\n")])])]),t("p",[s._v("命令解析：")]),s._v(" "),t("p",[s._v("--restart=always: 重启docker时,自动启动MySQL")]),s._v(" "),t("p",[s._v("–privileged=true: 赋予容器操作权限")]),s._v(" "),t("p",[s._v("--name mysql：将容器名定义为mysql")]),s._v(" "),t("p",[s._v("-p 3306:3306 ：将 windows 的 3306 端口映射到该 docker 容器的 3306 端口上（前一个 3306 是 windows的，后一个是 docker 容器的）")]),s._v(" "),t("p",[s._v("【-v】：就是目录挂载的意思，windows无法直接访问 docker 容器中的文件，可以使用该命令将 docker 容器中的文件映射到 windows目录中；")]),s._v(" "),t("p",[s._v("-v D:\\Docker\\MySQL\\conf\\my.cnf:/etc/mysql/my.cnf ：将 docker 容器的配置文件，映射到 windows中的D:\\Docker\\MySQL\\conf\\my.cnf")]),s._v(" "),t("p",[s._v("-v D:\\Docker\\MySQL\\logs:/logs -v D:\\Docker\\MySQL\\data:/var/lib/mysql:  将容器的日志文件和数据文件映射到window中")]),s._v(" "),t("p",[s._v("-e MYSQL_ROOT_PASSWORD=123456：-e 设置 mysql 的参数，此处是设置 mysql root 用户的密码为123456；")]),s._v(" "),t("p",[s._v("MySQL启动好后,我们可以通过Docker Desktop查看启动的容器及日志和一些基本配置等。")]),s._v(" "),t("p",[t("img",{attrs:{src:"/assets/img/image-20230914120556367.png",alt:"image-20230914120556367"}})]),s._v(" "),t("p",[t("img",{attrs:{src:"/assets/img/image-20230914120743473.png",alt:"image-20230914120743473"}})]),s._v(" "),t("p",[s._v("到这里我们就完成了MySQL的启动，我们可以通过客户端连接MySQL进行一些操作了，连接地址127.0.0.1，端口3306，账号root，密码123456")]),s._v(" "),t("p",[s._v("第一次可能比较慢，熟悉了之后就非常快了，比在本地直接安装配置要快的多，而且一些软件安装配置起来非常繁琐，会浪费很多不必要的时间。还有很多开源的应用提供docker版本，掌握了这个方法后，可以很快的安装这些应用来验证和使用，用户体验直接上升一个数量级。")])])},[],!1,null,null,null);e.default=r.exports}}]);