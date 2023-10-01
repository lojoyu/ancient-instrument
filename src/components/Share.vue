<script setup>
import { ref, reactive, onMounted, watch, toRaw } from 'vue'
import { useElementSize } from '@vueuse/core'
import bgImg from '../assets/2.Back Ground底圖/2-底圖all.png'
import selectInstrumentImg from '../assets/3.選擇樂器區域/3-選擇樂器底-全部.png'
import makeMusicImg from '../assets/4.製作音樂組合/4-製作音樂底.png'
import InstrumentTable from './InstrumentTable.vue'
import infoImg from '../assets/5.icon/5-問號.png'
import playImg from '../assets/5.icon/5-播放.png'
import pauseImg from '../assets/5.icon/5-暫停.png'
import shareImg from '../assets/5.icon/5-分享.png'
import leafImg from '../assets/2.Back Ground底圖/2-葉子.png'
import infoAllImgLu from '../assets/7-說明全部左上.png'
import infoAllImgLb from '../assets/7-說明全部左下.png'
import infoAllImgRu from '../assets/7-說明全部右上.png'
import infoAllImgRb from '../assets/7-說明全部右下.png'
import homeImg from '../assets/5.icon/5-回開始畫面.png'
import replayImg from '../assets/5.icon/5-再一次.png'
import emptyImg from '../assets/5.icon/5-空.png'

import MusicLine from './MusicLine.vue'
import PlayInstrumentAni from './PlayInstrumentAni.vue'
import p5 from 'p5'
import { script } from '../p5/background.js'
import {defineProps} from 'vue';
import * as Tone from 'tone'
import { instrumentsEn } from '../assets/instrument'
import sound from '../assets/Music/BoatLute_1.mp3'
import { useRoute, useRouter } from 'vue-router'
import ShareModal from './ShareModal.vue'
import FadeBackground from './FadeBackground.vue'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  getUrlQueryParams()

});

let getUrlQueryParams = async () => {    
  await router.isReady()
  Object.keys(route.query).forEach(function(k){
    selectedInstr[k] = parseInt(route.query[k]);
    instrArray[route.query[k]] = true;
    totalInstr++;
  });
};

const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['start', 'click', 'home'])

let showModal = ref(false);
let showInfo = ref(true);
let timeout;

const playbtn = ref(null)
const el  = ref(null)
const leftLeaf = ref(null)
const triangle = ref(null)
let instrArray = reactive([false, false, false, false, false, false, false, false])
let playing = ref(false)
let selectedInstr = reactive([-1, -1, -1, -1])
let selectable = ref(true)
const { width, height } = useElementSize(el)
let myp5 = null;
let totalInstr = 0;

const getMusicUrl = (name) => {
    return new URL(`../assets/Music/${name}`, import.meta.url).href
}
let players = reactive([])
let musicLoaded = 0;
//let players = [];
for (let i=0; i<instrumentsEn.length; i++) {
    players.push([]);
    for (let j=0; j<3; j++) {
        players[i].push(new Tone.Player({
            url: getMusicUrl(`${instrumentsEn[i]}_${j+1}.mp3`),
            onload: ()=>{
                musicLoaded++;
            },
            loop: true
        }).toDestination());
    }
}
let player = new Tone.Player(sound).toDestination();
const animationInstr = ref(-1);

watch(width, (w) => {
    if (myp5 != null) myp5.divWidth = w;
});
watch(height, (h) => {
    if (myp5 != null) myp5.divHeight = h;
});

onMounted(() => {
    myp5 = new p5(script, document.getElementById('p5-bg'));
    setTimeout(()=> {
        showInfo.value = false
    }, 7000);
})

let clickPlay = (event) => {
    if (musicLoaded < 24) return;
    let el = event.target;
    if (el.getAttribute('play') == 'true') {
        //pause
        el.setAttribute('play', false);
        el.src = playImg;
        playing.value = false;
        emit('click', 'pause');
    } else {
        //play
        el.setAttribute('play', true);
        el.src = pauseImg;
        playing.value = true;
        emit('click', 'play')
    }
}

let setInstrument = (id, selected) => {
    if (selected) {
        instrArray[id] = true;
        for (let i=0; i<selectedInstr.length; i++) {
            if (selectedInstr[i] == -1) {
                selectedInstr[i] = id;
                totalInstr++;
                break;
            }
        }
        if (totalInstr == 4) {
            selectable = false
        }
    } else {
        instrArray[id] = false;
        for (let i=0; i<selectedInstr.length; i++) {
            if (selectedInstr[i] == id) {
                selectedInstr[i] = -1;
                selectable = true;
                totalInstr--;
                break;
            }
        }
    }
    
}
let replay = (home=false) => {
    playing.value = false;
    playbtn.value.setAttribute('play', false);
    playbtn.value.src = playImg;

    for (let i=0; i<selectedInstr.length; i++) {
        selectedInstr[i] = -1;
        totalInstr = 0;
        selectable = true;
    }
    for (let i=0; i<instrArray.length; i++) {
        instrArray[i] = false;
    }
    if (home) {
        setTimeout(()=>{
            emit('home');
        }, 100)
        
    }
}

document.addEventListener('click', (e) => {
    Tone.start();
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        replay(true);
    }, 50000);
})
</script>

<template>
    <img class="bg pos-top-center" :src="bgImg" alt="background" id="background">
    <img class="bg pos-top-ceter" :src="leafImg">
    <img class="bg pos-bottom-left" :src="selectInstrumentImg" alt="select instrument" id="select-instrument-bg">
    <img class="bg pos-bottom-center" :src="makeMusicImg" alt="make music" id="make-music-bg">
    <div class="btn-left-up">
        <img class="button-up" :src="homeImg" alt="Info" @click="replay(true)"/>
    </div>
    <div class="btn-right-up">
        <img class="button-up" :src="replayImg" alt="Info" @click="replay()"/>
    </div>
    <div class="button-container">
        <img class="button" :src="infoImg" alt="Info" @click="showInfo=true"/>
        <img class="button" :src="playImg" alt="Play" @click="clickPlay($event)" play='false' ref="playbtn"/>
        <img class="button" :src="emptyImg" alt="Share" @click="showModal=true"/>
        <!-- <img class="button" :src="shareImg" alt="Share" @click="showModal=true"/> -->
    </div>
    <InstrumentTable @set-instrument="setInstrument" :instrArray="instrArray" :selectable="selectable"/>
    <div id="make-music-line">
        <MusicLine v-for="i in 4" :space="(i%2)?true:false" :instrument="selectedInstr[i-1]" :play="playing" :player="selectedInstr[i-1] == -1 ? undefined : players[selectedInstr[i-1]]"/>
    </div>
    <div id="animation">
        <PlayInstrumentAni v-for="(ani, aniIndex) in selectedInstr" :instrument="ani" :play="playing"/>
    </div>
    <ShareModal :show-modal="showModal" v-on:close-modal="showModal=false"></ShareModal>
    <FadeBackground :show="showInfo">
        <div>
            <div class="modal-overlay"></div>
            <img class="pos-left-center cover-left-up" :src="infoAllImgLu">
            <img class="pos-right-center cover-left-bottom" :src="infoAllImgLb">
            <img class="pos-left-center cover-right-up" :src="infoAllImgRu">
            <img class="pos-right-center cover-right-bottom" :src="infoAllImgRb" @click="showInfo=false">
        </div>
    </FadeBackground>
</template>

<style scoped>
.btn-left-up {
    position: absolute;
    top: 0;
    left: 0;
    width: 7%;
    padding: 1%;
    
}
.btn-right-up {
    position: absolute;
    top: 0;
    right: 0;
    width: 7%;
    padding: 1%;
    
}
.modal-overlay {
  content: '';
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  background: #FFFFFF;
  opacity: 0.3;
  cursor: pointer;
}
.cover-left-up {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999; 
    object-fit: contain;
}
.cover-left-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999; 
    object-fit: contain;
}
.cover-right-up {
    position: fixed;
    top: 0;
    right: 0;

    width: 100%;
    z-index: 999; 
    object-fit: contain;
}
.cover-right-bottom {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    z-index: 999; 
    object-fit: contain;
}
.cover-right {
    position: fixed;
    bottom: 0;
    right: 0;
    height: 100%;
    z-index: 999; 
    object-fit: contain;
}
.bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.pos-top-center {
    object-position: top center;
}

.pos-center-left {
    object-position: center left;
}
.pos-center-right {
    object-position: center right;
}
.pos-center-center {
    object-position: center center;
}
.pos-bottom-left {
    object-position: bottom left;
}
.pos-bottom-right {
    object-position: bottom right;
}
.pos-bottom-center {
    object-position: bottom center;
}
.button-container {
    position: absolute;
    right: 2%;
    bottom: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 5%;
}

.circle-button {
    margin: 0;
    border: none;
    background-color: rgba(0, 0, 0, 0);
  /* border-radius: 50%;
  background-color: #007bff;
  color: #fff;
  border: none;
  margin: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; */
}

/* .circle-button img {
  width: 10%;
  height: 10%;
} */

.button-up {
    width: 60%;
    height: auto;
    margin: 20%;
}

.button {
    width: 76%;
    height: auto;
    margin: 12%;
}

#make-music-line {
    position: absolute;
    width: 43%;
    height: 30%;
    top: 65%;
    left: 50%;
}
#animation {
    position: absolute;
    width: 60%;
    height: 35%;
    top: 20%;
    left: 20%;
}
</style>
