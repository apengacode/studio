<template>
  <div class="operation-root">
    <div class="operation-buttons">
      <template v-for="btn in buttons" :key="btn.key">
        <div v-if="!btn.children" class="operation-button">
          <el-button :size="size" :type="btn.type" @click="onButtonClick(btn)">
            {{ btn.text }}
          </el-button>
        </div>
        <template v-else>
          <el-dropdown trigger="click" :size="size" class="operation-button">
            <el-button :type="btn.type" :size="size">
              {{ btn.text
              }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="cbtn in btn.children" :key="cbtn.key" @click.native="onButtonClick(cbtn)">{{ cbtn.text }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </template>
    </div>
    <div class="operation-tools">

      <!----------------- 导出 ----------------->
      <el-button v-if="existExport" class="operation-tools-item" type="primary" link @click="emits('exportExcel')">
        <i :style="{ fontSize: SizeMap[size] }" class="iconfont icon-export" />
      </el-button>

      <!----------------- 刷新 ----------------->
      <el-button v-if="existRefresh" class="operation-tools-item" :size="size" type="primary" @click="onRefresh" link>
        <el-icon :size="SizeMap[size]">
          <RefreshRight />
        </el-icon>
      </el-button>

      <!----------------- 大小 ----------------->
      <el-dropdown v-if="existSize" trigger="click" :size="size" class="operation-button">
        <el-button class="operation-tools-item" :size="size" type="primary" link>
          <i :style="{ fontSize: SizeMap[size] }" class="iconfont icon-font-size" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onChangeSize('large')">大</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu>
            <el-dropdown-item @click="onChangeSize('default')">中</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu>
            <el-dropdown-item @click="onChangeSize('small')">小</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!----------------- 设置 ----------------->
      <el-popover placement="bottom-start" :width="400" trigger="click">
        <template #reference>
          <el-button v-if="existSetting" class="operation-tools-item" :size="size" type="primary" link>
            <el-icon :size="SizeMap[size]">
              <Setting />
            </el-icon>
          </el-button>
        </template>
        <div class="tableSetting-container">
          <div class="tableSetting-header">
            <div class="tableSetting-header-title">列展示</div>
            <div class="tableSetting-header-reset">
              <el-button size="small" type="primary" link @click="onResetColumn"> 重置 </el-button>
            </div>
          </div>
          <div class="tableSetting-content">
            <el-checkbox-group v-model="checkeds" @change="onChangeColumnVisible">
              <div class="tableSetting-content-item" v-show="fixedLeftColumn.length">
                <div class="tableSetting-content-title">固定在右侧</div>

                <draggable item-key="id" :list="fixedLeftColumn" ghost-class="ghost" chosen-class="chosen-class" animation="100"
                  @change="onChangeSort">
                  <template #item="{ element: item, index }">
                    <div class="tableSetting-content-column" :key="item.id">
                      <div class="tableSetting-content-column-icon">
                        <span class="iconfont icon-tuodong"></span>
                      </div>
                      <div class="tableSetting-content-column-visible">
                        <el-checkbox :value="item.id" :disabled="item.disabled">{{
                          item.name
                        }}</el-checkbox>
                      </div>
                      <div v-if="item.id !== 'operate'">
                        <el-tooltip class="box-item" effect="dark" content="不固定" placement="top-end">
                          <el-button type="primary" link @click="onFixed(item, index, 'center', 'right')">
                            <el-icon>
                              <Sort />
                            </el-icon>
                          </el-button>
                        </el-tooltip>
                        <el-tooltip class="box-item" effect="dark" content="固定在列首" placement="top-end">
                          <el-button type="primary" link @click="onFixed(item, index, 'left', 'right')">
                            <el-icon>
                              <Upload />
                            </el-icon>
                          </el-button>
                        </el-tooltip>
                      </div>
                    </div>
                  </template>
                </draggable>
              </div>

              <div class="tableSetting-content-item" v-show="notFixedColumn.length">
                <div class="tableSetting-content-title">不固定</div>
                <draggable item-key="id" :list="notFixedColumn" ghost-class="ghost" chosen-class="chosen-class" animation="100"
                  @change="onChangeSort">
                  <template #item="{ element: item, index }">
                    <div class="tableSetting-content-column" :key="item.id">
                      <div class="tableSetting-content-column-icon">
                        <span class="iconfont icon-tuodong"></span>
                      </div>
                      <div class="tableSetting-content-column-visible">
                        <div>
                          <el-checkbox :value="item.id">{{
                            item.name
                            }}</el-checkbox>
                        </div>
                      </div>
                      <div>
                        <el-tooltip class="box-item" effect="dark" content="固定在列首" placement="top-end">
                          <el-button type="primary" link @click="onFixed(item, index, 'left', 'center')">
                            <el-icon>
                              <Upload />
                            </el-icon>
                          </el-button>
                        </el-tooltip>
                        <el-tooltip class="box-item" effect="dark" content="固定在列尾" placement="top-end">
                          <el-button type="primary" link @click="onFixed(item, index, 'right', 'center')">
                            <el-icon>
                              <Download />
                            </el-icon>
                          </el-button>
                        </el-tooltip>
                      </div>
                    </div>
                  </template>
                </draggable>
              </div>

              <div class="tableSetting-content-item" v-show="fixedRightColumn.length">
                <div class="tableSetting-content-title">固定在右侧</div>
                <draggable item-key="id" :list="fixedRightColumn" ghost-class="ghost" chosen-class="chosen-class" animation="100"
                  @change="onChangeSort">
                  <template #item="{ element: item, index }">
                    <div class="tableSetting-content-column" :key="item.id">
                      <div class="tableSetting-content-column-icon">
                        <span class="iconfont icon-tuodong"></span>
                      </div>
                      <div class="tableSetting-content-column-visible">
                        <el-checkbox :value="item.id" :disabled="item.disabled">{{
                          item.name
                        }}</el-checkbox>
                      </div>
                      <div v-if="item.id !== 'operate'">
                        <el-tooltip class="box-item" effect="dark" content="不固定" placement="top-end">
                          <el-button type="primary" link @click="onFixed(item, index, 'center', 'right')">
                            <el-icon>
                              <Sort />
                            </el-icon>
                          </el-button>
                        </el-tooltip>
                        <el-tooltip class="box-item" effect="dark" content="固定在列首" placement="top-end">
                          <el-button type="primary" link @click="onFixed(item, index, 'left', 'right')">
                            <el-icon>
                              <Upload />
                            </el-icon>
                          </el-button>
                        </el-tooltip>
                      </div>
                    </div>
                  </template>
                </draggable>

              </div>
            </el-checkbox-group>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, watch } from 'vue';
import {
  ArrowDown,
  RefreshRight,
  Setting,
  Download,
  Upload,
  Sort,
} from '@element-plus/icons-vue';
import draggable from 'vuedraggable';
import { ElMessage } from 'element-plus';
import type { CheckboxValueType } from 'element-plus';
import type { BatchButton, Column, SettingColumn } from '../type';

import { useDebounceFn } from '@/utils/fn';

const SizeMap = {
  small: '16px',
  default: '20px',
  large: '24px',
};

const props = defineProps<{
  buttons: BatchButton[];
  getParams: () => { [key: string]: any };
  getPagetotal: () => number;
  getCheckrecord: () => { [key: string]: any }[];
  size: 'small' | 'default' | 'large';
  existExport: boolean;
  existRefresh: boolean;
  existSize: boolean;
  existSetting: boolean;
  columns: Column[];
  selection: boolean;
  hasOperate: boolean;
}>();

const {
  buttons,
  getParams,
  getPagetotal,
  getCheckrecord,
  existExport,
  existRefresh,
  existSize,
  existSetting,
  columns,
  selection,
  hasOperate
} = toRefs(props);

const state = reactive<{
  checkeds: string[];
  fixedRightColumn: SettingColumn[];
  fixedLeftColumn: SettingColumn[];
  notFixedColumn: SettingColumn[];
}>({
  checkeds: [],
  notFixedColumn: [],
  fixedRightColumn: [],
  fixedLeftColumn: [],
});

const { checkeds, notFixedColumn, fixedRightColumn, fixedLeftColumn } =
  toRefs(state);

const emits = defineEmits([
  'doRefresh',
  'changeSize',
  'changeColumnPosition',
  'exportExcel'
]);

const { run: onButtonClick } = useDebounceFn(
  (btn: BatchButton) => {
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
  },
  500,
  { leading: true, trailing: false },
);

const { run: onRefresh } = useDebounceFn(
  () => {
    emits('doRefresh');
  },
  500,
  { leading: true, trailing: false },
);
const onChangeSize = (size: 'small' | 'default' | 'large') => {
  emits('changeSize', size);
};

const onFixed = (
  column: SettingColumn,
  index: number,
  toDirection: 'left' | 'center' | 'right',
  fromDirection: 'left' | 'center' | 'right',
) => {
  switch (fromDirection) {
    case 'left':
      switch (toDirection) {
        case 'center':
          notFixedColumn.value.splice(column.sort as number, 0, column);
          fixedLeftColumn.value.splice(index, 1);
          break;
        case 'right':
          fixedRightColumn.value.push(column);
          fixedLeftColumn.value.splice(index, 1);
          break;
        default:
          break;
      }
      break;
    case 'center':
      switch (toDirection) {
        case 'left':
          fixedLeftColumn.value.push(column);
          notFixedColumn.value.splice(index, 1);
          break;
        case 'right':
          fixedRightColumn.value.push(column);
          notFixedColumn.value.splice(index, 1);
          break;
        default:
          break;
      }
      break;
    case 'right':
      switch (toDirection) {
        case 'center':
          notFixedColumn.value.splice(column.sort as number, 0, column);
          fixedRightColumn.value.splice(index, 1);
          break;
        case 'left':
          fixedLeftColumn.value.push(column);
          fixedRightColumn.value.splice(index, 1);
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }

  emits(
    'changeColumnPosition',
    fixedLeftColumn.value,
    notFixedColumn.value,
    fixedRightColumn.value,
  );
};

const onChangeColumnVisible = (values: CheckboxValueType[]) => {
  fixedLeftColumn.value.forEach((item) => {
    if (!values.includes(item.id)) {
      item.show = false;
    } else {
      item.show = true;
    }
  });
  notFixedColumn.value.forEach((item) => {
    if (!values.includes(item.id)) {
      item.show = false;
    } else {
      item.show = true;
    }
  });
  fixedRightColumn.value.forEach((item) => {
    if (!values.includes(item.id)) {
      item.show = false;
    } else {
      item.show = true;
    }
  });
  emits(
    'changeColumnPosition',
    fixedLeftColumn.value,
    notFixedColumn.value,
    fixedRightColumn.value,
  );
};

const onChangeSort = () => {
  emits(
    'changeColumnPosition',
    fixedLeftColumn.value,
    notFixedColumn.value,
    fixedRightColumn.value,
  );
};

const onResetColumn = () => {
  fixedLeftColumn.value = [];
  notFixedColumn.value = [];
  fixedRightColumn.value = [];

  columns.value.forEach((item, index) => {
    notFixedColumn.value.push({
      id: item.fieldName,
      name: item.caption,
      sort: index,
    });
    checkeds.value.push(item.fieldName);
  });
  if (hasOperate.value) {
    fixedRightColumn.value.push({
      id: 'operate',
      name: '操作',
      disabled: true,
    });
    checkeds.value.push('operate');
  }
  if (selection.value) {
    fixedLeftColumn.value.push({
      id: 'selection',
      name: '复选',
      disabled: true,
    });
    checkeds.value.push('selection');
  }
  emits(
    'changeColumnPosition',
    fixedLeftColumn.value,
    notFixedColumn.value,
    fixedRightColumn.value,
  );
}

watch(
  columns,
  (_columns) => {
    _columns.forEach((item, index) => {
      notFixedColumn.value.push({
        id: item.fieldName,
        name: item.caption,
        sort: index,
      });
      checkeds.value.push(item.fieldName);
    });
  },
  { deep: true, immediate: true },
);

watch(hasOperate, (newValue) => {
  if (newValue) {
    fixedRightColumn.value.push({
      id: 'operate',
      name: '操作',
      disabled: true,
    });
    checkeds.value.push('operate');
  }
});


onMounted(() => {
  if (selection.value) {
    fixedLeftColumn.value.push({
      id: 'selection',
      name: '复选',
      disabled: true,
    });
    checkeds.value.push('selection');
  }
});
</script>

<style scoped lang="scss">
.operation-root {
  padding-top: 24px;
  display: flex;
  align-items: center;

  .operation-buttons {
    display: flex;
    width: 0;
    flex: 1;
  }

  .operation-button {
    margin-right: 8px;
  }

  .operation-tools {
    display: flex;

    &-item {
      margin: 0 8px;
    }
  }
}

.tableSetting-container {
  .tableSetting-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-title {
      font-size: 14px;
      font-weight: 600;
    }
  }

  .tableSetting-content {
    margin-top: 24px;

    .tableSetting-content-item {
      padding: 10px 0;

      .tableSetting-content-title {
        margin-block-start: 6px;
        margin-block-end: 6px;
        padding-inline-start: 24px;
        color: rgba(42, 46, 54, 0.65);
        font-size: 12px;
      }

      .tableSetting-content-column {
        display: flex;
        align-items: center;

        .tableSetting-content-column-icon {
          width: 50px;

          span {
            font-size: 12px;
          }
        }

        .tableSetting-content-column-visible {
          flex: 1;
        }
      }
    }
  }
}

.drag-wrapper {
  .list-content {
    width: 692px;
    height: 336px;
    display: flex;
    flex-direction: row;
    padding: 0px;
    gap: 12px 8px;
    flex-wrap: wrap;
    align-content: flex-start;
    flex-grow: 1;

    .drag-item {
      width: 132px;
      height: 32px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 6px 8px;
      cursor: pointer;

      border-radius: 4px;
      background: #fff;
      box-sizing: border-box;
      border: 1px solid #ccc;

      .drag-index {
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 4px;
        background: #f7f8fa;
        margin-right: 8px;
      }

      &:hover {
        background: #f0ecfd;
        box-sizing: border-box;
        border: 1px solid #8a61f2;
      }

      &.disabled {
        background: #f2f3f7;
        box-sizing: border-box;
        border: 1px solid #e6e8ed;
      }
    }

    // 拖拽时的占位样式
    .ghost {
      border: 1px dashed #24262b !important;
      color: #fff !important;
      background: #fff !important;

      .drag-index {
        display: none;
      }
    }

    // 拖拽时跟随样式
    .chosen-class {
      border: 1px solid #8a61f2;
      background: #f0ecfd;
      box-sizing: border-box;
    }
  }
}
</style>
