<template>
  <div
    class="home-list-wrap animate__animated animate__fadeInUp"
    :style="{ '--color': cardsInfo['common-color'] }"
  >
    <div class="home-list-wrap-title">
      <p
        class="home-list-title"
        :style="`background-image: url(${require(`../../assets/home/${cardType}-homelist-top.png`)})`"
      >
        {{ renderTitle(cardType) }}
      </p>
    </div>
    <div
      class="home-list"
      :style="`background-image: url(${require(`../../assets/home/${cardType}-homelist-middle.png`)})`"
    >
      <div class="home-list-content">
        <div
          class="home-list-item-wrap"
          v-for="(cardData, index) in data.cardInfoList"
          :key="index"
          @click="emit(cardData.cardType, cardData.id, cardData.currencyInfo)"
          :style="`background-image: url(${cardsInfo['list-item-wrap-bg']})`"
        >
          <div
            v-if="cardData.attributes"
            class="home-list-item-wrap-labels"
            :style="
              mixinSetLabelsBg(
                cardType,
                cardData.attributes.length > 2 ? 2 : cardData.attributes.length
              )
            "
          >
            <span v-for="(l, ix) in cardData.attributes.slice(0, 2)" :key="ix">
              {{ $t(`${l.name}`) }}
            </span>
          </div>
          <home-list-item
            :cardType="cardType"
            :colorsInfo="cardsInfo"
            :data="cardData"
          ></home-list-item>
          <div class="home-list-item-wrap-footer">
            <span v-if="cardType === 'open'">
              {{ $t("进行中") }}
            </span>
            <span v-if="cardType === 'will'">
              {{ $t("即将推出") }}

              {{ timers && timers[index].countdown }}
            </span>
            <span v-if="cardType === 'closed'">
              {{ $t("已经结束") }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <img
      class="banner-img"
      :src="`${require(`../../assets/home/${cardType}-homelist-bottom.png`)}`"
    />
  </div>
</template>
<script>
import homeListItem from "@components/Home/homeListItem.vue";
import mixinHome from "@mixins/home.js";
import { cloneDeep, isUndefined } from "lodash";
import { countdown } from "@utils/date.js";
export default {
  name: "homelist",
  data() {
    return {
      timer: null,
      cardList: null,
      timers: null,
    };
  },
  mixins: [mixinHome],
  components: {
    homeListItem,
  },
  props: {
    cardsInfo: Object,
    cardType: {
      type: String,
    },
    data: {
      type: Object,
    },
  },
  mounted() {
    this.timers = cloneDeep(this.data.cardInfoList);
    if (this.data.cardType === "will") {
      this.timers.map((d) => {
        this.$set(d, "countdown", d.startTime);
      });
      this.playTimer();
    }
  },
  methods: {
    renderTitle(type) {
      if (type === "open") {
        return this.$t("进行中");
      }
      if (type === "will") {
        return this.$t("即将推出");
      }
      if (type === "closed") {
        return this.$t("已经结束");
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
    playTimer() {
      this.timer = setInterval(() => {
        for (let key in this.timers) {
          this.timers[key].countdown = this.formateDate(
            countdown(this.timers[key].startTime)
          );
        }
      }, 1000);
    },
    emit(cardType, id, currencyInfo) {
      this.$emit("clickMethod", {
        cardType: cardType,
        cardId: id,
        currencyInfo,
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.banner-img {
  width: 100%;
  display: block;
}
.home-list-wrap {
  width: 100%;
  .home-list-title {
    font-size: 32px;
    padding-top: 20px;
    padding-left: 48px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height: 80px;
    color: var(--color);
  }
}
.home-list {
  background-size: 100% 100%;
  background-repeat: repeat-y;
  min-height: 550px;
  width: 100%;
  overflow: hidden;
  color: var(--color);

  .home-list-content {
    cursor: pointer;
    overflow: hidden;
    // margin-top: 20px;
    padding: 0px 48px;
    .home-list-item-wrap {
      border: 3px solid transparent;
      padding: 60px 30px 0px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      height: 544px;
      width: 374px;
      margin-bottom: 20px;
      margin-left: 15px;
      position: relative;
      &:hover {
        transition: all ease 0.15s;
        border: 3px solid var(--color);
      }
      .home-list-item-wrap-labels {
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
          padding-left: 12px;
        }
      }
    }
    .home-list-item-wrap:nth-child(3n + 1) {
      margin-left: 0%;
    }
    .home-list-item-wrap-footer {
      text-align: center;
      font-size: 16px;
      position: absolute;
      left: 0;
      bottom: 40px;
      right: 0;
    }
  }
}
</style>
