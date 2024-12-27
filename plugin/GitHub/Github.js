/*
Loon专用
2024-12-27
*/
let rawGithubPrefix = "https://raw.githubusercontent.com/"

// 镜像源定义
let APrefix = "https://ghp.ci/" // 代号A镜像
let BPrefix = "https://ghp.lamchey.xyz/" // 由 @lamchey 提供，代号B镜像

// 获取用户选择的镜像源
let changeTo = $persistentStore.read("镜像源")

var url = $request.url
var headers = $request.headers

// 删除原有的 host，避免干扰
delete headers.host
delete headers.Host

// 检查是否为 GitHub raw URL
 if (url.startsWith(rawGithubPrefix)) {
    if (changeTo == "") {
        headers["host"] = new URL(APrefix).host
        url = APrefix + url // 拼接前缀
    } else if (changeTo == "A镜像") {
        headers["host"] = new URL(APrefix).host
        url = APrefix + url
    }else if (changeTo == "B镜像") {
        headers["host"] = new URL(BPrefix).host
        url = BPrefix + url
    }
  
} 

// 返回修改后的 URL 和 headers
$done({url: url, headers: headers});
