<template>
  <component
    ref="widgetRef"
    :is="activeComponent"
    :column="column"
    v-model="value"
    :placeholder="placeholder"
    :readonly="readonly"
    @get-dict-recourse="onGetDictRecourse"
  >
  </component>
</template>
<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { useVModel } from '@vueuse/core';
import type { Dictionary } from '@/page/action/component/Action/Fields/type';
import type { Column } from '../type';
import { DISPLAY_TYPE } from '@/const';
import Text from './TEXT.vue';
import Number from './Number.vue';
import Select from './Select.vue';
import SelectMultiple from './SelectMultiple.vue';
import Textarea from './Textarea.vue';
import DateLocal from './DateLocal.vue';
import DateLocalRange from './DateLocalRange.vue';
import DateYM from './DateYM.vue';
import DateYMRange from './DateYMRange.vue';
import DateTime from './DateTime.vue';
import DateTimeRange from './DateTimeRange.vue';
import Switch from './Switch.vue';

const props = defineProps<{
  displayType: string;
  column: Column;
  modelValue: string | undefined;
  placeholder: string;
  readonly: string;
}>();

const widgetRef = ref<
  | InstanceType<typeof Text>
  | InstanceType<typeof Number>
  | InstanceType<typeof Select>
  | null
>(null);

const emit = defineEmits(['update:modelValue']);
const { column, displayType, placeholder } = toRefs(props);

const value = useVModel(props, 'modelValue', emit);

const activeComponent = computed(() => {
  switch (displayType.value) {
    case DISPLAY_TYPE.TEXT:
      return Text;
    case DISPLAY_TYPE.NUMBER:
      return Number;
    case DISPLAY_TYPE.SELECT:
      return Select;
    case DISPLAY_TYPE.SELECT_MULTIPLE:
      return SelectMultiple;
    case DISPLAY_TYPE.TEXTAREA:
      return Textarea;
    case DISPLAY_TYPE.DATE_LOCAL:
      return DateLocal;
    case DISPLAY_TYPE.DATE_LOCAL_RANGE:
      return DateLocalRange;
    case DISPLAY_TYPE.DATE_YM:
      return DateYM;
    case DISPLAY_TYPE.DATE_YM_RANGE:
      return DateYMRange;
    case DISPLAY_TYPE.DATE_TIME:
      return DateTime;
    case DISPLAY_TYPE.DATE_TIME_RANGE:
      return DateTimeRange;
    case DISPLAY_TYPE.SWITCH:
      return Switch;

    default:
      break;
  }
});

const onGetDictRecourse = (callback: (dictRecourse: Dictionary[]) => void) => {
  if (!column.value.dict && column.value.dictUrl) {
    setTimeout(() => {
      callback([
        { id: '01', name: '男' },
        { id: '02', name: '女' },
        { id: '03', name: '未知' },
      ]);
    }, 500);
  }
};
</script>

<style scoped lang="scss"></style>
