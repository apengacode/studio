<template>
  <el-input-number
    class="widget-number"
    style="width: 100%"
    v-model="value"
    clearable
    :min="1"
    :step="1"
    :step-strictly="true"
    :controls="false"
    :placeholder="placeholder"
    :disabled="readonly === '1'"
  />
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import type { Column } from '../type';
import { toRefs } from 'vue';

const props = defineProps<{
  column: Column;
  modelValue: undefined | number;
  placeholder: string;
  readonly: string;
}>();

const { placeholder } = toRefs(props);

const emit = defineEmits(['update:modelValue']);

const value = useVModel(props, 'modelValue', emit);
</script>

<style scoped lang="scss">
.widget-number ::v-deep .el-input__inner {
  text-align: left;
}
</style>
