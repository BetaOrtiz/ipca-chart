<template>
  <v-app>
    <div id="header">
      <div class="header-content">
        <div class="logo">
          <img src="./assets/cef.svg" alt="Caixa Econômica" />
        </div>
        <div class="header-elements">
          <div id="header-title">
            <h1>IPCA</h1>
            <h2>Consulta Histórico</h2>
          </div>
          <div class="nav">
            <router-link to="/">
              <button class="main-buttons" @click="page = 'table'">
                TABELA HISTÓRICA
              </button></router-link
            >

            <router-link to="/chart">
              <button class="main-buttons" @click="page = 'chart'">
                ANÁLISE POR GRUPOS
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="content">
        <router-view
          :ipcaData="ipcaData"
          :mesesDisponiveis="mesesDisponiveis"
          :variaveis="variaveis"
          :groups="groups"
          :selectedDate="selectedDate"
        />
      </div>
    </div>
  </v-app>
</template>

<script>
import './app-styles.css';
import '../src/styles/global.css';

export default {
  methods: {
    getDate() {
      const meses = [...new Set(this.ipcaData.map(item => item.D3N))];

      const mesesUpper = meses.map(mes => mes.toUpperCase());

      return mesesUpper.reverse();
    },
    getVariaveis() {
      const variaveis = [
        ...new Set(this.ipcaData.map(item => item.D2N)),
      ];
      return variaveis;
    },
    getGroups() {
      const groups = [
        ...new Set(this.ipcaData.map(item => item.D4N)),
      ];
      return groups;
    },
  },
  data() {
    return {
      page: 'table',
      selectedDate: '',
      variaveis: [],
      mesesDisponiveis: [],
      groups: [],
      ipcaData: [],
    };
  },

  created() {
    this.$http.get('/').then(res => {
      this.ipcaData = res.data;

      let x = this.getDate();
      x.pop();
      this.mesesDisponiveis = x;
      this.selectedDate = this.mesesDisponiveis[0];

      x = this.getVariaveis();
      x.shift();
      this.variaveis = x;

      x = this.getGroups();
      x.shift();
      this.groups = x;
    });
  },
};
</script>

<style></style>
