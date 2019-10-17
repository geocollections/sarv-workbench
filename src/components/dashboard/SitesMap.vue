<template>
  <div class="map">
    <div id="map" style="height: 50vh"></div>
  </div>
</template>

<script>
import * as L from "leaflet";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen";
import { fetchRecentSites } from "../../assets/js/api/apiCalls";
import { mapState } from "vuex";

export default {
  name: "SitesMap",
  data: () => ({
    map: null,
    markers: [],
    response: null,
    markerIcon: new L.DivIcon({
      html: "<i class='fas fa-circle' style='color: #FF5722' />",
      className: "map-marker"
    }),
    baseMaps: [
      {
        name: "OpenStreetMap",
        leafletObject: L.tileLayer(
          "https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w",
          {
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
        ),
        minZoom: 1,
        maxZoom: 18
      },
      {
        name: "OpenTopoMap",
        leafletObject: L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          {
            attribution:
              'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          }
        ),
        minZoom: 1,
        maxZoom: 18
      },
      {
        name: "Maaameti fotokaart",
        leafletObject: L.tileLayer(
          "https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
          {
            attribution:
              "Eesti kaardid: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
            tms: true,
            worldCopyJump: true,
            detectRetina: true,
            zIndex: 1,
            updateWhenIdle: true,
            continuousWorld: true
          }
        ),
        minZoom: 6,
        maxZoom: 18
      },
      {
        name: "Maaameti kaart",
        leafletObject: L.tileLayer(
          "https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
          {
            attribution:
              "Eesti kaardid: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
            tms: true,
            worldCopyJump: true,
            detectRetina: true,
            zIndex: 1,
            updateWhenIdle: true,
            continuousWorld: true
          }
        ),
        minZoom: 6,
        maxZoom: 18
      }
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
            continuousWorld: true
          }
        ),
        minZoom: 6,
        maxZoom: 18
      }
    ]
  }),

  computed: {
    ...mapState(["currentUser"])
  },

  created() {
    if (this.currentUser && this.currentUser.id) {
      fetchRecentSites(this.currentUser.id).then(response => {
        if (response && response.status === 200) this.response = response.body;
      });
    }
  },

  watch: {
    response: {
      handler(newVal) {
        if (newVal && newVal.results && newVal.results.length > 0) {
          this.initMap(newVal.results);
        }
      },
      deep: true
    }
  },

  methods: {
    initMap(results) {
      this.map = L.map("map", {
        layers: [this.baseMaps[0].leafletObject],
        scrollWheelZoom: true
      }).setView(L.latLng(58.5, 25.5), 6);

      let baseMaps = {};
      this.baseMaps.forEach(
        provider => (baseMaps[provider.name] = provider.leafletObject)
      );
      let overlayMaps = {};
      this.overlayMaps.forEach(
        provider => (overlayMaps[provider.name] = provider.leafletObject)
      );

      L.control.layers(baseMaps, overlayMaps).addTo(this.map);
      L.control.scale({ imperial: false }).addTo(this.map);

      // FULLSCREEN
      this.map.addControl(new window.L.Control.Fullscreen());

      //LAYERS CHANGED
      this.map.on("baselayerchange", this.handleLayerChange);

      this.setMarkers(results);
    },

    handleLayerChange(event) {
      if (event.name && event.name === "Maaameti fotokaart") {
        console.log(this.overlayMaps[0].leafletObject);
        this.map.addLayer(this.overlayMaps[0].leafletObject);
        document.querySelector(
          "#map > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > label > div > input"
        ).checked = true;
      } else {
        this.map.removeLayer(this.overlayMaps[0].leafletObject);
        document.querySelector(
          "#map > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > label > div > input"
        ).checked = false;
      }
    },

    setMarkers(locations) {
      this.markers = [];

      locations.forEach(entity => {
        let marker = L.marker(
          {
            lat: parseFloat(entity.latitude),
            lng: parseFloat(entity.longitude)
          },
          { icon: this.markerIcon }
        ).addTo(this.map);
        if (entity.id)
          marker.on("click", () => {
            let routeData = this.$router.resolve({
              path: "/site/" + entity.id
            });
            window.open(routeData.href, "SiteWindow");
          });
        marker.bindTooltip(entity.name, {
          permanent: false,
          direction: "right",
          offset: [7, 0]
        });
        this.markers.push(marker);
      });
      let bounds = new L.featureGroup(this.markers).getBounds();
      this.map.fitBounds(bounds, { maxZoom: 10 });
    }
  }
};
</script>

<style scoped></style>
