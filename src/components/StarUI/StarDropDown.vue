<template>
  <div class="star-dropdown">
    <Dropdown v-bind="$attrs">
      <slot name="tag"></slot>
      <DropdownMenu slot="dropdown" class="star-dropdown-menu">
        <DropdownItem
          v-for="(d, i) in itemList"
          :key="i"
          class="star-dropdown-menu-item"
          @click.native="emitClick(d.value)"
          :class="{ 'is-active': activeValue === d.value }"
        >
          {{ $t(`${d.text}`) }}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
import { Dropdown, DropdownMenu, DropdownItem } from "element-ui";
import session from "@utils/session.js";
export default {
  name: "StarDropDown",
  data() {
    return {};
  },
  props: {
    itemList: {
      type: Array,
    },
    activeValue: {
      type: [String, Number, null],
    },
  },
  components: {
    Dropdown,
    DropdownMenu,
    DropdownItem,
  },
  mounted() {
    let currLang = session.getItem("lang");
    if (!currLang) {
      session.setItem("lang", "zh");
      window.location.reload();
    }
  },
  methods: {
    emitClick(val) {
      this.$emit("handleClick", val);
    },
  },
  computed: {},
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
@mixin hoverStyle {
  background: #29f3f6 !important;
  color: #170c39 !important;
}
.star-dropdown-menu {
  background-color: #333d5c;
  color: #fff;
  border: none;
  border-radius: 0px;
  top: 80px !important;
  right: 20px !important;
  width: 192px !important;

  ::v-deep {
    .popper__arrow {
      &::after {
        display: none;
      }
      display: none;
    }
  }
}
.star-dropdown-menu-item {
  text-align: center;
  color: #fff;
  &:hover {
    @include hoverStyle();
  }
}
.star-dropdown-menu-item.is-active {
  background: rgba(42, 254, 254, 0.6) !important;
  color: #170c39 !important;
  &:hover {
    @include hoverStyle();
  }
}
</style>
