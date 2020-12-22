// 获取股票类型
export function getCodeType(item) {
  var reg = /^\d+$/;
  var flag = reg.test(item);
  if (flag && item.length == 6) {
    var n1 = item.substring(0, 1);
    return n1 == 6 ? "hu" : "shen";
  } else {
    var n2 = item.substring(0, 2);
    return n2 == "HK" ? "hk" : "us";
  }
}

//获取股票代码信息
export function getCodeInfo(item) {
  const arrs = { hu: "", shen: "", hk: "", us: "" };
  const numArr = { hu: 17, shen: 33, hk: "hk", us: "usa" };
  let m_url = "";
  let s_url = "";
  for (let i = 0; i < item.length; i++) {
    const cur = item[i].code;
    const type = getCodeType(cur);
    // let flag = false;
    for (const k in arrs) {
      if (type == k) {
        // flag = true;
        const val = arrs[k];
        val.length == 0 ? (arrs[k] += cur) : (arrs[k] = arrs[k] + "_" + cur);
      }
    }
  }
  for (var j in arrs) {
    const cur = arrs[j];
    if (cur.length > 0) {
      const head = numArr[j];
      m_url.length == 0 ? (m_url += head) : (m_url = m_url + "," + head);
      s_url.length == 0 ? (s_url += cur) : (s_url = s_url + "," + cur);
    }
  }
  return m_url + "/" + s_url;
}

export function parseCallback(callbackName, text) {
  const callbackReg = new RegExp(`${callbackName}\\(([\\s\\S]*)\\)`);
  const result = text.replace(callbackReg, "$1").trim();
  return result;
}

export function pieNum(e) {
  if ("--" == e) return e;
  var t = parseFloat(e);
  return (t =
    1e4 <= t && t < 1e8
      ? (t /= 1e4).toFixed(2) + "万"
      : 1e8 <= t && t < 1e12
      ? (t /= 1e8).toFixed(2) + "亿"
      : 1e12 <= t
      ? (t = t / 1e8 / 1e4).toFixed(2) + "万亿"
      : t.toFixed(2));
}

export function loop(fn, timeout) {
  let startTime = +new Date();
  let timer = null;

  const startSetInterval = interval => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      startTime += timeout;
      const endTime = +new Date();
      const deviation = endTime - startTime;

      const resolve = fn(endTime);

      if (resolve instanceof Promise) {
        resolve.then(() => {
          if (timer) {
            startSetInterval(timeout - deviation);
          }
        });
      } else {
        if (timer) {
          startSetInterval(timeout - deviation);
        }
      }
    }, interval);
  };

  const stopSetInterval = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    return 1;
  };

  startSetInterval(timeout);

  return stopSetInterval;
}
