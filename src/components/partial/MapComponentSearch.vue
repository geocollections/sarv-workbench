<template>
    <div v-if="mapData" id="map" style="height: 300px"></div>
</template>


<script>
  import './../../assets/js/leaflet/leaflet-groupedlayercontrol/leaflet.groupedlayercontrol.min.js'
    export default {
        name: "map-component-search",
        data() {
          return {
              map: null,
              groupedLayers: null,
              tileLayer: null,
              layers: [
                  {id: 0, name: 'Specimen', active: true, features: []}
              ]
          }
        },
      props: {
        mapData: {
          type: Array,
          default: []
        }
      },
        watch: {
            '$store.state.lang'(lang) {
                if (lang) {
                    this.map.removeControl(this.groupedLayers)
                    this.initLayers();
                }
            },
            '$store.state.mode'(mode) {
                if (mode) {
                    this.setView()
                    this.map.removeLayer(this.tileLayer)
                    this.tileLayer.addTo(this.map);
                }

            },
            'mapData': {
                handler: function (newVal, oldVal) {
                    this.resetLayers()
                    if(this.getLocationsObject(this.mapData)) {
                      this.loadMap()
                        this.initLayers();
                        this.checkAllLayers()
                    }

                }
            },
            deep: true

        },

        mounted (){
            if(this.getLocationsObject(this.mapData)) {
                this.loadMap()

                this.initLayers()
                // this.checkAllLayers()
            }

        },
        methods: {
            resetLayers() {
                return new Promise((resolve) => {
                    if(this.groupedLayers) {
                        for (let i = 0; i < this.layers.length; i++) {
                            this.map.removeLayer(this.layers[i].leaflatObjects)
                        }
                        this.map.removeControl(this.groupedLayers);

                        this.layers = [
                            {id: 0, name: 'Specimen', active: true, features: []},
                        ];
                        this.groupedLayers = null;
                    }
                    resolve()
                });
            },
            setView()  {
                let mode = this.$store.state.mode;
                if (mode) {
                    if(mode === 'in_global') this.map.setView([58.5,20.5], 1);
                    else if(mode === 'in_estonia') this.map.setView([58.5,25.5], 6);
                    else this.map.setView([58.5,25.5], 5);
                }
            },
            checkAllLayers() {
                this.layers.sort((a, b) => a.id - b.id);
                for(let i = 0; i < this.layers.length; i++){
                    if(this.layers[i].active)
                        this.map.addLayer(this.layers[i].leaflatObjects)
                }
            },
            initLayers : function() {
              this.layers.forEach((layer) => {
                  let leaflatObjects = []
                  // const markerFeatures = layer.features.filter(feature => feature.type === 'circle');
                  layer.features.forEach((feature) => {
                      function setCustomSettings(type) {
                          let setting;
                          switch (type) {
                              case 1: setting = {color: 'rgba(240, 95, 37,0.7)', opacity: 0.7 ,weight:6, zIndexOffset: 1}; break;
                              default: break;
                          }
                          return setting
                      }
                      feature.leafletObject = L.circle(feature.coords,setCustomSettings(feature.type))
                          .bindPopup(feature.locid === null ? feature.name : '<a target="_blank" href="http://geocollections.info/locality/'+feature.locid+'">'+feature.name+'</a>',
                              {className: "custom-popup-text"})
                      // if(layer.active)feature.leafletObject.addTo(this.map)

                      leaflatObjects.push(feature.leafletObject)
                  });
                  // layer.leaflatObjects = L.layerGroup(leaflatObjects)
              });
              // let groupedLayers = {};
              // groupedLayers[this.$t('map.overlay_title')] = {};
              // groupedLayers[this.$t('map.overlay_title')][this.$t('map.overlay_specimens')] = this.layers[0].leaflatObjects,

              // this.groupedLayers = L.control.groupedLayers(null,groupedLayers).addTo(this.map)
              // L.control.layers(null, groupedLayers,{'autoZIndex':true,'collapsed':true,'sortLayers':true}).addTo(this.map);

            },

            loadMap : function() {
                document.getElementById('map').style.cursor = 'default';
                this.map = L.map('map',{
                    fullscreenControl: true,
                })
                this.setView();
                this.tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w',
                    {
                        minZoom: 1,
                        maxZoom: 18,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    }
                );
                this.tileLayer.addTo(this.map);

            },

            getLocationsObject : function(object) {
                if (object === undefined || object === {} || object === false || object.length === 0) return;
                let this_ = this;
                object.forEach(function(element,index) {
                  this_.layers[0].features.push({
                    id:index,
                    coords:[element.latitude,element.longitude],
                    type:0,
                    name:'TEST'
                  });

                    // if (element.locality !== null && element.locality_id !== null
                    //     && element.latlong && element.latlong !== null) {
                    //     this_.layers[0].features.push({
                    //         id: index,
                    //         coords: getCoords(element.latlong),
                    //         type: 0,
                    //         name: 'TEST',
                    //         locid: element.locality_id
                    //                 // for sql query
                    //         // id: index,
                    //         // coords: [element.latitude, element.longitude],
                    //         // type: element['1'],
                    //         // name: (this_.$store.state.lang === 'ee' ? element.locality : element.locality_en),
                    //         // locid: element.locid
                    //     });
                    // }
                });
                return true
            },
        }
    }
</script>
<style src="./../../assets/js/leaflet/leaflet-groupedlayercontrol/leaflet.groupedlayercontrol.min.css"></style>
<style>
    .custom-popup-text a{
        color:#F05F40;
        font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
        font-size: 10pt;
        text-align: left;
        font-weight: 700;
    }
</style>
