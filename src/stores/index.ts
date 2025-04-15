import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState({
  storage: localStorage, // 默认使用 localStorage
  auto: true // 自动持久化所有 Store
}))

export default pinia