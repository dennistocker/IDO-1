<template>
  <div class="home-list-item">
    <div class="home-list-item-rough">
      <div class="home-list-item-rough-header">
        <star-item-cell cellType="vertical">
          <!-- 项目logo -->
          <img :src="data.icon" />
          <span>{{ $t(`${data.prdName}`) }}</span>
          <span>({{ $t(`${data.assignCurrency}`) }})</span>
        </star-item-cell>
      </div>
      <star-space :size="20"></star-space>
      <div class="home-list-item-rough-labels">
        <star-button
          v-for="(d, i) in data.labels"
          :key="i"
          light
          :style="
            mixinLabelColor(
              colorsInfo['label-text-color'],
              colorsInfo['label-border-color']
            )
          "
          >{{ $t(`${d.label}`) }}</star-button
        >
      </div>
      <star-space :size="10"></star-space>
      <div
        class="home-list-item-rough-icons"
        @mouseout.stop.prevent="changeHoverList(null, null, true)"
      >
        <svg-icon
          v-for="(iconkey, index) in data.links"
          :key="index"
          :name="
            isHoverList && isHoverList[index]
              ? svgName(iconkey.name, cardType, true)
              : svgName(iconkey.name, cardType)
          "
          class="home-list-item-rough-icons-icon"
          @mouseenter.stop.prevent="changeHoverList(index, true)"
          @mouseleave.stop.prevent="changeHoverList(index, false)"
          @click.stop.prevent="openURL(iconkey.url)"
        ></svg-icon>
        <!-- getSvgName(iconkey.name, cardType) -->
        <!-- :name="iconkey.name + '-' + cardType" -->
      </div>
      <star-space :size="20"></star-space>
      <div class="home-list-item-rough-infos">
        <star-item-cell :data="cellData('raiseTotal', data.payCurrency)">
        </star-item-cell>
        <star-item-cell
          :data="cellData('rate', data.assignCurrency, data.payCurrency)"
        >
        </star-item-cell>
        <star-item-cell :data="cellData('capTotal', data.assignCurrency)">
        </star-item-cell>
      </div>
    </div>
  </div>
</template>
<script>
import StarSpace from "@StarUI/StarSpace.vue";
import StarButton from "@StarUI/StarButton.vue";
import SvgIcon from "@components/SvgIcon/index.vue";
import StarItemCell from "@StarUI/StarItemCell.vue";
import { mapGetters } from "vuex";
import mixinHome from "@/mixins/home.js";
import utilsNumber from "@utils/number.js";
import utilsTool from "@utils/tool";
export default {
  components: { StarButton, StarSpace, SvgIcon, StarItemCell },
  mixins: [mixinHome],
  data() {
    return {};
  },
  props: {
    colorsInfo: { type: Object },
    cardType: {
      type: String,
    },
    data: {
      type: Object,
    },
  },
  mounted() {
    this.isHoverList =
      this.data &&
      this.data.links &&
      this.data.links.length &&
      this.data.links.map(() => {
        return false;
      });
  },
  methods: {
    openURL(url) {
      utilsTool.openNewWindow(url);
    },
    cellData(key, currency, currencyB) {
      let name, text;
      if (key === "raiseTotal") {
        name = this.$t("总募资");
        text = `${
          utilsNumber.formatNumberMeta(this.data[key], { grouped: true }).text
        } ${currency}`;
      }
      if (key === "rate") {
        name = this.$t("兑换比例");
        text = `1 ${currency} = ${
          utilsNumber.formatNumberMeta(this.data[key], { grouped: true }).text
        } ${currencyB}`;
      }
      if (key === "capTotal") {
        name = this.$t("总销售量");
        text = `${
          utilsNumber.formatNumberMeta(this.data[key], { grouped: true }).text
        } ${currency}`;
      }
      return {
        title: name,
        text,
      };
    },
  },
  computed: {
    ...mapGetters("StoreHome", ["cardTypeColorInfo"]),
  },
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
.home-list-item {
  width: 100%;
  .home-list-item-rough {
    width: 100%;
    position: relative;
    .home-list-item-rough-header {
      img {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 50%;
      }
      span {
        color: #fff;
        font-size: 16px;
        font-weight: 500;
        margin-left: 20px;
      }
    }
    .home-list-item-rough-labels {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .star-button {
        margin-right: 10px;
        border-radius: 2px;
        padding: 3px 6px;
        margin-bottom: 10px;
      }
      .star-button + .star-button {
        margin-left: 0px;
      }
    }
    .home-list-item-rough-icons {
      .home-list-item-rough-icons-icon {
        width: 24px;
        height: 24px;
        &:hover {
        }
      }
      .home-list-item-rough-icons-icon + .home-list-item-rough-icons-icon {
        margin-left: 10px;
      }
    }
    .home-list-item-rough-infos {
      .home-list-item-rough-infos-title {
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        opacity: 0.7;
      }
      .home-list-item-rough-infos-amount {
        font-size: 16px;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
}
</style>
