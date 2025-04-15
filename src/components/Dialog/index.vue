

<template>
  <div class="valueContainer" @click="onShowDialog"></div>
  <el-dialog v-model="visible" :title="title" width="800" draggable>
    <slot></slot>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue';
const props = defineProps<{title: string}>()

const {title} = toRefs(props)

const state = reactive({
  visible: false
})

const {visible} = toRefs(state)

const onShowDialog = () => {
  visible.value = true
}
</script>

<style scoped lang="scss">
.valueContainer {
  align-items: center;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  background-image: none;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
  cursor: text;
  display: inline-flex;
  flex-grow: 1;
  justify-content: flex-start;
  padding: 1px 11px;
  transform: translateZ(0);
  transition: var(--el-transition-box-shadow);
  text-align: left;
  width: 100%;
  cursor: pointer;
  height: 32px;
}
</style>
