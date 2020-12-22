<template>
  <div class="zx-list">
    <a-table
      class="result-table"
      :columns="columns"
      :data-source="dataSource"
      size="middle"
      :pagination="false"
    >
      <span class="data" slot="data" slot-scope="text">{{ pieNum(text) }}</span>
      <span slot="status" slot-scope="text, data" class="data status" :class="getHqColor(text)">
        <span class="symbol">{{ getHqSymbol(data[199112]) }}</span>
        <span class="value">{{ pieNum(text).replace(/-([0-9]+)/, "$1") }}</span>
      </span>
      <span
        slot="status-ratio"
        slot-scope="text, data"
        class="data status"
        :class="getHqColor(text)"
      >
        <span class="symbol">{{ getHqSymbol(data[199112]) }}</span>
        <span class="value">{{ pieNum(text).replace(/-([0-9]+)/, "$1") }}%</span>
      </span>
      <template slot="operation" slot-scope="text, record, index">
        <a
          href="javascript:"
          @click="onMoveTop(record.id, record)"
          title="上移"
          :style="index === 0 && 'visibility: hidden'"
          ><a-icon type="vertical-align-top"
        /></a>
        <a
          href="javascript:"
          @click="onMoveDown(record.id, record)"
          title="下移"
          style="margin-left: 10px"
          :style="index === dataSource.length - 1 && 'visibility: hidden'"
          ><a-icon type="vertical-align-bottom"
        /></a>
        <a
          href="javascript:"
          @click="onDelete(record.id, record)"
          title="删除"
          style="margin-left: 10px"
          ><a-icon type="delete"
        /></a>
      </template>
    </a-table>
  </div>
</template>

<script>
import { pieNum } from "@/utils/index";

export default {
  name: "ZxList",
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name",
          align: "left",
          ellipsis: true,
          fixed: "left"
        },
        {
          title: "当前价",
          dataIndex: "10",
          key: "10",
          width: 80,
          align: "right",
          ellipsis: true,
          fixed: "left",
          scopedSlots: { customRender: "data" }
        },
        {
          title: "涨跌幅",
          dataIndex: "199112",
          key: "199112",
          width: 80,
          align: "right",
          ellipsis: true,
          fixed: "left",
          scopedSlots: { customRender: "status-ratio" }
        },
        {
          title: "成交量(手)",
          dataIndex: "13",
          key: "13",
          // width: 80,
          align: "right",
          ellipsis: true,
          scopedSlots: { customRender: "data" }
        },
        {
          title: "成交额",
          dataIndex: "19",
          key: "19",
          // width: 80,
          align: "right",
          ellipsis: true,
          scopedSlots: { customRender: "data" }
        },
        {
          title: "市值",
          dataIndex: "3541450",
          key: "3541450",
          // width: 80,
          align: "right",
          ellipsis: true,
          scopedSlots: { customRender: "data" }
        },
        {
          title: "换手率",
          dataIndex: "1968584",
          key: "1968584",
          // width: 80,
          align: "right",
          ellipsis: true,
          scopedSlots: { customRender: "data" }
        },
        {
          title: "市盈率",
          dataIndex: "2034120",
          key: "2034120",
          // width: 80,
          align: "right",
          ellipsis: true,
          scopedSlots: { customRender: "data" }
        },
        {
          title: "昨收",
          dataIndex: "6",
          key: "6",
          // width: 80,
          align: "right",
          ellipsis: true,
          scopedSlots: { customRender: "data" }
        },
        {
          title: "今开",
          dataIndex: "7",
          key: "7",
          // width: 80,
          align: "right",
          ellipsis: true,
          scopedSlots: { customRender: "data" }
        },
        {
          title: "最高",
          dataIndex: "8",
          key: "8",
          // width: 80,
          align: "right",
          ellipsis: true,
          scopedSlots: { customRender: "data" }
        },
        {
          title: "最低",
          dataIndex: "9",
          key: "9",
          // width: 80,
          align: "right",
          ellipsis: true,
          scopedSlots: { customRender: "data" }
        },
        {
          title: "操作",
          dataIndex: "operation",
          key: "operation",
          width: 80,
          align: "center",
          fixed: "right",
          scopedSlots: { customRender: "operation" }
        }
      ]
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
      return 0 < value ? "red" : "--" == value ? "equal" : "green";
    },
    onDelete(id, record) {
      this.$emit("delete", record);
    },
    onMoveTop(id, record) {
      this.$emit("movetop", record);
    },
    onMoveDown(id, record) {
      this.$emit("movedown", record);
    }
  }
};
</script>

<style lang="scss" scoped>
.zx-list {
  margin: 5px;
}
.result-table {
  &::v-deep {
    .ant-table-title {
      padding: 0;
    }
    th,
    td {
      padding: 8px 0 !important;
      font-size: 12px;
    }

    .data {
      overflow: hidden;
      display: block;
      padding: 2px 4px;
      margin-left: 4px;
      border-radius: 3px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .status {
      .symbol {
        float: left;
      }
    }
  }
}
</style>
