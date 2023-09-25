<script setup>
import P5Background from './components/P5Background.vue';
import FadeBackground from './components/FadeBackground.vue';
import Playground from './components/Playground.vue';
import InstrumentTable from './components/InstrumentTable.vue';
import { ref, reactive } from 'vue';

let state = reactive({
  main: false,
  playground: true,
  share: false,
  info: false,
  ins: false
})
let start = () => {
  console.log('start in app.vue')
  state.main = false;
  state.playground = true;
}

function preloadImage(im_url) {
  let img = new Image();
  img.src = im_url;
}

</script>

<template>
  <!-- <P5Background /> -->
  <button @click="state.main = !state.main">Toggle {{ state.main }}</button>
  <FadeBackground :show="state.main">
    <P5Background @start="start"/>
  </FadeBackground>
  <FadeBackground :show="state.playground">
    <Playground />
  </FadeBackground>
  <!-- <InstrumentTable /> -->
</template>

<style scoped>

.v-enter-active,
.v-leave-active,
.v-enter-active img,
.v-leave-active img {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
