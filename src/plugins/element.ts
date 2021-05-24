import Vue from 'vue';
import { Button, Loading, Select, Option, Pagination } from 'element-ui';

Vue.use(Button)
  .use(Select)
  .use(Option)
  .use(Option)
  .use(Pagination);

Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
