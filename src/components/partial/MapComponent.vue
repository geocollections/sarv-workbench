<template class="map-component">
  <l-map ref="map" :zoom="zoom" :center="center" @click="addMarker">

         <!--:maxBounds= "[[57.52, 20.37],[60.0, 28.2]]" -->

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
  proj4.defs([
    [
      'EPSG:3301', '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 +lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'],
    [
      'WGS84', "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
    ]
  ]);
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
        crs: new L.Proj.CRS('EPSG:3301',
          '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 +lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
          {
            resolutions: [
              1024, 512, 256, 128,
              64, 32, 16, 8, 4, 2, 1, 0.5
            ],
            transformation: new L.Transformation(1, -40500, -1, 7017000)
          }),
        proj1: '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 +lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        proj2:'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ',
        center: this.isValidLocation(this.location) ? L.latLng(this.location) : L.latLng(58.5, 25.5),
        marker: this.isValidLocation(this.location) ? L.latLng(this.location) : null,
        tileProviders: [
          {
            name: 'OpenStreetMap',
            visible: true,
            continuousWorld: true,
            url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w',
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          },
          {
            name: 'OpenTopoMap',
            visible: false,
            continuousWorld: true,
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          },
          // {
          //   name: 'Maaamet',
          //   visible: false,
          //   continuousWorld: false,
          //   url: 'http://tiles.maaamet.ee/tm/tms/1.0.0/foto/{z}/{x}/{-y}.png',
          //   attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          // }
        ],
      }
    },

    watch: {
      location: function(newVal, oldVal) {
        // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        // Because if input from form fields is null then it gets reset to 0 and shows marker at 0:0, but I don't want that.
        if (this.isValidLocation(newVal)) {
          this.marker = L.latLng(newVal)
          this.center = L.latLng(newVal)

        } else {
          this.marker = null
          this.center = L.latLng(58.5, 25.5)
        }
      },
    },

    // Map start
    mounted () {
      this.$nextTick(() => {
        this.map = this.$refs.map.mapObject;
        let vm = this
        this.map.on('baselayerchange', function (event) {
          if(event.name === 'Maaamet') {
            vm.applyProjection()
          } else {
            vm.setDefault()
          }
        });
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
        this.marker = L.latLng(event.latlng);
        console.log(event.latlng)
        console.log(event.latlng)
        this.$emit('get-location', event.latlng)
      },

      transformCoordFromEPSG3301ToWSG(val){
        return proj4(proj4('EPSG:3301'),proj4('WGS84'),[parseFloat(val.lat), parseFloat(val.lng)]);
      },
      transformCoordFromWSGToEPSG3301(val){
        return proj4(proj4('WGS84'),proj4('EPSG:3301')[parseFloat(val.lng),parseFloat(val.lat)]);
      },

      applyProjection(){
        this.$emit('get-location', this.transformCoordFromEPSG3301ToWSG(this.location))

        this.zoom = 2
      },

      setDefaultProjection(){
        this.zoom = 8
      }

    }
  }
</script>

<style scoped>

</style>
