<template>
  <div class="pagination-root">
    <el-pagination
      v-model:current-page="props.page.pageIndex"
      v-model:page-size="props.page.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      size="small"
      :disabled="false"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="props.page.total"
      @size-change="(val) => emits('pageSizeChange', val)"
      @current-change="(val) => emits('pageIndexChange', val)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Page } from '../type';

const props = defineProps<{ page: Page, size: "small" | "default" | "large"; }>();

const emits = defineEmits(['pageSizeChange', 'pageIndexChange'])


</script>

<style scoped lang="scss">
.pagination-root {
  padding: 8px;
  display: flex;
  justify-content: flex-end;
}
</style>
