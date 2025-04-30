<template>
  <div class="operation-root">
    <div class="operation-left">
      <template v-for="btn in buttons" :key="btn.key">
        <div v-if="!btn.children" class="operation-button">
          <el-button :type="btn.type" @click="onButtonClick(btn)">
            {{ btn.text }}
          </el-button>
        </div>
        <template v-else>
          <el-dropdown trigger="click" class="operation-button">
            <el-button :type="btn.type">
              {{ btn.text
              }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="cbtn in btn.children"
                  :key="cbtn.key"
                  @click.native="onButtonClick(cbtn)"
                  >{{ cbtn.text }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </template>
    </div>
    <div class="operation-right">123</div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import type { BatchButton } from '../type';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  buttons: BatchButton[];
  getParams: () => { [key: string]: any };
  getPagetotal: () => number;
  getCheckrecord: () => { [key: string]: any }[];
}>();

const { buttons, getParams, getPagetotal, getCheckrecord } = toRefs(props);

const onButtonClick = (btn: BatchButton) => {
  const params = getParams.value();
  const total = getPagetotal.value();
  if (btn.checkRecords && total === 0) {
    ElMessage({
      message: '没有可操作记录',
      type: 'error',
    });
    return;
  }
  const checkrecords = getCheckrecord.value();
  btn.callback && btn.callback(params, checkrecords);
};
</script>

<style scoped lang="scss">
.operation-root {
  padding-top: 8px;
  display: flex;
  align-items: center;
  .operation-left {
    display: flex;
    width: 0;
    flex: 1;
  }
  .operation-button {
    margin-right: 8px;
  }
}
</style>
