<script setup>
import lottie from 'lottie-web'
import {onMounted, ref, watch} from 'vue'
import BoatLuteData from "../assets/人物演奏樂器/BoatLute船琴.json";
import CalungData from "../assets/人物演奏樂器/Calung卡隆竹琴.json";
import KetebungData from "../assets/人物演奏樂器/CharacterLoop皮面鼓.json";
import CharoniaTritonisData from "../assets/人物演奏樂器/CharoniaTritonis法螺號角.json";
import EngkromongData from "../assets/人物演奏樂器/Engkromong排鑼.json";
import IpuHekeData from "../assets/人物演奏樂器/IpuHeke葫蘆鼓.json";
import JewsHarpsData from "../assets/人物演奏樂器/JewsHarps口簧琴.json";
import PanFlutesData from "../assets/人物演奏樂器/PanFlutes排笛.json";

import { instruments } from '../assets/instrument';

const aniDiv = ref(null)
const getImageUrl = (name) => {
    return new URL(`../assets/人物演奏樂器/${name}`, import.meta.url).href
}
const animationData = [
    BoatLuteData,
    CalungData,
    CharoniaTritonisData,
    EngkromongData,
    IpuHekeData,
    JewsHarpsData,
    KetebungData,
    PanFlutesData,
]
let animation;
const props = defineProps({
    instrument: Number,
    play: Boolean,
    empty: Boolean,
})

watch(()=>props.play, (p) => {
    if (animation == undefined) return;
    if (p) {
        animation.play();
    } else {
        animation.pause();
    }
})

watch(()=>props.instrument, (i, oldi) => {
    if (oldi != -1 && animation != undefined) {
        animation.destroy();
        animation = undefined;
    }
    if (i != -1) {
        animation = lottie.loadAnimation({
            name: instruments[i],
            container: aniDiv.value,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            animationData: animationData[i]
        });
        if (props.play) animation.play();
    }
    
})


</script>
<template>
    <!-- <div v-if="props.instrument!=-1" :class="props.empty?'animation':'animationcenter'" ref="aniDiv"></div> -->
    <div :class="props.empty?'animation':props.instrument==-1?'':'animationcenter'" ref="aniDiv"></div>
    <div v-if="props.instrument==-1&&props.empty" class="empty" ></div>
</template>
<style scoped>
.animation {
    float: left;
    width: 25%;
}
.animationcenter {
    width: 22%;
}
.empty {
    float: left;
    width: 25%;
    height: 1px;
}
</style>