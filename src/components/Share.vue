<script setup>
import { ref, reactive, onMounted, watch, toRaw } from 'vue'
import { useElementSize } from '@vueuse/core'

import bgImg from '../assets/分享頁面背景.png'
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
let players = reactive([])

for (let i=0; i<instrumentsEn.length; i++) {
    players.push([undefined, undefined, undefined]);
}

let getUrlQueryParams = async () => {    
  await router.isReady()
  Object.keys(route.query).forEach(function(k){
    if (k != 'share') {
        let n = parseInt(route.query[k]);
        let t = n%10;
        tempo[k] = t;
        selectedInstr[k] = (n - t)/10;
        instrArray[route.query[k]] = true;
        totalInstr++;
        players[selectedInstr[k]][tempo[k]] = new Tone.Player({
            url: getMusicUrl(`${instrumentsEn[selectedInstr[k]]}_${tempo[k]+1}.mp3`),
            onload: ()=>{
                musicLoaded++;
            },
            loop: true
        }).toDestination();
        
    }
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
let tempo = reactive([0, 0, 0, 0])
let selectable = ref(true)
const { width, height } = useElementSize(el)
let myp5 = null;
let totalInstr = 0;

const getMusicUrl = (name) => {
    return new URL(`../assets/Music/${name}`, import.meta.url).href
}
let musicLoaded = 0;
//let players = [];



let player = new Tone.Player(sound).toDestination();
const animationInstr = ref(-1);

watch(width, (w) => {
    if (myp5 != null) myp5.divWidth = w;
});
watch(height, (h) => {
    if (myp5 != null) myp5.divHeight = h;
});

onMounted(() => {
    //myp5 = new p5(script, document.getElementById('p5-bg'));
    setTimeout(()=> {
        showInfo.value = false
    }, 7000);
})

let clickPlay = (event) => {
    if (musicLoaded < totalInstr) return;
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

    if (home) {
        setTimeout(()=>{
            emit('home');
        }, 0)
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
    <img class="bg pos-top-center" :src="bgImg" id="background">
    <img class="bg pos-top-ceter" :src="leafImg">
    <div id="animation" class="center">
        <PlayInstrumentAni v-for="(ani, aniIndex) in selectedInstr" :instrument="ani" :play="playing" :empty="false"/>
    </div>
    <div class="button-container center">
        <img class="button" :src="playImg" @click="clickPlay($event)" play='false' ref="playbtn"/>
        <img class="button" :src="homeImg" alt="Info" @click="replay(true)"/>
    </div>
    <div id="make-music-line">
        <MusicLine v-for="i in 4" :space="(i%2)?true:false" :instrument="selectedInstr[i-1]" :play="playing" :player="selectedInstr[i-1] == -1 ? undefined : players[selectedInstr[i-1]]" :tempo="tempo[i-1]"/>
    </div>
</template>

<style scoped>

#make-music-line {
    position:absolute;
    z-index: -1000;
}
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
    width: 5%;
    bottom: 10%;
    left: 50%;
    -ms-transform: translate(-50%, 0%);
    transform: translate(-50%, 0%);
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
    /* display: inline-block; */
    /* position: absolute; */
    width: 90%;
    position: absolute;
    top: 40%;
    left: 50%;
    -ms-transform: translate(-50%, -40%);
    transform: translate(-50%, -40%);
    /* height: 60%; */
    /* height: 60%;
    top: 20%; */
    /* left: 5%; */
}
.center {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>
