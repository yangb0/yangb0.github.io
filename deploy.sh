#!/usr/bin/env sh

# 终止一个错误
set -e

#删除dist目录
rm -rf dist

#提交
git add -A
git commit -m 'init'

#push到github
echo "=======================push代码到github======================="
git push

#push到gitee
echo "=======================push代码到gitee======================="
git push gitee
# 构建
echo "=======================开始构建静态文件======================="
yarn
yarn build


# 进入生成的构建文件夹
cd ./dist

# 将静态文件提交
git init
git add -A
git commit -m 'deploy'

# 静态文件push到github
echo "=======================push静态文件到github======================="
git push -f git@github.com:yangb0/yangb0.github.io.git master

# 静态文件push到gitee
echo "=======================push静态文件到gitee======================="
git push -f git@gitee.com:dsnk/dsnk.git master
