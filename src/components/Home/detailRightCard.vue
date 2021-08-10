<template>
  <div
    class="detail-card"
    :set="
      (((colorsInfo = cardTypeColorInfo(detailCardType)),
      (cardInfo = detailCardInfo(detailCardId))),
      (detailListAmount = changeDisplayList(cardInfo.decentralizedList)))
    "
  >
    <div
      v-if="cardInfo.attributes"
      class="detail-card-labels-top"
      :style="
        mixinSetLabelsBg(
          detailCardType,
          cardInfo.attributes.length > 2 ? 2 : cardInfo.attributes.length
        )
      "
    >
      <span
        v-for="(l, ix) in cardInfo.attributes.slice(0, 2)"
        :key="ix"
        :style="{ color: colorsInfo['common-color'] }"
      >
        {{ $t(`${l.name}`) }}
      </span>
    </div>
    <div class="detail-card-header">
      <img class="detail-card-header-logo" :src="cardInfo.icon" />
      <!-- <star-space :size="30" :horizontal="true"></star-space> -->
      <div class="detail-card-header-info">
        <div class="detail-card-header-info-currency">
          <span>
            {{ $t(`${cardInfo.prdName}`) }}
          </span>
          <span> ({{ $t(`${cardInfo.currencyInfo.assignCurrency}`) }}) </span>
        </div>
        <div>
          <span class="detail-card-header-info-hash">
            {{ cardInfo.currencyInfo.assignAddress }}
          </span>

          <star-tool-tip
            :content="copyContent"
            placement="top"
            class="detail-card-header-info-copy"
          >
            <svg-icon
              :name="setSvgName(detailCardType, isHover)"
              @click="clipHash(cardInfo.currencyInfo.assignAddress)"
              @mouseenter.native.prevent="isHover = true"
              @mouseleave.native.prevent="isHover = false"
            ></svg-icon>
          </star-tool-tip>
        </div>
      </div>
    </div>
    <star-space :size="20"></star-space>
    <div class="detail-card-labels">
      <star-button
        v-for="(d, i) in cardInfo.labels"
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
    <star-space :size="20"></star-space>
    <div
      class="detail-card-icons"
      @mouseout.stop.prevent="changeHoverList(null, null, true)"
    >
      <svg-icon
        v-for="(iconkey, index) in cardInfo.links"
        :key="index"
        :name="
          isHoverList && isHoverList[index]
            ? svgName(iconkey.name, detailCardType, true)
            : svgName(iconkey.name, detailCardType)
        "
        class="detail-card-icons-icon"
        @mouseenter.native.prevent="changeHoverList(index, true)"
        @mouseleave.native.prevent="changeHoverList(index, false)"
        @click.stop.prevent="handleToPath(iconkey)"
      ></svg-icon>
    </div>
    <star-space :size="20"></star-space>
    <div class="detail-card-tabs">
      <star-tab-bar
        :value="tabCategory"
        @input="hanleTabChange"
        :items="tabItmes"
        :color="colorsInfo['common-color']"
      >
      </star-tab-bar>
      <div class="detail-card-tabs-list">
        <template v-if="tabCategory === 'prodetail'">
          <star-list
            v-for="(d, index) in detailListAmount"
            :key="index"
            :data="d"
            type="prodetail"
            :bgColor="colorsInfo['list-bg-color']"
          >
          </star-list>
        </template>
        <template v-if="tabCategory === 'time'">
          <star-list
            v-for="(d, index) in cardInfo.proTimeList"
            :key="index"
            :data="d"
            type="time"
            :bgColor="colorsInfo['list-bg-color']"
          ></star-list>
        </template>
      </div>
    </div>
    <star-space :size="30"></star-space>
    <div class="detail-card-footer">
      {{ this.lang === "zh" ? cardInfo.prdDesc : cardInfo.prdDescEn }}
    </div>
  </div>
</template>
<script>
import StarSpace from "@StarUI/StarSpace.vue";
import SvgIcon from "@components/SvgIcon/index.vue";
import StarButton from "@StarUI/StarButton.vue";
import StarTabBar from "@StarUI/StarTabBar.vue";
import StarList from "@StarUI/StarList.vue";
import StarToolTip from "@StarUI/StarToolTip.vue";
import * as clipboard from "clipboard-polyfill/text";
import { mapState, mapGetters } from "vuex";
import mixinHome from "@mixins/home.js";
import session from "@utils/session";
import { cloneDeep } from "lodash";
import utilsNumber from "@utils/number.js";
import utilsTool from "@utils/tool";
export default {
  data() {
    return {
      isHover: false,
      copyContent: this.$t("复制"),
      tabCategory: "prodetail",
      tabItmes: [
        {
          label: this.$t("项目详情"),
          value: "prodetail",
        },
        {
          label: this.$t("时间"),
          value: "time",
        },
      ],
      lang: session.getItem("lang"),
    };
  },
  mixins: [mixinHome],
  components: {
    StarToolTip,
    StarSpace,
    SvgIcon,
    StarButton,
    StarTabBar,
    StarList,
  },
  watch: {},
  methods: {
    changeDisplayList(val) {
      // 需要再次组合下数据
      let list = cloneDeep(val);
      list = list.map((d, i) => {
        if (i === 0) {
          return {
            name: this.$t(`我的质押`),
            text: `${
              this.myStakeAmount
                ? utilsNumber.formatNumberMeta(
                    utilsNumber
                      .bigNum(this.myStakeAmount)
                      .div(Math.pow(10, this.currencyInfo.stakePrecision))
                      .toString(),
                    { grouped: true }
                  ).text
                : 0
            } ${this.currencyInfo.stakeCurrency}`,
          };
        }
        if (i === 1) {
          return {
            name: this.$t(`总销售量`),
            text: `${utilsNumber.formatNumberMeta(d, { grouped: true }).text} ${
              this.currencyInfo.assignCurrency
            }`,
          };
        }
        if (i === 2) {
          return {
            name: this.$t(`代币发行总量`),
            text:
              utilsNumber.formatNumberMeta(d, { grouped: true }).text +
              " " +
              `${this.currencyInfo.assignCurrency}`,
          };
        }
        if (i === 3) {
          return {
            name: this.$t("总质押"),
            text:
              utilsNumber.formatNumberMeta(
                utilsNumber
                  .bigNum(this.stakeTotalAmount)
                  .div(Math.pow(10, this.currencyInfo.stakePrecision))
                  .toString(),
                { grouped: true }
              ).text + ` ${this.currencyInfo.stakeCurrency}`,
          };
        }
        if (i === 4) {
          return {
            name: this.$t("兑换比例"),
            text: `1 ${this.currencyInfo.assignCurrency} = ${
              utilsNumber.formatNumberMeta(d, { grouped: true }).text
            } ${this.currencyInfo.payCurrency}`,
          };
        }
        if (i === 5) {
          return {
            name: this.$t("总募资"),
            text: `${utilsNumber.formatNumberMeta(d, { grouped: true }).text} ${
              this.currencyInfo.payCurrency
            }`,
          };
        }
      });
      return list;
    },
    hanleTabChange(val) {
      this.tabCategory = val;
    },
    handleToPath(val) {
      utilsTool.openNewWindow(val.url);
    },
    clipHash(val) {
      clipboard.writeText(val).then(
        () => {
          this.copyContent = this.$t("复制成功");
          setTimeout(() => {
            this.copyContent = this.$t("复制");
          }, 1500);
        },
        () => {
          console.log("error");
        }
      );
    },
  },
  computed: {
    setSvgName() {
      return function (type, isHover) {
        if (isHover) {
          return `copy-${type}-actived`;
        }
        return `copy-${type}`;
      };
    },
    ...mapState("StoreHome", {
      detailCardType: (state) => state.detailCardType,
      detailCardId: (state) => state.detailCardId,
      currencyInfo: (state) => state.currencyInfo,
    }),
    ...mapState("StoreContracts", {
      stakeAmount: (state) => state.stakeAmount,
      myStakeAmount: (state) => state.myStakeAmount,
      stakeTotalAmount: (state) => state.stakeTotalAmount,
    }),

    ...mapGetters("StoreHome", ["cardTypeColorInfo", "detailCardInfo"]),
  },
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.detail-card {
  padding: 40px 20px;
  position: relative;
  .detail-card-labels-top {
    position: absolute;
    top: 0;
    right: 0;
    background-size: 100% 100%;
    height: 26px;
    background-repeat: no-repeat;
    span {
      position: relative;
      top: -2px;
      height: 100%;
      display: inline-block;
      width: 94px;
      text-align: center;
      font-size: 12px;
    }
  }
  .detail-card-header {
    display: flex;
    .detail-card-header-logo {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: inline-block;
    }
    .detail-card-header-info {
      // display: flex;
      margin-left: 20px;
      .detail-card-header-info-currency {
        color: #fff;
      }
      .detail-card-header-info-hash {
        color: $text_gray_color;
        margin-right: 5px;
      }
      .detail-card-header-info-copy {
        display: inline-block;
      }
    }
  }
  .detail-card-labels {
    .star-button {
      border-radius: 2px;
      padding: 5px 10px;
      cursor: default;
    }
  }
  .detail-card-icons {
    .detail-card-icons-icon {
      width: 32px;
      height: 32px;
    }
    .detail-card-icons-icon + .detail-card-icons-icon {
      margin-left: 10px;
    }
  }
  .detail-card-tabs-list {
    width: 100%;
    overflow: hidden;
  }
  .detail-card-footer {
    color: $text_gray_color;
  }
}
</style>
