# MockLoveProxy

>基于AnyProxy的rule功能，在代理的后端增加一层mock。可以方便的配置某些接口的mock、可以依据场景切换mock。

## 功能
- 1、部分接口mock,
>根据url的path和mock文件名进行匹配，匹配成功则mock，匹配不成功则继续走url

- 2、支持多场景切换
>某些时候我们需要修改一个接口的返回值来测试不同的分支流程，每次抓包打断点改值很不方便，使用本脚本可以添加多个场景文件夹，场景文件夹内放置不同值的mock文件，在sceneConfig.json里修改使用何种场景即可。
mock查找顺序是先找场景文件夹再找default文件夹，优先使用场景文件夹。详细参加demo

- 3、mock 文件支持注释
>mock 文件支持注释，全部注释则不走mock，



## 安装
- 1、 安装[AnyProxy](https://github.com/alibaba/anyproxy)，需自行官网或百度
- 2、启动AnyProxy
```bash
#进入该工程目录下
anyproxy -i --rule rule.js
```
- 3、手机配置代理到AnyProxy或者Charles配置外部代理到AnyProxy

## Todo
目前的mock是本地文件版，可以满足大部分需求，后续可以改为mock服务器，可以扩展更多功能，如支持多用户（多AnyProxy端口）、支持接口历史记录（可以查看一个接口最近的成功失败记录并一键转为mock文件）