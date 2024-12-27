// 镜像源定义
const mirrorPrefixes = {
  A镜像: "https://fastraw.ixnic.net/",  // FastGit 镜像
  B镜像: "https://hub.incept.pw/",      // Hub 镜像
  C镜像: "https://ghp.ci/",             // GHP 镜像
  D镜像: "https://ghp.lamchey.xyz/"     // Lamchey 镜像
};

// GitHub 原始 URL 前缀
const githubPrefix = "https://raw.githubusercontent.com/";

// 获取用户选择的镜像源
const selectedMirror = $persistentStore.read("镜像源") || "A镜像"; // 默认使用 A 镜像

// 当前请求的 URL 和头部
let url = $request.url;
let headers = $request.headers;

// 删除原有的 Host 头，避免干扰
delete headers.host;
delete headers.Host;

// 检查是否是目标 URL
if (!url.startsWith(githubPrefix)) {
  $done({}); // 如果不是 GitHub 原始链接，直接返回
  return;
}

// 获取镜像前缀
const mirrorPrefix = mirrorPrefixes[selectedMirror] || mirrorPrefixes["A镜像"];

// 改写 URL 和 Host 头
if (selectedMirror === "C镜像" || selectedMirror === "D镜像") {
  // 对于 ghp.ci 和 lamchey 镜像，拼接完整 URL
  url = `${mirrorPrefix}${url}`;
} else {
  // 对于其他镜像，直接替换原始前缀
  url = url.replace(githubPrefix, mirrorPrefix);
}

// 设置新的 Host
headers["host"] = new URL(mirrorPrefix).host;

// 返回修改后的请求
$done({ url: url, headers: headers });
