<template>
  <div id="map" style="height: 50vh"></div>
</template>

<script>
  import * as L from "leaflet";
  import {toastError, toastSuccess} from "../../assets/js/iziToast/iziToast";

  export default {
    name: "map-component-2",
    props: {
      location: {
        type: Object,
        required: true
      },
      locations: {
        type: Array,
        default: null,
      },
      mode: {
        type: String,
        default: 'single',
      },
      gpsCoords: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        marker: null,
        markers: [],
        map: null,
        center: L.latLng(58.5, 25.5),
        currentLocation: undefined,
        tileLayer: null,
        tileProviders: [
          {
            name: 'OpenStreetMap',
            leafletObject: L.tileLayer(
              'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                minZoom: 1,
              })
          },
          {
            name: 'OpenTopoMap',
            leafletObject: L.tileLayer(
              'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
                minZoom: 1,
              })
          },
          {
            name: 'Maaameti fotokaart',
            leafletObject: L.tileLayer(
              'https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV', {
                attribution: 'Eesti kaardid: <a  href=\'http://www.maaamet.ee/\'>Maa-amet</a>',
                tms: true,
                worldCopyJump: true,
                detectRetina: true,
                zIndex: 1,
                updateWhenIdle: true,
                continuousWorld: true,
              })
          },
          {
            name: 'Maaameti kaart',
            leafletObject: L.tileLayer(
              'https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV', {
                attribution: 'Eesti kaardid: <a  href=\'http://www.maaamet.ee/\'>Maa-amet</a>',
                tms: true,
                worldCopyJump: true,
                detectRetina: true,
                zIndex: 1,
                updateWhenIdle: true,
                continuousWorld: true
              })
          },
          {
            name: 'Maaameti hübriidkaart',
            leafletObject: L.tileLayer(
              'https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV', {
                attribution: 'Eesti kaardid: <a  href=\'http://www.maaamet.ee/\'>Maa-amet</a>',
                tms: true,
                worldCopyJump: true,
                detectRetina: true,
                zIndex: 2,
                updateWhenIdle: true,
                continuousWorld: true,
              })
          },

        ],
        zoom: 11, //SET DEFAULT ZOOM LEVEL,
        gpsID: null
      }
    },

    computed: {
      mapMarkersLoaded() {
        return this.mode === 'single' && this.gpsCoords === true && this.currentLocation && this.location !== null
      },

      areLocationsSet() {
        return this.locations !== null && this.locations.length > 0
      },

      isLocationSet() {
        return this.location !== null && this.location.lat !== null && this.location.lng !== null
      }
    },

    created() {
      // SETTING DEFAULT ZOOM LEVEL
      if (this.isLocationSet || this.areLocationsSet) this.zoom = 15;
      else this.zoom = 6
    },

    mounted() {
      this.initMap();
      // this.$nextTick(() => {
      //   this.initMap();
      // })
    },

    beforeDestroy() {
      navigator.geolocation.clearWatch(this.gpsID)
    },

    methods: {

      initMap() {
        this.map = L.map('map', {
          layers: [this.tileProviders[0].leafletObject],
          scrollWheelZoom: false
        }).setView(this.center, this.zoom);

        let vm = this;
        let baseLayers = {};
        this.tileProviders.forEach(provider => {
          baseLayers[provider.name] = provider.leafletObject
        });

        L.control.layers(baseLayers).addTo(this.map);

        if (this.mode === 'single' && this.gpsCoords === true) this.setCurrentGpsLocationIfExists();

        //LAYERS CHANGED
        this.map.on('baselayerchange', (event) => {
          this.tileProviders.forEach(tile => {
            if (tile.name === event.name) {
              this.map.options.minZoom = tile.minZoom;
              this.map.options.maxZoom = tile.maxZoom;
            }
          })
        });

        //ZOOM ACTIVATED
        this.map.on('zoomend', (event) => this.zoom = event.target._zoom);

        if (this.mode === 'multiple') this.setMarkers(this.locations);

        if (this.mode === 'single') {
          if (this.isLocationSet) this.addMarker(this.location);
          this.map.on('click', (event) => this.updateCoordinates(event.latlng));
        }
      },

      //SET GROUP OF MARKERS
      setMarkers(newVal) {
        this.markers = [];

        newVal.forEach(entity => {
          let marker = L.marker({lat: parseFloat(entity.latitude), lng: parseFloat(entity.longitude)})
            .addTo(this.map)
            .on('click', () => window.open(location.origin + '/site/' + entity.id, '', 'width=800,height=750'));
          marker.bindTooltip(entity.name, {permanent: true, direction: 'right'});
          this.markers.push(marker)
        });
        let bounds = new L.featureGroup(this.markers).getBounds();
        this.map.fitBounds(bounds);
        this.map.setZoom(this.map.getBoundsZoom(bounds) - 2)
      },

      // Validates if coordinates exist in correct form.
      // isValidLocation(loc) {
      //   if (loc !== null) {
      //     if (loc.lat && loc.lat !== null && loc.lng && loc.lng !== null) {
      //       return loc.lat.length > 0 && loc.lng.length > 0
      //     }
      //     return false
      //   }
      //   return false
      // },

      updateCoordinates(coordinates) {
        this.$emit('update-coordinates', coordinates)
      },

      addMarker(latlng) {
        if (this.marker !== null) this.map.removeLayer(this.marker);

        let location = [parseFloat(latlng.lat), parseFloat(latlng.lng)];

        this.marker = L.marker(location,
          {
            draggable: true,
            clickable: false,
            zIndexOffset: 100
          })
          .addTo(this.map)
          .on('dragend', (event) => this.updateCoordinates(event.target._latlng));

        this.map.setView(this.marker._latlng, this.zoom);
      },

      setCurrentGpsLocationIfExists() {
        this.getGPSLocation().then(currentGPSLocation => {
          if (currentGPSLocation === null) return;
          let redIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          this.currentLocation = L.marker({lat: currentGPSLocation.latitude, lng: currentGPSLocation.longitude}, {icon: redIcon, zIndexOffset: -1})
            .addTo(this.map);
          this.currentLocation.bindPopup("GPS location").openPopup();
        });

      },
      // GET CURRENT LOCATION FROM GPS
      getGPSLocation() {
        if (navigator.geolocation) {
          return new Promise(resolve => {
            this.gpsID = navigator.geolocation.watchPosition(position => {
              console.log(position)
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
            }, error => {
              toastError({text: error.message})
              resolve(null)
            })
          });

          // return new Promise(resolve => {
          //   navigator.geolocation.getCurrentPosition((position) => {
          //
          //     resolve({
          //       latitude: position.coords.latitude,
          //       longitude: position.coords.longitude,
          //       accuracy: position.coords.accuracy
          //     })
          //   }, function (error) {
          //     if (error.code == error.PERMISSION_DENIED)
          //       this.errorMessege = "Geolocation is not supported by this browser.";
          //     resolve(null)
          //   });
          // });
        }
      },
      setZoom() {
        let featureGroup = [];
        featureGroup.push(this.currentLocation);
        if (this.marker !== null) {
          featureGroup.push(this.marker);
          let bounds = new L.featureGroup(featureGroup).getBounds();
          this.map.fitBounds(bounds);
          this.map.setZoom(this.map.getBoundsZoom(bounds) - 2)
        }

      },

    },
    watch: {
      location: function (newVal, oldVal) {
        if ((newVal.lat !== oldVal.lat) || (newVal.lng !== oldVal.lng)) {
          if (this.mode === 'multiple') return;

          if (this.isLocationSet) {
            this.addMarker(newVal)
          } else {
            if (this.marker) this.map.removeLayer(this.marker)
            this.marker = null

          }
        }
      },

      currentLocation: function (newVal, oldVal) {
        // if (newVal !== null && this.marker !== null) {
        //   this.setZoom()
        // } else if (newVal === null && this.marker !== null) {
        //   this.map.setView(this.marker._latlng, this.zoom);
        // }
      },
      mapMarkersLoaded: function (newVal) {
        if (this.marker !== null) this.map.setView(this.marker._latlng, this.zoom);
        // if (this.gpsCoords && newVal) {
        //   //zoom to fit all markers
        //   let featureGroup = []
        //   featureGroup.push(this.currentLocation);
        //   if(this.marker !== null) featureGroup.push(this.marker)
        //   if(featureGroup.length > 1) {
        //     let bounds = new L.featureGroup(featureGroup).getBounds()
        //     this.map.fitBounds(bounds);
        //     this.map.setZoom(this.map.getBoundsZoom(bounds)-2)
        //   }
        // }
      },
    }
  }
</script>

<style scoped>

</style>
