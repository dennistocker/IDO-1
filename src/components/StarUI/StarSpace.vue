<template>
  <div :style="sizeStyle" />
</template>

<script>
export default {
  name: "StarSpace",
  props: {
    horizontal: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [Number, String],
      default: 10,
    },
  },
  computed: {
    sizeStyle() {
      const size = this.size;
      if (this.horizontal) {
        return `display:inline-block; width: ${size}PX;`;
      }
      return `height: ${size}PX;`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
