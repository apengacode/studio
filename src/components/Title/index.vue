<template>
  <div
    class="titleContainer"
    :style="{ marginBottom: margin ? size + 'px' : '0' }"
  >
    <div class="titleContainerLeft">
      <div
        class="title v-str-cut"
        :style="{ fontSize: size + 'px', lineHeight: size + 'px' }"
      >
        <slot></slot>
      </div>
      <div class="v-ph-8"><slot name="left"></slot></div>
    </div>
    <slot name="right"></slot>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
const props = withDefaults(defineProps<{ size?: string; margin?: boolean }>(), {
  size: '16',
  margin: true,
});

const { size } = toRefs(props);
</script>

<style scoped lang="scss">
.titleContainer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  .titleContainerLeft {
    display: flex;
    align-items: center;
    width: 0;
    flex: 1;
    .title {
      border-left: 4px solid #3c4ad1;
      padding-left: 8px;
      font-size: 16px;
      line-height: 16px;
      font-weight: 700;
    }
  }
}
</style>
