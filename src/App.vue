<script setup lang="ts">
import theme from './utils/theme';
import setting from './setting';
theme.genThemeStyleScript(setting.THEMES[0]);
</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="scss">

</style>
