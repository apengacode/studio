<template>
  <el-date-picker
    :placeholder="placeholder"
    :disabled="readonly === '1'"
    v-model="value"
    type="daterange"
    range-separator="To"
    start-placeholder="Start date"
    end-placeholder="End date"
    format="YYYY-MM-DD"
    value-format="YYYY-MM-DD"
  />
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import type { Column } from '../type';

const props = defineProps<{
  column: Column;
  modelValue: string | undefined;
  placeholder: string;
  readonly: string;
}>();

const emit = defineEmits(['update:modelValue']);

const value = useVModel(props, 'modelValue', emit);
</script>

<style scoped lang="scss"></style>
