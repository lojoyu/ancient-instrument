<script setup>
import {instruments, instrumentsEn} from '../assets/instrument.js'
import borderImg from '../assets/3.選擇樂器區域/3-選擇音樂底-格線.png'
import notSelectedImg from '../assets/3.選擇樂器區域/3.未點選狀態按鍵-底.png'

import {ref, reactive, toRaw} from 'vue'
const getImageUrl = (name) => {
    return new URL(`../assets/3.選擇樂器區域/${name}`, import.meta.url).href
}
const props = defineProps({
  selectable: Boolean,
  instrArray: Array,
})
const emit = defineEmits(['setInstrument'])

let instrumentImg = [[],[]]
for (let i=0; i<8; i++) {
    instrumentImg[i>=4?1:0].push({
        imageSrc: getImageUrl(`未觸發/${instrumentsEn[i]}-未觸發.png`),
        selectedImageSrc: getImageUrl(`已觸發/${instrumentsEn[i]}-已觸發.png`),
    })
} 
const tableData = reactive(instrumentImg);
const cells = ref([]);

let toggleImages = (rowIndex, cellIndex, event) => {
    //console.log(event.target);
    
    let el = event.target;
    if (el.getAttribute('selected') == 'true') {
        //cancel selection
        el.setAttribute('selected', false);
        el.src = tableData[rowIndex][cellIndex].imageSrc;
        emit('setInstrument', rowIndex*4+cellIndex, false);
    } else if (props.selectable) {
        //select
        el.setAttribute('selected', true);
        el.src = tableData[rowIndex][cellIndex].selectedImageSrc;
        emit('setInstrument', rowIndex*4+cellIndex, true);
    }
}

let setCells = (el) => {
    if (el) {
        cells.value.push(el)
    }
}

</script>

<template>
    <div class="table-wrapper">
      <table >
        <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
          <td v-for="(cell, colIndex) in row" :key="colIndex">
            <img :src="instrArray[rowIndex*4+colIndex]?cell.selectedImageSrc:cell.imageSrc" alt="Image" @click="toggleImages(rowIndex, colIndex, $event)" :selected="instrArray[rowIndex*4+colIndex]" />
          </td>
        </tr>
      </table>
    </div>
</template>
    
<style scoped>
.table-wrapper {
    position: absolute;
    bottom: 5%;
    left: 7%;
    background-image: url('../assets/3.選擇樂器區域/3-選擇音樂底-格線.png'); 
    background-size: contain;
    /* background-position: center; */
    background-repeat: no-repeat;
    background-position: 10px center;
    width: 30%;
    /* width: 100%;
    height: 100%; */
}

table {
    border-collapse: collapse;
}

td {
    border: none;
    padding: 0;
}

img {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 100%;
}
</style>
  