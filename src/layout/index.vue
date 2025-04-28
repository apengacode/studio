<template>
  <div class="layout-container">
    <header>
      <el-card class="header-card">
        <div class="header-container">
          <section class="v-ph-8 logo">开发平台</section>
          <section class="v-ph-8 nav">
            <el-menu
              :default-active="activeMenu"
              class="header-menu"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-sub-menu index="workspace">
                <template #title>Workspace</template>
                <el-menu-item index="/workspace/table">Table</el-menu-item>
                <el-menu-item index="/workspace/action">Action</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </section>
          <section class="v-ph-8 theme">theme</section>
          <section class="v-ph-8 user">user</section>
        </div>
      </el-card>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
<script setup lang="ts">
import { reactive, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const state = reactive<{ activeMenu: string }>({
  activeMenu: '',
});

const { activeMenu } = toRefs(state);

watch(route, (newVal) => (activeMenu.value = newVal.path), {
  deep: true,
  immediate: true,
});

const handleSelect = (key: string) => {
  router.push(key);
};
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  header {
    display: flex;
    align-items: center;
    padding: 8px;
    .header-card {
      width: 100%;
      .header-container {
        width: 100%;
        display: flex;
        section {
          display: flex;
          align-items: center;
        }
        .nav {
          flex: 1;
          width: 0;
          .header-menu {
            width: 100%;
          }
        }
      }
    }
  }
  main {
    flex: 1;
    height: 0;
    overflow-y: auto;
  }
}
</style>
