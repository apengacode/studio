<template>
  <div class="table-pro-root" v-loading="tableLoading">
    <section class="tablepro-search" v-if="search">
      <Search ref="searchRef" @reset-page="onSearchReset" @search-page="onSearch" :dataLoading="dataLoading"
        :defaultSearchSwitch="defaultSearchSwitch" :size="defaultSize" :columns="searchColumns" />
    </section>
    <section class="tablepro-operation">
      <Operation :buttons="batchButtons" :get-params="getParams" :get-pagetotal="getPagetotal" :get-checkrecord="getCheckrecord" :size="defaultSize"
        :exist-export="existExport" :exist-refresh="existRefresh" :exist-size="existSize" :exist-setting="existSetting" :columns="cloneGridColumns"
        :selection="selection" @do-refresh="doRequest" @change-size="onChangeSize" @change-grid-column-visible="onChangeGridColumnVisible"
        @change-column-position="onChangeColumnPosition" :hasOperate="singleButtons.length > 0" />
    </section>
    <section class="tablepro-grid">
      <Grid ref="gridRef" :columns="gridColumns" :dataResourse="data" :dataLoading="dataLoading" :selection="selection" :select-value="selectValue"
        :select-label="selectLabel" :default-selections="defaultSelections" :buttons="singleButtons" :get-params="getParams" :size="defaultSize" />
    </section>
    <section class="tablepro-pagination">
      <Pagination :page="page" @pageSizeChange="onPageSizeChange" @pageIndexChange="onPageIndexChange" :size="defaultSize" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, ref, watch } from 'vue';
import { clone } from 'lodash';
import Search from './Search/index.vue';
import Operation from './Operations/index.vue';
import Pagination from './Pagination/index.vue';
import Grid from './Grid/index.vue';
import type {
  Column,
  RequestPage,
  Page,
  Response,
  Button,
  BatchButton,
  SingleButton,
  SettingColumn,
} from './type';
import { useDebounceFn } from '@/utils/fn';
import { checkPermission } from './utils';

const props = withDefaults(
  defineProps<{
    action: string;
    changeColumns?: (columns: Column[]) => Promise<Column[]>;
    params?: { [key: string]: any } | (() => Promise<{ [key: string]: any }>);
    defaultSearchSwitch?: string;
    search?: boolean;
    request: (params: any, page: RequestPage) => Promise<Response<any[]>>;
    buttons: Button[] | (() => Promise<Button[]>);
    selection?: boolean;
    selectValue: string;
    selectLabel: string;
    defaultSelections?: { [key: string]: any }[];
    size?: 'small' | 'default' | 'large';
    existExport?: boolean;
    existRefresh?: boolean;
    existSize?: boolean;
    existSetting?: boolean;
  }>(),
  {
    search: true,
    params: () => ({}),
    buttons: () => [],
    selection: true,
    defaultSelections: () => [],
    size: 'default',
    existExport: true,
    existRefresh: true,
    existSize: true,
    existSetting: true,
  },
);

const state = reactive<{
  columns: Column[];
  gridColumns: Column[];
  cloneGridColumns: Column[];
  searchColumns: Column[];
  data: any[];
  page: Page;
  tableLoading: boolean;
  dataLoading: boolean;
  defaultParams: { [key: string]: any };
  batchButtons: BatchButton[];
  singleButtons: SingleButton[];
  defaultSize: 'small' | 'default' | 'large';
}>({
  columns: [],
  data: [],
  page: { pageIndex: 1, pageSize: 10, total: 0 },
  tableLoading: false,
  dataLoading: false,
  defaultParams: {},
  batchButtons: [],
  singleButtons: [],
  defaultSize: 'default',
  gridColumns: [],
  searchColumns: [],
  cloneGridColumns: [],
});

const {
  action,
  changeColumns,
  params,
  search,
  request,
  buttons,
  selection,
  size,
  existExport,
  existRefresh,
  existSize,
  existSetting,
} = toRefs(props);
const {
  columns,
  data,
  page,
  tableLoading,
  dataLoading,
  defaultParams,
  batchButtons,
  singleButtons,
  defaultSize,
  gridColumns,
  searchColumns,
  cloneGridColumns,
} = toRefs(state);

const searchRef = ref<InstanceType<typeof Search> | null>(null);
const gridRef = ref<InstanceType<typeof Grid> | null>(null);

const emits = defineEmits(['request']);

const getParams = () => {
  const requestParams = searchRef.value?.getValue();
  return {
    ...defaultParams.value,
    ...requestParams,
    pageIndex: page.value.pageIndex,
    pageSize: page.value.pageSize,
  };
};

// 发起数据请求
const { run: doRequest } = useDebounceFn(
  async () => {
    const tableIsEmpty = gridRef.value?.getIsEmpty();
    if (tableIsEmpty) return;
    dataLoading.value = true;
    const requestParams = searchRef.value?.getValue();
    const res = await request.value(
      {
        ...defaultParams.value,
        ...requestParams,
      },
      {
        pageIndex: page.value.pageIndex,
        pageSize: page.value.pageSize,
      },
    );
    dataLoading.value = false;
    if (res.success) {
      data.value = res.data.rows;
      page.value.total = res.data.total;
    }
  },
  10,
  { leading: false, trailing: true },
);

const onPageSizeChange = (val: number) => {
  page.value.pageSize = val;
  doRequest();
};
const onPageIndexChange = (val: number) => {
  page.value.pageIndex = val;
  doRequest();
};

const onSearch = () => {
  page.value = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  };
  data.value = [];
  doRequest();
};

const onSearchReset = () => {
  page.value = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  };
  data.value = [];
  doRequest();
};

const getPagetotal = () => {
  return page.value.total;
};
const getCheckrecord = () => {
  return gridRef.value?.getCheckRecord() as { [key: string]: any }[];
};

const onChangeSize = (size: 'small' | 'default' | 'large') => {
  defaultSize.value = size;
};

const onChangeGridColumnVisible = (checkeds: string[]) => {
  gridColumns.value = gridColumns.value.map((item) => {
    return {
      ...item,
      'setting.show': checkeds.includes(item.fieldName),
    };
  });
};

const onChangeColumnPosition = (
  fixedLeftColumn: SettingColumn[],
  notFixedColumn: SettingColumn[],
  fixedRightColumn: SettingColumn[],
) => {
  gridColumns.value = []
  fixedLeftColumn.forEach((column) => {
    const findColumn = cloneGridColumns.value.find((item) => {
      return item.fieldName === column.id;
    });
    if (findColumn) {
      gridColumns.value.push({
        ...findColumn,
        fixed: 'left',
        'setting.show': column.show,
      });
    }
  })
  notFixedColumn.forEach((column) => {
    const findColumn = cloneGridColumns.value.find((item) => {
      return item.fieldName === column.id;
    });
    if (findColumn) {
      gridColumns.value.push({
        ...findColumn,
        fixed: undefined,
        'setting.show': column.show,
      });
    }
  })
  fixedRightColumn.forEach((column) => {
    const findColumn = cloneGridColumns.value.find((item) => {
      return item.fieldName === column.id;
    });
    if (findColumn) {
      gridColumns.value.push({
        ...findColumn,
        fixed: 'right',
        'setting.show': column.show,
      });
    }
  })
};

watch(size, () => { }, { immediate: true });
onMounted(async () => {
  // 设置字段
  tableLoading.value = true;
  let columnsResource: Column[] = [];
  let actionData = window.localStorage.getItem(action.value);
  if (!actionData) {
    columnsResource = [];
  } else {
    columnsResource = JSON.parse(actionData);
  }
  let _columns: Column[] = [];
  if (changeColumns.value && typeof changeColumns.value === 'function') {
    _columns = await changeColumns.value(columnsResource);
  } else {
    _columns = columnsResource;
  }

  columns.value = _columns;

  // 设置表格显示字段
  gridColumns.value = columns.value.filter((column) => {
    let hidden = column['grid.hidden'] || column['hidden'];
    if (hidden) {
      return hidden === '0';
    }
    return true;
  });
  cloneGridColumns.value = clone(gridColumns.value);

  // 设置搜索字段 判断是否有搜索  如果search为false 则searchColumns为[] 默认的params全都是固定条件
  searchColumns.value = columns.value.filter((item) => {
    if (item['search.search'] && item['search.search'] === '1') {
      return true;
    }
  });
  if (!search.value) {
    searchColumns.value = [];
  }
  // 设置查询条件和固定条件
  let _params: { [key: string]: any } = {};
  if (params.value && typeof params.value === 'function') {
    _params = await params.value();
  }
  if (params.value && typeof params.value === 'object') {
    _params = await params.value;
  }
  // 区分搜索条件和固定条件
  defaultParams.value = {};
  const searchParams: { [key: string]: any } = {};
  for (let k in _params) {
    // 查询不到则为固定条件
    const findFlag = searchColumns.value.some((item) => {
      return item.fieldName === k;
    });
    if (findFlag) {
      searchParams[k] = _params[k];
    } else {
      defaultParams.value[k] = _params[k];
    }
  }

  searchRef.value?.setSearchForm(searchParams);
  tableLoading.value = false;

  doRequest();

  // 设置按钮
  let _buttons: Button[] = [];
  if (buttons.value && typeof buttons.value === 'function') {
    _buttons = await buttons.value();
  }
  if (buttons.value && Array.isArray(buttons.value)) {
    _buttons = buttons.value;
  }
  batchButtons.value = [];
  singleButtons.value = [];
  const defaultButton = {
    type: 'default',
    checkRecords: true,
  };
  _buttons.forEach((btn) => {
    if (checkPermission(btn.permission)) {
      if (!btn.children) {
        if (btn.canBatch) {
          batchButtons.value.push({ ...defaultButton, ...btn } as BatchButton);
        }
        if (btn.canSingle) {
          singleButtons.value.push({
            ...defaultButton,
            ...btn,
          } as SingleButton);
        }
      } else if (btn.children.length) {
        const children = btn.children.filter((cbtn) => {
          return checkPermission(cbtn.permission);
        });
        btn.children = children;
        if (children.length) {
          if (btn.canBatch) {
            batchButtons.value.push({
              ...defaultButton,
              ...btn,
            } as BatchButton);
          }
          if (btn.canSingle) {
            singleButtons.value.push({
              ...defaultButton,
              ...btn,
            } as SingleButton);
          }
        }
      }
    }
  });

  // 设置默认size
  defaultSize.value = size.value;
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
