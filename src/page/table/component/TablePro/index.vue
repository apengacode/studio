<template>
  <div class="table-pro-root">
    <section class="tablepro-search">
      <Search :columns="columns" :params="params" :defaultSearchSwitch="defaultSearchSwitch" />
    </section>
    <section class="tablepro-operation">
      <Operation />
    </section>
    <section class="tablepro-section">
      <Section />
    </section>
    <section class="tablepro-grid">
      <Grid />
    </section>
  </div>
</template>

<script setup lang="ts">
import Search from './Search/index.vue';
import Operation from './Operation/index.vue';
import Section from './Section/index.vue';
import Grid from './Grid/index.vue';
import { onMounted, reactive, toRefs } from 'vue';
import type { Column } from './type';

const props = defineProps<{
  action: string;
  changeColumn?: (
    columns: Column[],
    callback: (columns: Column[]) => void,
  ) => void;
  params?: { [key: string]: string | undefined | null | number };
  defaultSearchSwitch?: string
}>();

const state = reactive<{ columns: Column[] | undefined }>({
  columns: undefined,
});

const { action, changeColumn, params } = toRefs(props);
const { columns } = toRefs(state);

onMounted(() => {
  let columnsResource: Column[] = [];
  let actionData = window.localStorage.getItem(action.value);
  if (!actionData) {
    columnsResource = [];
  } else {
    columnsResource = JSON.parse(actionData);
  }
  if (changeColumn.value && typeof changeColumn.value === 'function') {
    changeColumn.value(columnsResource, (newColumns) => {
      columns.value = newColumns;
    });
    return;
  }
  columns.value = columnsResource;
});
</script>

<style scoped lang="scss">
.table-pro-root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .tablepro-grid {
    height: 0;
    flex: 1;
  }
}
</style>
