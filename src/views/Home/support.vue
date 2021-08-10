<template>
  <div class="star-home-support">
    <div class="star-container star-home-support-wrap">
      <p>I PARTNERS</p>
      <div>
        <star-tag
          v-for="(d, i) in supportList"
          :key="i"
          class="support-icon"
          :class="`support-tag-${i + 1}`"
          :style="`background-image: url(${d})`"
        >
        </star-tag>
      </div>
    </div>
  </div>
</template>
<script>
import StarTag from "@StarUI/StarTag.vue";
export default {
  data() {
    return {
      supportList: [
        require("../../assets/home/support-bticoin.png"),
        require("../../assets/home/support-buiness.png"),
        require("../../assets/home/support-hacker.png"),
        require("../../assets/home/support-yahoo.png"),
      ],
    };
  },
  components: {
    StarTag,
  },
  mounted() {},
  methods: {},
  computed: {},
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
.star-home-support {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 146px;
  background-image: url("../../assets/home/support-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  .star-home-support-wrap {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .support-icon {
    height: 60px;
    cursor: default;
  }
  @for $i from 1 through 4 {
    .support-tag-#{$i} {
      @if $i == 1 {
        width: 207px;
      }
      @if $i == 2 {
        width: 145px;
      }
      @if $i == 3 {
        width: 225px;
      }
      @if $i == 4 {
        width: 125px;
      }
    }
  }
  p {
    font-size: 35px;
    color: $text_light_color;
    @include fontRigelstar();
  }
}
</style>
