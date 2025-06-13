A Vue 3 component that gives a 'Liquid Glass' effect. Currently only works in Chrome and Edge.

Demo: https://liquid-glass-rho.vercel.app/

### Props

```js
contentClass: {
    type: String,
    default: ''
},

config: {
    type: Object,
    default: () => ({})
},
```

### Default Config

```js
const defaultConfig = {
    width: 300,
    height: 600,
    radius: 50,
    bevelWidth: 0.1, // 0 to 1
    bevelBlur: 7, // 0 to 50
    backgroundBlur: 3,
    warpAmount: 0.07, // 0 to 1
    warpDistance: 50, // 0 to 100
    warpDirection: -180, // -180 to 180
}
```

### Example

```js
import {LGContainer} from "liquid-glass-container";

const config = ref({
    width: 300,
    height: 300,
    radius: 40,
    // ...other values you want to customise
})
```

```vue

<LGContainer :config="config">
  Your content
</LGContainer>
```

### Animation

Due to how this works, some properties are not possible to animate with CSS. 
Therefore, it is recommended to use an animation library to animate the values.

For example using GSAP:

```js
const onHover = () => {
    gsap.to(config.value, {
        bevelBlur: 18,
        bevelWidth: 0.05,
        warpAmount: 0.1,
        duration: 0.4,
        ease: "power1.inOut",
    });
}

const onUnhover = () => {
    gsap.to(config.value, {
        bevelBlur: 15,
        bevelWidth: 0.1,
        warpAmount: 0.07,
        duration: 0.4,
        ease: "power1.inOut",
    });
}
```