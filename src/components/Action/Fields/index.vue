<template>
  <div class="fieldsRoot v-pr-8">
    <Title>
      基本配置
      <template #right>
        <el-icon class="v-mh-8 operateIcon" size="14" @click="onAddField"
          ><Plus
        /></el-icon>
        <el-icon class="v-mh-8 operateIcon" size="14" @click="onMove('up')"
          ><Top
        /></el-icon>
        <el-icon class="v-mh-8 operateIcon" size="14" @click="onMove('down')"
          ><Bottom
        /></el-icon>
      </template>
    </Title>
    <div class="searchContainer">
      <el-input
        v-model="searchValue"
        placeholder="Type something"
        :prefix-icon="Search"
      />
    </div>
    <main>
      <el-table
        :data="tableData"
        @selection-change="onSelectionChange"
        border
        stripe
        style="width: 100%; height: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="操作" width="200">
          <template v-slot="scope">
            <template v-if="scope.row.editabled">
              <el-button
                link
                size="small"
                type="primary"
                @click="onSaveField(scope.row)"
                >保存</el-button
              >
              <el-button
                link
                size="small"
                type="primary"
                @click="onDeleteField(scope.$index)"
                >删除</el-button
              >
            </template>
            <template v-else>
              <el-button
                size="small"
                type="primary"
                @click="emit('setFieldOptions', scope.row)"
                >编辑属性</el-button
              >
              <el-button
                link
                size="small"
                type="primary"
                @click="onEditField(scope.row)"
                >编辑</el-button
              >
              <el-button
                link
                size="small"
                type="primary"
                @click="onDeleteField(scope.$index)"
                >删除</el-button
              >
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="fieldName" label="字段名" width="180">
          <template v-slot="scope">
            <el-input
              v-show="scope.row.editabled"
              v-model="scope.row.fieldName"
            />
            <span v-show="!scope.row.editabled">{{ scope.row.fieldName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zhCn" label="中文名" width="180">
          <template v-slot="scope">
            <el-input v-show="scope.row.editabled" v-model="scope.row.zhCn" />
            <span v-show="!scope.row.editabled">{{ scope.row.zhCn }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enUs" label="英文名">
          <template v-slot="scope">
            <el-input v-show="scope.row.editabled" v-model="scope.row.enUs" />
            <span v-show="!scope.row.editabled">{{ scope.row.enUs }}</span>
          </template>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Plus, Top, Bottom } from '@element-plus/icons-vue';
import Title from '../../Title/index.vue';
import type { State, FieldData } from './type';
import { usePinia } from '@/stores/const';
import uuid from '@/utils/uuid';
const state = reactive<State>({
  searchValue: '',
  visible: false,
  tableData: [],
  fieldForm: {
    fieldName: undefined,
    zhCn: undefined,
    enUs: undefined,
  },
  fieldFormRules: {
    fieldName: [
      { required: true, message: '请输入字段名', trigger: 'blur' },
      { min: 1, max: 20, message: '长度应在1-20', trigger: 'blur' },
    ],
    zhCn: [
      { required: true, message: '请输入中文', trigger: 'blur' },
      { min: 1, max: 50, message: '长度应在1-50', trigger: 'blur' },
    ],
  },
  selections: [],
});

const props = defineProps<{ actionId: string | undefined }>();

const store = usePinia();

const { actionId } = toRefs(props);

const { defaultFieldValue } = toRefs(store);

const { searchValue, tableData, selections } = toRefs(state);

const emit = defineEmits(['setFieldOptions']);

const onSelectionChange = (list: FieldData[]) => {
  selections.value = list;
};

const onAddField = () => {
  tableData.value.push({
    ...defaultFieldValue.value,
    editabled: true,
    id: uuid(),
  });
};

const onSaveField = (row: FieldData) => {
  if (validate(row)) {
    row.editabled = false;
  }
};

const validate: (row: FieldData) => boolean = (row) => {
  if (!row.fieldName) {
    ElMessage({
      message: '字段名必填',
      type: 'warning',
      duration: 0,
    });
    return false;
  }
  if (!row.zhCn) {
    ElMessage({
      message: '中文必填',
      type: 'warning',
    });
    return false;
  }
  return true;
};

const onEditField = (row: FieldData) => {
  row.editabled = true;
};
const onDeleteField = (index: number) => {
  tableData.value.splice(index, 1);
};

const onMove = (direction: string) => {
  if (!selections.value.length) return; // 无选中 不移动
  let indexs: number[] = []; // 拿到需要移动元素的索引
  for (let selection of selections.value) {
    const index = tableData.value.findIndex((item) => {
      return item.id === selection.id;
    });
    indexs.push(index);
  }

  if (direction === 'up') {
    // 排序 向上排序  需要从索引最小的开始处理 一次交换 向下排序 需要从索引最大的开始处理 一次交换
    indexs = indexs.sort((a, b) => a - b);
  } else {
    indexs = indexs.sort((a, b) => b - a);
  }

  indexs.forEach((i) => {
    if (direction === 'up') {
      if (i !== 0) {
        [tableData.value[i], tableData.value[i - 1]] = [
          tableData.value[i - 1],
          tableData.value[i],
        ];
      }
    } else {
      if (i !== tableData.value.length - 1) {
        [tableData.value[i], tableData.value[i + 1]] = [
          tableData.value[i + 1],
          tableData.value[i],
        ];
      }
    }
  });
};

const getActionFieldDatas = (actionId: string) => {
  if (actionId === '1-1-1') {
    tableData.value = [
      {
        ...defaultFieldValue.value,
        editabled: false,
        id: '1823012judjaksjdn',
        fieldName: 'name',
        zhCn: '姓名',
        enUs: 'name',
      },
      {
        ...defaultFieldValue.value,
        editabled: false,
        id: '1823012judjaksjdn1',
        fieldName: 'age',
        zhCn: '年龄',
        enUs: 'age',
      },
      {
        ...defaultFieldValue.value,
        editabled: false,
        id: '1823012judjaksjdn12',
        fieldName: 'collage',
        zhCn: '院系',
        enUs: 'collage',
      },
    ];
  } else {
    tableData.value = []
  }
};

watch(
  actionId,
  (newVal) => {
    if (newVal) {
      getActionFieldDatas(newVal);
    }
  },
  { deep: true, immediate: true },
);
</script>

<style scoped lang="scss">
.fieldsRoot {
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  .operateIcon:hover {
    color: var(--primary-color);
    cursor: pointer;
  }
  main {
    height: 0;
    flex: 1;
  }
}
.dialog-body {
  height: 150px;
  overflow-y: auto;
}
</style>
