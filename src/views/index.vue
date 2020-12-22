<template>
  <div class="page">
    <header class="page-header">
      <div class="container ph-container">
        <div class="ph-title">我的自选</div>
        <div class="stock-search">
          <a-select
            show-search
            label-in-value
            :value="selectCode"
            placeholder="添加自选股"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="fetchStock"
            @change="handleChange"
            style="width: 200px"
          >
            <a-icon slot="suffixIcon" type="search" style="color: rgba(0,0,0,.45)" />
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="stock in searchOptions" :key="stock.code">
              {{ stock.code }} {{ stock.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </header>
    <main class="page-main">
      <div class="container">
        <HqData :data-source="hqdata"></HqData>
        <ZxTable
          :data-source="zxlist"
          @delete="onDeleteZx"
          @movetop="onMoveTop"
          @movedown="onMoveDown"
        ></ZxTable>
      </div>
    </main>
  </div>
</template>

<script>
import { debounce } from "lodash";
import { mapActions } from "vuex";
import { getCodeType, loop } from "@/utils/index";
import HqData from "@/components/hq-data";
import ZxTable from "@/components/zx-table";

export default {
  name: "Popup",
  components: {
    HqData,
    ZxTable
  },
  data() {
    return {
      hqCode: ["hs_1A0001", "hs_399001", "hs_399006"],
      hqdata: [],
      zxlist: [],
      selfstockinfo: [],
      codeTypeNumArr: { hu: 17, shen: 33, hk: "hk", us: "usa" },
      selectCode: undefined,
      searchOptions: [],
      fetching: false
    };
  },
  watch: {
    selfstockinfo() {
      localStorage.setItem("SELF_STOCK_INFO", JSON.stringify(this.selfstockinfo));
    }
  },
  created() {
    this.fetchStock = debounce(this.fetchStock, 250, { maxWait: 1000 });
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
      getMultimarketrealData: "ths/getMultimarketrealData",
      searchStock: "ths/searchStock"
    }),
    openIndex() {
      window.open(chrome.extension.getURL("index.html"));
    },
    handleChange(data) {
      Object.assign(this, {
        selectCode: undefined,
        searchOptions: [],
        fetching: false
      });
      const code = data.key;
      if (code && this.selfstockinfo.findIndex(stock => stock.code === code) === -1) {
        this.selfstockinfo.push({ code: code });
        this.reload();
      }
    },
    fetchStock(keyworld) {
      keyworld = keyworld.trim();
      if (keyworld === "" || keyworld === undefined) {
        Object.assign(this, {
          selectCode: undefined,
          searchOptions: [],
          fetching: false
        });
        return;
      }
      this.fetching = true;
      this.searchStock(keyworld).then(async data => {
        const source = data.flat(1);
        const searchOptions = [];
        source.forEach(item => {
          const [type, template] = item.split("||");
          const [code, name, typeName] = template.split(" ");
          searchOptions.push({
            code,
            name,
            type,
            typeName
          });
        });
        this.searchOptions = searchOptions;
        this.fetching = false;
      });
    },
    reload() {
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
          const tabledata = [];
          const deleteCode = [];
          this.selfstockinfo.forEach(item => {
            const code = item.code;
            const codeType = getCodeType(code);
            const codeTypeNum = this.codeTypeNumArr[codeType];

            if (!res[codeTypeNum] || !res[codeTypeNum][code]) {
              deleteCode.push(code);
              return;
            }
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
          // 检索移除数据
          deleteCode.forEach(code => {
            const index = this.selfstockinfo.findIndex(stock => stock.code === code);
            if (index !== -1) {
              this.selfstockinfo.splice(index, 1);
            }
          });
          this.zxlist = tabledata;
        });
      }
    },
    onDeleteZx(stock) {
      const dataSource = [...this.zxlist];
      this.zxlist = dataSource.filter(item => item.code !== stock.code);

      const list = [...this.selfstockinfo];
      this.selfstockinfo = list.filter(item => item.code !== stock.code);
    },
    onMoveTop(stock) {
      const stockinfo = [...this.selfstockinfo];
      const nodeIndex = stockinfo.findIndex(item => item.code === stock.code);
      if (nodeIndex !== -1) {
        stockinfo[nodeIndex] = [stockinfo[nodeIndex], stockinfo[nodeIndex - 1]];
        stockinfo[nodeIndex - 1] = stockinfo[nodeIndex][0];
        stockinfo[nodeIndex] = stockinfo[nodeIndex][1];
        this.selfstockinfo = stockinfo;

        const zxlist = [...this.zxlist];
        zxlist[nodeIndex] = [zxlist[nodeIndex], zxlist[nodeIndex - 1]];
        zxlist[nodeIndex - 1] = zxlist[nodeIndex][0];
        zxlist[nodeIndex] = zxlist[nodeIndex][1];
        this.zxlist = zxlist;
      }
    },
    onMoveDown(stock) {
      const stockinfo = [...this.selfstockinfo];
      const nodeIndex = stockinfo.findIndex(item => item.code === stock.code);
      if (nodeIndex !== -1) {
        stockinfo[nodeIndex] = [stockinfo[nodeIndex], stockinfo[nodeIndex + 1]];
        stockinfo[nodeIndex + 1] = stockinfo[nodeIndex][0];
        stockinfo[nodeIndex] = stockinfo[nodeIndex][1];
        this.selfstockinfo = stockinfo;

        const zxlist = [...this.zxlist];
        zxlist[nodeIndex] = [zxlist[nodeIndex], zxlist[nodeIndex + 1]];
        zxlist[nodeIndex + 1] = zxlist[nodeIndex][0];
        zxlist[nodeIndex] = zxlist[nodeIndex][1];
        this.zxlist = zxlist;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 960px;
  margin: 0 auto;
}

.ph-container {
  display: flex;
  align-items: center;
}
.ph-title {
  display: inline-block;
  flex: 1;
  padding: 16px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 24px;
}
.stock-search {
  float: right;
  margin-left: auto;
  padding: 16px 0;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 400;
  font-size: 14px;
}
</style>
