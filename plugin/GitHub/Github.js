// 镜像源定义
const mirrorPrefixes = {
  A镜像: "https://fastraw.ixnic.net/", // 由 @duya1234567 提供
  B镜像: "https://hub.incept.pw/",     // 由 @mxe365 提供
  C镜像: "https://ghp.ci/",
  D镜像: "https://ghp.lamchey.xyz/"
};

// 默认镜像
const defaultMirror = "A镜像";

// 读取用户选择的镜像源
const selectedMirror = $persistentStore.read("镜像源") || defaultMirror;

// 当前请求的 URL 和头部
let url = $request.url;
let headers = $request.headers;

// 删除原有的 Host 头，防止干扰
delete headers.host;
delete headers.Host;

// 检查是否为目标 GitHub URL
const githubPrefix = "https://raw.githubusercontent.com/";
if (!url.startsWith(githubPrefix)) {
  $done({});
  return;
}

// 获取镜像前缀
const mirrorPrefix = mirrorPrefixes[selectedMirror] || mirrorPrefixes[defaultMirror];

// 改写 URL
url = mirrorPrefix.startsWith("https://ghp.") 
  ? `${mirrorPrefix}${url}` // 拼接方式
  : url.replace(githubPrefix, mirrorPrefix); // 替换方式

// 设置新的 Host 头
headers["host"] = new URL(mirrorPrefix).host;

// 返回修改后的请求
$done({ url: url, headers: headers });
