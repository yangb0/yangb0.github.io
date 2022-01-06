#!/usr/bin/env sh

# 终止一个错误
set -e

#删除dist目录
rm -rf dist

#提交
git add -A
git commit -m 'init'

#push到github
git push

#push到gitee
git push gitee
# 构建
yarn

yarn build


# 进入生成的构建文件夹
cd ./dist

# 如果你是要部署到自定义域名
# echo 'www.example.com' > CNAME
git init
git add -A
git commit -m 'deploy'

# 如果你想要部署到 https://<USERNAME>.github.io
git push -f git@github.com:yangb0/yangb0.github.io.git master
