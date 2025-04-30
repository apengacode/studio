<template>
  <div class="grid-root" title="asdasdasd">
    <div class="grid-selection" ref="selectionRef" v-show="selections.length">
      <div class="selection-left">
        <el-tag
          v-for="tag in selections"
          :key="tag[selectValue]"
          closable
          :disable-transitions="false"
          @close="onRemoveSelection(tag)"
        >
          {{ formatterLabel(tag) }}
        </el-tag>
      </div>
      <div class="selection-right">
        <el-button
          @click="() => (selectionSwitchStatus = !selectionSwitchStatus)"
          link
          type="primary"
          size="small"
          >{{ selectionSwitchStatus ? '收起' : '展开' }}</el-button
        >
      </div>
    </div>
    <div class="table-root">
      <el-table
        ref="tableRef"
        :data="data"
        :empty-text="emptyMessage"
        v-loading="dataLoading"
        height="100%"
        style="width: 100%"
        :row-key="selectValue"
        @select="onSelect"
        @select-all="onSelectAll"
      >
        <template v-if="selection">
          <el-table-column type="selection" width="55" />
        </template>
        <template v-for="column in gridColumns" :key="column.fieldName">
          <el-table-column :prop="column.fieldName" :label="column.caption" />
        </template>
        <el-table-column
          label="操作"
          v-if="buttons.length"
          :width="operationWidth"
          fixed="right"
        >
          <template #default="scope">
            <div class="operation-wrapper">
              <template v-for="btn in buttons" :key="btn.key">
                <div v-if="!btn.children" class="row-button">
                  <el-button
                    v-if="buttonShow(scope.row, btn)"
                    link
                    type="primary"
                    size="small"
                    @click="onButtonClick(scope.row, btn)"
                    >{{ btn.text }}</el-button
                  >
                </div>
                <template v-else>
                  <el-dropdown
                    trigger="click"
                    class="row-button"
                    v-if="dropdownShow(scope.row, btn)"
                  >
                    <el-button link type="primary" size="small">
                      {{ btn.text
                      }}<el-icon class="el-icon--right"><arrow-down /></el-icon
                    ></el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <template v-for="cbtn in btn.children" :key="cbtn.key">
                          <el-dropdown-item
                            v-if="buttonShow(scope.row, cbtn)"
                            @click.native="onButtonClick(scope.row, cbtn)"
                            >{{ cbtn.text }}</el-dropdown-item
                          >
                        </template>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  nextTick,
  computed,
} from 'vue';
import type { Column, SingleButton } from '../type';
import emitter from '@/utils/bus';
import { replacePlaceholders } from '../utils';
import type { ElTable } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';

const props = withDefaults(
  defineProps<{
    columns?: Column[];
    dataResourse: any[];
    dataLoading: boolean;
    selection: boolean;
    selectValue: string;
    selectLabel: string;
    defaultSelections: { [key: string]: any }[];
    buttons: SingleButton[];
    getParams: () => { [key: string]: any };
  }>(),
  {
    columns: () => [],
    dataResourse: () => [],
    dataLoading: false,
    defaultSelections: () => [],
    buttons: () => [],
  },
);
const {
  columns,
  dataResourse,
  dataLoading,
  selection,
  selectValue,
  selectLabel,
  defaultSelections,
  buttons,
  getParams,
} = toRefs(props);

const state = reactive<{
  gridColumns: Column[];
  data: any[];
  isEmpty: boolean;
  emptyMessage: string;
  selections: any[];
  selectionSwitchStatus: boolean;
  // operationWidth: number;
}>({
  gridColumns: [],
  isEmpty: false,
  emptyMessage: '',
  data: [],
  selections: [],
  selectionSwitchStatus: false,
  // operationWidth: 1000,
});

const {
  gridColumns,
  data,
  isEmpty,
  emptyMessage,
  selections,
  selectionSwitchStatus,
  // operationWidth,
} = toRefs(state);

const selectionRef = ref<HTMLElement | null>(null);
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);

const onSelect = (_: any, row: any) => {
  const index = selections.value.findIndex(
    (item) => item[selectValue.value] === row[selectValue.value],
  );
  if (index === -1) {
    selections.value.push(row);
  } else {
    selections.value.splice(index, 1);
  }
};

const onSelectAll = (allRow: { [key: string]: any }[]) => {
  data.value.forEach((row) => {
    const index = selections.value.findIndex(
      (item) => item[selectValue.value] === row[selectValue.value],
    );
    if (allRow.length === 0) {
      index !== -1 && selections.value.splice(index, 1);
    } else {
      index === -1 && selections.value.push(row);
    }
  });
};

const getIsEmpty = () => {
  return isEmpty.value;
};

const formatterLabel = (select: any) => {
  return replacePlaceholders(selectLabel.value, select);
};

const onRemoveSelection = (select: any) => {
  const selectIndex = selections.value.findIndex(
    (item) => item[selectValue.value] === select[selectValue.value],
  );
  selectIndex !== -1 && selections.value.splice(selectIndex, 1);
  // 在判断 这条数据是否在这个当前页中
  const pageIndex = data.value.findIndex(
    (item) => item[selectValue.value] === select[selectValue.value],
  );
  pageIndex !== -1 &&
    tableRef.value?.toggleRowSelection(data.value[pageIndex], false);
};

const getCheckRecord = () => {
  return [...selections.value];
};

const operationWidth = computed(() => {
  let width = 0;
  buttons.value.forEach((btn) => {
    const textLeng = btn.text.length;
    if (!btn.children) {
      width += textLeng * 12 + 14;
    } else {
      width += textLeng * 12 + 55;
    }
  });
  return width;
});

const onButtonClick = (row: { [key: string]: any }, btn: SingleButton) => {
  const params = getParams.value();
  btn.callback && btn.callback(params, [row]);
};

const buttonShow = (row: { [key: string]: any }, btn: SingleButton) => {
  if (btn.beforRender && typeof btn.beforRender === 'function') {
    return btn.beforRender(row);
  }
  return true;
};
const dropdownShow = (row: { [key: string]: any }, btn: SingleButton) => {
  return btn.children?.some((cbtn) => {
    if (cbtn.beforRender && typeof cbtn.beforRender === 'function') {
      return cbtn.beforRender(row);
    }
    return true;
  });
};

watch(selectionSwitchStatus, (status) => {
  if (selectionRef.value) {
    selectionRef.value.style.height = status ? 'auto' : '32px';
  }
});

watch(
  columns,
  (newColumns) => {
    if (newColumns && newColumns.length) {
      gridColumns.value = newColumns.filter((column) => {
        let hidden = column['grid.hidden'] || column['hidden'];

        if (hidden) {
          return hidden === '0';
        }
        return true;
      });
    }
  },
  { deep: true, immediate: true },
);

watch(
  () => [dataResourse.value, isEmpty.value],
  async ([_dataResourse, _isEmpty]) => {
    if (_isEmpty) {
      data.value = [];
      return;
    }

    data.value = Array.isArray(_dataResourse) ? _dataResourse : [];
    await nextTick();
    data.value.forEach((item) => {
      const target = selections.value.find(
        (row) => row[selectValue.value] === item[selectValue.value],
      );
      if (!!target) {
        tableRef.value?.toggleRowSelection(item, true);
      }
    });
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  emitter.on('onChangeEmpty', ((m: { empty: boolean; message: string }) => {
    isEmpty.value = m.empty;
    emptyMessage.value = m.message;
    if (!isEmpty.value) {
      emptyMessage.value = '暂无数据';
    }
  }) as any);

  selections.value = defaultSelections.value;
});

defineExpose({ getIsEmpty, getCheckRecord });
</script>

<style scoped lang="scss">
.grid-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  .table-root {
    flex: 1;
    height: 0;
    padding-top: 8px;
  }
}
.grid-selection {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  height: 32px;
  .selection-left {
    flex: 1;
    width: 0;
  }
  .selection-right {
  }
}
.operation-wrapper {
  width: 100%;
  display: flex;
  .row-button {
    padding: 0 4px;
  }
}
</style>
