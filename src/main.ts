import { createApp } from 'vue';
import './assets/css/base.css';
import './assets/css/tailwind.css';
import './assets/css/variables.scss';
import 'element-plus/dist/index.css'
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';


const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount('#root');
