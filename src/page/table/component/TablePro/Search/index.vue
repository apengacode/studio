<template>
  <div class="search-root">
    <el-form :model="form" :rules="rules">
      <div class="searchItemWrapper" ref="rootRef">
        <div
          class="searchItem"
          v-for="column in searchColumns"
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
            />
          </el-form-item>
        </div>

        <div class="searchButtons" :style="searchButtonsStyle">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button>重置</el-button>
          <el-button text type="primary" @click="onChangeSwitch"
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

const buttonWidth = 220;
const searchItemWidth = 300;

const props = withDefaults(
  defineProps<{
    columns: Column[] | undefined;
    params?: { [key: string]: string | undefined | null | number };
    defaultSearchSwitch?: string;
  }>(),
  { columns: undefined, defaultSearchSwitch: '0' },
);

const rootRef = ref<HTMLElement | null>(null);

const { defaultSearchSwitch } = toRefs(props);

const state = reactive<{
  form: any;
  rootWidth: number;
  searchColumns: Column[];
  switchStatus: string;
  rules: any;
}>({
  form: {},
  rootWidth: 0,
  searchColumns: [],
  switchStatus: defaultSearchSwitch.value,
  rules: [],
});

const { form, rootWidth, searchColumns, switchStatus, rules } = toRefs(state);

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
  console.log(form.value);
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
  const visibleColumns = searchColumns.value.filter((item) => {
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

watch(
  () => [switchStatus.value, searchColumns.value],
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
  props,
  (newProps) => {
    if (newProps.columns && newProps.columns.length) {
      searchColumns.value = newProps.columns.filter((item) => {
        if (item['search.search'] && item['search.search'] === '1') {
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
          }
          rules.value[item.fieldName as string] = valids;
          return true;
        } else {
          searchColumns.value = [];
          rules.value = {};
        }
      });

      if (newProps.params && typeof newProps.params === 'object') {
        for (let k in newProps.params) {
          if (newProps.params[k]) {
            const findColumn = searchColumns.value.find((item) => {
              return item.fieldName === k;
            });
            if (!!findColumn) {
              form.value[k] = newProps.params[k];
            }
          }
        }
        console.log('form', form.value);
      }
    }
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  const width = rootRef.value?.offsetWidth as number;
  rootWidth.value = width;
});
</script>

<style scoped lang="scss">
.search-root {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 24px 12px 6px;
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
