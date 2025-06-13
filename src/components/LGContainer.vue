<template>
  <div class="LGContainer" :style="containerStyles">
    <slot/>

    <svg class="LGFilter" :style="filterStyles" xmlns="http://www.w3.org/2000/svg">
      <defs style="touch-action: none;">
        <filter :id="`${id}-filter`" color-interpolation-filters="sRGB" style="touch-action: none;">
          <!-- the input displacement image -->
          <feImage :x="imageSize.x" :y="imageSize.y" :width="imageSize.w" :height="imageSize.h" result="map"
                   :href="filter"
                   style="touch-action: none;"/>
          <!-- the displacement map to use -->
          <feDisplacementMap in2="map" in="SourceGraphic" yChannelSelector="B" xChannelSelector="R" scale="-180"/>
        </filter>
      </defs>
    </svg>

  </div>

</template>

<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  id: {
    type: String,
    default: 'gc1',
  },
  width: {
    type: Number,
    default: 300,
  },
  height: {
    type: Number,
    default: 600,
  },
  border: {
    type: Number,
    default: 0.1,
  },
  radius: {
    type: Number,
    default: 50,
  },
  alpha: {
    type: Number,
    default: 0.93,
  },
  lightness: {
    type: Number,
    default: 50,
  },
  inputBlur: {
    type: Number,
    default: 20,
  },
  outputBlur: {
    type: Number,
    default: 7,
  },
})

const hoverScale = ref(1)

const imageSize = computed(() => {
  return {
    w: `${100 * hoverScale.value}%`,
    h: `${100 * hoverScale.value}%`,
    x: `${(100 - (100 * hoverScale.value))/ 2}%`,
    y: `${(100 - (100 * hoverScale.value))/ 2}%`,
  }
})

const filter = computed(() => {

  const borderX = Math.min(props.width, props.height) * (props.border * 0.5)

  let svg = `
<svg class="displacement-image" viewBox="0 0 ${props.width} ${props.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${props.id}-red" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#0000"/>
      <stop offset="100%" stop-color="red"/>
    </linearGradient>
    <linearGradient id="${props.id}-blue" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0000"/>
      <stop offset="100%" stop-color="blue"/>
    </linearGradient>
  </defs>

    <!-- backdrop -->
    <rect x="0" y="0" width="${props.width}" height="${props.height}" fill="black"></rect>

    <!-- red linear -->
    <rect x="0" y="0" width="${props.width}" height="${props.height}" rx="${props.radius}" fill="url(#${props.id}-red)" />

     <!-- blue linear -->
    <rect x="0" y="0" width="${props.width}" height="${props.height}" rx="${props.radius}" fill="url(#${props.id}-blue)" style="mix-blend-mode: difference" />

    <!-- block out distortion -->
    <rect
      x="${borderX}"
      y="${Math.min(props.width, props.height) * (props.border * 0.5)}"
      width="${props.width - borderX * 2}"
      height="${props.height - borderX * 2}"
      rx="${props.radius}"
      fill="hsl(0 0% ${props.lightness}% / ${props.alpha}"
      style="filter:blur(${props.inputBlur}px)" />
</svg>`

  const encoded = encodeURIComponent(svg)
  const dataUri = `data:image/svg+xml,${encoded}`

  return dataUri
})

const containerStyles = computed(() => {
  return {
    width: `${props.width}px`,
    height: `${props.height}px`,
    borderRadius: `${props.radius}px`,
    backdropFilter: `url(#${props.id}-filter) blur(${props.outputBlur * 0.1}px)`,
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
    touchAction: 'none'
  }
})

</script>