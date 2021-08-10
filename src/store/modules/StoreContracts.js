import contractsApi from "@api/contracts.js";
import * as types from "../constants/contracts";
import { fromPairs } from "lodash";
import utilsNumber from "@utils/number.js";

const StoreWallet = {
  namespaced: true,
  moduleName: "StoreContracts",
  state: {
    stakeAmount: null, // 个人已质押额度
    personStakeAmount: null, // 个人质押上限
    restStakeAmount: null, // 个人还可质押总额
    proState: null, // 1未开始 2进行中 3质押中 4待支付 5已结束
    stakeTotalAmount: null, // 总质押
    myStakeAmount: null, // 我的质押 列表展示
    payState: false, // 支付状态
  },
  mutations: {
    [types.SET_STAKE_AMOUNT](state, payload) {
      state.stakeAmount = payload;
    },
    [types.SET_PROJECT_INFO](state, payload) {
      state.personStakeAmount = payload.amount;
      state.proState = payload.proState;
      state.stakeTotalAmount = payload.stakeTotalAmount;
    },
    [types.SET_REST_STAKE_AMOUNT](state, payload) {
      state.restStakeAmount = payload;
    },
    [types.SET_STAKE_MY_AMOUNT](state, payload) {
      state.myStakeAmount = payload;
    },
    [types.SET_PAY_STATE](state, payload) {
      state.payState = payload;
      // state.payState = true;
    },
  },
  actions: {
    async loadInfo({ rootState, commit, state }, payload) {
      Promise.allSettled([
        // 获取质押额度
        contractsApi.getStakeAmount(
          rootState.StoreWallet.stcAccounts[0],
          payload
        ),
        // 获取项目详情
        contractsApi.getContractsProjectInfo(payload),
      ])
        .then((result) => {
          console.log("result", result);
          if (result[0].status === "fulfilled") {
            if (result[0].value.result) {
              let res = fromPairs(result[0].value.result.value);
              let value =
                res["staking_tokens"]["Struct"]["value"][0][1]["U128"];
              let myStake = res["staking_token_amount"]["U128"];
              let payState = res["is_pay_off"]["Bool"];
              commit(types.SET_STAKE_AMOUNT, value);
              commit(types.SET_STAKE_MY_AMOUNT, myStake);
              commit(types.SET_PAY_STATE, payState);
            }
          }
          if (result[1].status === "fulfilled") {
            let res = fromPairs(result[1].value.result.value);
            let amount = res.personal_staking_token_amount_limit.U128;
            let proState = res.state.U8;
            let stakeTotalAmount = res.staking_token_amount.U128;
            commit(types.SET_PROJECT_INFO, {
              amount,
              proState,
              stakeTotalAmount,
            });
          }
          if (
            result[0].status === "fulfilled" &&
            result[1].status === "fulfilled"
          ) {
            const restStakeAmount = utilsNumber
              .bigNum(state.personStakeAmount)
              .minus(state.stakeAmount || 0)
              .toString();
            commit(types.SET_REST_STAKE_AMOUNT, restStakeAmount);
          }
        })
        .catch((e) => {
          console.error("项目详情失败:", e);
        });
    },
  },
};

export default StoreWallet;
