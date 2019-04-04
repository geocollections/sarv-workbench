<template class="map-component">
  <l-map ref="map" :zoom="zoom" :center="center" @click="addMarker" :min-zoom="minZoom">
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

  export default {
    name: "MapComponent2",
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
        minZoom:1,
        zoom: 8,
        center: this.isValidLocation(this.location) ? L.latLng(this.location) : L.latLng(58.5, 25.5),
        marker: this.isValidLocation(this.location) ? L.latLng(this.location) : null,
        tmshybriid: new L.TileLayer('https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{y}.png&ASUTUS=MAAAMET&KESKKOND=LIVE&IS=TMSNAIDE', {
          continuousWorld: true,
          attribution: "Map: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
          tms: true,
          worldCopyJump: true,
          maxZoom: 15,
          minZoom: 6,
          zIndex: 2,
          updateWhenIdle: false

        }),
        tmsfoto: new L.TileLayer('https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{y}.jpg&ASUTUS=MAAAMET&KESKKOND=LIVE&IS=TMSNAIDE', {
          continuousWorld: true,
          attribution: "Map: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
          tms: true,
          worldCopyJump: true,
          maxZoom: 18,
          minZoom: 6,
          zIndex: 1,
          updateWhenIdle: false
        }),
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
          {
            name: 'Maaamet',
            visible: false,
            continuousWorld: true,
            url: '',
            attribution: 'Map: <a  href=\'http://www.maaamet.ee/\'>Maa-amet</a>'
          }
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
        console.log(event.latlng)
        this.marker = L.latLng(event.latlng);
        this.$emit('get-location', event.latlng)
      },
      applyProjection(){
        //Maa-ameti poolt pakutavad TMS teenused on kättesaadavad aadressil https://tiles.maaamet.ee/tm/tms/1.0.0/
        //NB! Antud näide kasutab TMS@3857 (@GMC) projektsiooni!

        //Palume kasutada  URL-i, kus päringut on täiendatud lisaparameetritega, mille abil on võimalik vastava teenuse päringud statistika jaoks logidest välja filtreerida.
        //NÄITEKS: &ASUTUS=MAAAMET&KESKKOND=LIVE&IS=TMSNAIDE

        this.map.fitBounds([
          [60.28165, 30.624],
          [57.17855, 19.46739]
        ]);

        this.minZoom = 6;
        this.zoom = 7;
        this.map.addLayer(this.tmsfoto);
        this.map.addLayer(this.tmshybriid);


      },
      setDefault(){
        this.minZoom = 1;
        this.zoom = 8;
        this.map.removeLayer(this.tmsfoto);
        this.map.removeLayer(this.tmshybriid);
      }

    }
  }
</script>

<style scoped>

</style>
