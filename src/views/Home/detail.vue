<template>
  <div class="detail-wrap animate__animated animate__fadeInUp">
    <star-space :size="30"></star-space>
    <div class="detail-wrap-content">
      <div
        class="detail-wrap-content-left"
        :style="`background-image: url(${require(`../../assets/home/${detailCardType}-left-bg.png`)})`"
      >
        <detail-left-card @eventLoop="eventLoop"> </detail-left-card>
      </div>
      <div
        class="detail-wrap-content-right"
        :style="`background-image: url(${require(`../../assets/home/${detailCardType}-right-bg.png`)})`"
      >
        <detail-right-card> </detail-right-card>
      </div>
    </div>
  </div>
</template>
<script>
import StarSpace from "@StarUI/StarSpace.vue";
import DetailRightCard from "@components/Home/detailRightCard.vue";
import DetailLeftCard from "@components/Home/detailLeftCard.vue";
import { mapActions, mapState } from "vuex";
import { Wallet } from "@contactLogic";
import { isNil, isUndefined } from "lodash";
export default {
  components: {
    StarSpace,
    DetailRightCard,
    DetailLeftCard,
  },
  data() {
    return {
      inputValue: "",
    };
  },
  mounted() {
    if (this.walletStatus !== "connected") {
      console.error("wallet not conneceted");
      return;
    }
    this.getBanlance();
    this.loadInfo({
      stakeToken: this.currencyInfo.stakeAddress,
      payToken: this.currencyInfo.payAddress,
      assignToken: this.currencyInfo.assignAddress,
    });
  },
  methods: {
    async getBanlance() {
      const params = {
        provider: this.stcProvider,
        account: this.stcAccounts[0],
        token: this.currencyInfo.stakeAddress,
      };
      // 获取钱包下特定币种S额度
      const balance = await Wallet.getAccountBalance(params);
      if (!isNil(balance) || !isUndefined(balance)) {
        this.$store.commit("StoreWallet/SET_WALLET_BALANCE", {
          [this.currencyInfo.stakeCurrency]: balance,
        });
      }
    },
    // 支付后轮询查询状态
    eventLoop() {
      // this.timer = setInterval(() => {
      //   this.loadInfo({
      //     stakeToken: this.currencyInfo.stakeAddress,
      //     payToken: this.currencyInfo.payAddress,
      //     assignToken: this.currencyInfo.assignAddress,
      //   });
      // }, 7000);
    },
    inputEvent(e) {
      this.inputValue = e;
    },
    ...mapActions("StoreContracts", ["getStakeAmount", "loadInfo"]),
  },
  computed: {
    ...mapState("StoreHome", {
      detailCardType: (state) => state.detailCardType,
      currencyInfo: (state) => state.currencyInfo,
    }),
    ...mapState("StoreWallet", ["stcAccounts", "stcProvider", "walletStatus"]),
  },
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
.detail-wrap {
  padding-top: 40px;
  .detail-wrap-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .detail-wrap-content-left {
      width: 36%;
      padding: 40px 20px 50px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .detail-wrap-content-right {
      width: 55%;
      background-repeat: no-repeat;
      background-image: url("../../assets/home/open-right-bg.png");
      background-size: 100% 100%;
    }
  }
}
</style>
