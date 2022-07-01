<template>
  <div :class="['iconfont',id]" :style="{fontSize:`${size}px`,color:`${color}`}"></div>
</template>

<script>
export default {
  name: "MyIcon",
  props: {
    id: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    size: {
      type: [Number, String],
      default: 20
    },
  }
}
</script>

<style scoped>

</style>
