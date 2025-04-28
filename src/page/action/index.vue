<script setup lang="ts">
import { reactive, toRefs } from 'vue';
import Tree from './component/Tree/index.vue';
import Action from './component/Action/index.vue';
import type { TreeNode } from './types';
import { cloneDeep } from 'lodash';

const state = reactive<{ node: undefined | TreeNode }>({
  node: undefined,
});

const { node } = toRefs(state);

const selectNode = (selectNode: TreeNode) => {
  node.value = cloneDeep(selectNode);
};
</script>

<template>
  <div class="page v-fr-bc v-p-8">
    <el-card class="part left-part">
      <Tree @select-node="selectNode" />
    </el-card>
    <el-card class="part right-part v-ml-8">
      <Action :node="node" />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.page {
  width: 100%;
  height: 100%;
  .part {
    height: 100%;
    overflow-y: auto;
  }
  .left-part {
    width: 13%;
  }
  .right-part {
    flex: 1;
  }
}
.right-part ::v-deep .el-card__body {
  height: 100%;
}
</style>
