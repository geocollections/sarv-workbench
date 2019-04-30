<template>
  <tbody>
  <!-- TODO: Add tooltip which follows mouse, example: http://jsfiddle.net/h2dL07ns/324/ -->
  <tr v-for="(value, key) in data">
    <td style="padding:0.3rem; margin: 0;" v-for="entity in value">
      <div :style="'height: ' + controls.height + 'rem; width: ' + controls.width + 'rem; font-size: ' + controls.size + 'px; overflow: auto; word-break: break-word;'">{{ entity }}</div>
<!--      <div :style="'font-size: ' + controls.size + 'px; overflow: auto;'">{{ entity }}</div>-->
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
  .table-cell {

  }

</style>
