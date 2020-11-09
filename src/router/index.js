import Vue from 'vue';
import Router from 'vue-router';

import Chart from '../components/Chart';
import Table from '../components/Table';
// import Teste from '../components/Teste';
// import Teste2 from '../components/Teste2';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'table',
      path: '/',
      component: Table,
    },
    {
      name: 'teste',
      path: '/chart',
      component: Chart,
    },
  ],
});
