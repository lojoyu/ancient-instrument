<script setup>
import { defineProps, Transition, ref } from 'vue';
import logo from '../assets/6-分享/6-十三行logo.png';
import text from '../assets/6-分享/6-分享你的南島音樂.png';

const emit = defineEmits(['closeModal'])
const props = defineProps({
  showModal: Boolean
})

</script>
<template>
<Transition name="fade" appear>
    <div class="modal-overlay" 
         v-if="props.showModal" 
         @click="emit('closeModal')"></div>
  </Transition>
  <Transition name="pop" appear>
    <div class="modal" 
         role="dialog" 
         v-if="props.showModal"
         >
        <img class="logo" :src="logo" alt="logo" />
        <img class="sharetext" :src="text" alt="logo" />

      <!-- <button @click="emit('closeModal')" class="button">Hide Modal</button> -->

    </div>
</Transition>

</template>
<style scoped>
.logo {
    width: 30%;
}
.sharetext {
    width: 50%;
}
.button {
  border: none;
  color: #FFF;
  /* background: rgb(240, 201, 70); */
  appearance: none;
  font: inherit;
  font-size: 1.8rem;
  padding: .5em 1em;
  border-radius: .3em;
  cursor: pointer;
}

.modal {
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  text-align: center;
  width: fit-content;
  height: fit-content;
  max-width: 22em;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
  background: rgb(240, 201, 70);
  z-index: 999;
  transform: none;
}
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
</style>