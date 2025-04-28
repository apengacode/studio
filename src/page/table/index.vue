<template>
  <article>
    <el-card class="table-card">
      <TablePro
        action="1-1-1"
        :changeColumn="onChangeColumn"
        :params="params"
        defaultSearchSwitch="1"
      />
    </el-card>
  </article>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TablePro from './component/TablePro/index.vue';
import type { Column } from './component/TablePro/type';

const onChangeColumn = (
  columns: Column[],
  callback: (columns: Column[]) => void,
) => {
  setTimeout(() => {
    columns[2] = {
      ...columns[2],
      dictUrl: 'asjd/qwhjekij',
    };
    columns[3] = {
      ...columns[3],
      dictUrl: 'asjd/qwhjekij',
    };
    callback([...columns]);
  }, 500);
};

const params = ref({});

onMounted(() => {
  setTimeout(() => {
    params.value = {
      name: '张三',
      sex: '01',
      age: '12',
      sport: ['01', '02'],
      birthday: '2025-04-08',
      birthdayt: '2025-04-08',
      birthdayRange: ['2025-04-08', '2025-04-10'],
      birthdayYm: '2025-04',
      kg: true,
    };
  }, 200);
});
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
