import {
  SMART_CONTRACTS_API,
  SMART_CONTRACTS_TEST_API,
  CONTRACTS_TEST_ADDRESS,
  CONTRACTS_ADDRESS,
} from "@constants/contracts";
// 合约相关接口
import request from "@utils/request";
const COUNT = "";

let CONTRACTS_URL, CONTRACTS_ADD;
if (process.env.NODE_ENV !== "development") {
  // 线上
  CONTRACTS_URL = SMART_CONTRACTS_API;
  CONTRACTS_ADD = CONTRACTS_ADDRESS;
} else {
  // 开发
  CONTRACTS_URL = SMART_CONTRACTS_TEST_API;
  CONTRACTS_ADD = CONTRACTS_TEST_ADDRESS;
}

// 合约项目详情
function getContractsProjectInfo({ stakeToken, payToken, assignToken }) {
  if (!stakeToken || !payToken || !assignToken) return;
  let params = {
    id: 101,
    jsonrpc: "2.0",
    method: "contract.get_resource",
    params: [
      CONTRACTS_ADD, //合约地址
      `${CONTRACTS_ADD}::Offering${COUNT}::Offering<${stakeToken},${payToken},${assignToken}>`,
    ],
  };
  console.log("params", params);
  return request({
    headers: {
      "content-type": "application/json",
    },
    url: CONTRACTS_URL,
    method: "post",
    data: JSON.stringify(params),
  });
}

// 获取该活动已质押额度
function getStakeAmount(accountToken, { stakeToken, payToken, assignToken }) {
  if (!stakeToken || !payToken || !assignToken) return;
  let params = {
    id: 101,
    jsonrpc: "2.0",
    method: "contract.get_resource",
    params: [
      accountToken,
      `${CONTRACTS_ADD}::Offering${COUNT}::Staking<${stakeToken},${payToken},${assignToken}>`,
    ],
  };
  return request({
    headers: {
      "content-type": "application/json",
    },
    url: CONTRACTS_URL,
    method: "post",
    data: JSON.stringify(params),
  });
}

export default {
  getContractsProjectInfo,
  getStakeAmount,
};
