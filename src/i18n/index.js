import Vue from "vue";
import VueI18n from "vue-i18n";
import session from "@utils/session";

// https://juejin.cn/post/6844903575571660807
// https://kazupon.github.io/vue-i18n/zh/guide/directive.html#%E5%AF%B9%E8%B1%A1%E8%AF%AD%E6%B3%95
// 国际化
Vue.use(VueI18n);

function loadMessages() {
  const context = require.context("../lang", true, /[a-z0-9-_]+\.json$/i);
  const messages = context
    .keys()
    .map((key) => ({ key, locale: key.match(/[a-z0-9-_]+/i)[0] }))
    .reduce(
      (messages, { key, locale }) => ({
        ...messages,
        [locale]: context(key),
      }),
      {}
    );
  return { context, messages };
}

const { messages } = loadMessages();

const langs = Object.keys(messages);
const namespaces = ["constants", "errors", "wallet"];
langs.forEach((lang) => {
  namespaces.forEach((key) => {
    for (let i in messages[lang][key]) {
      messages[lang][i] = messages[lang][key][i];
    }
    if (key === "constants") {
      delete messages[lang][key];
    }
  });
});

const i18n = new VueI18n({
  locale: session.getItem("lang") || "en", // 语言标识
  fallbackLocale: "en", // 找不到语言包默认
  messages,
  silentTranslationWarn: true,
});

// 延迟加载翻译
//

// $t('key')
// 动态切换语言
// this.$i18n.locale = cn | us

// todo 动态加载语言包
Vue.use(i18n);

export default i18n;
