<template>
  <div>
    <div id="select">
      <div class="select">
        <v-select
          :items="mesesDisponiveis"
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
        v-for="variavel in variaveis"
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
      ><button @click="getPeriodData" class="btn" id="data">
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
    <!-- </div> -->

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
  props: ['ipcaData', 'mesesDisponiveis', 'variaveis', 'groups'],
  created() {
    this.periodSelected.monthInitial = this.mesesDisponiveis[1];
    this.periodSelected.monthFinal = this.mesesDisponiveis[0];
    this.getPeriodData();
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
        const i = this.mesesDisponiveis.indexOf(
          this.periodSelected.monthInitial,
        );
        const finalMonths = this.mesesDisponiveis.slice(0, i);
        return finalMonths;
      } else {
        return this.mesesDisponiveis;
      }
    },
  },
  methods: {
    verifyBlankFields: function() {
      if (!this.periodSelected.initial) {
        alert('Erro');
      }
    },
    getPeriodData: function() {
      console.log(this.periodSelected);

      const filteredByVariation = this.ipcaData.filter(
        item => item.D2N === this.variationSelected,
      );

      const firstIndex = filteredByVariation.find(
        item =>
          item.D3N === this.periodSelected.monthInitial.toLowerCase(),
      );

      const secondIndex = filteredByVariation.find(
        item =>
          item.D3N === this.periodSelected.monthFinal.toLowerCase(),
      );

      this.periodSelected = {
        ...this.periodSelected,
        initial: this.ipcaData.indexOf(firstIndex),
        final: this.ipcaData.indexOf(secondIndex),
      };

      const dataPeriod = this.ipcaData.slice(
        this.periodSelected.initial,
        this.periodSelected.final + 10,
      );

      const groupIndex = dataPeriod.filter(
        item => item.D4N === this.selectedGroup,
      );

      const monthsToPlot = groupIndex.map(item => item.D3N);
      this.options = {
        chart: {
          id: 'vuechart-example',
        },
        xaxis: {
          categories: monthsToPlot,
        },
      };

      const dataToPlot = groupIndex.map(item => item.V);

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
