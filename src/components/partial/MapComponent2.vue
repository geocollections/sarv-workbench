<template>
  <div id="map" style="height: 50vh"></div>
</template>

<script>
  import 'leaflet'
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
          type:Boolean,
          default: false
        }
      },

      data(){
        return {
          marker:null,
          markers:[],
          map:null,
          center: L.latLng(58.5, 25.5),
          currentLocation:undefined,
          tileLayer: null,
          tileProviders: [
            {
              name: 'OpenStreetMap',
              maxZoom: 8,
              minZoom: 2,
              leafletObject: L.tileLayer(
                'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w', {
                  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', minZoom: 1,})
            },
            {
              name: 'OpenTopoMap',
              maxZoom: 8,
              minZoom: 1,
              leafletObject: L.tileLayer(
                'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                  attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)', minZoom: 1,})
            },
            {
              name: 'Maaameti fotokaart',
              maxZoom: 18,
              minZoom: 6,
              leafletObject: L.tileLayer(
                'https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV', {
                  attribution: 'Eesti kaardid: <a  href=\'http://www.maaamet.ee/\'>Maa-amet</a>',
                  tms: true,
                  worldCopyJump: true,
                  detectRetina: true,
                  zIndex: 1,
                  updateWhenIdle: true,
                  continuousWorld: true,})
            },
            {
              name: 'Maaameti kaart',
              maxZoom: 18,
              minZoom: 6,
              leafletObject: L.tileLayer(
                'https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV', {
                  attribution: 'Eesti kaardid: <a  href=\'http://www.maaamet.ee/\'>Maa-amet</a>',      tms: true,
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
                  attribution: 'Eesti kaardid: <a  href=\'http://www.maaamet.ee/\'>Maa-amet</a>',     tms: true,
                  worldCopyJump: true,
                  detectRetina: true,
                  zIndex: 2,
                  updateWhenIdle: true,
                  continuousWorld: true,
                })
            },

          ],
          zoom : 11 //SET DEFAULT ZOOM LEVEL
        }
      },
      computed:{
        mapMarkersLoaded () { return this.mode === 'single'  && this.gpsCoords === true
          && this.currentLocation && this.location !== null }
      },
      mounted(){
        let vm = this;
        this.$nextTick(() => { vm.initMap(); })
      },
      methods:{

        initMap(){
          this.map = L.map('map',{layers: [this.tileProviders[0].leafletObject]}).setView(this.center, this.zoom);
          let vm = this
          let  baseLayers = {}
          baseLayers[this.tileProviders[0].name] = this.tileProviders[0].leafletObject
          baseLayers[this.tileProviders[1].name] = this.tileProviders[1].leafletObject
          baseLayers[this.tileProviders[2].name] = this.tileProviders[2].leafletObject
          baseLayers[this.tileProviders[3].name] = this.tileProviders[3].leafletObject
          L.control.layers(baseLayers,{}).addTo(this.map);
          this.map.addLayer(vm.tileProviders[4].leafletObject)
          if(this.mode === 'single' && this.gpsCoords === true) this.setCurrentGpsLocationIfExists();


          //LAYERS CHANGED
          this.map.on('baselayerchange', function(e) {
            vm.tileProviders.forEach(tile => {
              if(tile.name === e.name) {
                vm.map.options.minZoom = tile.minZoom;
                vm.map.options.maxZoom = tile.maxZoom;
              }
            })
          });

          //ZOOM ACTIVATED
          this.map.on('zoomend', function(e) {
            // console.log(e.target._zoom)
            vm.zoom = e.target._zoom
          });

          if(this.mode === 'multiple') {
            this.setMarkers(this.locations)
          }

          if(this.mode === 'single') {
            if (this.isValidLocation(this.location)) {
              this.addMarker(this.location)
            }
            this.map.on('click', function(e) {
              vm.addMarker(e.latlng)
            });
          }
        },
        //SET GROUP OF MARKERS
        setMarkers(newval){
          this.markers = []
          let vm = this
          newval.forEach(entity => {
            let marker = L.marker({lat:parseFloat(entity.latitude), lng: parseFloat(entity.longitude)})
              .addTo(vm.map)
              .on('click', function(){
              window.open('https://edit2.geocollections.info/site/'+entity.id, '', 'width=800,height=750')
            })
            vm.markers.push(marker)
          });
          let bounds = new L.featureGroup(this.markers).getBounds();
          this.map.fitBounds(bounds);
          this.map.setZoom(this.map.getBoundsZoom(bounds)-2)
        },

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

        updateCoordinates(event){
          this.$emit('get-location', event.target.getLatLng())
        },

        addMarker(latlng){
          if(this.marker !== null) this.map.removeLayer(this.marker)

          let vm = this, location=[parseFloat(latlng.lat),parseFloat(latlng.lng)];
          this.marker = L.marker(location, {
            draggable:true, clickable:false, zIndexOffset: 100})
            .addTo(this.map)
            .on('dragend', function(e) {
            vm.$emit('get-location', e.target._latlng)

            vm.map.setView(vm.marker._latlng,vm.zoom);
          });
          vm.$emit('get-location', this.marker._latlng);
          this.map.setView(this.marker._latlng,vm.zoom);
        },
        setCurrentGpsLocationIfExists(){
          let vm = this
          this.getGPSLocation().then(currentGPSLocation => {
            if(currentGPSLocation === null) return;
            var redIcon = new L.Icon({
              iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
            vm.currentLocation =  L.marker({lat:currentGPSLocation.latitude, lng: currentGPSLocation.longitude},
              {icon: redIcon,zIndexOffset: -1})
              .addTo(vm.map)
            vm.currentLocation.bindPopup("GPS location").openPopup();
          });

        },
        // GET CURRENT LOCATION FROM GPS
        getGPSLocation() {
          let this_ = this;

          if (navigator.geolocation) {
            return new Promise(resolve => {
              navigator.geolocation.getCurrentPosition(function (position) {

                resolve( {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy
                })
              }, function (error) {
                if (error.code == error.PERMISSION_DENIED)
                  this_.errorMessege = "Geolocation is not supported by this browser.";
                resolve (null)
              });
            });
          }
        },
        setZoom() {
          let featureGroup = []
          featureGroup.push(this.currentLocation);
          if(this.marker !== null) {
            featureGroup.push(this.marker)
            let bounds = new L.featureGroup(featureGroup).getBounds()
            this.map.fitBounds(bounds);
            this.map.setZoom(this.map.getBoundsZoom(bounds)-2)
          }

        },

      },
      watch: {
        location: function (newVal, oldVal) {
          if (this.mode === 'multiple') return;
          console.log(newVal)
          // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
          // Because if input from form fields is null then it gets reset to 0 and shows marker at 0:0, but I don't want that.

          // if (this.marker !== null && (newVal.lat === null || newVal.lng === null) && !(newVal.lat === null && newVal.lng === null)) {
          //   console.log('REMOVE')
          //   this.map.removeLayer(this.marker)
          // }

          if (this.isValidLocation(newVal)) {
            this.addMarker(newVal)
          } else {
            this.marker = null
          }
        },

        currentLocation: function (newVal, oldVal) {
          // if (newVal !== null && this.marker !== null) {
          //   this.setZoom()
          // } else if (newVal === null && this.marker !== null) {
          //   this.map.setView(this.marker._latlng, this.zoom);
          // }
        },
        mapMarkersLoaded: function (newVal, oldVal) {
          console.log(newVal)
          if(this.marker !== null) this.map.setView(this.marker._latlng, this.zoom);
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
