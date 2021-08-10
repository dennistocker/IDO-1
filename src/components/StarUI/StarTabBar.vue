<template>
  <div class="star-tabs">
    <tabs @tab-click="handleClick" :value="value" :style="{ '--color': color }">
      <tab-pane
        v-for="d in items"
        :label="d.label"
        :key="d.value"
        :name="d.value"
      >
        <slot></slot>
      </tab-pane>
    </tabs>
  </div>
</template>
<script>
// import variables from "@styles/variables.scss";
import { Tabs, TabPane } from "element-ui";
export default {
  data() {
    return {
      tabValue: this.value,
      activeName: "second",
      "--testcolor": "red",
    };
  },
  components: {
    Tabs,
    TabPane,
  },
  props: {
    items: {
      type: Array,
    },
    value: null,
    color: String,
  },
  mounted() {},
  methods: {
    handleClick(tab) {
      this.$emit("input", tab.name);
    },
  },
  computed: {},
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.star-tabs {
  ::v-deep {
    .el-tabs__item.is-active {
      color: var(--color);
    }
    .el-tabs__item {
      color: #fff;
    }
    .el-tabs__active-bar {
      background-color: var(--color);
    }
    .el-tabs__item:hover {
      color: none;
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
  }
}
</style>
