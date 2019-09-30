<template>
  <div id="app">
    <main-page />
  </div>
</template>

<script>

import mainPage from './views/main-page.vue';

export default {
  name: 'app',
  components: {
    mainPage,
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Metal Mania', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: url(http://cur.cursors-4u.net/games/gam-11/gam1078.png), auto;
  user-select: none;
}
</style>
