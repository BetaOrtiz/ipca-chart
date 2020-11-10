<template>
  <v-app>
    <div class="top">
      <div class="logo">
        <router-link to="/">
          <img src="./assets/cef_neg.png" alt="Caixa Econômica" />
        </router-link>
      </div>
    </div>

    <div id="header">
      <div class="header-elements">
        <div class="header-left-content">
          <h1>IPCA</h1>
          <h2>Consulta Histórico</h2>
          <router-link to="/">
            <button
              :class="
                this.$router.history.current.path === '/chart'
                  ? 'main-buttons'
                  : 'main-buttons disabled'
              "
              :disabled="this.$router.history.current.path === '/'"
              @click="page = 'table'"
            >
              <span> TABELA HISTÓRICA </span>
            </button></router-link
          >
          <router-link to="/chart">
            <button
              :class="
                this.$router.history.current.path === '/'
                  ? 'main-buttons'
                  : 'main-buttons disabled'
              "
              :disabled="
                this.$router.history.current.path === '/chart'
              "
              @click="page = 'chart'"
            >
              <span> ANÁLISE POR GRUPOS </span>
            </button>
          </router-link>
        </div>
        <div class="header-right-content">
          <div class="title">
            <h6>Atualização</h6>
            <p>{{ lastAtualizationDate }}</p>
          </div>

          <div class="indexes">
            <v-card
              v-for="(item, key) in indexes"
              :key="key"
              class="card"
              elevation="2"
            >
              <span>{{ item.variavel }}</span>
              <p>{{ item.serie }}</p>
            </v-card>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <router-view
        :ipcaData="ipcaData"
        :mesesDisponiveis="mesesDisponiveis"
        :variaveis="variaveis"
        :groups="groups"
        :selectedDate="selectedDate"
      />
    </div>
  </v-app>
</template>

<script>
import './app-styles.css';
import '../src/styles/global.css';

export default {
  methods: {
    getDate() {
      const date = new Date();
      let month = date.getMonth().toString();

      const serializedMonth =
        month.length === 2 ? month : `0${month}`;

      const year = date.getFullYear();

      const formatDate = new Date(`${serializedMonth}/30/${year}`);
      var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      this.lastAtualizationDate = new Intl.DateTimeFormat(
        'pt-BR',
        options,
      ).format(formatDate);

      return { year, serializedMonth };
    },
    getMonths() {
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
      indexes: [],
      lastAtualizationDate: '',
    };
  },

  created() {
    this.$http.get('/').then(res => {
      this.ipcaData = res.data;

      let x = this.getMonths();
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

    const date = this.getDate();
    console.log(date);
    this.$http
      .get(
        `https://servicodados.ibge.gov.br/api/v3/agregados/7060/periodos/${date.year}${date.serializedMonth}/variaveis/63|69?localidades=N1[all]&classificacao=315[7169]`,
      )
      .then(res => {
        res.data.map(item => {
          const dataIndice = {
            variavel: item.variavel,
            serie:
              item.resultados[0].series[0].serie[
                `${date.year}${date.serializedMonth}`
              ],
          };

          this.indexes = [...this.indexes, dataIndice];
        });
      });
  },
};
</script>

<style></style>
