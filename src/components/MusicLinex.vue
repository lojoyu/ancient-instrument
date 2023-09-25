<script setup>
import { ref, onMounted, watch } from 'vue'
import { get, useElementSize } from '@vueuse/core'

import p5 from 'p5'
import { script } from '../p5/musicline.js'
import notSelectedImg from '../assets/3.選擇樂器區域/3.未點選狀態按鍵-底.png'
//import dotImg from '../assets/4.製作音樂組合/3-空圓點.png'
import dotImg from '../assets/4.製作音樂組合/3-BoatLute-圓點-1.png'

import {defineProps} from 'vue';
import { instruments, instrumentsEn } from '../assets/instrument'

const props = defineProps({
  instrument: Number,
  tempo: Number,
  space: Boolean
})

const el  = ref(null)
const imgPlace  = ref(null)
const tempoPlace = ref(null)
let nowTempo = 0;

const { width, height } = useElementSize(el)
let myp5 = null;

const getImageUrl = (name) => {
    return new URL(`../assets/${name}`, import.meta.url).href
}

let instrumentImg = []
for (let i=0; i<8; i++) {
    instrumentImg.push({
        imageSrc: getImageUrl(`3.選擇樂器區域/3-${instruments[i]}-觸發.png`),
        dotSrc: [
          getImageUrl(`4.製作音樂組合/3-${instrumentsEn[i]}-圓點-1.png`),
          getImageUrl(`4.製作音樂組合/3-${instrumentsEn[i]}-圓點-2.png`),
          getImageUrl(`4.製作音樂組合/3-${instrumentsEn[i]}-圓點-3.png`)]
    })
}

watch(width, (w) => {
    if (myp5 != null) myp5.divWidth = w;
});
watch(height, (h) => {
    if (myp5 != null) myp5.divHeight = h;
    console.log(h, myp5.divHeight);

});

onMounted(() => {
    myp5 = new p5(script, el.value);
    if (myp5.divWidth == undefined) myp5.divWidth = width;
    if (myp5.divHeight == undefined) myp5.divHeight = height;
    myp5.seed = Math.random()*100;
    myp5.playing = false;
    myp5.windowResized();
})

let changeTempo = () => {
  nowTempo = (nowTempo + 1) % 3;
  tempoPlace.value.src = instrumentImg[props.instrument].dotSrc[nowTempo];
}

</script>

<template>
  <div class="image-canvas-container">
    <!-- <div class="image-container">
      <div class="image">
        <img class="instr" :src="instrument < 0 ? notSelectedImg : instrumentImg[instrument].imageSrc" @click="changeTempo()" ref="imgPlace">
      </div>
      <div class="image">
        <img class="dot" :src="dotImg" ref="tempoPlace">
      </div>
    </div> -->
    <div v-if="space==true" class="p5-musicline space" ref="el"></div>
    <div v-else class="p5-musicline" ref="el"></div>
  </div>
</template>

<style scoped>
.image-canvas-container {
  display: flex;
  flex-direction: column;
}

.image-container {
  display: flex;
  justify-content: space-between;
}

.image {
  flex: 1;
  position: relative;
  z-index: 1; /* 图像的z-index设置为1，Canvas默认为0，以确保Canvas在图像下方 */
}

img {
  max-width: 100%;
  height: auto;
}

.p5-musicline {
  flex: 1;
  z-index: 0; /* Canvas的z-index设置为0，确保在图像下方 */
}
</style>
