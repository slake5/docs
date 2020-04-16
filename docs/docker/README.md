# Docker 环境配置

## 安装docker

```sh
# 1，更新系统
$ sudo apt-get update

# 2，安装docker
$ sudo apt-get install docker-ce

$ sudo usermod -aG docker $USER
```

## 使用docker国内镜像

```sh
$ vi /etc/docker/daemon.json

{
  "registry-mirrors": ["https://registry.docker-cn.com"] 
}

# or
# http://hub-mirror.c.163.com

// 重启docker
$ systemctl daemon-reload 
$ systemctl restart docker
```

## 更新docker

```sh
# 1，卸载旧版本docker
# 全新安装时，无需执行该步骤
$ sudo apt-get remove docker docker-engine docker.io

# 2，更新系统软件
$ sudo apt-get update

# 3，安装依赖包
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

# 4，添加官方密钥
# 执行该命令时，如遇到长时间没有响应说明网络连接不到docker网站，需要使用代-理进行。
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 显示OK,表示添加成功.
# 5，向 source.list 中添加 Docker 软件源
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# 6，再次更新软件
# 这一步不能够省略，我们需要再次把软件更新到最新，否则下一步有可能会报错。
$ sudo apt-get update

# 7，安装docker
# 如果想指定安装某一版本，可使用 sudo apt-get install docker-ce=<VERSION>
# 以下命令没有指定版本，默认就会安装最新版
$ sudo apt-get install docker-ce

# 8，查看docker版本
$ docker -v

# 9、如果没启动，用以下命令启动docker
$ sudo service docker start
#$ sudo systemctl enable docker
#$ sudo systemctl start docker
```

## // 安装docker-compose

```sh
# 1，下载docker-compose
$ sudo curl -L https://github.com/docker/compose/releases/download/1.17.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

# 2，授权
$ sudo chmod +x /usr/local/bin/docker-compose

# 3，查看版本信息
$ docker-compose --version

```

## 查看docker的image信息

```sh
# 查看image的id
$ docker images
19b316f55e30
# 进入image的存储目录
$ cd /var/lib/docker/image/aufs/imagedb/content/sha256
# 找出image的完整id
$ ll | grep 19b316f55e30
# 查看信息
$ cat 19b316f55e3034d1b9a2409b38ea4c4451cbc3e3d4f753eb7f0ce8d3c25d4ac7
# 用json格式化工具查看
Done
```

## Dockerfile的制作

```shell
$ ll
drwxrwxr-x 2 server server 4096 6月  30 22:48 ./
drwxrwxr-x 3 server server 4096 6月  30 20:10 ../
-rw-rw-r-- 1 server server   88 6月  30 21:36 Dockerfile
-rw-rw-r-- 1 server server   27 6月  30 21:25 .dockerignore
-rw-rw-r-- 1 server server  324 6月  30 21:21 index.js
-rw-rw-r-- 1 server server  263 6月  30 21:23 package.json

$ cat Dockerfile
FROM node
ADD . /app
WORKDIR /app
RUN npm install
EXPOSE 8000
# CMD ['命令', '参数1', ...]
CMD ["npm", "start"]
```

更多详情见另一章 `Dockerfile`

## 查看docker的改动

```shell
$ docker diff web-server
```

## 保存镜像

```shell
# 格式：docker commit [选项] <容器ID或容器名> [<仓库名>[:<标签>]]

$ docker commit \
    --author "chen <chen@chen.com>" \
    --message "修改了网页" \
    webserver \
    nginx:v2

sha256:07e33465974800ce65751acc279adc6ed2dc5ed4e0838f8b86f0c87aa1795214
```

## 格式化输出

使用 `--format='json .xxxxxx'`，注意 `json` 后面有个空格

```shell
$ docker ps
CONTAINER ID        IMAGE                             COMMAND                   CREATED             STATUS                    PORTS                                                          NAMES
e4024b23b366        docs/docker.github.io:docs-base   "/bin/sh -c 'echo \"D…"   11 hours ago        Up 11 minutes             0.0.0.0:32769->80/tcp, 0.0.0.0:32768->4000/tcp                 amazing_swanson

$ docker inspect --format='{{json .NetworkSettings.NetWorks}}' amazing_swanson
{"bridge":{"IPAMConfig":null,"Links":null,"Aliases":null,"NetworkID":"035e799ed112445e0696f6170a77dbbd5b458b76800991b39597e186da9b25aa","EndpointID":"f4661d88be742ae5583aed7f675efb3700e129d4d420b6ab40b8738d9d49e0a8","Gateway":"172.17.0.1","IPAddress":"172.17.0.3","IPPrefixLen":16,"IPv6Gateway":"","GlobalIPv6Address":"","GlobalIPv6PrefixLen":0,"MacAddress":"02:42:ac:11:00:03","DriverOpts":null}}
```









