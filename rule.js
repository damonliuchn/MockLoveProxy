const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
var filePath = __dirname;
var sceneConfigFilePath = filePath + path.sep + "sceneConfig.json"
var defaultFiles//默认场景
var sceneFiles//选中场景
function walk(dir) {
    var readDirSync = function fun(dir, results) {
        var file = fs.readdirSync(dir);
        file.forEach(function (childPath, index) {
            var info = fs.statSync(dir + path.sep + childPath)
            if (info.isDirectory()) {
                readDirSync(dir + path.sep + childPath, results);
            } else {
                results.push(dir + path.sep + childPath)
            }
        })
    };
    var results = []
    readDirSync(dir, results)
    return results;
}
function deleteCodeComments(code) {
    // http://sodino.com/2016/05/12/js-regexp-delete-code-comments/
    // 将'://'全部替换为特殊字符，删除注释代码后再将其恢复回来
    var regTmp1 = /:\/\//g;
    var tmp1 = '@:@/@/@';
    var regTmp2 = /@:@\/@\/@/g;
    var tmp2 = ':\/\/';
    code = code.replace(regTmp1, tmp1);
    var reg = /(\/\/.*)|(\/\*[\s\S]*?\*\/)/g;//.表示可匹配的字符内容为除了换行符以外的任意一个字符
    code = code.replace(reg, '');
    return code.replace(regTmp2, tmp2);
}
module.exports = {
        summary: 'a rule to hack response',
        * beforeSendRequest(requestDetail)
        {
            //requestDetail.url.indexOf("XXX.com")
			if(true){//这里可以配置过滤域名
                var urlParsed = url.parse(requestDetail.url);
                //获取用户选中场景，如果有改动则重新加载文件夹
                defaultFiles = walk(filePath + path.sep + "default")
                var currentScene = JSON.parse(deleteCodeComments(fs.readFileSync(sceneConfigFilePath).toString())).scene
                sceneFiles = walk(filePath + path.sep + currentScene)

                var mockPath;
                //从默认场景里找
                for (i = 0; i < defaultFiles.length; i++) {
                    var bb = defaultFiles[i].split(path.sep)
                    var fileName = bb[bb.length - 1].replace(/\.json/, "")
                    if (urlParsed.pathname && urlParsed.pathname.endsWith(fileName)) {
                        mockPath = defaultFiles[i]
                        break
                    }
                }
                //从选中场景里找
                for (i = 0; i < sceneFiles.length; i++) {
                    var bb = sceneFiles[i].split(path.sep)
                    var fileName = bb[bb.length - 1].replace(/\.json/, "")
                    if (urlParsed.pathname && urlParsed.pathname.endsWith(fileName)) {
                        mockPath = sceneFiles[i]
                        break
                    }
                }
                if (mockPath) {
                    var data = deleteCodeComments(fs.readFileSync(mockPath).toString())
                    if(/\S/.test(data)){
                        var finalData = {
                            response: {
                                statusCode: 200,
                                header: {'content-type': 'text/html'},
                                body: data
                            }
                        }
                        return finalData;
                    }
                }
            }
            // if (requestDetail.url === 'http://192.168.10.1:10007/aa.json') {
            //     return new Promise((resolve, reject) = > {
            //             http.get('http://192.168.10.1:10007/aa.json', function (req, res) {
            //                 var html = '';
            //                 req.on('data', function (data) {
            //                     html += data;
            //                 });
            //                 req.on('end', function () {
            //                     console.info(html);
            //                     var finalData = {
            //                         response: {
            //                             statusCode: 200,
            //                             header: {'content-type': 'text/html'},
            //                             body: html
            //                         }
            //                     }
            //                     resolve(finalData);
            //                 })
            //             });
            //     })//end return
            // }//end if
        }
}