import { ref, onUnmounted } from 'vue';

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 200,
  options: DebounceOptions = { leading: true, trailing: false },
) {
  const timer = ref<ReturnType<typeof setTimeout> | null>(null);
  const lastArgs = ref<Parameters<T>>();
  const isPending = ref(false);

  // 清除定时器
  const cancel = () => {
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }
    isPending.value = false;
  };

  // 立即执行
  const flush = () => {
    if (timer.value) {
      cancel();
      fn(...lastArgs.value!);
    }
  };

  // 防抖核心逻辑
  const run = (...args: Parameters<T>) => {
    lastArgs.value = args;

    if (isPending.value) {
      if (options.trailing) {
        cancel();
        timer.value = setTimeout(() => {
          fn(...args);
          isPending.value = false;
        }, wait);
      }
      return;
    }

    // 处理 leading 逻辑
    if (options.leading) {
      fn(...args);
    }

    isPending.value = true;
    timer.value = setTimeout(() => {
      // 处理 trailing 逻辑
      if (options.trailing && lastArgs.value) {
        fn(...lastArgs.value);
      }
      isPending.value = false;
    }, wait);
  };

  // 组件卸载时自动清理
  onUnmounted(cancel);

  return { run, cancel, flush };
}
