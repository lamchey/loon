// 镜像源定义
const mirrorPrefixes = {
  A镜像: "https://fastraw.ixnic.net/", 
  B镜像: "https://hub.incept.pw/",     
  C镜像: "https://ghp.ci/",            
  D镜像: "https://ghp.lamchey.xyz/"    
};

// 默认镜像
const defaultMirror = "A镜像";

// 获取用户选择的镜像源
const selectedMirror = $persistentStore.read("镜像源") || defaultMirror;

// 当前请求 URL 和头部
let url = $request.url;
let headers = $request.headers;

// 删除原有的 Host，防止干扰
delete headers.host;
delete headers.Host;

// 检查是否是目标 URL
const githubPrefix = "https://raw.githubusercontent.com/";
if (!url.startsWith(githubPrefix)) {
  $done({}); // 如果不是 GitHub 原始链接，直接返回
  return;
}

// 获取用户选择的镜像前缀
const mirrorPrefix = mirrorPrefixes[selectedMirror] || mirrorPrefixes[defaultMirror];

// 改写 URL
if (mirrorPrefix.startsWith("https://ghp.")) {
  url = `${mirrorPrefix}${url}`;
} else {
  url = url.replace(githubPrefix, mirrorPrefix);
}

// 设置新的 Host 头
const mirrorHost = new URL(mirrorPrefix).host;
headers["host"] = mirrorHost;

// 返回修改后的请求
$done({ url: url, headers: headers });
