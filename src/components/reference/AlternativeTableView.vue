<template>
  <tbody>
  <tr v-for="(value, key) in data">
    <td style="padding:0.3rem; margin: 0;" v-for="entity in value">
      <div :style="'height: ' + controls.height + 'rem; width: ' + controls.width + 'rem; font-size: ' + controls.size + 'px; overflow: auto;'">{{ entity }}</div>
    </td>
  </tr>
  </tbody>
</template>

<script>
  export default {
    props: {
      module: {
        type: String,
        default: 'reference'
      },
      data: {
        type: Array,
      },
      controls: {
        type: Object,
      },
    },
    name: "AlternativeTableView"
  }
</script>

<style scoped>

</style>
