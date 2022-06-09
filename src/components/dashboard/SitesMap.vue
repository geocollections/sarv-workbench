<template>
  <div class="map">
    <div id="map" style="height: 50vh"></div>
  </div>
</template>

<script>
import * as L from "leaflet";
import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import {
  fetchRecentImages,
  fetchRecentSamples,
  fetchRecentSites,
  fetchRecentSpecimens,
} from "../../assets/js/api/apiCalls";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "SitesMap",

  props: {
    showMap: {
      type: Boolean,
    },
  },

  data() {
    return {
      map: null,
      sites: [],
      samples: [],
      specimens: [],
      images: [],
      response: {
        recentSites: null,
        recentSamples: null,
        recentSpecimens: null,
        recentImages: null,
      },
      sitesIcon: new L.DivIcon({
        html: "<i class='far fa-circle' style='color: #FF3D00; background-color: #FFAB91; border-radius: 100%;' />",
        className: "map-marker",
      }),
      samplesIcon: new L.DivIcon({
        html: "<i class='far fa-circle' style='color: #FFC107; background-color: #FFE082; border-radius: 100%;' />",
        className: "map-marker",
      }),
      specimensIcon: new L.DivIcon({
        html: "<i class='far fa-circle' style='color: #673AB7; background-color: #B39DDB; border-radius: 100%;'/>",
        className: "map-marker",
      }),
      imagesIcon: new L.DivIcon({
        html: "<i class='far fa-circle' style='color: #009688; background-color: #80CBC4; border-radius: 100%;'/>",
        className: "map-marker",
      }),
      baseMaps: [
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
            }
          ),
          minZoom: 1,
          maxZoom: 18,
        },
        {
          name: "OpenTopoMap",
          leafletObject: L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            {
              attribution:
                'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            }
          ),
          minZoom: 1,
          maxZoom: 18,
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
              continuousWorld: true,
            }
          ),
          minZoom: 6,
          maxZoom: 18,
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
              continuousWorld: true,
            }
          ),
          minZoom: 6,
          maxZoom: 18,
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
      gestureHandlingOptions: {
        text: {
          touch: this.$t("gestureHandling.touch"),
          scroll: this.$t("gestureHandling.scroll"),
          scrollMac: this.$t("gestureHandling.scrollMac"),
        },
        duration: 1000,
      },
    };
  },

  computed: {
    ...mapState("map", ["defaultLayer"]),
    ...mapGetters("user", ["getCurrentUser"]),
  },

  created() {
    if (this.getCurrentUser && this.getCurrentUser.id)
      this.fetchRecentData(this.getCurrentUser.id);
  },

  watch: {
    response: {
      handler(newVal) {
        if (
          newVal &&
          Object.entries(newVal).length > 0 &&
          newVal.constructor === Object
        ) {
          this.initMap(newVal);
        }
      },
      deep: true,
    },

    showMap(newVal) {
      if (newVal && this.map) {
        this.map.invalidateSize();
        let bounds = new L.featureGroup([
          ...this.sites,
          ...this.samples,
          ...this.specimens,
          ...this.images,
        ]).getBounds();
        this.map.fitBounds(bounds, { maxZoom: 10 });
      }
    },
  },

  methods: {
    ...mapActions("map", ["updateDefaultLayer"]),

    async fetchRecentData(userId) {
      const recentSites = await fetchRecentSites(userId);
      const recentSamples = await fetchRecentSamples(userId);
      const recentSpecimens = await fetchRecentSpecimens(userId);
      const recentImages = await fetchRecentImages(userId);

      this.response = {
        recentSites: this.returnResponseResults(recentSites),
        recentSamples: this.returnResponseResults(recentSamples),
        recentSpecimens: this.returnResponseResults(recentSpecimens),
        recentImages: this.returnResponseResults(recentImages),
      };
    },

    returnResponseResults(apiResponse) {
      if (apiResponse && apiResponse.status === 200) {
        if (
          apiResponse.data &&
          apiResponse.data.count &&
          apiResponse.data.count > 0
        ) {
          return apiResponse.data.results;
        } else return null;
      } else return null;
    },

    initMap(recentData) {
      L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

      this.map = L.map("map", {
        layers: [this.baseMaps[0].leafletObject],
        gestureHandling: true,
        gestureHandlingOptions: this.gestureHandlingOptions,
      }).setView(L.latLng(58.5, 25.5), 6);

      let baseMaps = {};
      this.baseMaps.forEach(
        (provider) => (baseMaps[provider.name] = provider.leafletObject)
      );
      let overlayMaps = {};
      this.overlayMaps.forEach(
        (provider) => (overlayMaps[provider.name] = provider.leafletObject)
      );

      L.control.layers(baseMaps, overlayMaps).addTo(this.map);
      L.control.scale({ imperial: false }).addTo(this.map);

      // Default layer
      if (this.defaultLayer) {
        this.map.removeLayer(baseMaps["CartoDB"]);
        this.map.addLayer(baseMaps[this.defaultLayer]);
        if (this.defaultLayer === "Maaameti fotokaart") {
          this.map.addLayer(this.overlayMaps[0].leafletObject);
        }
      }

      // FULLSCREEN
      this.map.addControl(new window.L.Control.Fullscreen());

      //LAYERS CHANGED
      this.map.on("baselayerchange", this.handleLayerChange);

      this.setMarkers(recentData);
    },

    handleLayerChange(event) {
      this.updateDefaultLayer(event.name);

      if (event.name && event.name === "Maaameti fotokaart") {
        // console.log(this.overlayMaps[0].leafletObject);
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

    setMarkers(recentData) {
      this.sites = [];
      this.samples = [];
      this.specimens = [];
      this.images = [];

      // SITES
      if (recentData.recentSites) {
        recentData.recentSites.forEach((site) => {
          let marker = L.marker(
            {
              lat: parseFloat(site.latitude),
              lng: parseFloat(site.longitude),
            },
            { icon: this.sitesIcon }
          ).addTo(this.map);
          if (site.id)
            marker.on("click", () => {
              let routeData = this.$router.resolve({
                path: "/site/" + site.id,
              });
              window.open(routeData.href, "SiteWindow");
            });
          marker.bindTooltip(site.name, {
            permanent: false,
            direction: "right",
            offset: [7, 0],
          });
          this.sites.push(marker);
        });
      }

      // SAMPLES
      if (recentData.recentSamples) {
        recentData.recentSamples.forEach((sample) => {
          let marker = L.marker(
            {
              lat: parseFloat(sample.locality__latitude),
              lng: parseFloat(sample.locality__longitude),
            },
            { icon: this.samplesIcon }
          ).addTo(this.map);
          if (sample.locality__id)
            marker.on("click", () => {
              let routeData = this.$router.resolve({
                path: "/locality/" + sample.locality__id,
              });
              window.open(routeData.href, "LocalityWindow");
            });
          marker.bindTooltip(sample.locality__locality, {
            permanent: false,
            direction: "right",
            offset: [7, 0],
          });
          this.samples.push(marker);
        });
      }

      // SPECIMENS
      if (recentData.recentSpecimens) {
        recentData.recentSpecimens.forEach((specimen) => {
          let marker = L.marker(
            {
              lat: parseFloat(specimen.locality__latitude),
              lng: parseFloat(specimen.locality__longitude),
            },
            { icon: this.specimensIcon }
          ).addTo(this.map);
          if (specimen.locality__id)
            marker.on("click", () => {
              let routeData = this.$router.resolve({
                path: "/locality/" + specimen.locality__id,
              });
              window.open(routeData.href, "LocalityWindow");
            });
          marker.bindTooltip(specimen.locality__locality, {
            permanent: false,
            direction: "right",
            offset: [7, 0],
          });
          this.specimens.push(marker);
        });
      }

      // IMAGES
      if (recentData.recentImages) {
        recentData.recentImages.forEach((image) => {
          let marker = L.marker(
            {
              lat: parseFloat(image.image_latitude),
              lng: parseFloat(image.image_longitude),
            },
            { icon: this.imagesIcon }
          ).addTo(this.map);
          if (image.id)
            marker.on("click", () => {
              let routeData = this.$router.resolve({
                path: "/attachment/" + image.id,
              });
              window.open(routeData.href, "ImageWindow");
            });
          marker.bindTooltip(image.image_place, {
            permanent: false,
            direction: "right",
            offset: [7, 0],
          });
          this.images.push(marker);
        });
      }

      let listOfDifferentItems = [
        ...this.sites,
        ...this.samples,
        ...this.specimens,
        ...this.images,
      ];
      if (listOfDifferentItems.length > 0) {
        let bounds = new L.featureGroup(listOfDifferentItems).getBounds();
        this.map.fitBounds(bounds, { maxZoom: 10 });
      }
    },
  },
};
</script>

<style>
.sites-icon {
  color: #ba68c8;
  background-color: #e1bee7;
  border-radius: 100%;
}
</style>
