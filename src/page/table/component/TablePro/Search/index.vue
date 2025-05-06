<template>
  <div class="search-root">
    <el-form :model="form" :rules="rules" :size="props.size">
      <div class="searchItemWrapper" ref="rootRef">
        <div
          class="searchItem"
          v-for="column in columns"
          v-show="column.show === '1'"
          :style="{ width: getColumnWidth(column) + 'px' }"
        >
          <el-form-item :label="column.caption" :prop="column.fieldName">
            <WidgetWrapper
              :column="column"
              v-model="form[column.fieldName as string]"
              :displayType="getSearchDisplayType(column)"
              :placeholder="getSearchPlaceholder(column)"
              :readonly="getSearchReadonly(column)"
              :size="size"
            />
          </el-form-item>
        </div>

        <div class="searchButtons" :style="searchButtonsStyle">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button text link type="primary" @click="onChangeSwitch"
            >{{ switchStatus === '0' ? '展开' : '收起'
            }}<el-icon class="v-ml-4"
              ><ArrowUp v-show="switchStatus === '1'" /><ArrowDown
                v-show="switchStatus === '0'" /></el-icon
          ></el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, onMounted, computed, watch } from 'vue';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import type { Column } from '../type';
import WidgetWrapper from '../widget/WidgetWrapper.vue';
import { DISPLAY_TYPE } from '@/const';
import emitter from '@/utils/bus';

const buttonWidth = 220;
const searchItemWidth = 300;

const props = withDefaults(
  defineProps<{
    params?: { [key: string]: any } | (() => Promise<{ [key: string]: any }>);
    columns: Column[];
    defaultSearchSwitch?: string;
    dataLoading: boolean;
    size: 'small' | 'default' | 'large';
  }>(),
  { defaultSearchSwitch: '0', dataLoading: false },
);

const rootRef = ref<HTMLElement | null>(null);

const { defaultSearchSwitch, columns } = toRefs(props);

const state = reactive<{
  form: any;
  rootWidth: number;
  switchStatus: string;
  rules: any;
}>({
  form: {},
  rootWidth: 0,
  switchStatus: defaultSearchSwitch.value,
  rules: [],
});

const { form, rootWidth, switchStatus, rules } = toRefs(state);

const emits = defineEmits(['searchPage', 'resetPage']);

const onChangeSwitch = () => {
  if (switchStatus.value === '1') {
    switchStatus.value = '0';
  } else {
    switchStatus.value = '1';
  }
};

const getSearchDisplayType: (column: Column) => string = (column) => {
  return column['search.displayType'] || column['displayType'];
};

const getSearchPlaceholder: (column: Column) => string = (column) => {
  return column['search.placeholder'] || '';
};
const getSearchReadonly: (column: Column) => string = (column) => {
  return column['search.readonly'] || '0';
};

const onSearch = () => {
  emits('searchPage');
};

const onReset = () => {
  form.value = {};
  emits('resetPage');
};

const getColumnWidth = (column: Column | undefined) => {
  if (!column) return 0;
  const displayType = column['search.displayType'] || column.displayType;
  if (displayType.indexOf('range') !== -1) {
    return searchItemWidth * 2;
  } else {
    return searchItemWidth;
  }
};

const searchButtonsStyle = computed(() => {
  if (rootWidth.value === 0) {
    return {
      width: '220px',
    };
  }
  const visibleColumns = columns.value.filter((item) => {
    return item.show === '1';
  });
  const visibleColumnsLen = visibleColumns.length;
  let total = 0;
  // 获取index是在第几个换行
  for (let i = 0; i < visibleColumnsLen; i++) {
    let columnWidth = getColumnWidth(visibleColumns[i]);
    if (total + columnWidth < rootWidth.value) {
      total += columnWidth;
    } else {
      total = columnWidth;
    }
  }
  if (rootWidth.value - total > buttonWidth) {
    return {
      width: rootWidth.value - total + 'px',
    };
  } else {
    return {
      width: rootWidth.value + 'px',
    };
  }
});

const getValue = () => {
  return form.value;
};
const setSearchForm = (val: any) => {
  const defaultParams: { [key: string]: any } = {};
  for (let k in val) {
    if (val[k]) {
      const findColumn = columns.value.find((item) => {
        return item.fieldName === k;
      });
      if (!!findColumn) {
        defaultParams[k] = val[k];
      }
    }
  }
  form.value = { ...defaultParams };
};

watch(
  columns,
  (_columns) => {
    const _rules: { [key: string]: any[] } = {};
    _columns.forEach((item) => {
      const valids = [];
      const displayType = item['search.displayType'] || item.displayType;

      if (item['search.required'] && item['search.required'] === '1') {
        valids.push({
          required: true,
          message: item.caption + '必填！',
          trigger:
            displayType === DISPLAY_TYPE.TEXT ||
            displayType === DISPLAY_TYPE.NUMBER
              ? 'blur'
              : 'change',
        });
        _rules[item.fieldName] = valids;
      }
    });
    rules.value = _rules;
  },
  { deep: true, immediate: true },
);
watch(
  () => [switchStatus.value, columns.value],
  (newVal) => {
    if (Array.isArray(newVal[1]) && newVal[1].length) {
      newVal[1].forEach((item) => {
        if (newVal[0] === '1') {
          item.show = '1';
        } else {
          if (
            item['search.quickSearch'] &&
            item['search.quickSearch'] === '1'
          ) {
            item.show = '1';
          } else {
            item.show = '0';
          }
        }
      });
    }
  },
  { immediate: true },
);

watch(
  () => [form.value, columns.value],
  ([_form, _columns]) => {
    let empty = false;
    let messages: string[] = [];
    let message: string = '';
    if (_columns.length) {
      _columns.forEach((item: Column) => {
        if (
          item['search.required'] &&
          item['search.required'] === '1' &&
          !_form[item.fieldName]
        ) {
          messages.push(item.caption);
          empty = true;
        }
      });
    }

    if (empty) {
      message = messages.join('、') + '为空！';
    }

    emitter.emit('onChangeEmpty', { empty, message });
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  const width = rootRef.value?.offsetWidth as number;
  rootWidth.value = width;
});

defineExpose({ getValue, setSearchForm });
</script>

<style scoped lang="scss">
.search-root {
  padding: 24px 0 6px;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  .searchItemWrapper {
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    min-width: 0;
    .searchItem {
      padding: 0 8px;
    }
    .searchButtons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-bottom: 18px;
    }
  }
}
</style>
