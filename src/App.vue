<template>
  <v-app>
    <TopBar />
    <header id="header">
      <div class="elements">
        <div class="left-content">
          <h1>IPCA</h1>
          <h2>Consulta Histórico</h2>
          <nav class="column">
            <!-- <router-link to="/">
              <button
                :class="
                  this.$router.history.current.path === '/chart'
                    ? 'main-buttons'
                    : 'main-buttons disabled after'
                "
                :disabled="this.$router.history.current.path === '/'"
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
              >
                <span> ANÁLISE POR GRUPOS </span>
              </button>
            </router-link> -->
            <Nav :route="this.$router.history.current.path" />
          </nav>
        </div>
        <div class="right-content">
          <div class="title">
            <h6>Atualização</h6>
            <span>{{ lastAtualizationDate }}</span>
          </div>

          <div class="indexes">
            <v-card
              v-for="(item, key) in indexes"
              :key="key"
              class="card"
              elevation="2"
            >
              <h3>{{ item.variavel }}</h3>
              <p>{{ item.serie }}</p>
            </v-card>
          </div>
        </div>
      </div>
    </header>

    <div class="back-to-top" @click="scrollToTop">
      <v-icon x-large color="var(--blue)">
        mdi-arrow-up-bold-circle
      </v-icon>
      Voltar ao topo
    </div>

    <section>
      <router-view
        :ipcaData="ipcaData"
        :availableMonths="availableMonths"
        :variations="variations"
        :groups="groups"
        :selectedDate="selectedDate"
        :error="error"
      />
    </section>
    <footer><span>GEADV - 2020</span></footer>
  </v-app>
</template>

<script>
import TopBar from './components/TopBar';
import Nav from './components/Nav';
import './app-styles.css';
import '../src/styles/global.css';

export default {
  components: { TopBar, Nav },
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
    getVariations() {
      const variations = [
        ...new Set(this.ipcaData.map(item => item.D2N)),
      ];
      return variations;
    },
    getGroups() {
      const groups = [
        ...new Set(this.ipcaData.map(item => item.D4N)),
      ];
      return groups;
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
  },
  data() {
    return {
      selectedDate: '',
      variations: [],
      availableMonths: [],
      groups: [],
      ipcaData: [],
      indexes: [],
      lastAtualizationDate: '',
      error: '',
    };
  },
  created() {
    // Na resolução da requisição à API, foram isolados em estados os dados dos meses disponíveis para consulta,
    // as variáveis do índice e os grupos de consulta existentes.
    // Foram realizadas manipulações diretas nos arrays para retirada do primeiro objeto que contém dados informativos

    this.$http
      .get('/')
      .then(res => {
        this.ipcaData = res.data;

        let months = this.getMonths();
        months.pop();
        this.availableMonths = months;
        this.selectedDate = this.availableMonths[0];

        let variations = this.getVariations();
        variations.shift();
        this.variations = variations;

        let groups = this.getGroups();
        groups.shift();
        this.groups = groups;
      })
      .catch(() => {
        this.error = 'Ocorreu um erro. Tente novamente.';
      });

    // chamada ao método que retorna o último dia do mês anterior
    const date = this.getDate();

    // Utilização da API disponibilizada pelo IBGE com os dados do IPCA para 2020
    this.$http
      .get(
        `https://servicodados.ibge.gov.br/api/v3/agregados/7060/periodos/${date.year}${date.serializedMonth}/variaveis/63|69?localidades=N1[all]&classificacao=315[7169]`,
      )
      .then(res => {
        res.data.map(item => {
          const dataIndex = {
            variavel: item.variavel,
            serie:
              item.resultados[0].series[0].serie[
                `${date.year}${date.serializedMonth}`
              ],
          };

          this.indexes = [...this.indexes, dataIndex];
        });
      });
  },
};
</script>

<style></style>
