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
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "SitesMap",

  props: {
    showMap: {
      type: Boolean,
    },
    gestureHandling: {
      type: Boolean,
      default: true,
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
        site: null,
        sample: null,
        specimen: null,
        attachment: null,
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
    ...mapGetters("user", ["getCurrentAgent"]),
  },

  async mounted() {
    if (this.getCurrentAgent && this.getCurrentAgent.id)
      await this.fetchRecentData(this.getCurrentAgent.id);
    this.initMap(this.response);
  },

  watch: {
    response: {
      handler(newVal) {
        if (this.map) this.setMarkers(newVal);
      },
      deep: true,
    },

    showMap(newVal) {
      if (newVal && this.map) {
        this.map.invalidateSize();
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
      }
    },
  },

  methods: {
    ...mapActions("map", ["updateDefaultLayer"]),

    async fetchRecentData(userId) {
      const tables = [
        {
          table: "site",
          defaultParams: {
            project__project_agent__agent: userId,
            latitude__isnull: false,
            longitude__isnull: false,
            fields: "name,latitude,longitude,id",
          },
        },
        {
          table: "sample",
          defaultParams: {
            agent_collected: userId,
            locality__isnull: false,
            locality__latitude__isnull: false,
            locality__longitude__isnull: false,
            fields: "locality",
          },
        },
        {
          table: "specimen",
          defaultParams: {
            agent_collected: userId,
            locality__isnull: false,
            locality__latitude__isnull: false,
            locality__longitude__isnull: false,
            fields: "locality",
          },
        },
        {
          table: "attachment",
          defaultParams: {
            author: userId,
            image_latitude__isnull: false,
            image_longitude__isnull: false,
            fields: "image_latitude,image_longitude,id,image_place",
          },
        },
      ];
      const options = {
        page: 1,
        paginateBy: 30,
        sortBy: ["id"],
        sortDesc: [true],
      };

      await Promise.all(
        tables.map((item) =>
          this.$api.rw
            .get(item.table, { defaultParams: item.defaultParams, options })
            .then((res) => (this.response[item.table] = res?.results ?? []))
            .catch((err) => (this.response[item.table] = []))
        )
      );
    },

    initMap(recentData) {
      L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

      this.map = L.map("map", {
        layers: [this.baseMaps[0].leafletObject],
        // scrollWheelZoom: false,
        gestureHandling: this.gestureHandling,
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
      if (recentData.site?.length > 0) {
        recentData.site.forEach((site) => {
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
      if (recentData.sample?.length > 0) {
        recentData.sample.forEach((sample) => {
          let marker = L.marker(
            {
              lat: parseFloat(sample.locality.latitude),
              lng: parseFloat(sample.locality.longitude),
            },
            { icon: this.samplesIcon }
          ).addTo(this.map);
          marker.on("click", () => {
            let routeData = this.$router.resolve({
              path: "/locality/" + sample.locality.id,
            });
            window.open(routeData.href, "LocalityWindow");
          });
          marker.bindTooltip(sample.locality.locality, {
            permanent: false,
            direction: "right",
            offset: [7, 0],
          });
          this.samples.push(marker);
        });
      }

      // SPECIMENS
      if (recentData.specimen?.length > 0) {
        recentData.specimen.forEach((specimen) => {
          let marker = L.marker(
            {
              lat: parseFloat(specimen.locality.latitude),
              lng: parseFloat(specimen.locality.longitude),
            },
            { icon: this.specimensIcon }
          ).addTo(this.map);
          marker.on("click", () => {
            let routeData = this.$router.resolve({
              path: "/locality/" + specimen.locality.id,
            });
            window.open(routeData.href, "LocalityWindow");
          });
          marker.bindTooltip(specimen.locality.locality, {
            permanent: false,
            direction: "right",
            offset: [7, 0],
          });
          this.specimens.push(marker);
        });
      }

      // IMAGES
      if (recentData.attachment?.length > 0) {
        recentData.attachment.forEach((image) => {
          let marker = L.marker(
            {
              lat: parseFloat(image.image_latitude),
              lng: parseFloat(image.image_longitude),
            },
            { icon: this.imagesIcon }
          ).addTo(this.map);
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
      // console.log(listOfDifferentItems);
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
