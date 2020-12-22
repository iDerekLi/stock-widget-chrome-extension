import axios from "@/utils/axios";
import { getCodeInfo, parseCallback } from "@/utils/index";

const api = {
  /**
   * 获取行情数据
   * @param stockList
   * @returns {Promise<AxiosResponse<any>>}
   */
  getHqData(stockList) {
    return axios({
      baseURL: "http://d.10jqka.com.cn",
      url: "/v2/time/" + stockList.join(",") + "/last.js",
      method: "get",
      headers: {
        referer: "http://d.10jqka.com.cn"
      }
    }).then(res => {
      return JSON.parse(parseCallback(`quotebridge_v2_time_${stockList.join("_")}_last`, res.data));
    });
  },
  /**
   * 获取自选数据
   * @param stockinfo
   * @returns {Promise<AxiosResponse<any>>}
   */
  getMultimarketrealData(stockinfo) {
    const path = getCodeInfo(stockinfo);
    const basicend = "/1968584_13_19_3541450_526792_6_7_8_9_10_2034120_199112_264648";
    return axios({
      baseURL: "http://d.10jqka.com.cn",
      url: "/multimarketreal/" + path + basicend,
      method: "get",
      headers: {
        referer: "http://d.10jqka.com.cn"
      },
      params: {
        callback: "multimarketreal",
        _: Date.now()
      }
    }).then(res => {
      return JSON.parse(parseCallback("multimarketreal", res.data));
    });
  },
  /**
   * 查询股票信息
   * @param keyword
   * @returns {Promise<AxiosResponse<any>>}
   */
  searchStock(keyword = "") {
    return axios({
      baseURL: "http://news.10jqka.com.cn",
      url: `/public/index_keyboard_${keyword}_stocknoxsb,hk,usa_5_jsonp.html`,
      method: "get",
      headers: {
        referer: "http://news.10jqka.com.cn"
      }
    }).then(res => {
      return JSON.parse(parseCallback("jsonp", res.data));
    });
  }
};

/**
 * 同花顺数据中心
 */
export default {
  namespaced: true,
  state: {
    stockKeyMap: {
      "6": "昨收",
      "7": "今开",
      "8": "最高",
      "9": "最低",
      "10": "当前价",
      "13": "成交量(手)",
      "19": "成交额",
      "199112": "涨跌幅",
      "264648": "涨跌",
      "526792": "振幅",
      "1968584": "换手率",
      "2034120": "市盈率",
      "3541450": "市值",
      name: "名称"
    }
  },
  mutations: {},
  actions: {
    /**
     * 获取行情数据
     * @param stockList
     * @returns {Promise<{}>}
     */
    getHqData(store, stockList) {
      return api.getHqData(stockList).then(source => {
        const dataPool = {};

        for (const i in source) {
          const item = source[i];
          const data = item.data.split(";");
          const arr = [];
          for (let j = 0; j < data.length; j++) {
            const dataGroup = data[j].split(",");
            arr.push([j, +dataGroup[1], dataGroup[0]]);
          }
          dataPool[i] = item;
          dataPool[i].data = arr;
        }

        return dataPool;
      });
    },
    /**
     * 获取自选数据
     * @param stockinfo
     * @returns {Promise<AxiosResponse<*>>}
     */
    getMultimarketrealData(store, stockinfo) {
      return api.getMultimarketrealData(stockinfo);
    },
    /**
     * 搜索股票信息
     * @param keyword
     * @returns {Promise<AxiosResponse<*>>}
     */
    searchStock(store, keyword) {
      return api.searchStock(keyword);
    }
  }
};
