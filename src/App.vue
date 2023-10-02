<script setup>
import P5Background from './components/P5Background.vue';
import FadeBackground from './components/FadeBackground.vue';
import Playground from './components/Playground.vue';
import InstrumentTable from './components/InstrumentTable.vue';
import { ref, reactive } from 'vue';
import {preloadAll, preloadPlay, preloadHome} from './js/preload'
import {onMounted} from 'vue'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import Share from './components/Share.vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  getUrlQueryParams()

});

let getUrlQueryParams = async () => {    
  await router.isReady()
  Object.keys(route.query).forEach(function(k){
    console.log(k);
    if (k == 'share') {
      state.share = true;
      state.main = false;
    }
  });
};


let state = reactive({
  main: false,
  playground: false,
  loading: true,
  share: false,
})
let start = () => {
  state.main = false;
  state.loading = true;
  preloadPlay(()=>{
    state.loading = false;
    state.playground = true;
  });
}

function preloadImage(im_url) {
  let img = new Image();
  img.src = im_url;
}
let home = () => {
  state.playground = false;
  state.loading = true;
  preloadHome(()=>{
    state.loading = false;
    state.main = true;
  });
}
onMounted(()=>{
  preloadAll(()=>{
    console.log('all loaded!');
    state.loading = false;
    state.main = true;
  })
})
</script>

<template>
  <loading v-model:active="state.loading"
          :can-cancel="false"
          :is-full-page="true"
          loader="dots"
          color="#f1d248"/>
  <!-- <P5Background /> -->
  <!-- <button @click="state.main = !state.main">Toggle {{ state.main }}</button> -->
  <FadeBackground :show="state.main">
    <P5Background @start="start"/>
  </FadeBackground>
  <FadeBackground :show="state.playground">
    <Playground @home="home"/>
  </FadeBackground>
  <FadeBackground :show="state.share">
    <Share />
  </FadeBackground>
  <!-- <InstrumentTable /> -->
</template>

<style scoped>

.v-enter-active,
.v-leave-active,
.v-enter-active img,
.v-leave-active img
{
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-to {
  opacity: 1;
}
</style>
