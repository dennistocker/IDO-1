import * as types from "../constants/home.js";
import dayjs from "dayjs";
import homeApi from "../../api/home.js";
import utilsNumber from "@utils/number.js";
const mapKey = new Map([
  ["processing", "open"],
  ["init", "will"],
  ["finish", "closed"],
]);
const StoreHome = {
  namespaced: true,
  state: {
    status: "home-list",
    detailCardType: "", // 详情页卡片类型,
    detailCardId: null, // 具体卡片的id
    cardData: null,
    currencyToken: null,
    currencyName: null,
  },
  mutations: {
    [types.STORE_HOME_CHANGE_STATUS](state, info) {
      console.log("info", info);
      const { cardType, status, cardId, token, currencyName } = info;
      state.detailCardType = cardType;
      state.status = status;
      state.currencyToken = token;
      state.currencyName = currencyName;
      if (cardId) {
        state.detailCardId = cardId;
      }
    },
    [types.STORE_HOME_SET_DATA_LIST](state, payload) {
      state.cardData = payload;
    },
  },
  getters: {
    cardTypeColorInfo: () => (type) => {
      let obj = {};
      if (type === "open") {
        obj = {
          "list-bg-color": "#192A51",
          "common-color": "#2afefe",
          "label-text-color": "#23B0B4",
        };
      }
      if (type === "will") {
        obj = {
          "list-bg-color": "#303244",
          "common-color": "#bbff8a",
          "label-text-color": "#86B66B",
        };
      }
      if (type === "closed") {
        obj = {
          "list-bg-color": "#303352",
          "common-color": "#A6DFE6",
          "label-text-color": "#7DA2B3",
        };
      }
      obj[
        "list-item-wrap-bg"
      ] = require(`../../assets/card/${type}-card-item.png`);
      // if (type !== "closed") {
      obj[
        "detail-input-wrap-bg"
      ] = require(`../../assets/home/${type}-input-border.png`);
      // }

      obj[
        "detail-wrap-content-button"
      ] = require(`../../assets/home/${type}-button.png`);
      return obj;
    },
    detailCardInfo: (state) => (id) => {
      return state.cardData
        .filter((d) => d.cardType === state.detailCardType)[0]
        .cardInfoList.filter((dd) => dd.id === id)[0];
    },
  },
  actions: {
    async triggerStakeRecord(params) {
      const res = await homeApi.triggerStakeRecord(params);
      console.log("=====triggerStakeRecord====", res);
    },
    // async getCardInfo() {
    // let pId = state.detailCardId;
    // let res = await homeApi.getCardInfo(pId);
    // console.log(res);
    // },
    async getDataList({ commit }) {
      let res = await homeApi.getDataList();
      console.log("====getDataList=====", res);
      let results = [];
      const endStates = ["processing", "init", "finish"];
      // const endStates = ["init"];
      for (let i = 0; i < endStates.length; i++) {
        const cardInfoList = res.data[endStates[i]].map((d) => {
          const {
            raiseTotal,
            rate,
            pledgeEndTime, // 质押结束时间
            lockStartTime, // 锁仓开始时间
            lockEndTime, // 锁仓结束时间
            pledgeStartTime, // 质押开始时间
            payStartTime, // 支付开始时间
            payEndTime, // 支付结束时间
            assignmentStartTime, // 代币分配开始时间
            assignmentEndTime, // 代币分配结束时间
            currencyTotal, //代币发行总量
          } = d;
          const capTotal = utilsNumber.bigNum(raiseTotal).div(rate).toString();
          return {
            ...d,
            cardType: mapKey.get(endStates[i]),
            capTotal,
            proTimeList: [
              {
                title: "质押时间",
                startDate: dayjs(pledgeStartTime).format("YYYY/MM/DD HH:mm:ss"),
                endDate: dayjs(pledgeEndTime).format("YYYY/MM/DD HH:mm:ss"),
              },
              {
                title: "锁仓时间",
                startDate: dayjs(lockStartTime).format("YYYY/MM/DD HH:mm:ss"),
                endDate: dayjs(lockEndTime).format("YYYY/MM/DD HH:mm:ss"),
              },
              {
                title: "支付时间",
                startDate: dayjs(payStartTime).format("YYYY/MM/DD HH:mm:ss"),
                endDate: dayjs(payEndTime).format("YYYY/MM/DD HH:mm:ss"),
              },
              {
                title: "代币分配时间",
                startDate: dayjs(assignmentStartTime).format(
                  "YYYY/MM/DD HH:mm:ss"
                ),
                endDate: dayjs(assignmentEndTime).format("YYYY/MM/DD HH:mm:ss"),
              },
            ],
            decentralizedList: [0, 0, currencyTotal, 0, rate, raiseTotal],
          };
        });
        let obj = {
          cardType: mapKey.get(endStates[i]),
          cardInfoList,
        };
        results.push(obj);
      }
      results = results.filter((d) => d.cardInfoList.length > 0);
      console.log("results", results);
      commit(types.STORE_HOME_SET_DATA_LIST, results);
    },
  },
};

export default StoreHome;
