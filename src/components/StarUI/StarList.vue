<template>
  <div class="star-list">
    <div
      class="star-list-item prodetail"
      v-if="type === 'prodetail'"
      :style="setStyle()"
    >
      <span class="title">
        {{ data.name }}
      </span>
      <span class="amount">
        {{ data.text }}
      </span>
    </div>
    <div class="star-list-item time" v-if="type === 'time'" :style="setStyle()">
      <span class="title">
        {{ $t(`${data.title}`) }}
      </span>
      <div class="time-info">
        <p v-if="data.startDate" class="time-info-date">
          <span>
            {{ $t("始") }}
          </span>
          <span>{{ data.startDate }}</span>
        </p>
        <p v-if="data.endDate" class="time-info-date">
          <span>
            {{ $t("至") }}
          </span>
          <!-- <span> 2021 08 12 / 12:00:00 </span> -->
          <span>{{ data.endDate }}</span>

          <span style="margin-left: 8px">UTC+8</span>
        </p>
        <!-- <p v-else>
          <span>{{ data.date }}</span>
        </p> -->
      </div>
    </div>
  </div>
</template>
<script>
import utilsNumber from "@utils/number";
export default {
  data() {
    return {
      utilsNumber,
    };
  },
  props: {
    data: {
      type: Object,
    },
    bgColor: null,
    type: String,
  },
  mounted() {},
  methods: {
    setStyle() {
      if (this.bgColor) {
        return { "background-color": this.bgColor };
      }
    },
  },
  computed: {},
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.star-list {
  width: 100%;
  &.star-list {
    margin-top: 3px;
  }
  .star-list-item {
    width: 100%;
    padding: 15px;
    // background-color: red;
    &.prodetail {
      display: flex;
      font-size: 14px;
      .title {
        display: flex;
        flex: 1;
        color: $text_gray_color;
      }
      .amount {
        display: flex;
        flex: 3;
        font-weight: 500;
        color: #fff;
      }
    }
    &.time {
      display: flex;
      font-size: 14px;
      align-items: center;
      .title {
        display: flex;
        flex: 1.3;
        color: $text_gray_color;
      }
      .time-info {
        margin-left: 30px;
        display: flex;
        flex: 3;
        flex-direction: column;
        justify-content: center;
        color: #fff;
        .time-info-date {
          span:first-child {
            display: inline-block;
            width: 45px;
          }
        }
      }
    }
  }
}
</style>
