<template>
  <star-button dark>
    <span @click="onClickConnect">
      <span v-if="walletStatus === 'unConnected'">
        {{ $t("连接钱包") }}
      </span>
      <span v-if="walletStatus === 'connected'">
        {{ $t("已连接") }}
      </span>
    </span>
  </star-button>
</template>

<script>
import StarButton from "@StarUI/StarButton.vue";
import session from "@utils/session.js";
import { mapState, mapActions } from "vuex";
import { Notification } from "element-ui";
import { Wallet } from "@contactLogic";
import utilsTool from "@utils/tool";
import { STAR_MASK_PLUGIN_URL } from "@constants/contracts";
export default {
  name: "StarConnectWallet",
  data() {
    return {
      isStarMaskInstalled: null,
    };
  },
  components: {
    StarButton,
  },
  mounted() {
    const currLang = session.getItem("lang");
    this.currLang = currLang;
  },
  methods: {
    ...mapActions("StoreWallet", [
      "setOnboarding",
      "setStcAccounts",
      "setStcProvider",
      "setStcChianID",
    ]),
    handleNewAccounts() {
      if (this.isStarMaskInstalled) {
        console.log("切换账户了");
      }
    },
    async loadData() {
      // 网络id
      // const chianID = await Wallet.getStcChianID();
      // session.setItem("chianID", chianID);
      // this.setStcChianID(chianID);
      const permissions = await Wallet.getPermissions();
      console.log("permissions", permissions);
      // if (!permissions.length) {
      //   this.setPermissions();
      // }
      // this.getAccountBalance();
    },
    async setPermissions() {
      const permArr = await Wallet.setPermissions();
      console.log("permissions:", permArr);
    },
    async onClickConnect() {
      // 检查是否下载
      if (!this.isStarMaskInstalled) {
        const h = this.$createElement;
        Notification({
          message: h(
            "div",
            {
              style: {
                position: "relative",
                "font-size": "14px",
                color: "#FFFFFF",
              },
            },
            [
              h("p", this.$t("wallet.download-tip")),
              h(
                "p",
                {
                  style: {
                    color: "#29F3F6",
                    cursor: "pointer",
                    "word-break": "break-all",
                    "margin-top": "8px",
                  },
                  on: {
                    click: () => {
                      utilsTool.openNewWindow(STAR_MASK_PLUGIN_URL);
                    },
                  },
                },
                STAR_MASK_PLUGIN_URL
              ),
              h(
                "star-button",
                {
                  props: {
                    light: true,
                  },
                  style: {
                    padding: "5px",
                    "margin-left": "200px",
                    "margin-top": "20px",
                  },
                  on: {
                    click: () => {
                      utilsTool.openNewWindow(STAR_MASK_PLUGIN_URL);
                    },
                  },
                },
                this.$t("前去下载")
              ),
            ]
          ),
          duration: 2000,
          offset: 100,
          showClose: false,
        });
        // 加上会直接跳转到chorme插件
        // 推测是链接跳转
        // this.onboarding.startOnboarding();
        return;
      }
      const isStarMaskConnected =
        this.stcAccounts && this.stcAccounts.length > 0;
      if (isStarMaskConnected) {
        this.$store.commit(
          "StoreWallet/SET_WALLET_CONNECT_STATUS",
          "connected"
        );
        if (this.onboarding) this.onboarding.stopOnboarding();
        this.loadData();
      } else {
        this.connetWallet();
      }
    },
    async connetWallet() {
      this.$store.commit(
        "StoreWallet/SET_WALLET_CONNECT_STATUS",
        "unConnected"
      );
      const accounts = await Wallet.connect();
      this.setStcAccounts(accounts);
    },
    handleAccountsChange() {
      // 需要依赖某些状态，直接刷新页面了
      window.location.reload();
    },
  },
  watch: {
    stcAccounts(value) {
      if (value && value.length) {
        this.$store.commit(
          "StoreWallet/SET_WALLET_CONNECT_STATUS",
          "connected"
        );
        this.loadData();
      }
    },
  },
  computed: {
    ...mapState("StoreWallet", [
      "stcAccounts",
      "onboarding",
      "stcProvider",
      "walletStatus",
    ]),
  },
  beforeDestroy() {},

  async created() {
    if (!this.onboarding) {
      const onboarding = Wallet.createStarMaskOnboarding();
      console.log("onboarding", onboarding);
      if (onboarding) this.setOnboarding(onboarding);
    }
    const stcProvider = Wallet.createStcProvider();
    this.setStcProvider(stcProvider);
    this.isStarMaskInstalled = Wallet.checkStarMaskInstalled();
    if (this.isStarMaskInstalled) {
      window.starcoin &&
        window.starcoin.on("accountsChanged", () => {
          this.handleAccountsChange();
        });
      this.connetWallet();
    }
  },
};
</script>
