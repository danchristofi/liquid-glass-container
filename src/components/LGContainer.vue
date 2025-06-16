<template>
  <div class="LGContainer" :style="containerStyles">

    <div :class="contentClass">
      <slot/>
    </div>

    <svg v-if="finalConfig.caAmount" class="LGFilter" :style="filterStyles" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter :id="`${id}-filter`" color-interpolation-filters="sRGB">
          <feImage x="0" y="0" width="100%" height="100%" result="map" :href="filter"/>
          <feDisplacementMap in2="map" in="SourceGraphic" result="lg"
                             yChannelSelector="B" xChannelSelector="R"
                             :scale="finalConfig.warpDirection"/>

          <feColorMatrix in="lg" values="1 0 0 0 0
														0 0 0 0 0
														0 0 0 0 0
														0 0 0 1 0"></feColorMatrix>
          <feOffset :dx="finalConfig.caAmount" result="cr"></feOffset>
          <feColorMatrix in="lg" values="0 0 0 0 0
														0 1 0 0 0
														0 0 0 0 0
														0 0 0 1 0"></feColorMatrix>
          <feOffset :dy="finalConfig.caAmount" result="cg"></feOffset>
          <feColorMatrix in="lg" values="0 0 0 0 0
														0 0 0 0 0
														0 0 1 0 0
														0 0 0 1 0" result="cb"></feColorMatrix>
          <feBlend in="cr" in2="cb" result="b1" mode="screen"></feBlend>
          <feBlend in="cg" in2="b1" mode="screen" result="ca"></feBlend>

          <feImage x="0" y="0" width="100%" height="100%" result="caMask" :href="caMask"/>

          <feComponentTransfer in="caMask" result="edge-mask">
            <feFuncA type="table" tableValues="1 0"/>
          </feComponentTransfer>

          <feComposite in="ca" in2="edge-mask" operator="in" result="masked-blur"/>

          <feMerge>
            <feMergeNode in="lg"/>
            <feMergeNode in="masked-blur"/>
          </feMerge>
        </filter>
      </defs>
    </svg>

    <svg v-else class="LGFilter" :style="filterStyles" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter :id="`${id}-filter`" color-interpolation-filters="sRGB">
          <feImage x="0" y="0" width="100%" height="100%" result="map" :href="filter"/>
          <feDisplacementMap in2="map" in="SourceGraphic" yChannelSelector="B" xChannelSelector="R" :scale="finalConfig.warpDirection"/>
        </filter>
      </defs>
    </svg>

    <img v-if="debug" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;" :src="filter" alt="">

  </div>

</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  contentClass: {
    type: String,
    default: ''
  },
  config: {
    type: Object,
    default: () => ({})
  },
  debug: {
    type: Boolean,
    default: false,
  }
})

const defaultConfig = {
  width: 300,
  height: 600,
  radius: 50,
  bevelWidth: 0.1,
  bevelBlur: 7,
  backgroundBlur: 3,
  warpAmount: 0.07,
  warpDistance: 50,
  warpDirection: -180,
  caAmount: 2,
}

const finalConfig = computed(() => ({
  ...defaultConfig,
  ...props.config
}))

const id = `lgc-${Math.random() * 100}`

const filter = computed(() => {

  const borderX = Math.min(finalConfig.value.width, finalConfig.value.height) * (finalConfig.value.bevelWidth * 0.5)
  const rad = finalConfig.value.radius - (finalConfig.value.bevelWidth * 50)

  let svg = `
<svg viewBox="0 0 ${finalConfig.value.width} ${finalConfig.value.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}-red" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#0000"/>
      <stop offset="100%" stop-color="red"/>
    </linearGradient>
    <linearGradient id="${id}-blue" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0000"/>
      <stop offset="100%" stop-color="blue"/>
    </linearGradient>
  </defs>

    <rect x="0" y="0" width="${finalConfig.value.width}" height="${finalConfig.value.height}" fill="black"></rect>

    <rect x="0" y="0" width="${finalConfig.value.width}" height="${finalConfig.value.height}" rx="${finalConfig.value.radius}" fill="url(#${id}-red)" />

    <rect x="0" y="0" width="${finalConfig.value.width}" height="${finalConfig.value.height}" rx="${finalConfig.value.radius}" fill="url(#${id}-blue)" style="mix-blend-mode: difference" />

    <!-- block  distortion -->
    <rect
      x="${borderX}"
      y="${Math.min(finalConfig.value.width, finalConfig.value.height) * (finalConfig.value.bevelWidth * 0.5)}"
      width="${finalConfig.value.width - borderX * 2}"
      height="${finalConfig.value.height - borderX * 2}"
      rx="${rad}"
      fill="hsl(0 0% ${finalConfig.value.warpDistance}% / ${1 - finalConfig.value.warpAmount}"
      style="filter:blur(${finalConfig.value.bevelBlur}px)" />
</svg>`

  const encoded = encodeURIComponent(svg)
  const dataUri = `data:image/svg+xml,${encoded}`

  return dataUri
})

const caMask = computed(() => {

  const borderX = Math.min(finalConfig.value.width, finalConfig.value.height) * (finalConfig.value.bevelWidth * 0.5)
  const rad = finalConfig.value.radius - (finalConfig.value.bevelWidth * 50)

  let svg = `
<svg viewBox="0 0 ${finalConfig.value.width} ${finalConfig.value.height}" xmlns="http://www.w3.org/2000/svg">

    <rect x="${borderX}"
      y="${Math.min(finalConfig.value.width, finalConfig.value.height) * (finalConfig.value.bevelWidth * 0.5)}"
      width="${finalConfig.value.width - borderX * 2}"
      height="${finalConfig.value.height - borderX * 2}"
      rx="${rad}"
       fill="black" style="filter:blur(${finalConfig.value.bevelBlur}px)"/>

</svg>`

  const encoded = encodeURIComponent(svg)
  const dataUri = `data:image/svg+xml,${encoded}`

  return dataUri
})

const containerStyles = computed(() => {
  return {
    width: `${finalConfig.value.width}px`,
    height: `${finalConfig.value.height}px`,
    borderRadius: `${finalConfig.value.radius}px`,
    backdropFilter: `url(#${id}-filter) blur(${finalConfig.value.backgroundBlur * 0.1}px)`,
    boxShadow: `inset 0 0 2px 1px rgba(255,255,255, 0.3), inset 0 0 10px 1px rgba(255,255,255, 0.3), 0 10px 20px rgba(0,0,0, 0.2)`,
    position: `relative`,
    overflow: `hidden`,
    display: `flex`,
  }
})

const filterStyles = computed(() => {
  return {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    touchAction: 'none',
    pointerEvents: 'none'
  }
})

</script>