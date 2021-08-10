<template>
  <div class="star-item-cell">
    <div v-if="cellType === 'horizontal'" class="star-item-cell-horizontal">
      <slot name="default"></slot>
      <p class="star-item-cell-title">{{ data.title }}</p>
      <star-space :size="5"></star-space>
      <p class="star-item-cell-info">
        <template v-if="data.text"> {{ data.text }}</template>
      </p>
      <star-space :size="20"></star-space>
    </div>
    <div v-if="cellType === 'vertical'" class="star-item-cell-vertical">
      <slot name="default"></slot>
    </div>
  </div>
</template>
<script>
import StarSpace from "@StarUI/StarSpace.vue";
import utilsNumber from "@utils/number.js";
export default {
  data() {
    return {
      utilsNumber,
    };
  },
  components: {
    StarSpace,
  },
  props: {
    cellType: {
      type: String,
      default: "horizontal",
    },
    data: {
      type: Object,
    },
    formatOptions: {
      type: [Object, null],
      default: null,
    },
  },
  mounted() {},
  methods: {},
  computed: {},
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
.star-item-cell {
  color: #ffffff;
  .star-item-cell-horizontal {
    .star-item-cell-title {
      font-size: 12px;
      font-weight: 400;
      opacity: 0.7;
    }
    .star-item-cell-info {
      font-size: 16px;
      font-weight: 500;
    }
  }
  .star-item-cell-vertical {
    display: flex;
    align-items: center;
  }
}
</style>
