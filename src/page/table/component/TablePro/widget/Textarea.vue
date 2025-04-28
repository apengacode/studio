<template>
  <el-input
    v-model="value"
    type="textarea"
    clearable
    :placeholder="placeholder"
    :disabled="readonly === '1'"
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
