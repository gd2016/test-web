import { ComponentCustomProperties } from 'vue'

import type { Graph } from '@antv/g6'
import SvgIcon from '@/components/svg-icon.vue'
import useStore from '@/store'

declare module '@vue/runtime-core' {
  // declare your own store states
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: ReturnType<typeof useStore>
    window: Window
  }
  interface GlobalComponents {
    SvgIcon: typeof SvgIcon
  }
}
