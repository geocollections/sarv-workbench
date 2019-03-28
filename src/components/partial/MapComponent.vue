<template class="map-component">
  <l-map ref="map" :zoom="zoom" :center="center" @click="addMarker">
    <l-control-layers position="topright"></l-control-layers>
    <l-tile-layer v-for="tileProvider in tileProviders"
      :key="tileProvider.name"
      :name="tileProvider.name"
      :visible="tileProvider.visible"
      :url="tileProvider.url"
      :attribution="tileProvider.attribution"
      layer-type="base"/>
    <l-marker v-if="marker !== null" :lat-lng="marker">
    </l-marker>
  </l-map>
</template>

<script>
  import {LMap, LTileLayer, LControlLayers, LMarker } from 'vue2-leaflet';
  import proj4 from 'proj4'
  import 'proj4leaflet'

  export default {
    name: "MapComponent",
    props: {
      location: {
        type: Object,
        required: true,
        default: null,
      }
    },
    components: {
      LMap,
      LTileLayer,
      LControlLayers,
      LMarker
    },

    data() {
      return {
        map: null,
        zoom: 8,
        proj1: '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 +lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        proj2:'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ',
        center: this.isValidLocation(this.location) ? L.latLng(this.location) : L.latLng(58.5, 25.5),
        marker: this.isValidLocation(this.location) ? L.latLng(this.location) : null,
        tileProviders: [
          {
            name: 'OpenStreetMap',
            visible: true,
            url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w',
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          },
          {
            name: 'OpenTopoMap',
            visible: false,
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          }
        ]
      }
    },

    watch: {
      location: function(newVal, oldVal) {
        // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        // Because if input from form fields is null then it gets reset to 0 and shows marker at 0:0, but I don't want that.
        if (this.isValidLocation(newVal)) {
          this.marker = L.latLng(newVal)
          this.center = L.latLng(newVal)
          this.zoom = 10
        } else {
          this.marker = null
          this.center = L.latLng(58.5, 25.5)
        }

      }
    },

    // Map start
    mounted () {
      this.$nextTick(() => {
        this.map = this.$refs.map.mapObject
      })
    },

    methods: {

      // Validates if coordinates exist in correct form.
      isValidLocation(loc) {
        if (loc !== null)  {
          if (loc.lat && loc.lat !== null && loc.lng && loc.lng !== null) {
            return loc.lat.length > 0 && loc.lng.length > 0
          }
          return false
        }
        return false
      },

      addMarker(event) {
        // console.log(event.latlng)
        this.marker = L.latLng(event.latlng)
        this.$emit('get-location', event.latlng)
      }

    }
  }
</script>

<style scoped>

</style>
