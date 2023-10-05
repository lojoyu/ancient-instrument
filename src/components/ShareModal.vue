<script setup>
import { defineProps, Transition, ref, reactive, watch, onMounted } from 'vue';
import logo from '../assets/6-分享/6-十三行logo.png';
import textImg from '../assets/6-分享/6-分享你的南島音樂.png';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import { useElementSize, useClipboard } from '@vueuse/core'
import copyImg from '../assets/6-分享/文字-點選複製分享網址.png';
import copiedImg from '../assets/6-分享/文字-已複製.png';



const emit = defineEmits(['closeModal'])
const props = defineProps({
  showModal: Boolean,
  url: String,
  showCopy: Boolean
})

const el  = ref(null)
const opt = reactive({color: {light: '#f0c946'}})
const { width, height } = useElementSize(el)
const source = ref('');
const othercopied = ref(false);
const { text, copy, copied, isSupported } = useClipboard({ source })

watch(height, (h) => {
  opt.width = h;
});

watch(()=>props.url, (url)=>{
  source.value = url;
})


</script>
<template>
<Transition name="fade" appear>
    <div class="modal-overlay" 
         v-if="props.showModal" 
         @click="emit('closeModal')"></div>
  </Transition>
  <Transition name="pop" appear>
    <div cloass="modal-outside">
      <div class="modal" 
          role="dialog" 
          v-if="props.showModal"
          >
          <img class="sharetext" :src="textImg" alt="logo" />
          <div v-if="isSupported&&props.showCopy" class="copy-box">
            <button class="pushable" @click="copy(source)">
                <span v-if='!copied' class="front">
                    <img :src="copyImg">
                </span>
                <span v-else class="pushfront">
                    <img :src="copiedImg">
                </span>
            </button>
          </div>
          <figure class="qrcode" ref="el">
            <vue-qrcode :value="url"
                        :options="opt">
            </vue-qrcode><br>
          </figure>
          
          <img class="logo" :src="logo" alt="logo" /><br>


        <!-- <button @click="emit('closeModal')" class="button">Hide Modal</button> -->

      </div>
    </div>
</Transition>

</template>
<style scoped>

.logo {
  margin: 0.5% 0 1.5% 0;
  height: 10%;
}

.copy-box {
  /* margin-bottom: 1%; */
  /* height: 6%; */
}
.qrcode {
  width: 80%;
  margin: 0 10%;
  height: 60%;
  /* height: 70%; */
}
.sharetext {
  margin: 2% 0;
  height: 6%;
}
/* .button {
  border: none;
  color: #FFF;
  appearance: none;
  font: inherit;
  font-size: 1.8rem;
  padding: .5em 1em;
  border-radius: .3em;
  cursor: pointer;
} */

.modal {
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  text-align: center;
  width: 70%;
  height: 70%;
  /* max-height: 80%; */
  /* height: fit-content; */
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
  background: rgb(240, 201, 70);
  z-index: 999;
  transform: none;
}
/* 
.modal-outside {
  position: absolute;
  width: 100%;
  height: 100%;
} */
.modal h1 {
  margin: 0 0 1rem;
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
  opacity: 0.6;
  cursor: pointer;
}

/* ---------------------------------- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .4s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(1) translateY(100%);
}


.pushable {
    background: rgb(139,35,39);
    border-radius: 10px;
    border: none;
    padding: 0;
    cursor: pointer;
    outline-offset: 4px;
    width: 25%;

}
.front {
    display: block;
    padding: 2%;
    border-radius: 10px;
    font-size: 1.25rem;
    background: rgb(165,53,52);
    color: white;
    transform: translateY(-10%);
}

.front img, .pushfront img{
  width: 80%;
}

.pushable:active .front, .pushable:active .pushfront {
    transform: translateY(-3%);
}

.pushfront {
  display: block;
  padding: 2%;
  border-radius: 10px;
  font-size: 1.25rem;
  background: rgb(165,53,52);
  color: white;
  transform: translateY(-3%);
}

</style>