// 镜像源定义
const mirrorPrefixes = {
  A镜像: "https://ghp.ci/",
  B镜像: "https://ghp.lamchey.xyz/"
};

// 读取用户选择的镜像源
const selectedMirror = $persistentStore.read("镜像源") || "A镜像"; // 默认使用 A 镜像

// 当前请求的 URL
let url = $request.url;

// 获取镜像前缀
const mirrorPrefix = mirrorPrefixes[selectedMirror] || mirrorPrefixes["A镜像"];

// 检查并重写 URL
if (mirrorPrefix) {
  url = `${mirrorPrefix}${url}`;
}

// 删除原有的 Host 头，防止干扰
let headers = $request.headers;
delete headers.host;
delete headers.Host;

// 设置新的 Host 头
headers["host"] = new URL(mirrorPrefix).host;

// 返回修改后的请求
$done({ url: url, headers: headers });
