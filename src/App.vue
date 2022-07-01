<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import "./assets/css/reset.less"

export default {
  name: 'App',
  destroyed() {
    window.localStorage.removeItem('userName');
  }
}
</script>

<style>
@import "./assets/fonts/iconfont.css";
</style>
