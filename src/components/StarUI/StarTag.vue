<template>
  <div class="star-tag">
    <slot name="default"></slot>
  </div>
</template>
<script>
export default {
  name: "StarTag",
  data() {
    return {};
  },
  props: {
    img: {
      type: String,
    },
  },
  mounted() {},
  methods: {},
  computed: {},
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
.star-tag {
  // padding: 10px;
  // width: 100px;
  // height: 60px;
  display: inline-block;
  cursor: pointer;
}
.star-tag + .star-tag {
  margin-left: 10px;
}
</style>
