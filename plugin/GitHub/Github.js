/*
Loon专用
2024-12-27
*/
let githubPrefix = "https://raw.githubusercontent.com/"
let A_Prefix = "https://fastraw.ixnic.net/" //由FastGit群组成员 @duya1234567 提供，代号A镜像。
let B_Prefix = "https://hub.incept.pw/" // 由FastGit群组成员 @mxe365 提供，代号B镜像。
let C_Prefix = "https://ghgo.xyz/" 
let D_Prefix = "https://ghp.lamchey.xyz/" 

let changeTo = $persistentStore.read("镜像源")

var url = $request.url
var headers = $request.headers
delete headers.host
delete headers.Host

if (!url.startsWith(githubPrefix)) {
    $done({});
    return;
}

if (changeTo == "") {
    headers["host"] = "A镜像"
    url = url.replace(githubPrefix,A_Prefix)
} else if (changeTo == "B镜像") {
    headers["host"] = "hub.incept.pw"
    url = url.replace(githubPrefix,B_Prefix)
} else if (changeTo == "C镜像") {
    headers["host"] = "ghgo.xyz"
    url = C_Prefix + url
} else if (changeTo == "D镜像") {
    headers["host"] = "ghp.lamchey.xyz"
    url = D_Prefix + url
}

$done({url:url,headers:headers})
