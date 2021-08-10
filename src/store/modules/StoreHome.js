import * as types from "../constants/home.js";
import dayjs from "dayjs";
import homeApi from "../../api/home.js";
// import utilsNumber from "@utils/number.js";
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
    // 活动币种信息， 基础币、质押币、支付币
    currencyInfo: {},
  },
  mutations: {
    [types.STORE_HOME_CHANGE_STATUS](state, info) {
      const { cardType, status, cardId, currencyInfo } = info;
      state.detailCardType = cardType;
      state.status = status;
      state.currencyInfo = currencyInfo;
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
          "label-border-color": "rgba(42, 254, 254, 0.25)",
        };
      }
      if (type === "will") {
        obj = {
          "list-bg-color": "#303244",
          "common-color": "#bbff8a",
          "label-text-color": "#86B66B",
          "label-border-color": "rgba(187, 255, 138, 0.26)",
        };
      }
      if (type === "closed") {
        obj = {
          "list-bg-color": "#303352",
          "common-color": "#A6DFE6",
          "label-text-color": "#7DA2B3",
          "label-border-color": "rgba(166, 223, 230, 0.28)",
        };
      }
      obj[
        "list-item-wrap-bg"
      ] = require(`../../assets/card/${type}-card-item.png`);
      obj[
        "detail-input-wrap-bg"
      ] = require(`../../assets/home/${type}-input-border.png`);

      obj[
        "detail-wrap-content-button"
      ] = require(`../../assets/home/${type}-button.png`);
      obj[
        "detail-input-wrap-bg-actived"
      ] = require(`../../assets/home/${type}-input-border-actived.png`);
      obj[
        "detail-wrap-content-button-actived"
      ] = require(`../../assets/home/${type}-button-actived.png`);
      return obj;
    },
    detailCardInfo: (state) => (id) => {
      return state.cardData
        .filter((d) => d.cardType === state.detailCardType)[0]
        .cardInfoList.filter((dd) => dd.id === id)[0];
    },
  },
  actions: {
    /* eslint-disable*/
    async triggerStakeRecord({}, params) {
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
      let results = [];
      const endStates = ["processing", "init", "finish"];
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
            payCurrency,
            payPrecision,
            payAddress,
            assignCurrency,
            assignPrecision,
            assignAddress,
            pledgeCurrency,
            pledgePrecision,
            pledgeAddress,
            saleTotal,
          } = d;
          const capTotal = saleTotal;
          //质押币种、精度、地址
          // pledgeCurrency: null;
          // pledgePrecision;
          // pledgeAddress;
          // //支付币种、精度、地址
          // payCurrency;
          // payPrecision;
          // payAddress;
          // //分配币种/精度、地址
          // assignCurrency;
          // assignPrecision;
          // assignAddress;
          return {
            ...d,
            currencyInfo: {
              // 质押
              stakeCurrency: pledgeCurrency,
              stakePrecision: pledgePrecision,
              stakeAddress: pledgeAddress,
              // stakeCurrency: "STC",
              // stakePrecision: 9,
              // stakeAddress: "0x1::STC::STC",
              //支付币种、精度、地址
              payCurrency,
              payPrecision,
              payAddress,
              // //分配币种/精度、地址
              assignCurrency,
              assignPrecision,
              assignAddress,
              // payCurrency: "USDT",
              // payPrecision: 9,
              // payAddress:
              //   "0xd800a4813e2f3ef20f9f541004dbd189::DummyToken::USDT",
              //分配币种/精度、地址
              // assignCurrency: "DUMMY",
              // assignPrecision: 9,
              // assignAddress:
              //   "0xd800a4813e2f3ef20f9f541004dbd189::DummyToken::DUMMY",
            },
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
            decentralizedList: [
              0,
              capTotal,
              currencyTotal,
              0,
              rate,
              raiseTotal,
            ],
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
