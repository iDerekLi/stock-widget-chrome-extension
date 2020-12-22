import axios from "axios";

// https://developer.chrome.com/docs/extensions/reference/webRequest/#life-cycle-of-requests
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const requestHeaders = details.requestHeaders;
    const extraHeadersIndex = requestHeaders.findIndex(header => header.name === "extraHeaders");

    if (extraHeadersIndex !== -1) {
      const extraHeaders = JSON.parse(requestHeaders.splice(extraHeadersIndex, 1)[0].value);

      for (const Key in extraHeaders) {
        requestHeaders.push({
          name: Key,
          value: extraHeaders[Key]
        });
      }
    }

    return {
      requestHeaders: requestHeaders
    };
  },
  {
    urls: ["<all_urls>"]
  },
  ["blocking", "requestHeaders", "extraHeaders"]
);

const extraHeaderKeys = ["referer", "cookie"];

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    const headers = config.headers;
    const extraHeaders = {};
    let extra = false;
    for (const key in headers) {
      if (extraHeaderKeys.includes(key)) {
        extra = true;
        extraHeaders[key] = headers[key];
        delete headers[key];
      }
    }
    if (extra) {
      headers.extraHeaders = JSON.stringify(extraHeaders);
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

export default axios;
