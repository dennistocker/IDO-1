<template>
  <div
    :set="
      (((cardsInfo = cardTypeColorInfo(detailCardType)),
      (cardContent = detailCardInfo(detailCardId))),
      (cardCountDown = cardContent.startTime))
    "
  >
    <div class="detail-input-wrap" :style="setInputBg(isFocus, cardsInfo)">
      <star-input
        class="detail-input"
        :precision="currencyInfo.stakePrecision"
        :value="inputValue"
        :maxColor="cardsInfo['common-color']"
        @input="inputEvent"
        @maxEvent="maxEvent"
        @focus="isFocus = true"
        @blur="isFocus = false"
        :stakeCurrency="currencyInfo.stakeCurrency"
        v-if="stakeStatus === 'stake' && proState === 2"
      ></star-input>

      <star-input
        class="detail-input"
        v-if="stakeStatus === 'unstake'"
        :precision="currencyInfo.stakePrecision"
        :value="inputValue"
        :maxColor="cardsInfo['common-color']"
        @input="inputEvent"
        :stakeCurrency="currencyInfo.stakeCurrency"
        @maxEvent="maxEvent"
        @focus="isFocus = true"
        @blur="isFocus = false"
      >
      </star-input>
    </div>
    <star-space :size="12"></star-space>
    <div v-if="stakeStatus === 'unstake'" class="detail-wrap-content-left-info">
      <span>{{ $t("还可解押") }}：{{ renderAmount(stakeAmount) }}</span>
    </div>
    <div
      class="detail-wrap-content-left-info"
      v-if="
        detailCardType === 'open' && proState === 2 && stakeStatus === 'stake'
      "
    >
      <div>
        <span>{{ $t("还可质押") }}：</span>
        <span
          >{{ renderAmount(restStakeAmount) }}
          {{ currencyInfo.stakeCurrency }}</span
        >
      </div>
      <div>
        <span>{{ $t("余额") }}：</span>
        <!-- 钱包的stc -->
        <span
          >{{ renderAmount(balances[currencyInfo.stakeCurrency]) }}
          {{ currencyInfo.stakeCurrency }}</span
        >
      </div>
    </div>
    <star-space
      :size="24"
      v-if="
        detailCardType === 'open' &&
        proState !== 3 &&
        proState !== 4 &&
        proState !== 5
      "
    ></star-space>

    <div
      class="detail-wrap-conent-left-amount-text"
      v-if="detailCardType === 'open' && (proState === 4 || proState === 3)"
    >
      <template v-if="proState === 3 && stakeStatus !== 'unstake'">
        <p class="detail-wrap-conent-left-amount-text-ttile">
          {{ $t("我的质押") }}
        </p>
        <star-space :size="8"></star-space>
        <p class="detail-wrap-conent-left-amount-text-amount">
          {{ renderAmount(stakeAmount) }} {{ currencyInfo.stakeCurrency }}
        </p>
      </template>
      <template v-if="proState === 4 && stakeStatus !== 'unstake'">
        <p class="detail-wrap-conent-left-amount-text-ttile">
          {{ $t("我的份额") }}
        </p>
        <star-space :size="8"></star-space>
        <p class="detail-wrap-conent-left-amount-text-amount">
          {{
            getCurrencyShare(cardContent.capTotal, cardContent.assignPrecision)
          }}
          {{ cardContent.assignCurrency }}
        </p>
      </template>
    </div>
    <div class="detail-wrap-content-left-error" v-if="errorText">
      <p>{{ errorText }}</p>
    </div>
    <star-space :size="12"></star-space>
    <star-button
      v-if="showRule(detailCardType, payState)"
      class="detail-wrap-content-button"
      :class="{
        noPointer:
          (proState === 3 || proState === 1) && stakeStatus === 'stake',
      }"
      :style="setButtonBg(isHoverBtn, cardsInfo)"
      @mouseenter.native.prevent.stop="isHoverBtn = true"
      @mouseleave.native.prevent.stop="isHoverBtn = false"
    >
      <!-- :style="`background-image: url(${cardsInfo['detail-wrap-content-button']})`" -->
      <p
        :style="{ color: cardsInfo['common-color'] }"
        class="detail-wrap-content-button-text"
      >
        <span
          v-if="
            stakeStatus === 'stake' &&
            detailCardType === 'open' &&
            proState === 2
          "
          @click="onStakeClick"
        >
          {{ $t("质押") }}
        </span>
        <span
          v-if="
            detailCardType === 'open' &&
            proState === 3 &&
            stakeStatus === 'stake'
          "
        >
          {{ $t("锁仓中") }}
        </span>
        <span
          v-if="
            detailCardType === 'open' &&
            proState === 4 &&
            stakeStatus === 'stake'
          "
          @click="payUSDT"
        >
          {{ isPaying ? `${$t("支付中")}...` : $t("待支付") }}
        </span>
        <span v-if="proState === 5 && stakeStatus === 'stake'">
          {{ $t("已结束") }}
        </span>
        <span
          v-if="
            proState === 1 &&
            stakeStatus === 'stake' &&
            detailCardType === 'will'
          "
        >
          {{ $t("未开始") }}: {{ countdowntime }}
        </span>

        <span v-if="stakeStatus === 'unstake'" @click="onUnstakeClick">
          {{ $t("解押") }}
        </span>
      </p>
    </star-button>
    <div v-if="!payState && proState !== 1">
      <star-space :size="20"></star-space>
      <span
        class="detail-wrap-content-left-unstake"
        :style="{ color: cardsInfo['common-color'] }"
        @click="changeStakeStatus('unstake')"
        v-if="stakeStatus === 'stake' && proState !== 1"
      >
        {{ $t("解押") }}
      </span>
      <span
        v-if="stakeStatus === 'unstake' && proState !== 3 && proState !== 4"
        style="margin-left: 5px"
        class="detail-wrap-content-left-unstake"
        :style="{ color: cardsInfo['common-color'] }"
        @click="changeStakeStatus('stake')"
      >
        {{ $t("质押") }}
      </span>
      <span
        v-if="stakeStatus === 'unstake' && proState === 3"
        style="margin-left: 5px"
        class="detail-wrap-content-left-unstake"
        :style="{ color: cardsInfo['common-color'] }"
        @click="changeStakeStatus('stake')"
      >
        {{ $t("锁仓") }}
      </span>
      <span
        v-if="stakeStatus === 'unstake' && proState === 4 && !payState"
        style="margin-left: 5px"
        class="detail-wrap-content-left-unstake"
        :style="{ color: cardsInfo['common-color'] }"
        @click="changeStakeStatus('stake')"
      >
        {{ $t("待支付") }}
      </span>
    </div>
    <!-- 支付成功 -->
    <div
      class="detail-wrap-content-left-paysuccess"
      v-if="payState && proState === 4"
    >
      <div class="detail-wrap-content-left-paysuccess-wrap">
        <img src="../../assets/home/pay-sucess.png" />
        <span class="detail-wrap-content-left-paysuccess-title">{{
          $t("支付成功")
        }}</span>
      </div>
      <star-space :size="10"></star-space>
      <p class="detail-wrap-content-left-paysuccess-detail">
        {{
          $t("支付成功文案", {
            assign: currencyInfo.assignCurrency,
            stake: currencyInfo.stakeCurrency,
          })
        }}
      </p>
    </div>
    <star-space :size="35"></star-space>
    <div class="detail-wrap-content-left-rule">
      <p>
        {{ $t("参与规则") }}
      </p>
      <star-space :size="10"></star-space>
      <p class="detail-wrap-content-left-rule-content">
        {{ this.lang === "zh" ? cardContent.ruleDesc : cardContent.ruleDescEn }}
      </p>
    </div>
  </div>
</template>
<script>
import StarButton from "@StarUI/StarButton.vue";
import StarInput from "@StarUI/StarInput.vue";
import StarSpace from "@StarUI/StarSpace.vue";
import { mapGetters, mapState, mapActions } from "vuex";
import utilsNumber from "@utils/number.js";
import { isNil, isUndefined } from "lodash";
import session from "@utils/session";
import { Wallet } from "@contactLogic";
import { countdown } from "@utils/date.js";
export default {
  data() {
    return {
      inputValue: "",
      stakeStatus: "stake", // 质押状态 质押stake   解压unstake
      lang: session.getItem("lang"),
      errorText: "",
      countdowntime: null,
      currencyShareAmount: "0", // 为0没有份额，说明没有参与活动
      isPaying: false,
      timer: null,
      isFocus: false,
      isHoverBtn: false,
    };
  },
  components: { StarInput, StarSpace, StarButton },
  mounted() {
    if (this.detailCardType === "will") {
      let time = this.detailCardInfo(this.detailCardId).startTime;
      this.timer = setInterval(() => {
        this.countdowntime = this.formateDate(countdown(time));
      }, 1000);
    }
  },
  methods: {
    ...mapActions("StoreHome", ["triggerStakeRecord"]),
    setFocus() {
      this.isFocus = true;
    },
    showRule(type, paystate) {
      if (type === "open") {
        if (paystate) {
          return false;
        }
        return true;
      }
      if (type === "closed" || type === "will") {
        return true;
      }
    },
    formateDate(obj) {
      const { day, hour, minute, second } = obj;
      if (
        isUndefined(day) &&
        isUndefined(hour) &&
        isUndefined(minute) &&
        isUndefined(second)
      ) {
        window.location.reload();
        return;
      }
      return `${day === 0 ? "" : `${day}D`} ${hour}:${minute}:${second}`;
    },
    getParams() {
      const { stakeAddress, payAddress, assignAddress } = this.currencyInfo;
      return {
        provider: this.stcProvider,
        // 这里token怎么传
        tokenCode: [stakeAddress, payAddress, assignAddress],
        chianID: this.stcChianID,
      };
    },
    // 获取代币份额
    getCurrencyShare(capTotal, precision) {
      if (!this.myStakeAmount) {
        this.currencyShareAmount = "0";
        return "0";
      }
      let amount = utilsNumber.formatNumberMeta(
        utilsNumber
          .bigNum(this.myStakeAmount)
          .times(capTotal)
          .div(this.stakeTotalAmount)
          .toString(),
        {
          precision,
          trailingZero: false,
          round: "floor",
        }
      ).text;
      if (isNil(amount) || !this.myStakeAmount) {
        amount = "0";
      }
      this.currencyShareAmount = amount;
      return amount;
    },
    changeStakeStatus(state) {
      this.stakeStatus = state;
      this.inputValue = "";
      this.errorText = "";
    },
    inputEvent(e) {
      if (this.detailCardType === "will") {
        return;
      }
      this.errorText = "";
      this.inputValue = e;
    },
    isNilCheck(val) {
      if (val === "NaN") {
        return "0";
      }
      return val;
    },
    maxEvent() {
      if (this.detailCardType === "will") {
        return;
      }
      if (this.stakeStatus === "stake") {
        // 最大质押量、钱包余额做比较
        if (
          utilsNumber
            .bigNum(this.restStakeAmount)
            .gte(this.balances[this.currencyInfo.stakeCurrency])
        ) {
          this.inputValue = this.isNilCheck(
            utilsNumber
              .bigNum(this.balances[this.currencyInfo.stakeCurrency])
              .div(Math.pow(10, this.currencyInfo.stakePrecision))
              .toString()
          );
        } else {
          this.inputValue = this.isNilCheck(
            utilsNumber
              .bigNum(this.restStakeAmount)
              .div(Math.pow(10, this.currencyInfo.stakePrecision))
              .toString()
          );
        }
      }
      if (this.stakeStatus === "unstake") {
        if (isNil(this.stakeAmount)) {
          return;
        }
        this.inputValue = this.isNilCheck(
          utilsNumber
            .bigNum(this.stakeAmount)
            .div(Math.pow(10, this.currencyInfo.stakePrecision))
            .toString()
        );
      }
    },
    renderAmount(balance) {
      if (isNil(balance)) return "0";
      return utilsNumber.formatNumberMeta(
        utilsNumber
          .bigNum(balance)
          .div(Math.pow(10, this.currencyInfo.stakePrecision))
          .toString(),
        { grouped: true }
      ).text;
    },

    validteStake() {
      if (!utilsNumber.bigNum(this.inputValue).gt(0)) {
        return false;
      }
      if (!utilsNumber.bigNum(this.inputValue).gte(100)) {
        this.errorText = this.$t("errors.最小质押100", {
          currency: this.currencyInfo.stakeCurrency,
        });
        return false;
      }
      if (
        utilsNumber
          .bigNum(this.inputValue)
          .gt(
            utilsNumber
              .bigNum(this.balances[this.currencyInfo.stakeCurrency])
              .div(Math.pow(10, this.currencyInfo.stakePrecision))
          )
      ) {
        this.errorText = this.$t("errors.账户余额不足");
        return false;
      }
      if (
        utilsNumber
          .bigNum(this.inputValue)
          .gt(
            utilsNumber
              .bigNum(this.restStakeAmount)
              .div(Math.pow(10, this.currencyInfo.stakePrecision))
          )
      ) {
        this.errorText = this.$t("errors.质押量超出个人额度上限");
        return false;
      }

      return true;
    },
    async onStakeClick() {
      if (!this.validteStake()) return;
      const params = this.getParams();
      const amount = utilsNumber
        .bigNum(this.inputValue)
        .times(Math.pow(10, this.currencyInfo.stakePrecision))
        .toString();
      const res = await Wallet.stakeFunc({
        ...params,
        amount,
      });
      // 质押成功
      if (res) {
        this.triggerStakeRecord({
          userAddress: this.stcAccounts[0],
          prdAddress: this.currencyInfo.assignAddress,
          userPledgeType: 1,
          currency: this.currencyInfo.assignCurrency,
          amount: this.inputValue,
        });
        // console.log("=====质押成功=====");
        // console.log("stake result:", res);
      }
      this.inputValue = "";
    },
    validteUnstake() {
      if (!utilsNumber.bigNum(this.inputValue).gt(0)) {
        return false;
      }
      if (
        utilsNumber
          .bigNum(this.inputValue)
          .gt(
            utilsNumber
              .bigNum(this.stakeAmount)
              .div(Math.pow(10, this.currencyInfo.stakePrecision))
          )
      ) {
        this.errorText = this.$t("errors.可解押量不足");
        return false;
      }
      return true;
    },
    async onUnstakeClick() {
      if (this.detailCardType === "will" || this.isPaying === true) {
        return;
      }
      if (!this.validteUnstake()) return;
      const params = this.getParams();
      const amount = utilsNumber
        .bigNum(this.inputValue)
        .times(Math.pow(10, this.currencyInfo.stakePrecision))
        .toString();
      const res = await Wallet.unStakeFunc({
        ...params,
        amount,
      });
      if (res) {
        this.triggerStakeRecord({
          userAddress: this.stcAccounts[0],
          prdAddress: this.currencyInfo.assignAddress,
          userPledgeType: 2,
          currency: this.currencyInfo.assignCurrency,
          amount: this.inputValue,
        });
        // console.log("=====解押成功=====");
        // console.log("unstake result:", res);
      }
      this.inputValue = "";
    },
    validtePay() {
      if (this.proState === 4) {
        if (this.currencyShareAmount === "0") {
          // 待支付状态但是没参与或者没有额度
          this.errorText = this.$t("errors.您未获得该活动额度");
          return false;
        }
      }
      return true;
    },
    async payUSDT() {
      if (!this.validtePay()) return;
      if (this.isPaying) return;
      this.isPaying = true;
      const params = this.getParams();
      const res = await Wallet.payUSDT({
        ...params,
      });
      if (res) {
        console.log("=====支付成功=====");
        this.$emit("eventLoop");
      }
      // 支付后去轮询接口
      // this.$emit("eventLoop");
    },
  },
  computed: {
    setButtonBg() {
      return function (focus, data) {
        if (!focus) {
          return {
            "background-image": `url(${data["detail-wrap-content-button"]})`,
          };
        }
        return {
          "background-image": `url(${data["detail-wrap-content-button-actived"]})`,
        };
      };
    },
    setInputBg() {
      return function (focus, data) {
        if (!focus) {
          return {
            "background-image": `url(${data["detail-input-wrap-bg"]})`,
          };
        }
        return {
          "background-image": `url(${data["detail-input-wrap-bg-actived"]})`,
        };
      };
    },
    ...mapState("StoreHome", {
      detailCardType: (state) => state.detailCardType,
      colorInfo: (state) => state.colorInfo,
      detailCardId: (state) => state.detailCardId,
      currencyInfo: (state) => state.currencyInfo,
    }),
    ...mapState("StoreWallet", {
      balances: (state) => state.balances,
      stcProvider: (state) => state.stcProvider,
      stcAccounts: (state) => state.stcAccounts,
      stcChianID: (state) => state.stcChianID,
    }),
    ...mapState("StoreContracts", {
      restStakeAmount: (state) => state.restStakeAmount,
      stakeAmount: (state) => state.stakeAmount,
      proState: (state) => state.proState,
      myStakeAmount: (state) => state.myStakeAmount,
      stakeTotalAmount: (state) => state.stakeTotalAmount,
      payState: (state) => state.payState,
    }),
    ...mapGetters("StoreHome", ["cardTypeColorInfo", "detailCardInfo"]),
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.noPointer {
  cursor: default;
}
.detail-input-wrap {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .detail-input {
    width: 100%;
  }
}

.detail-wrap-content-left-info {
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
}
.detail-wrap-content-button {
  color: $btn_base_bgcolor;
  height: 54px;
  text-align: center;
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: transparent;
  line-height: 54px;
  padding: 0;
  .detail-wrap-content-button-text {
    font-weight: 500;
    font-size: 24px;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    span {
      display: inline-block;
      width: 100%;
      -webkit-user-select: none;
      -ms-user-select: none;
      -khtml-user-select: none;
      user-select: none;
    }
  }
}
.detail-wrap-content-left-error {
  font-size: 14px;
  color: $text_error_color;
  font-weight: 500;
  text-align: center;
}
.detail-wrap-conent-left-amount-text {
  text-align: center;
  .detail-wrap-conent-left-amount-text-ttile {
    color: #959fa1;
    font-size: 14px;
  }
  .detail-wrap-conent-left-amount-text-amount {
    color: #fff;
    font-size: 22px;
  }
}
.detail-wrap-content-left-unstake {
  color: $text_light_color;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  display: inline-block;
}
.detail-wrap-content-left-paysuccess {
  color: #2afefe;
  .detail-wrap-content-left-paysuccess-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    .detail-wrap-content-left-paysuccess-title {
      font-size: 24px;
      margin-left: 5px;
    }
  }
  .detail-wrap-content-left-paysuccess-detail {
    font-size: 14px;
    font-weight: 500;
  }
}
.detail-wrap-content-left-rule {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  .detail-wrap-content-left-rule-content {
    color: $text_gray_color;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
