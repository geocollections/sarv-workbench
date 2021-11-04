<template>
  <div class="polygon-map">
    <div id="polygon-map" style="height: 50vh; width: 100%"></div>
  </div>
</template>

<script>
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { mapActions, mapState } from "vuex";

export default {
  name: "PolygonMap",

  props: {
    isViewOnly: {
      type: Boolean,
      default: false,
    },

    polygon: {
      type: String,
    },
  },

  data: () => ({
    map: null,
    center: L.latLng(58.5, 25.5),
    maxZoom: 13,
    minZoom: 2,
    zoom: 7,
    newPolygon: null,
    tileProviders: [
      {
        name: "CartoDB",
        leafletObject: L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          }
        ),
        minZoom: 1,
        maxZoom: 18,
      },
      {
        name: "OpenStreetMap",
        leafletObject: L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            minZoom: 1,
          }
        ),
      },
      {
        name: "OpenTopoMap",
        leafletObject: L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          {
            attribution:
              'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            minZoom: 1,
          }
        ),
      },
      {
        name: "Maaameti fotokaart",
        leafletObject: L.tileLayer(
          "https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
          {
            attribution:
              "<a  href='http://www.maaamet.ee/' target='MapReferenceWindow'>&copy; Maa-amet</a>",
            tms: true,
            detectRetina: true,
            updateWhenIdle: true,
            zIndex: 1,
            worldCopyJump: true,
            continuousWorld: true,
          }
        ),
      },
      {
        name: "Maaameti kaart",
        leafletObject: L.tileLayer(
          "https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
          {
            attribution:
              "<a href='http://www.maaamet.ee/' target='MapReferenceWindow'>&copy; Maa-amet</a>",
            tms: true,
            detectRetina: true,
            updateWhenIdle: true,
            zIndex: 1,
            worldCopyJump: true,
            continuousWorld: true,
          }
        ),
      },
    ],
    overlayMaps: [
      {
        name: "Maaameti hübriidkaart",
        leafletObject: L.tileLayer(
          "https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
          {
            attribution:
              "Eesti kaardid: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
            tms: true,
            worldCopyJump: true,
            detectRetina: true,
            zIndex: 2,
            updateWhenIdle: true,
            continuousWorld: true,
          }
        ),
        minZoom: 6,
        maxZoom: 18,
      },
    ],
  }),

  computed: {
    ...mapState("map", ["defaultLayer"]),
  },

  mounted() {
    this.initMap();
  },

  beforeDestroy() {
    this.map.off("pm:create", this.handlePmCreate);
    this.map.off("pm:remove", this.handlePmRemove);
    if (this.newPolygon) {
      this.newPolygon.off("pm:edit", this.handlePmEdit);
      this.newPolygon.off("pm:cut", this.handlePmCut);
    }
  },

  watch: {
    mapState: {
      handler() {
        this.$nextTick(() => {
          this.map.invalidateSize();
        });
      },
      immediate: true,
    },

    newPolygon(newVal) {
      if (newVal) {
        this.newPolygon.on("pm:edit", this.handlePmEdit);
        this.newPolygon.on("pm:cut", this.handlePmCut);
      }
    },
  },

  methods: {
    ...mapActions("map", ["updateDefaultLayer"]),

    initMap() {
      this.map = L.map("polygon-map", {
        layers: [this.tileProviders[0].leafletObject],
        scrollWheelZoom: false,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
      }).fitBounds([
        [59.8937871096, 21.5136411202],
        [57.3959015512, 28.3681954033],
      ]);

      let baseLayers = {};
      this.tileProviders.forEach((provider) => {
        baseLayers[provider.name] = provider.leafletObject;
      });
      let overlayMaps = {};
      this.overlayMaps.forEach(
        (provider) => (overlayMaps[provider.name] = provider.leafletObject)
      );

      L.control.layers(baseLayers, overlayMaps).addTo(this.map);
      L.control.scale({ imperial: false }).addTo(this.map);

      // Default layer
      if (this.defaultLayer) {
        this.map.removeLayer(baseLayers["CartoDB"]);
        this.map.addLayer(baseLayers[this.defaultLayer]);
        if (this.defaultLayer === "Maaameti fotokaart") {
          this.map.addLayer(this.overlayMaps[0].leafletObject);
        }
      }

      if (!this.isViewOnly) {
        this.map.pm.addControls({
          position: "topleft",
          drawMarker: false,
          drawCircleMarker: false,
          drawPolyline: false,
          drawRectangle: false,
          drawCircle: false,
        });

        this.map.on("pm:create", this.handlePmCreate);
        this.map.on("pm:remove", this.handlePmRemove);
      }

      if (this.polygon) this.setPolygon(this.polygon);

      //LAYERS CHANGED
      this.map.on("baselayerchange", this.handleLayerChange);
    },

    handlePmCreate(event) {
      if (this.newPolygon) this.newPolygon.removeFrom(this.map);
      this.newPolygon = event.layer;
      let coordinates = this.getPolygonCoordinates(event.layer, true);
      this.$emit("polygon:updated", coordinates);
    },

    handlePmEdit(event) {
      let coordinates = this.getPolygonCoordinates(event.target, true);
      this.$emit("polygon:updated", coordinates);
    },

    handlePmRemove() {
      this.$emit("polygon:updated", null);
    },

    handlePmCut(event) {
      this.newPolygon = event.layer._layers[event.layer._leaflet_id - 1];
      let coordinates = this.getPolygonCoordinates(
        event.layer._layers[event.layer._leaflet_id - 1],
        true
      );
      this.$emit("polygon:updated", coordinates);
    },

    setPolygon(arrayOfPoints) {
      if (arrayOfPoints && arrayOfPoints.length > 0) {
        let coordinates = JSON.parse(arrayOfPoints);

        if (coordinates && coordinates.length > 0) {
          let polygons = L.polygon(coordinates, { color: "#4CAF50" }).addTo(
            this.map
          );
          this.newPolygon = polygons;

          let bounds = polygons.getBounds();
          // nextTick fixes weird zoom issue on first render
          this.$nextTick(() => {
            this.map.fitBounds(bounds);
          });
        }
      }
    },

    getPolygonCoordinates(polygon, returnInStringFormat = false) {
      if (polygon) {
        let geoJSON = polygon.toGeoJSON();
        let type = geoJSON.geometry.type;
        let coordinates = geoJSON.geometry.coordinates;

        let newCoordinates = [];

        coordinates.forEach((polygonArrays) => {
          if (type === "MultiPolygon") {
            let polygon = [];
            polygonArrays.forEach((polygonItem) => {
              let switchedPolygonArray = polygonItem.map((latLngArray) => {
                return [latLngArray[1], latLngArray[0]];
              });
              polygon.push(switchedPolygonArray);
            });

            newCoordinates.push(polygon);
          } else {
            let switchedPolygonArray = polygonArrays.map((latLngArray) => {
              return [latLngArray[1], latLngArray[0]];
            });
            newCoordinates.push(switchedPolygonArray);
          }
        });

        // console.log(coordinates);
        // console.log(newCoordinates);

        if (returnInStringFormat) return JSON.stringify(newCoordinates);
        else return newCoordinates;
      } else {
        return "";
      }
    },

    handleLayerChange(event) {
      this.updateDefaultLayer(event.name);

      if (event.name && event.name === "Maaameti fotokaart") {
        this.map.addLayer(this.overlayMaps[0].leafletObject);
        document.querySelector(
          "#polygon-map > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > label > div > input"
        ).checked = true;
      } else {
        this.map.removeLayer(this.overlayMaps[0].leafletObject);
        document.querySelector(
          "#polygon-map > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > label > div > input"
        ).checked = false;
      }
    },
  },
};
</script>

<style scoped></style>
