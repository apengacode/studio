<template>
  <article>
    <el-card class="table-card">
      <TablePro
        action="1-1-1"
        :changeColumns="onChangeColumns"
        :params="onGetDefaultParams"
        :request="onRequest"
        :buttons="getButtons"
        select-label="{KCH}【{KCM}】"
        select-value="WID"
        :default-selections="[
          {
            WID: 'ba13df81739942898cdedf5b3377f267',
            KCH: '20240705',
            KCM: 'xjwang-课程',
          },
          {
            WID: '58bcab074b044b49b9e20bf64b15b5aa',
            KCH: '20240705',
            KCM: 'xjwang-课程',
          },
        ]"
      />
    </el-card>
  </article>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import TablePro from './component/TablePro/index.vue';
import type { Column, Response, Button } from './component/TablePro/type';
import { getList } from './component/TablePro/utils';

const getButtons: () => Promise<Button[]> = () => {
  return new Promise((reslove) => {
    setTimeout(() => {
      reslove([
        {
          key: 'add',
          text: '新增',
          type: 'primary',
          canBatch: true,
          checkRecords: false,
          permission: 'add',
          callback(params, records) {
          },
        },
        {
          key: 'delete',
          text: '删除',
          permission: 'delete',
          canBatch: true,
          checkRecords: true,
          callback() {},
        },
        {
          key: 'audit',
          text: '审核',
          type: 'warning',
          canBatch: true,
          children: [
            {
              key: 'auditing',
              text: '待审核',
              permission: 'auditing',
              checkRecords: true,
              callback(params, records) {
                console.log(params);
                console.log(records);
              },
            },
            {
              key: 'audited',
              text: '已审核',
              permission: 'audited',
              checkRecords: true,
              beforRender(row) {
                return true;
              },
              callback() {},
            },
          ],
          callback() {},
        },
        {
          key: 'export',
          text: '导出',
          canBatch: true,
          checkRecords: true,
          callback() {},
        },
        {
          key: 'edit',
          text: '编辑',
          canSingle: true,
          callback(params, records) {
            console.log(params);
            console.log(records);
          },
        },
        {
          key: 'detail',
          text: '详情',
          canSingle: true,
          callback() {},
        },
        {
          key: 'more',
          text: '更多',
          type: 'warning',
          canSingle: true,
          children: [
            {
              key: 'auditing',
              text: '待审核',
              permission: 'auditing',
              checkRecords: true,
              callback(params, records) {
                console.log(params);
                console.log(records);
              },
            },
            {
              key: 'audited',
              text: '已审核',
              permission: 'audited',
              checkRecords: true,
              beforRender(row) {
                return true;
              },
              callback() {},
            },
          ],
          callback() {},
        },
      ]);
    }, 10);
  });
};

const buttons: Button[] = [
  {
    key: 'add',
    text: '新增',
    type: 'primary',
    canBatch: true,
    checkRecords: false,
    permission: 'add',
    callback(params, records) {
      console.log(params);
      console.log(records);
    },
  },
  {
    key: 'delete',
    text: '删除',
    permission: 'delete',
    canBatch: true,
    checkRecords: true,
    callback() {},
  },
  {
    key: 'audit',
    text: '审核',
    type: 'warning',
    canBatch: true,
    canSingle: true,
    checkRecords: true,
    callback() {},
  },
  {
    key: 'export',
    text: '导出',
    canBatch: true,
    checkRecords: true,
    callback() {},
  },
  {
    key: 'edit',
    text: '编辑',
    canSingle: true,
    callback() {},
  },
  {
    key: 'detail',
    text: '详情',
    canSingle: true,
    callback() {},
  },
];

const onChangeColumns: (columns: Column[]) => Promise<Column[]> = (columns) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      columns[2] = {
        ...columns[2],
        dictUrl: 'asjd/qwhjekij',
      };
      columns[3] = {
        ...columns[3],
        dictUrl: 'asjd/qwhjekij',
      };
      resolve([...columns]);
    }, 500);
  });
};

const onGetDefaultParams = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        XNXQDM: '2024-2025-1',
        // sex: ''
      });
    }, 500);
  });
};

interface TableRow {
  name: string;
  sex: string;
  age: string;
  sport: string[];
  birthday: string;
  birthdayt: string;
  birthdayRange: string[];
  birthdayYm: string;
}

const onRequest = async (
  params: any,
  page: { pageIndex: number; pageSize: number },
): Promise<Response<TableRow[]>> => {
  const res = await getList({ ...params, ...page });
  return res;
};

onMounted(() => {});
</script>

<style scoped lang="scss">
article {
  width: 100%;
  height: 100%;
  padding: 8px;
}
.table-card {
  width: 100%;
  height: 100%;
}
.table-card ::v-deep .el-card__body {
  width: 100%;
  height: 100%;
}
</style>
