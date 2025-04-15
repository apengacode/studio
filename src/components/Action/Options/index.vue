<template>
  <div class="optionsRoot" v-if="options">
    <Title size="16"> 属性配置 </Title>
    <main>
      <el-form :model="form" label-width="auto">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="1">
            <template #title>
              <Title size="14" :margin="false"> 基础属性 </Title>
            </template>
            <el-form-item label="字典配置">
              <!-- <el-input v-model="form.name" /> -->
              <Dialog title="数据字典"></Dialog>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template #title>
              <Title size="14" :margin="false"> 参数属性 </Title>
            </template>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template #title>
              <Title size="14" :margin="false"> 默认显示属性 </Title>
            </template>
            <el-form-item label="是否必填">
              <el-select v-model="form.required" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否隐藏">
              <el-select v-model="form.hidden" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否只读">
              <el-select v-model="form.readonly" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所占列数">
              <el-input-number
                style="width: 100%; text-align: left"
                v-model="form.columnNumber"
                clearable
                :min="1"
                :max="12"
                :step="1"
                :step-strictly="true"
                :controls="false"
              />
            </el-form-item>
            <el-form-item label="显示类型">
              <el-select v-model="form.displayType" filterable clearable>
                <el-option
                  v-for="item in store.displayType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template #title>
              <Title size="14" :margin="false"> 列表显示属性 </Title>
            </template>
            <el-form-item label="是否必填">
              <el-select v-model="form['grid.required']" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否隐藏">
              <el-select v-model="form['grid.hidden']" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否只读">
              <el-select v-model="form['grid.readonly']" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否固定">
              <el-select v-model="form['grid.fixed']" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="列宽（px或%）">
              <el-input v-model="form['grid.width']" clearable />
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template #title>
              <Title size="14" :margin="false"> 表单显示属性 </Title>
            </template>
            <el-form-item label="是否必填">
              <el-select v-model="form['form.required']" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否隐藏">
              <el-select v-model="form['form.hidden']" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否只读">
              <el-select v-model="form['form.readonly']" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="显示类型">
              <el-select
                v-model="form['form.displayType']"
                filterable
                clearable
              >
                <el-option
                  v-for="item in store.displayType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="联动地址">
              <el-input v-model="form['form.linkUrl']" clearable />
            </el-form-item>
            <el-form-item label="联动字段">
              <el-input v-model="form['form.linkField']" clearable />
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item name="6">
            <template #title>
              <Title size="14" :margin="false"> 查询显示属性 </Title>
            </template>
            <el-form-item label="快速查询">
              <el-select
                v-model="form['search.quickSearch']"
                filterable
                clearable
              >
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否必填">
              <el-select v-model="form['search.required']" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否隐藏">
              <el-select v-model="form['search.hidden']" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否只读">
              <el-select v-model="form['search.readonly']" filterable clearable>
                <el-option
                  v-for="item in store.yesOrNo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="显示类型">
              <el-select
                v-model="form['search.displayType']"
                filterable
                clearable
              >
                <el-option
                  v-for="item in store.displayType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所占列数">
              <el-input-number
                style="width: 100%; text-align: left"
                v-model="form['search.columnNumber']"
                clearable
                :min="1"
                :max="12"
                :step="1"
                :step-strictly="true"
                :controls="false"
              />
            </el-form-item>
            <el-form-item label="联动地址">
              <el-input v-model="form['search.linkUrl']" clearable />
            </el-form-item>
            <el-form-item label="联动字段">
              <el-input v-model="form['search.linkField']" clearable />
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item name="7">
            <template #title>
              <Title size="14" :margin="false"> 校验 </Title>
            </template>
            <el-form-item label="长度">
              <el-input-number
                style="width: 100%; text-align: left"
                v-model="form['validate.length']"
                clearable
                :min="1"
                :step="1"
                :step-strictly="true"
                :controls="false"
              />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="form['validate.type']" filterable clearable>
                <el-option
                  v-for="item in store.validateType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="正则表达式">
              <el-input v-model="form['validate.rule']" clearable />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </main>
  </div>
  <div class="emptyContainer" v-else>请选择字段</div>
</template>
<script setup lang="ts">
import { reactive, toRefs, watch } from 'vue';
import { usePinia } from '../../../stores/dictionary';
import type { FieldData } from '../Fields/type';
import Title from '../../Title/index.vue';
import Dialog from '../../Dialog/index.vue';

const store = usePinia();

const state = reactive<{ activeNames: string[]; form: FieldData }>({
  activeNames: ['1', '2', '3', '4', '5', '6', '7'],
  form: {
    required: undefined,
    hidden: undefined,
    readonly: undefined,
    columnNumber: undefined,
    displayType: undefined,

    'grid.required': undefined,
    'grid.hidden': undefined,
    'grid.readonly': undefined,
    'grid.fixed': undefined,
    'grid.width': undefined,

    'form.required': undefined,
    'form.hidden': undefined,
    'form.readonly': undefined,
    'form.displayType': undefined,
    'form.linkUrl': undefined,
    'form.linkField': undefined,

    'search.quickSearch': undefined,
    'search.required': undefined,
    'search.hidden': undefined,
    'search.readonly': undefined,
    'search.displayType': undefined,
    'search.linkUrl': undefined,
    'search.linkField': undefined,
    'search.columnNumber': undefined,

    'validate.rule': undefined,
    'validate.length': undefined,
    'validate.type': undefined,
  },
});
const props = defineProps<{ options: FieldData | undefined }>();

const { activeNames, form } = toRefs(state);
const { options } = toRefs(props);

const emit = defineEmits(['reportOptionsValue'])

watch(
  options,
  (newVal) => {
    if (newVal) {
      form.value = newVal;
    }
  },
  { deep: true, immediate: true },
);


watch(form, (newVal) => {
  console.log(newVal)
  // emit('reportOptionsValue', newVal)
}, {deep: true, immediate: true})

const handleChange = () => {};
</script>
<style scoped lang="scss">
.emptyContainer {
  height: 100%;
  width: 50%;
}
.optionsRoot {
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  main {
    height: 0;
    flex: 1;
    overflow-y: auto;
  }
  footer {
    display: flex;
    justify-content: flex-end;
    padding: 8px;
    border-top: 0.5px solid #e5e7eb;
    border-bottom: 0.5px solid #e5e7eb;
  }
}
.optionsRoot ::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
