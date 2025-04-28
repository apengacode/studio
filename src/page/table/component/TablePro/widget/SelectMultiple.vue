<template>
  <el-select
    v-model="value"
    filterable
    clearable
    multiple
    @focus="onfocus"
    :loading="loading"
    :placeholder="placeholder"
     :disabled="readonly === '1'"
  >
    <el-option
      v-for="item in dict"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script setup lang="ts">
import { toRefs, reactive, onMounted, watch } from 'vue';
import { useVModel } from '@vueuse/core';
import type {
  Dictionary,
} from '@/page/action/component/Action/Fields/type';
import type { Column } from '../type';

const props = defineProps<{
  column: Column;
  modelValue: string | undefined;
  placeholder: string;
  readonly: string;
}>();

const state = reactive<{ dict: Dictionary[]; loading: boolean }>({
  dict: [],
  loading: false,
});
const emit = defineEmits(['update:modelValue', 'get-dict-recourse']);

const { column, placeholder } = toRefs(props);
const { dict, loading } = toRefs(state);
const value = useVModel(props, 'modelValue', emit);
const onfocus = () => {
  if (!dict.value.length) {
    loading.value = true;
    emit('get-dict-recourse', (dictRecourse: Dictionary[]) => {
      dict.value = dictRecourse;
      loading.value = false;
    });
  }
};
watch(
  () => [value.value, dict.value],
  (newVal) => {
    if (!newVal[0]) return;
    if (newVal[0] && !newVal[1]?.length) {
      onfocus();
    }
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  if (column.value.dict) {
    dict.value = column.value.dict;
  } else {
    dict.value = [];
  }
});
</script>

<style scoped lang="scss"></style>
