// Loon 插件脚本
/*
Loon专用
2024-12-27
支持多种 GitHub URL 类型的镜像改写
*/

// 检查脚本类型是否为 http-request
if (typeof $request === "undefined") {
  console.log("错误：未检测到 $request。请确保脚本类型为 http-request");
  $done({});
}

// 定义镜像地址
const mirrorPrefixes = {
  "A镜像": "https://ghp.lamchey.xyz/",
  "B镜像": "https://ghp.ci/",
  "C镜像": "https://fastraw.ixnic.net/",
  "D镜像": "https://hub.incept.pw/"
};

// 获取用户选择的镜像源，若未选择，则默认为 A 镜像
const selectedMirror = $persistentStore.read("镜像源");
const mirrorPrefix = mirrorPrefixes[selectedMirror] || mirrorPrefixes["A镜像"];

// 定义 GitHub URL 类型的正则表达式列表
const githubRegexList = [
  {
    regex: /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:releases|archive)\/.*$/i
  },
  {
    regex: /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:blob|raw)\/.*$/i
  },
  {
    regex: /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:info|git-).*$/i
  },
  {
    regex: /^(?:https?:\/\/)?raw\.(?:githubusercontent|github)\.com\/.+?\/.+?\/.+?\/.+$/i
  },
  {
    regex: /^(?:https?:\/\/)?gist\.(?:githubusercontent|github)\.com\/.+?\/.+?\/.+$/i
  },
  {
    regex: /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/tags.*$/i
  }
];

// 当前请求的 URL 和请求头
let url = $request.url;
let headers = $request.headers;

// 删除 `host`，确保后续改写正确
delete headers.host;
delete headers.Host;

// 输出原始 URL
console.log("原始 URL:", url);

// 循环检查每种 URL 类型并进行改写
for (let i = 0; i < githubRegexList.length; i++) {
  const { regex } = githubRegexList[i];

  if (regex.test(url)) {
    // 替换 URL，添加镜像前缀
    if (url.startsWith("https://raw.githubusercontent.com/")) {
      url = url.replace("https://raw.githubusercontent.com/", `${mirrorPrefix}https://raw.githubusercontent.com/`);
    } else if (url.startsWith("https://github.com/")) {
      url = url.replace("https://github.com/", `${mirrorPrefix}github.com/`);
    } else {
      // 默认处理其他 URL 类型
      url = url.replace(regex, (match) => {
        return match.replace(/^https?:\/\/(?:raw\.)?github\.com/, mirrorPrefix + "github.com");
      });
    }
    headers["host"] = new URL(mirrorPrefix).host; // 设置新的 host 头
    break; // 找到第一个匹配的 URL 后跳出循环
  }
}

// 输出修改后的 URL
console.log("修改后的 URL:", url);

// 返回修改后的 URL 和请求头
$done({ url: url, headers: headers });
