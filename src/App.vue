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
import rotateImg from './assets/手機轉橫式.png'

const router = useRouter()
const route = useRoute()
let exhibition = ref(false);

let getUrlQueryParams = async () => {    
  await router.isReady()
  Object.keys(route.query).forEach(function(k){
    if (k == 'share' && route.query[k]=='true') {
      state.loading = false;
      state.share = true;
      return true;
    }
    if (k == 'exhibition') {
      exhibition.value = true;
      return;
    }
  });
  state.loading = false;
  state.main = !state.share;
};

let toRotate = ref(false);
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

let home = () => {
  state.playground = false;
  state.loading = true;
  preloadHome(()=>{
    state.loading = false;
    state.main = true;
  });
}

let shareToHome = () => {
  router.replace({ query: {} })
  state.share = false;
  state.loading = true;
  preloadHome(()=>{
    state.loading = false;
    state.main = true;
  });
}

const portrait = window.matchMedia("(orientation: portrait)").matches;
onMounted(()=>{
  preloadAll(()=>{
    getUrlQueryParams()
  })
  if (portrait) {
    toRotate.value = true;
  }
})

window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
    const portrait = e.matches;
    if (portrait) {
        toRotate.value = true;
    } else {
        toRotate.value = false;
    }
});

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
    <Playground @home="home" :exhibition="exhibition"/>
  </FadeBackground>
  <FadeBackground :show="state.share">
    <Share @home="shareToHome"/>
  </FadeBackground>
  <FadeBackground :show="toRotate">
    <div class="overlay" 
         @click="emit('closeModal')"></div>
    <img :src="rotateImg" class="rotate">
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

.rotate {
  width: 80%;
  height: auto;
  z-index: 1001;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);

}
.overlay {
  content: '';
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: #FFFFFF;
  opacity: 0.6;
  cursor: pointer;
}
</style>
