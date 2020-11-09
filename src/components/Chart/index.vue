<template>
  <div>
    <div id="select">
      <div class="select">
        <v-select
          :items="mesesDisponiveis"
          filled
          label="Selecione mês inicial"
          v-model="periodSelected.initial"
        ></v-select>
      </div>

      <div class="select">
        <v-select
          :items="possibleFinalMonths"
          filled
          label="Selecione mês final"
          v-model="periodSelected.final"
        ></v-select>
      </div>
    </div>

    <v-radio-group v-model="radioButtonSelected" row>
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

    <button @click="getPeriodData" class="btn">
      PESQUISAR
    </button>

    <div id="titleChart" v-if="showChart">
      <strong>
        {{ radioButtonSelected }}
      </strong>
      <p>
        {{ periodSelected.monthInitial }} -
        {{ periodSelected.monthFinal }}
      </p>
      <p>{{ selectedGroup }}</p>
    </div>
    <!-- </div> -->

    <apexchart
      v-if="showChart"
      id="chart"
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
  data() {
    return {
      radioButtonSelected: null,
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
      showChart: false,
      selectedGroup: '',
    };
  },
  computed: {
    possibleFinalMonths: function() {
      if (this.periodSelected.initial) {
        const i = this.mesesDisponiveis.indexOf(
          this.periodSelected.initial,
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
      this.verifyBlankFields();

      const monthInitial = this.periodSelected.initial;
      const monthFinal = this.periodSelected.final;

      console.log(this.periodSelected);

      const filteredByVariation = this.ipcaData.filter(
        item => item.D2N === this.radioButtonSelected,
      );

      const firstIndex = filteredByVariation.find(
        item =>
          item.D3N === this.periodSelected.initial.toLowerCase(),
      );

      const secondIndex = filteredByVariation.find(
        item => item.D3N === this.periodSelected.final.toLowerCase(),
      );

      this.periodSelected = {
        initial: this.ipcaData.indexOf(firstIndex),
        final: this.ipcaData.indexOf(secondIndex),
        monthInitial,
        monthFinal,
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

      this.showChart = true;
    },
  },
};
</script>

<style></style>
