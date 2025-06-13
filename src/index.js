import LGContainer from './components/LGContainer.vue'

// Install function for Vue.use()
function install(Vue) {
    Vue.component('LGContainer', LGContainer)
}

// Export component
export default LGContainer

// Export install function
export { install, LGContainer }

// Auto-install when vue is found (in browser via script tag)
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}