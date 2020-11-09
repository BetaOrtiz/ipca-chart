<template>
  <div>
    <v-select
      :items="mesesDisponiveis"
      filled
      label="Selecione mês"
      v-model="selectedDate"
    ></v-select>

    <v-progress-linear
      v-if="!ipcaData.length"
      indeterminate
      color="yellow darken-2"
    ></v-progress-linear>

    <template v-else>
      <div class="export-csv-button">
        <download-csv :data="filteredByMonth">
          <v-icon dark medium>
            mdi-microsoft-excel
          </v-icon>
          Exportar CSV
        </download-csv>
      </div>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        filled
      ></v-text-field>

      <v-data-table
        dense
        :headers="headers"
        :items="filteredByMonth"
        :items-per-page="100"
        class="elevation-1"
        group-by="D2N"
        :search="search"
      >
        <template
          v-slot:group.header="{
            group,
            headers,
            toggle,
            isOpen,
          }"
        >
          <td :colspan="headers.length">
            <v-btn @click="toggle" x-small icon :ref="group">
              <v-icon v-if="!isOpen">mdi-plus</v-icon>
              <v-icon v-else>mdi-minus</v-icon>
            </v-btn>
            <span class="mx-5 font-weight-bold">{{ group }}</span>
          </td>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script>
import '../../styles/global.css';

export default {
  props: ['ipcaData', 'mesesDisponiveis', 'selectedDate'],
  computed: {
    filteredByMonth: function() {
      const filteredData = this.ipcaData.filter(
        item => item.D3N.toUpperCase() === this.selectedDate,
      );
      return filteredData;
    },
  },
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Variável',
          value: 'D2N',
          align: 'center',
        },
        {
          text: 'Valor',
          value: 'V',
          align: 'center',
          groupable: false,
        },
        {
          text: 'Grupos',
          value: 'D4N',
          align: 'start',
        },
      ],
    };
  },
};
</script>

<style>
.export-csv-button {
  width: 125px;
  min-width: 130px;
  justify-content: space-between;
  padding: 5px;
  display: flex;
  background-color: green;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 20px;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
}
</style>
