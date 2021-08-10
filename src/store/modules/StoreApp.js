import i18n from "../../i18n/index";
import session from "@utils/session";
const StoreApp = {
  namespaced: true,
  state: {
    headerItems: [
      {
        label: i18n.t("项目"),
        path: "home",
        value: "home",
      },
    ],
    activeHeaderItem: "home",
    language: session.getItem("lang"),
  },
  mutations: {
    SET_LOGIN_STATE(state, flag) {
      state.loginState = flag;
    },
  },
  actions: {},
};

export default StoreApp;
