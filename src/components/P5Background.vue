<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import leftLeafImg from '../assets/1.Home開頭主頁/1-左上方葉子.png'
import rightLeafImg from '../assets/1.Home開頭主頁/1-右方葉子.png'
import bottomLeafImg from '../assets/1.Home開頭主頁/1-下方葉子.png'
import textureImg from '../assets/1.Home開頭主頁/1-紋理-壓在葉塗上.png'
import triangleImg from '../assets/1.Home開頭主頁/1-三角形.png'
import textImg from '../assets/1.Home開頭主頁/1-文字-創造你的南島之音.png'
import startImg from '../assets/1.Home開頭主頁/1-文字-點擊開始.png'

import p5 from 'p5'
import { script } from '../p5/background.js'
import {defineProps} from 'vue';

const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['start'])

const el  = ref(null)
const leftLeaf = ref(null)
const triangle = ref(null)
const { width, height } = useElementSize(el)
let myp5 = null;

watch(width, (w) => {
    if (myp5 != null) myp5.divWidth = w;
});
watch(height, (h) => {
    if (myp5 != null) myp5.divHeight = h;
});

onMounted(() => {
    myp5 = new p5(script, document.getElementById('p5-bg'));
})

let start = () => {
    leftLeaf.value.classList.add('leftrotate');
    triangle.value.classList.add('zoom');
    emit('start');
}

</script>

<template>
  <!-- <div id="p5-bg" ref="el"> -->
  <!-- </div> -->
    <img class="bg" :src="leftLeafImg" alt="left leaf" id="left-leaf" ref="leftLeaf">
    <img class="bg" :src="rightLeafImg" alt="right leaf" id="right-leaf">
    <img class="bg" :src="bottomLeafImg" alt="bottom leaf" id="bottom-leaf">
    <img class="bg" :src="textureImg" alt="texture" id="texture">
    <div class="centerobj">
        <div class="coverimg">
            <img :src="triangleImg" alt="triangle" id="triangle" ref="triangle">
            <img :src="textImg" alt="text" id="text">
        </div>

        <div id="button">
            <button class="pushable" @click="start">
                <span class="front">
                    <img :src="startImg" alt="start" id="start">
                </span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.coverimg {
    position: relative;
    width: 100%;
    height: 30vh;
}
#triangle, #text {
    position: absolute;
    top: 0;
    width: 100%;
    height: auto;
}
.zoom {
    -webkit-animation: zoom 1s linear;
    -moz-animation: zoom 1s linear;
    animation: zoom 1s linear;
    animation-fill-mode: forwards;
    -webkit-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
}

.centerobj { 
    /* position: relative; */
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
    width: 40%;
    margin: 0 auto;
    -ms-transform: translateY(50%);
    transform: translateY(50%);
    /* padding: 12%; */
}
.centerobj img {
    width: 100%;
}

#button {
    /* position: relative; */
    padding: 5% 30%;
    margin-top: 20px;
}
.bg {
    position:fixed; 
    bottom: 0;
    left:0;
    right: 0;
    min-width: 100%;
    height: 100vh;
    display: block;
    margin: 0 auto;
    z-index: -1;
    transition-property: bottom, left;
    transition-duration: 4s;
    /* transition-delay: 2s; */
}

.pushable {
    background: rgb(214, 188, 62);
    border-radius: 20px;
    border: none;
    padding: 0;
    cursor: pointer;
    outline-offset: 4px;
}
.front {
    display: block;
    padding: 10px 10px;
    border-radius: 20px;
    font-size: 1.25rem;
    background: rgb(241, 210, 72);
    color: white;
    transform: translateY(-5%);
}

.pushable:active .front {
    transform: translateY(-2px);
}

/* #left-leaf {
    bottom: 50% !important;
} */
.leftrotate {
    bottom: 0%;
    left: -10%;
    /* top: 50%;
    left: 50%;
    width: 100%;
    height: 100%; */
    /* transform-origin: 20% 20%;
    -webkit-animation: clockwise 1s linear;
    -moz-animation: clockwise 1s linear;
    animation: clockwise 1s linear; */
}
@-moz-keyframes zoom {
  0% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(5, 5);
  }
  
}
@keyframes zoom {
  0% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(5, 5);
  }
}

@-moz-keyframes clockwise {
    0% {
        -moz-transform: rotate(0deg);
    }
    100% {
        -moz-transform: rotate(40deg);
    }
}
@keyframes clockwise {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(40deg);
    }
}


.v-enter-active,
.v-leave-active,
.v-enter-active img,
.v-leave-active img {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
