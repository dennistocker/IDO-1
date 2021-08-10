<template>
  <div class="star-footer animate__animated animate__fadeInUp">
    <div class="star-footer-left">
      <p class="star-footer-left-title">ATLASPAD</p>
      <p class="star-footer-left-desc">
        <!-- <span>
          {{ $t("Terms") }}
        </span>
        <span>
          {{ $t("法律") }}
        </span> -->
      </p>
    </div>
    <div class="star-footer-right">
      <div v-for="(d, index) in data" :key="index">
        <p class="star-footer-right-title">
          {{ $t(d.name) }}
        </p>
        <p
          v-for="(dd, ii) in d.list"
          :key="ii"
          class="star-footer-right-item"
          @click="pushPage(dd.url)"
        >
          {{ $t(dd.name) }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import utilsTool from "@utils/tool";
export default {
  data() {
    return {
      data: [
        {
          name: "Social",
          list: [
            { name: "Twitter", url: "https://twitter.com/AtlasPad" },
            { name: "Medium", url: "https://medium.com/@atlaspad" },
            { name: "Telegram", url: "https://t.me/atlaspad" },
            {
              name: "Github",
              url: "https://github.com/xfhxfh1212/initial-dex-offering",
            },
          ],
        },
        // {
        //   name: "AtlasPad",
        //   list: [{ name: "Whitepaper", url: "" }],
        // },
        // {
        //   name: "Get in Touch",
        //   list: [{ name: "12321313@qq.com", url: "" }],
        // },
      ],
    };
  },
  mounted() {},
  methods: {
    pushPage(url) {
      utilsTool.openNewWindow(url);
    },
  },
  computed: {},
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.star-footer {
  background: #2e345b;
  text-align: center;
  color: #fff;
  padding: 70px 90px 30px;
  position: relative;
  height: 300px;
  animation-duration: 1s;
  display: flex;
  .star-footer-left {
    flex: 1;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    text-align: left;
    .star-footer-left-title {
      font-family: Rigelstar;
      font-size: 28px;
    }
    .star-footer-left-desc {
      display: flex;
      color: $text_gray_color;
      span {
        font-size: 14px;
      }
      span + span {
        margin-left: 100px;
      }
    }
  }
  .star-footer-right {
    flex: 1;
    display: flex;
    justify-content: space-around; // justify-content: space-around;
    .star-footer-right-title {
      margin-bottom: 30px;
      font-size: 20px;
    }
    .star-footer-right-item {
      margin-bottom: 10px;
      font-size: 14px;
      color: $text_gray_color;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
