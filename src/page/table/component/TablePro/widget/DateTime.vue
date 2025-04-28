<template>
  <el-date-picker
    v-model="value"
    type="datetime"
    :placeholder="placeholder"
    :disabled="readonly === '1'"
    format="YYYY-MM-DD HH:mm:ss"
    value-format="YYYY-MM-DD HH:mm:ss"
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
