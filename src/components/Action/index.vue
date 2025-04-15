<template>
  <div class="actionRoot">
    <el-tabs
      v-model="activeTab"
      closable
      @tab-remove="onTabRemove"
      @tab-click="resetFieldOptions"
    >
      <el-tab-pane v-for="tab in tabs" :name="tab.id" :label="tab.name" />
    </el-tabs>
    <div class="actionContainer" v-if="activeTab">
      <Fields @set-field-options="onSetFieldOptions" :actionId="activeTab" />
      <Options :options="currentFieldOptions" />
    </div>
    <div class="emptyContainer" v-else>请选择左侧节点</div>
    <footer v-show="activeTab">
      <el-button type="primary" size="small">保存</el-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, watch, computed } from 'vue';
import type { TabPaneName } from 'element-plus';
import type { TreeNode } from '../../page/home/types';
import Fields from './Fields/index.vue';
import Options from './Options/index.vue';
import type { FieldData } from './Fields/type';

const props = defineProps<{
  node: TreeNode | undefined;
}>();

const { node } = toRefs(props);

// 监听node 将组件传过来的node数据push到list里
watch(
  node,
  (newVal) => {
    if (newVal && newVal) {
      activeTab.value = newVal.id;
      resetFieldOptions();
      if (tabs.value.some((tab) => tab.id === newVal.id)) return;
      tabs.value.push(newVal);
    }
  },
  { deep: true, immediate: true },
);

const state = reactive<{
  tabs: TreeNode[];
  activeTab: string | undefined;
  currentFieldOptions: undefined | FieldData;
}>({
  tabs: [],
  activeTab: undefined,
  currentFieldOptions: undefined,
});
const { tabs, activeTab, currentFieldOptions } = toRefs(state);

// 移除关闭tab
const onTabRemove = (val: TabPaneName) => {
  console.log(val);
  if (val === activeTab.value) {
    resetFieldOptions();
  }
  const index = tabs.value.findIndex((tab) => {
    return tab.id === val;
  });
  tabs.value.splice(index, 1);

  // 如果tabs.length存在 取第一个tab作为默认  否则没有默认tab
  if (tabs.value.length) {
    activeTab.value = tabs.value[0].id;
    return;
  }
  activeTab.value = undefined;
};

const onSetFieldOptions = (options: FieldData) => {
  currentFieldOptions.value = options;
};

const currentTabData = computed(() => {
  if (activeTab.value) {
    return tabs.value.find((tab) => {
      return tab.id === activeTab.value;
    });
  }
  return undefined;
});

const resetFieldOptions = () => {
  currentFieldOptions.value = undefined;
};
</script>

<style scoped lang="scss">
.actionRoot {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .actionContainer {
    flex: 1;
    height: 0;
    display: flex;
  }
}
</style>
