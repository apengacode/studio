<script setup lang="ts">
import { Folder, SwitchFilled, FolderOpened } from '@element-plus/icons-vue';
import { reactive } from 'vue';
import type { TreeNode } from '../../page/home/types';

const state = reactive<{ data: TreeNode[] }>({
  data: [
    {
      id: '1',
      name: '用户权限管理',
      type: 'app',
      switch: '0',
      children: [
        {
          id: '1-1',
          name: '密码管理',
          type: 'page',
          switch: '0',
          children: [
            {
              id: '1-1-1',
              type: 'action',
              switch: '0',
              name: 'queryStudentList',
            },
            {
              id: '1-1-2',
              type: 'action',
              switch: '0',
              name: 'queryTeacherList',
            },
          ],
        },
      ],
    },
  ],
});

function switchNodeStatus(
  id: string,
  data: TreeNode[] | undefined,
  status: string,
) {
  if (data && data.length) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].children && data[i].children?.length) {
        switchNodeStatus(id, data[i].children, status);
      }
      if (data[i].id === id) {
        data[i].switch = status;
      }
    }
  }
}

const emit = defineEmits(['selectNode']);

const handleNodeClick = (data: TreeNode) => {
  if (data.type === 'action') {
    emit('selectNode', data);
  }
};
</script>

<template>
  <el-tree
    style="max-width: 600px"
    :data="state.data"
    :props="{
      children: 'children',
      label: 'name',
    }"
    node-key="id"
    @node-expand="(data) => switchNodeStatus(data.id, state.data, '1')"
    @node-collapse="(data) => switchNodeStatus(data.id, state.data, '0')"
    @node-click="handleNodeClick"
  >
    <template #default="{ node, data }">
      <div class="tree-row">
        <div class="node-icon v-mr-4">
          <template v-if="data.type !== 'action'">
            <el-icon size="12" v-if="data.switch === '0'"><Folder /></el-icon>
            <el-icon size="12" v-if="data.switch === '1'"
              ><FolderOpened
            /></el-icon>
          </template>
          <template v-else>
            <el-icon size="12"><SwitchFilled /></el-icon>
          </template>
        </div>
        <div class="node-name">{{ node.label }}</div>
        <!-- <div>
          <el-button type="primary">
            Append
          </el-button>
          <el-button
            style="margin-left: 4px"
            type="danger"
            link
          >
            Delete
          </el-button>
        </div> -->
      </div>
    </template>
  </el-tree>
</template>

<style scoped lang="scss">
.tree-row {
  width: 100%;
  display: flex;
  align-items: center;
  .node-icon {
    transform: translateY(1px);
  }
}
</style>
