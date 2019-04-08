<template>
  <div class="col p-0">

     <span class="custom-control custom-switch">
        <input type="checkbox" class="custom-control-input" id="customSwitch" v-model="showCollapseMap">
        <label class="custom-control-label" for="customSwitch">{{ $t(showCollapseMap ? 'add.buttons.mapEnabled' : 'add.buttons.mapDisabled')}}</label>
      </span>
    <b-collapse v-model="showCollapseMap" id="collapseMap">
      <map-component style="width: 100%" v-bind:location="{ lat: null, lng: null }"
                     v-bind:locations="relatedData.site" v-on:choose-locations="chooseLocations" />
    </b-collapse>
  </div>
</template>

<script>
    export default {
      name: "MapSwitch",
      data(){
        return {
          showCollapseMap:true
        }
      }
    }
</script>

<style scoped>

</style>
