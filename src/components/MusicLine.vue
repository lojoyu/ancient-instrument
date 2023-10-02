<script setup>
import { ref, onMounted, watch, toRaw } from 'vue'
import { get, useElementSize } from '@vueuse/core'

import p5 from 'p5'
import { script } from '../p5/musicline.js'
import notSelectedImg from '../assets/3.選擇樂器區域/3.未點選狀態按鍵-底.png'
import dotImg from '../assets/4.製作音樂組合/3-空圓點.png'
import {defineProps} from 'vue';
import { instruments, instrumentsEn } from '../assets/instrument'
import * as Tone from 'tone'


const props = defineProps({
  id: Number,
  instrument: Number,
  tempo: Number,
  space: Boolean,
  play: Boolean,
  player: Array
})
const emit = defineEmits(['tempoChange'])

const el  = ref(null)
const imgPlace  = ref(null)
const tempoPlace = ref(null)
let nowTempo = 0;

const { width, height } = useElementSize(el)
let myp5 = null;
let startTime = 0;

const getImageUrl = (name) => {
    return new URL(`../assets/${name}`, import.meta.url).href
}

let instrumentImg = []
for (let i=0; i<8; i++) {
    instrumentImg.push({
        imageSrc: getImageUrl(`3.選擇樂器區域/已觸發/${instrumentsEn[i]}-已觸發.png`),
        dotSrc: [
          getImageUrl(`4.製作音樂組合/3-${instrumentsEn[i]}-圓點-1.png`),
          getImageUrl(`4.製作音樂組合/3-${instrumentsEn[i]}-圓點-2.png`),
          getImageUrl(`4.製作音樂組合/3-${instrumentsEn[i]}-圓點-3.png`)]
    })
}

watch(width, (w) => {
    if (myp5 != null) {
      myp5.divWidth = w;
      myp5.windowResized();
    }
});
watch(height, (h) => {
    if (myp5 != null) {
      myp5.divHeight = h;
      myp5.windowResized();
    }
});
watch(()=>props.play, (p) => {
    if (myp5 != null) myp5.playing = p;
    if (p) startTime = Date.now();
    if (props.player == undefined) return;
    if (p) toRaw(props.player)[props.tempo].start();
    else toRaw(props.player)[props.tempo].stop();
});
watch(()=>props.player, (player, oldPlayer) => {
    if (player == undefined && props.play) toRaw(oldPlayer)[props.tempo].stop();
    if (props.play) toRaw(player)[props.tempo].start(0, (Date.now() - startTime)/1000);
    if (oldPlayer != undefined && !props.play) toRaw(oldPlayer)[props.tempo].stop();
   // else toRaw(player)[nowTempo].stop();

    // if (p) startTime = Date.now();
    // if (props.player == undefined) return;
    // if (p) toRaw(props.player)[nowTempo].start();
    // else toRaw(props.player)[nowTempo].stop();
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
  if (props.instrument < 0) return;
  if (props.play) {
    toRaw(props.player)[props.tempo].stop();
    toRaw(props.player)[(props.tempo + 1) % 3].start(+0, (Date.now() - startTime)/1000);
  }
  tempoPlace.value.src = instrumentImg[props.instrument].dotSrc[props.tempo];
  emit('tempoChange', props.id, (props.tempo + 1)%3);
}

</script>

<template>
  <div :class="space ? 'space music-wrapper' : 'music-wrapper'" >
    <!-- <div v-if="space==true" class="p5-musicline space" ref="el"></div> -->
    <!-- <div v-else class="p5-musicline" ref="el"></div> -->
    <div class="p5-musicline" ref="el"></div>
    <!-- <img class="dot" :src="instrument < 0 ? instrumentImg[0].dotSrc[nowTempo+1] :  instrumentImg[instrument].dotSrc[nowTempo]" ref="tempoPlace"> -->
    <!-- <div class="up-image"> -->
    <!-- <img :class="space?instr-space:instr" :src="instrument < 0 ? notSelectedImg : instrumentImg[instrument].imageSrc" @click="changeTempo()" ref="imgPlace"> -->
    <img class="instr" :src="instrument < 0 ? notSelectedImg : instrumentImg[instrument].imageSrc" @click="changeTempo()" ref="imgPlace">
    <img class="dot" :src="instrument < 0 ? dotImg :  instrumentImg[instrument].dotSrc[props.tempo]" ref="tempoPlace">
      
    <!-- </div> -->
  </div>
</template>

<style scoped>
/* #p5-musicline {
  position: relative;
  width: 40%;
  height: 20%;
  z-index: 1;
} */
.p5-musicline {
  display: block;
  /* margin: 0 auto;
  padding: 0; */
  width: 85%;
  height: 80%;
  /* overflow: hidden; */
  /* float:left; */
  /* margin-left: 2%; */
  margin-top: 1%;
}
img.instr {
  float:left;
  margin-left: -85%;
  display: block;
  /* width: auto; */
  height: 100%;
}
img.instr-space {
  float:left;
  margin-left: -72%;
  display: block;
  /* width: auto; */
  height: 100%;
}
img.dot {
  width: 80%;
  height: 100%;
  object-fit: contain;
  /* width: 100%;
  max-height: 100%; */
  /* height: 90%; */
  /* display: block; */
  /* float:left; */
  /* margin-left: -90%; */
}
.space {
  margin-left: 5%;
}
.music-wrapper {
  display: flex;
  height: 30%;
  width: 100%;
  margin-bottom: -3%;
}
.up-image {
  /* float: left;
  width: 100%;
  height: 100%; */
}
</style>
