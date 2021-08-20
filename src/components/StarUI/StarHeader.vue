<template>
  <div class="star-header">
    <div class="star-header-left">
      <img src="../../assets/header/logo.png" />
      <Menu
        :default-active="activeHeaderItem"
        mode="horizontal"
        class="star-menu"
        @select="handleSelectTab"
      >
        <MenuItem
          :index="d.value"
          class="star-menu-item"
          v-for="(d, index) in headerItems"
          :key="index"
          :class="{ 'star-menu-item-active': activeHeaderItem === d.value }"
        >
          {{ $t(`${d.label}`) }}
        </MenuItem>
      </Menu>
    </div>

    <div class="star-header-right">
      <star-button light @click="pushPage">
        <img
          src="../../assets/home/video.png"
          style="width: 12px; height: 12px"
        />
      </star-button>
      <star-connect-wallet
        class="star-header-right-btn"
        @click="onClickConnect"
      ></star-connect-wallet>
      <star-drop-down
        trigger="click"
        :itemList="langs"
        @handleClick="hanldeChangeLang"
        :activeValue="currLang"
      >
        <template #tag>
          <star-button light>
            {{ $t("语言") }}
          </star-button>
        </template>
      </star-drop-down>
    </div>
  </div>
</template>
<script>
import { Menu, MenuItem } from "element-ui";
import StarButton from "@StarUI/StarButton.vue";
import StarDropDown from "@StarUI/StarDropDown.vue";
import session from "@utils/session.js";
import { mapState, mapActions } from "vuex";
import { Notification } from "element-ui";
import { Wallet } from "@contactLogic";
import utilsTool from "@utils/tool";
import { STAR_MASK_PLUGIN_URL } from "@constants/contracts";
import StarConnectWallet from "./StarConnectWallet.vue";

export default {
  name: "StarHeader",
  data() {
    return {
      currLang: null,
      langs: [
        { text: "中文", value: "zh" },
        { text: "ENG", value: "en" },
      ],
      isStarMaskInstalled: null,
    };
  },
  components: {
    Menu,
    MenuItem,
    StarButton,
    StarDropDown,
    StarConnectWallet,
  },
  mounted() {
    const currLang = session.getItem("lang");
    this.currLang = currLang;
  },
  methods: {
    pushPage() {
      window.open(
        "https://medium.com/@atlaspad/atlaspad-video-tutorial-ba8985298aaa",
        "_blank"
      );
    },
    ...mapActions("StoreWallet", [
      "setOnboarding",
      "setStcAccounts",
      "setStcProvider",
      "setStcChianID",
    ]),
    handleSelectTab() {
      this.$store.commit("StoreHome/STORE_HOME_CHANGE_STATUS", {
        status: "home-list",
      });
      window.scrollTo(0, 0);
      // 切换tab
      // this.activeHeaderItem = key;
    },
    hanldeChangeLang(value) {
      let currLang = this.language;
      if (currLang === value) return;
      if (currLang !== value) {
        session.setItem("lang", value);
        window.location.reload();
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
    // async getAccountBalance() {
    //   // console.log("stcAccounts", this.stcAccounts);
    //   if (this.stcProvider) {
    //     const params = {
    //       provider: this.stcProvider,
    //       account: this.stcAccounts[0], // 默认取STC
    //     };
    //     // 获取钱包STC额度
    //     const balance = await Wallet.getAccountBalance(params);
    //     if (!isNil(balance) || !isUndefined(balance)) {
    //       this.$store.commit("StoreWallet/SET_WALLET_BALANCE", {
    //         stc: balance,
    //       });
    //     }
    //   }
    // },
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
      // this.connetWallet();
      // 需要依赖某些状态，直接刷新页面了
      window.location.reload();
    },
  },
  watch: {
    stcAccounts(value) {
      if (value && value.length) {
        // this.walletStatus = "Connected";
        this.$store.commit(
          "StoreWallet/SET_WALLET_CONNECT_STATUS",
          "connected"
        );
        this.loadData();
      }
    },
  },
  computed: {
    ...mapState("StoreApp", ["headerItems", "activeHeaderItem", "language"]),
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
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.star-header {
  height: 80px;
  width: calc(100% - 80px);
  display: flex;
  align-items: center;
  background-image: url("../../assets/header/header.png");
  background-repeat: no-repeat;
  background-size: cover;
  padding: 0px 30px;
  padding-left: 50px;
  box-sizing: content-box;
  display: flex;
  justify-content: space-between;
  .star-menu {
    background-color: transparent;
    border-bottom: none;
    margin-left: 50px;
  }
  .star-menu-item {
    height: 80px;
    line-height: 80px;
    color: #fff;
    text-align: center;
    font-size: 18px;
    padding: 0px 20px;
    &:hover {
      background-color: transparent !important;
      color: $text_light_color !important;
    }
  }
  .el-menu-item.is-active {
    background-color: transparent !important;
    border-bottom: 2px solid $light_bordercolor;
    color: $text_light_color !important;
  }
  .el-menu-item.is-active.star-menu-item-active {
    background: linear-gradient(
      180deg,
      rgba(84, 255, 255, 0) 0%,
      rgba(42, 254, 254, 0.21) 100%
    );
  }
  .star-header-left {
    display: flex;
    align-items: center;
    img {
      margin-right: 10px;
    }
  }
  .star-header-right {
    display: flex;
    align-items: center;
    .star-button {
      padding: 8px 20px;
      box-sizing: border-box;
      height: 36px;
    }
    .star-header-right-btn {
      margin-right: 20px;
      margin-left: 20px;
    }
  }
}
</style>
