<template>
  <div class="zx-list">
    <a-table
      class="result-table"
      :columns="columns"
      :data-source="dataSource"
      size="middle"
      :pagination="false"
      :show-header="false"
    >
      <span class="data" slot="data" slot-scope="text">{{ pieNum(text) }}</span>
      <span
        slot="status"
        slot-scope="text, data"
        class="data status"
        :class="getHqColor(data[199112])"
      >
        <span class="symbol">{{ getHqSymbol(data[199112]) }}</span>
        <span class="value">{{ pieNum(text).replace(/-([0-9]+)/, "$1") }}</span>
      </span>
      <span
        slot="status-ratio"
        slot-scope="text, data"
        class="data status"
        :class="getHqColor(data[199112])"
      >
        <span class="symbol">{{ getHqSymbol(data[199112]) }}</span>
        <span class="value">{{ pieNum(text).replace(/-([0-9]+)/, "$1") }}%</span>
      </span>
      <template slot="operation" slot-scope="text, record">
        <a href="javascript:" @click="onDelete(record.id)" title="删除"><a-icon type="delete"/></a>
        <a href="javascript:" @click="onToTop(record.id)" title="置顶" style="margin-left: 10px"
          ><a-icon type="vertical-align-top"
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
          ellipsis: true
        },
        {
          title: "当前价",
          dataIndex: "10",
          key: "10",
          width: 80,
          align: "right",
          ellipsis: true,
          scopedSlots: { customRender: "data" }
        },
        {
          title: "涨跌幅",
          dataIndex: "199112",
          key: "199112",
          width: 70,
          align: "right",
          ellipsis: true,
          scopedSlots: { customRender: "status-ratio" }
        }
      ],
      editing: false
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
    onDelete(id) {
      const dataSource = [...this.data];
      this.data = dataSource.filter(item => item.id !== id);

      const list = [...this.from.list];
      this.from.list = list.filter(item => item !== id);
    },
    onToTop(id) {
      const list = [...this.from.list];
      const nodeIndex = list.findIndex(item => item === id);
      if (nodeIndex !== -1) {
        const node = list.splice(nodeIndex, 1)[0];
        list.splice(3, 0, node);
        this.from.list = list;

        const data = [...this.data];
        const nodeData = data.splice(nodeIndex - 3, 1)[0];
        data.splice(0, 0, nodeData);
        this.data = data;
      }
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
