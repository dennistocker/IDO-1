export default {
  data() {
    return {
      timer: null,
      isHoverList: [],
    };
  },
  methods: {
    changeHoverList(index, flag, t) {
      if (t) {
        // 为了鼠标移动过快，hover没更新
        // throttle应该会更好
        this.isHoverList = [].concat(
          this.isHoverList.map(() => {
            return false;
          })
        );
        return;
      }
      if (!flag) {
        this.$set(this.isHoverList, index, false);
        return;
      }
      this.$set(this.isHoverList, index, true);
    },
  },
  computed: {
    // 右上角的label
    mixinSetLabelsBg() {
      return function (type, len) {
        if (len && Number(len) > 0)
          return {
            "background-image": `url(${require(`../assets/home/${type}-card-label-${len}.png`)})`,
          };
      };
    },
    // 列表里的label
    mixinLabelColor() {
      return function (a, b) {
        return {
          color: a,
          border: `1px solid ${b}`,
        };
      };
    },
    // svgHover状态
    svgName() {
      return function (name, type, flag) {
        if (flag) {
          return `${name}-${type}-actived`;
        }
        return `${name}-${type}`;
      };
    },
  },
};
