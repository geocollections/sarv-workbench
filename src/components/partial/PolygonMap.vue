<template>
  <div class="polygon-map">
    <div id="polygon-map" style="height: 50vh; width: 100%"></div>
  </div>
</template>

<script>
import * as L from "leaflet";

export default {
  name: "PolygonMap",

  props: {
    isViewOnly: {
      type: Boolean,
      default: false
    },

    polygon: {
      type: String
    }
  },

  data: () => ({
    map: null,
    center: L.latLng(58.5, 25.5),
    maxZoom: 13,
    minZoom: 2,
    zoom: 7,
    tileProviders: [
      {
        name: "OpenStreetMap",
        leafletObject: L.tileLayer(
          "https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w",
          {
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            minZoom: 1
          }
        )
      },
      {
        name: "OpenTopoMap",
        leafletObject: L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          {
            attribution:
              'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            minZoom: 1
          }
        )
      },
      {
        name: "Maaameti kaart",
        leafletObject: L.tileLayer(
          "https://tiles.maaamet.ee/tm/tms/1.0.0/kaart/{z}/{x}/{y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
          {
            attribution:
              "<a href='http://www.maaamet.ee/' target='MapReferenceWindow'>&copy; Maa-amet</a>",
            tms: true,
            detectRetina: true,
            updateWhenIdle: true,
            zIndex: 1,
            worldCopyJump: true,
            continuousWorld: true
          }
        )
      },
      {
        name: "Maaameti Fotokaart",
        leafletObject: L.tileLayer(
          "https://tiles.maaamet.ee/tm/tms/1.0.0/foto/{z}/{x}/{y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
          {
            attribution:
              "<a  href='http://www.maaamet.ee/' target='MapReferenceWindow'>&copy; Maa-amet</a>",
            tms: true,
            detectRetina: true,
            updateWhenIdle: true,
            zIndex: 1,
            worldCopyJump: true,
            continuousWorld: true
          }
        )
      }
    ]
  }),

  mounted() {
    this.initMap();
  },

  watch: {
    mapState: {
      handler() {
        this.$nextTick(() => {
          this.map.invalidateSize();
        });
      },
      immediate: true
    }
  },

  methods: {
    initMap() {
      this.map = L.map("polygon-map", {
        layers: [this.tileProviders[0].leafletObject],
        scrollWheelZoom: true,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom
      }).fitBounds([
        [59.8937871096, 21.5136411202],
        [57.3959015512, 28.3681954033]
      ]);

      let baseLayers = {};
      this.tileProviders.forEach(provider => {
        baseLayers[provider.name] = provider.leafletObject;
      });

      L.control.layers(baseLayers).addTo(this.map);
      L.control.scale({ imperial: false }).addTo(this.map);

      if (this.polygon) this.setPolygon(this.polygon);
    },

    setPolygon(arrayOfPoints) {
      if (arrayOfPoints && arrayOfPoints.length > 0) {
        let coordinates = JSON.parse(arrayOfPoints);

        if (coordinates && coordinates.length > 0) {
          let polygons = L.polygon(coordinates, { color: "#4CAF50" }).addTo(
            this.map
          );
          let bounds = polygons.getBounds();
          // nextTick fixes weird zoom issue on first render
          this.$nextTick(() => {
            this.map.fitBounds(bounds);
          });
        }
      }
    }
  }
};
</script>

<style scoped></style>
