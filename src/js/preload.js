//playground
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

//home
import triangleImg from '../assets/1.Home開頭主頁/1-三角形.png'
import textImg from '../assets/1.Home開頭主頁/1-文字-創造你的南島之音.png'
import startImg from '../assets/1.Home開頭主頁/1-文字-點擊開始.png'
import bgImg from '../assets/1.Home開頭主頁/1-背景.png'

//instrument
import {instruments, instrumentsEn} from '../assets/instrument.js'
import borderImg from '../assets/3.選擇樂器區域/3-選擇音樂底-格線.png'
import notSelectedImg from '../assets/3.選擇樂器區域/3.未點選狀態按鍵-底.png'

//musicline
import dotImg from '../assets/4.製作音樂組合/3-空圓點.png'

import {ref, reactive, toRaw} from 'vue'
const getImageUrl = (name) => {
    return new URL(`../assets/${name}`, import.meta.url).href
}
let instrumentImg = []
for (let i=0; i<8; i++) {
    instrumentImg.push(getImageUrl(`3.選擇樂器區域/未觸發/${instrumentsEn[i]}-未觸發.png`))
    instrumentImg.push(getImageUrl(`3.選擇樂器區域/已觸發/${instrumentsEn[i]}-已觸發.png`))
    instrumentImg.push(getImageUrl(`4.製作音樂組合/3-${instrumentsEn[i]}-圓點-1.png`))
    instrumentImg.push(getImageUrl(`4.製作音樂組合/3-${instrumentsEn[i]}-圓點-2.png`))
    instrumentImg.push(getImageUrl(`4.製作音樂組合/3-${instrumentsEn[i]}-圓點-3.png`))
} 

export let preloadAll = (loaded) => {
    
    let count = 0;
    let imgs = [
        triangleImg, textImg, startImg, bgImg,
        infoImg, playImg, pauseImg, shareImg, leafImg, infoAllImgLu, infoAllImgLb, 
        infoAllImgRb, infoAllImgRu, homeImg, replayImg, emptyImg,
        ...instrumentImg,
    ];
    for (let i=0; i<imgs.length; i++) {
        let image = new Image();
        image.src = imgs[i];
        image.onload = () => {
            count ++;
            if (count == imgs.length) loaded();
        }
    }
}

export let preloadHome = (loaded = ()=>{}) => {
    
    let count = 0;
    let imgs = [
        triangleImg, textImg, startImg, bgImg,
    ];
    for (let i=0; i<imgs.length; i++) {
        let image = new Image();
        image.src = imgs[i];
        image.onload = () => {
            count ++;
            if (count == imgs.length) loaded();
        }
    }
}

export let preloadPlay = (loaded = ()=>{}) => {
    
    let count = 0;
    let imgs = [
        infoImg, playImg, pauseImg, shareImg, leafImg, infoAllImgLu, infoAllImgLb, 
        infoAllImgRb, infoAllImgRu, homeImg, replayImg, emptyImg,
        ...instrumentImg,
    ];
    for (let i=0; i<imgs.length; i++) {
        let image = new Image();
        image.src = imgs[i];
        image.onload = () => {
            count ++;
            if (count == imgs.length) loaded();
        }
    }
}