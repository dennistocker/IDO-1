<template>
  <div id="app">
    <star-header></star-header>
    <router-view></router-view>
    <star-footer></star-footer>
  </div>
</template>
<script>
import StarHeader from "@StarUI/StarHeader";
import StarFooter from "@StarUI/StarFooter";
export default {
  components: {
    StarHeader,
    StarFooter,
  },
};
</script>

<style lang="scss"></style>
