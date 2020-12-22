<template>
  <a-card class="page-widget" size="small" title="股票" :bordered="false">
    <template slot="extra">
      <a-icon v-if="loading" type="loading" />
    </template>
    <HqData :data-source="hqdata"></HqData>
    <ZxList :data-source="zxlist"></ZxList>
    <div class="card-footer">
      <a-button size="small" icon="setting" @click="openIndex" />
      <a-button size="small" icon="github" />
    </div>
  </a-card>
</template>

<script>
import { mapActions } from "vuex";
import { getCodeType, loop } from "@/utils/index";
import HqData from "@/components/hq-data";
import ZxList from "@/components/zx-list";

export default {
  name: "Popup",
  components: {
    HqData,
    ZxList
  },
  data() {
    return {
      hqCode: ["hs_1A0001", "hs_399001", "hs_399006"],
      hqdata: [],
      zxlist: [],
      selfstockinfo: [],
      codeTypeNumArr: { hu: 17, shen: 33, hk: "hk", us: "usa" },
      loading: false
    };
  },
  watch: {
    selfstockinfo() {
      localStorage.setItem("SELF_STOCK_INFO", JSON.stringify(this.selfstockinfo));
    }
  },
  async mounted() {
    const localSelfStockInfo = JSON.parse(localStorage.getItem("SELF_STOCK_INFO"));

    if (Array.isArray(localSelfStockInfo) && localSelfStockInfo.length > 0) {
      this.selfstockinfo = localSelfStockInfo;
    }
    this.reload();
    this.timer = loop(this.reload, 1000 * 6);
  },
  beforeDestroy() {
    this.timer();
  },
  methods: {
    ...mapActions({
      getHqData: "ths/getHqData",
      getMultimarketrealData: "ths/getMultimarketrealData"
    }),
    openIndex() {
      window.open(chrome.extension.getURL("index.html"));
    },
    reload() {
      this.loading = true;
      // 更新行情数据
      if (this.hqCode.length) {
        this.getHqData(this.hqCode).then(source => {
          const hqdata = [];
          this.hqCode.forEach(code => {
            const name = source[code].name;
            const realData = source[code].data;
            const realPre = source[code].pre;
            const price = realData[realData.length - 1][1];

            hqdata.push({
              lastData: {
                pre: realPre,
                price: `${realData[realData.length - 1][1]}`,
                zde: (price - realPre).toFixed(2),
                zdf: (((price - realPre) / realPre) * 100).toFixed(2)
              },
              originData: realData,
              name: name
            });
          });

          this.hqdata = hqdata;
        });
      }

      // 更新自选数据
      if (this.selfstockinfo.length) {
        this.getMultimarketrealData(this.selfstockinfo).then(res => {
          this.loading = false;
          const tabledata = [];
          this.selfstockinfo.forEach(item => {
            const code = item.code;
            const codeType = getCodeType(code);
            const codeTypeNum = this.codeTypeNumArr[codeType];
            const data = res[codeTypeNum][code];

            for (let k in data) {
              const des = data[k];
              if (des == "") {
                data[k] = "--";
              }
            }

            if (data) {
              tabledata.push({
                ...data,
                code,
                codeType,
                codeTypeNum
              });
            }
          });
          this.zxlist = tabledata;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-widget {
  width: 340px;
  max-height: 600px;
  &::v-deep {
    .ant-card-body {
      padding: 0;
    }
  }
}

.result-table {
  margin: 5px;
}

.card-footer {
  min-height: 30px;
  padding: 0 12px;
  font-size: 14px;
}
</style>
