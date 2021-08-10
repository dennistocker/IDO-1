<template>
  <div class="home">
    <div class="home-banner" v-if="status === 'home-list'">
      <div class="red-wrap">
        <img src="../../assets/home/red.png" />
      </div>
      <div class="home-banner-wrap star-container">
        <div class="home-banner-content">
          <p class="home-banner-title">ATLASPAD</p>
          <p class="home-banner-subtitle">
            {{ $t("连接stc生态第一步") }}
          </p>
          <div class="home-banner-btns">
            <star-button
              blborder
              class="home-banner-btns-btn"
              @click="utilsTool.openNewWindow('https://t.me/atlaspad')"
            >
              {{ $t("加入我们") }}
            </star-button>
            <star-button trborder dark class="home-banner-btns-btn">
              {{ $t("购买STC") }}
            </star-button>
          </div>
        </div>
        <img src="../../assets/home/man.png" />
      </div>
      <div class="green-wrap">
        <img src="../../assets/home/green.png" />
      </div>
      <support> </support>
    </div>

    <div class="star-container">
      <template v-if="status === 'home-list'">
        <home-list
          v-for="(d, index) in cardData"
          :key="index"
          :cardType="d.cardType"
          :data="d"
          style="margin-top: 70px"
          :cardsInfo="cardTypeColorInfo(d.cardType)"
          @clickMethod="clickMethod"
        ></home-list>
      </template>
      <template v-if="status === 'home-detail'">
        <home-detail></home-detail>
      </template>
    </div>
    <star-space :size="120"></star-space>
  </div>
</template>
<script>
import HomeList from "./homeList.vue";
import StarButton from "@StarUI/StarButton.vue";
import support from "./support.vue";
import { Notification } from "element-ui";
import HomeDetail from "./detail.vue";
import { mapState, mapGetters, mapActions } from "vuex";
import StarSpace from "@StarUI/StarSpace.vue";
import utilsTool from "@utils/tool";
export default {
  data() {
    return {
      cardTTTData: null,
      colorInfo: {},
      loading: true,
      utilsTool,
    };
  },
  components: {
    StarButton,
    support,
    HomeDetail,
    HomeList,
    StarSpace,
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    ...mapActions("StoreHome", ["getDataList"]),
    clickMethod(value) {
      if (this.walletStatus !== "connected") {
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
            [h("p", this.$t("wallet.connect-tip"))]
          ),
          duration: 2000,
          offset: 80,
          showClose: false,
        });
        return;
      }
      // 防止footer展露出来
      window.scrollTo(0, 500);
      this.$store.commit(
        "StoreHome/STORE_HOME_CHANGE_STATUS",
        Object.assign({}, { status: "home-detail" }, { ...value })
      );
    },
  },
  computed: {
    ...mapGetters("StoreHome", ["cardTypeColorInfo"]),
    ...mapState("StoreHome", {
      status: (state) => state.status,
      cardData: (state) => state.cardData,
    }),
    ...mapState("StoreApp", {
      language: (state) => state.language,
    }),
    ...mapState("StoreWallet", {
      walletStatus: (state) => state.walletStatus,
    }),
  },

  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

@keyframes light {
  0% {
    opacity: 100%;
  }
  25% {
    opacity: 60%;
  }
  50% {
    opacity: 30%;
  }
  70% {
    opacity: 60%;
  }
  100% {
    opacity: 90%;
  }
}

@keyframes lightGreen {
  0% {
    opacity: 30%;
  }
  25% {
    opacity: 50%;
  }
  50% {
    opacity: 100%;
  }
  70% {
    opacity: 50%;
  }
  100% {
    opacity: 30%;
  }
}

.red-wrap {
  animation-name: light;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  position: absolute;
  left: 0;
  top: 0;
  img {
    width: 100%;
    height: 100%;
  }
}
.green-wrap {
  animation-name: lightGreen;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  position: absolute;
  right: 0;
  bottom: 0;
  img {
    width: 100%;
    height: 100%;
  }
}
.home-banner {
  z-index: 999;
  width: 100%;
  background-image: url("../../assets/home/nbg.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  overflow: hidden;
  height: 600px;
  position: relative;
  .home-banner-wrap {
    height: 100%;
    margin: 0 auto;
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .home-banner-content {
    display: inline-block;

    color: #fff;
    .home-banner-title {
      @include fontRigelstar();
      font-weight: 400;
      font-size: 70px;
    }
    .home-banner-subtitle {
      font-size: 22px;
      margin-top: 25px;
    }
    .home-banner-btns {
      margin-top: 30px;
      .home-banner-btns-btn {
        width: 150px;
        height: 50px;
        line-height: 50px;
        font-size: 26px;
        font-weight: bold;
      }
      .home-banner-btns-btn + .home-banner-btns-btn {
        margin-left: 30px;
      }
    }
    .home-banner-desc {
      font-size: 14px;
      margin-top: 30px;
    }
  }
}
@media screen and (max-width: 1440px) {
  .home-banner {
    height: 600px;
    .home-banner-content {
      margin-top: -40px;
      .home-banner-title {
        // font-size: 80px;
      }
      // margin-top: 100px;
      .home-banner-btns {
        .home-banner-btns-btn {
          // width: 160px;
          // height: 50px;
          // line-height: 50px;
          font-size: 26px !important;
        }
      }
    }
  }
}
</style>
