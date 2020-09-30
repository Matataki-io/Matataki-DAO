import Vue from 'vue';
import {
    Button,
    Loading,
    Select,
    Option
} from 'element-ui';


Vue.use(Button)
.use(Select)
.use(Option)

Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;