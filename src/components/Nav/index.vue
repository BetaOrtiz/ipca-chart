<template>
  <div class="column">
    <router-link to="/">
      <button
        :class="
          route === '/chart'
            ? 'main-buttons'
            : 'main-buttons disabled after'
        "
        :disabled="route === '/'"
      >
        <span> TABELA HISTÓRICA </span>
      </button></router-link
    >
    <router-link to="/chart">
      <button
        :class="
          route === '/' ? 'main-buttons' : 'main-buttons disabled'
        "
        :disabled="route === '/chart'"
      >
        <span> ANÁLISE POR GRUPOS </span>
      </button>
    </router-link>
  </div>
</template>

<script>
import './styles.css';
import '../../styles/global.css';
export default {
  props: ['route'],
  created() {
    console.log(this.route);
  },
};
</script>

<style></style>
