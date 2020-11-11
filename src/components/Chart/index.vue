<template>
  <div>
    <div class="flex space-between">
      <div class="select">
        <v-select
          :items="availableMonths"
          filled
          label="Selecione mês inicial"
          v-model="periodSelected.monthInitial"
        ></v-select>
      </div>

      <div class="select">
        <v-select
          :items="possibleFinalMonths"
          filled
          label="Selecione mês final"
          v-model="periodSelected.monthFinal"
        ></v-select>
      </div>
    </div>

    <v-radio-group v-model="variationSelected" row>
      <v-radio
        v-for="variavel in variations"
        :key="variavel"
        :label="variavel"
        :value="variavel"
      ></v-radio>
    </v-radio-group>

    <div>
      <v-select
        :items="groups"
        filled
        label="Selecione o grupo"
        v-model="selectedGroup"
      ></v-select>
    </div>

    <a href="#data"
      ><button @click="loadChart" class="btn" id="data">
        PESQUISAR
      </button></a
    >

    <div id="chart">
      <strong>
        {{ variationSelected }}
      </strong>
      <p>
        {{ periodSelected.monthInitial }} -
        {{ periodSelected.monthFinal }}
      </p>
      <p>{{ selectedGroup }}</p>
    </div>

    <apexchart
      width="100%"
      type="line"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import './styles.css';
import '../../styles/global.css';

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: [
    'ipcaData',
    'availableMonths',
    'variations',
    'groups',
    'error',
  ],
  created() {
    this.periodSelected.monthInitial = this.availableMonths[1];
    this.periodSelected.monthFinal = this.availableMonths[0];
    this.loadChart();
  },
  data() {
    return {
      variationSelected: 'IPCA - Variação mensal',
      options: {
        chart: {
          id: 'vuechart-example',
        },
        xaxis: {
          categories: [],
        },
      },
      series: [
        {
          name: '',
          data: [],
        },
      ],
      periodSelected: {
        initial: '',
        final: '',
        monthInitial: '',
        monthFinal: '',
      },
      selectedGroup: 'Índice geral',
    };
  },
  computed: {
    possibleFinalMonths: function() {
      if (this.periodSelected.monthInitial) {
        const i = this.availableMonths.indexOf(
          this.periodSelected.monthInitial,
        );
        const finalMonths = this.availableMonths.slice(0, i);
        return finalMonths;
      } else {
        return this.availableMonths;
      }
    },
  },
  methods: {
    /*estes métodos filtram os dados retornados pela API de acordo com as opções selecionadas pelo usuário
    embora fosse possível trabalhar o mesmo array inicial para cada filtro disponível ao usuário, visando menor acoplamento
    entre eles, no longo prazo a tendência será que o retorno da API seja cada vez maior, portanto, a decisão tomada
    foi a de realizar a invocação de um método dentro do método seguinte, preferindo performance que reusabilidade.*/

    loadChart: function() {
      this.setDataToPlot();
    },
    filterByVariation: function() {
      const filteredByVariation = this.ipcaData.filter(
        item => item.D2N === this.variationSelected,
      );

      return filteredByVariation;
    },
    filterByMonths: function() {
      const filteredByVariation = this.filterByVariation();

      const firstInitialMonthOccurrence = filteredByVariation.find(
        item =>
          item.D3N === this.periodSelected.monthInitial.toLowerCase(),
      );

      const firstFinalMonthOccurence = filteredByVariation.find(
        item =>
          item.D3N === this.periodSelected.monthFinal.toLowerCase(),
      );

      this.periodSelected = {
        ...this.periodSelected,
        initial: this.ipcaData.indexOf(firstInitialMonthOccurrence),
        final: this.ipcaData.indexOf(firstFinalMonthOccurence),
      };

      const filteredByMonth = this.ipcaData.slice(
        this.periodSelected.initial,
        this.periodSelected.final + 10,
      );

      return filteredByMonth;
    },
    filterByGroup: function() {
      const filteredByMonth = this.filterByMonths();

      const filteredByGroup = filteredByMonth.filter(
        item => item.D4N === this.selectedGroup,
      );

      return filteredByGroup;
    },
    setDataToPlot: function() {
      const filteredByGroup = this.filterByGroup();

      const monthsToPlot = filteredByGroup.map(item => item.D3N);
      this.options = {
        chart: {
          id: 'vuechart-example',
        },
        xaxis: {
          categories: monthsToPlot,
        },
      };

      const dataToPlot = filteredByGroup.map(item => item.V);

      this.series = [
        {
          name: 'Valor',
          data: dataToPlot,
        },
      ];
    },
  },
};
</script>

<style></style>
