<template>
  <div
    class="star-button"
    v-on="$listeners"
    :class="{
      light,
      dark,
      blborder,
      trborder,
    }"
  >
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: "StarButton",
  components: {},
  data() {
    return {};
  },
  props: {
    dark: {
      default: false,
      type: Boolean,
    },
    light: {
      type: Boolean,
      default: false,
    },
    blborder: {
      default: false,
      type: Boolean,
    },
    trborder: {
      default: false,
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

@mixin btnstyle($color, $bgcolor: false, $border: false) {
  color: $color;
  @if $bgcolor {
    background: $bgcolor;
  } @else {
    background: transparent;
  }
  @if $border {
    border: 1px solid $light_bordercolor;
  }
}

.star-button {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  color: $text_base_color;
  font-weight: 500;
  border: none;
  padding: 12px 20px;
  font-size: 14px;
  text-align: center;
  box-sizing: content-box;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.star-button + .star-button {
  margin-left: 10px;
}
.star-button.light {
  @include btnstyle($btn_base_bgcolor, false, $light_bordercolor);
}
.star-button.dark {
  @include btnstyle(#000, $text_light_color);
}
// 左下
.star-button.blborder {
  ::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -8px;
    right: 0;
    left: -10px;
    background-image: linear-gradient(
      to left,
      rgba(255, 0, 0, 0),
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 1)
    );
  }
  ::after {
    content: "";
    position: absolute;
    width: 2px;
    height: 100%;
    bottom: -8px;
    left: -10px;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 0, 0, 0),
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 1)
    );
  }
}
// 右上
.star-button.trborder {
  ::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    top: -8px;
    right: 0;
    bottom: 0;
    left: 10px;
    background-image: linear-gradient(
      to right,
      rgba(255, 0, 0, 0),
      rgba(42, 254, 254, 0.7),
      rgba(42, 254, 254, 1)
    );
  }

  ::after {
    content: "";
    position: absolute;
    width: 2px;
    height: 100%;
    top: -8px;
    bottom: 0;
    right: -10px;
    background-image: linear-gradient(
      to top,
      rgba(255, 0, 0, 0),
      rgba(42, 254, 254, 0.7),
      rgba(42, 254, 254, 1)
    );
  }
}
</style>
