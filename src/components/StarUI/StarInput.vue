<template>
  <div class="star-input">
    <Input v-bind="{ ...$attrs }" @input="inputEvent" v-on="$listeners">
      <div slot="suffix" class="star-input-suffix">
        <span
          class="star-input-suffix-max"
          :style="{ color: maxColor }"
          @click.stop="maxEvent"
          >MAX</span
        >
        <span>|</span>
        <span class="star-input-suffix-usdt">{{ stakeCurrency }}</span>
      </div>
    </Input>
  </div>
</template>
<script>
import { Input } from "element-ui";
export default {
  data() {
    return {
      inputValue: "",
    };
  },
  components: {
    Input,
  },
  // value不用props接，因为事件出发会导致子组件直接修改了父组件
  props: {
    stakeCurrency: {
      type: String,
      default: "",
    },
    inputType: {
      type: String,
      default: "number",
    },
    precision: {
      type: Number, // 小数点后精度
      default: 0,
    },
    type: {
      type: String,
      default: "number",
    },
    maxColor: String,
  },
  methods: {
    maxEvent() {
      this.$emit("maxEvent");
    },
    inputEvent(val) {
      if (this.type === "number" && this.precision > 0) {
        val = val.toString();
        val = val
          .replace(/[^\d^\\.]+/g, "") // 把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, "$1") // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, "0."); // 如果输入的第一位为小数点，则替换成 0. 实现自动补全
        let reg = new RegExp("^\\d*(\\.?\\d{0," + this.precision + "})", "g");
        this.value = val.match(reg)[0] || ""; // 最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
      }
      this.$emit("input", this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.star-input {
  color: #fff;
  height: 54px;
  ::v-deep {
    .el-input,
    .el-input__inner {
      height: 54px;
    }
    .el-input__inner {
      width: 80%;
      border: none;
      background: none;
      color: #fff;
      line-height: 54px;
    }
  }
  .star-input-suffix {
    display: flex;
    align-items: center;
    height: 100%;
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
    .star-input-suffix-max {
      margin-right: 10px;
      cursor: pointer;
    }
    .star-input-suffix-usdt {
      margin-left: 10px;
      margin-right: 5px;
      cursor: default;
    }
  }
}
</style>
