<template>
  <div class="hq-data">
    <div
      v-for="(hq, index) in dataSource"
      :key="index"
      class="hq-dataitem"
      :class="getHqColor(hq.lastData.zdf)"
    >
      <label class="hq-name">{{ hq.name }}</label>
      <strong class="hq-current">{{ hq.lastData.price }}</strong>
      <div class="hq-info">
        <span class="hq-jump"
          >{{ getHqSymbol(hq.lastData.zdf)
          }}{{ pieNum(hq.lastData.zde).replace(/-([0-9]+)/, "$1") }}</span
        >
        <span class="hq-jumpratio"
          >{{ getHqSymbol(hq.lastData.zdf)
          }}{{ pieNum(hq.lastData.zdf).replace(/-([0-9]+)/, "$1") }}%</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { pieNum } from "@/utils/index";

export default {
  name: "hq-data",
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hqlist: []
    };
  },
  beforeCreate() {
    this.pieNum = pieNum;
  },
  methods: {
    getHqSymbol(value) {
      return 0 < value ? "+" : "--" == value ? "" : "-";
    },
    getHqColor(value) {
      return 0 < value ? "red" : 0 > value ? "green" : "equal";
    }
  }
};
</script>

<style lang="scss" scoped>
.hq-data {
  display: flex;
  flex-direction: row;
  padding: 0;
  margin: 5px;
  .hq-dataitem {
    flex: 1;
    padding: 5px 0;
    margin: 0 2.5px;
    border-radius: 3px;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;

    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }

    .hq-name,
    .hq-current,
    .hq-jump,
    .hq-jumpratio {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .hq-name,
    .hq-current {
      display: block;
    }
    .hq-current {
      font-weight: 600;
    }
    .hq-info {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 12px;
    }
    .hq-jump,
    .hq-jumpratio {
      flex: 1;
    }
  }
}
</style>
