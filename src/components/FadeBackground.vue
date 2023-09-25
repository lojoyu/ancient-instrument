<script setup>
import {defineProps} from 'vue';

const props = defineProps({
  show: Boolean
})

</script>

<template>
    <Transition appear>
        <div v-if="props.show">
            <slot></slot>
        </div>
    </Transition>
</template>

<style scoped>
</style>
