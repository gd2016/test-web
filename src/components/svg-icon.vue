<template>
  <svg
    aria-hidden="true"
    @click="!disabled && emit('click', $event)"
    :class="[
      {
        hover: hover,
        disabled: disabled,
        withcolor: withcolor
      },
      'ezoo-icon',
      `ezoo-icon-${name}`
    ]"
  >
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
const emit = defineEmits({
  click: (evt: MouseEvent) => evt instanceof MouseEvent
})
const props = withDefaults(
  defineProps<{
    prefix?: string
    name: string
    withcolor?: boolean
    color?: string
    hover?: boolean
    disabled?: boolean
  }>(),
  {
    prefix: 'icon',
    withcolor: true,
    color: 'var(--el-text-color-primary)',
    hover: true,
    disabled: false
  }
)

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<style lang="less" scoped>
svg {
  &.withcolor {
    color: v-bind(color);
  }
  object-fit: cover;
  width: 16px;
  height: 16px;
  outline: none;
  &.hover {
    &:hover {
      cursor: pointer;
      color: var(--el-color-primary);
    }
  }

  &.disabled {
    color: var(--el-text-color-disabled);
  }
}
.ezoo-icon-success,
.ezoo-icon-error,
.ezoo-icon-info,
.ezoo-icon-warning {
  color: #fff;
  &.hover {
    &:hover {
      color: #fff;
    }
  }
}
</style>

<!-- <style lang="scss">
#icon-menu-3 {
  .outline {
    color: #000000;
  }
}
</style> -->
