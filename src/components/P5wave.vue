<script setup>
import { ref, onMounted, watch } from 'vue'
import { useElementSize } from '@vueuse/core'

import p5 from 'p5'
import { script } from '../p5/musicline.js'

const el  = ref(null)
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

</script>

<template>
    <div id="p5-bg" ref="el">
    </div>
</template>

<style scoped>
#p5-bg {
    position: relative;
    width: 100%;
}
</style>
