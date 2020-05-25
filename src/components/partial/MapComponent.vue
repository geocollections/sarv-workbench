<template>
  <div class="map-component">
    <div id="map" style="height: 50vh"></div>
    <div class="map-links text-right" v-if="isLocationSet">
      <span class="google-map">
        <a
          :href="
            `https://www.google.com/maps/?q=${this.location.lat},${this.location.lng}`
          "
          :title="
            `https://www.google.com/maps/?q=${this.location.lat},${this.location.lng}`
          "
          target="_blank"
          >Google Maps</a
        >
      </span>
      <span> | </span>
      <span class="xgis2">
        <a
          :href="
            `https://xgis.maaamet.ee/xgis2/page/app/geoloogia400k?punkt=${this.geoToLest(
              this.location.lat,
              this.location.lng
            )}&moot=20000&tooltip=test`
          "
          title="TODO"
          target="_blank"
          >Estonian Geoportal</a
        >
      </span>
    </div>
  </div>
</template>

<script>
import * as L from "leaflet";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen";
import "leaflet-measure/dist/leaflet-measure.css";
import "leaflet-measure/dist/leaflet-measure";
import { mapActions, mapState } from "vuex";

export default {
  name: "MapComponent",
  props: {
    location: {
      type: Object,
      required: true
    },
    locations: {
      type: Array,
      default: null
    },
    mode: {
      type: String,
      default: "single"
    },
    gpsCoords: {
      type: Boolean,
      default: false
    },
    module: {
      type: String
    },
    showMap: {
      type: Boolean
    }
  },

  data() {
    return {
      map: null,
      marker: null,
      markers: [],
      markerLayer: null,
      center: L.latLng(58.5, 25.5),
      currentLocation: null,
      tileLayer: null,
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
          )
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
          )
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
      ],
      zoom: 11, //SET DEFAULT ZOOM LEVEL,
      gpsID: null,
      markerIcon: new L.DivIcon({
        html:
          '<i class="fas fa-map-marker-alt fa-3x" style="color: #007bff;"></i>',
        iconSize: [29, 37],
        iconAnchor: [12, 36],
        popupAnchor: [2, -34],
        className: "clean-icon"
      }),
      gpsIcon: new L.DivIcon({
        html:
          '<i class="fas fa-map-marker-alt fa-3x" style="color: #dc3545;"></i>',
        iconSize: [29, 37],
        iconAnchor: [12, 36],
        popupAnchor: [2, -34],
        className: "clean-icon"
      }),
      measureOptions: {
        position: "bottomright",
        primaryLengthUnit: "kilometers",
        secondaryLengthUnit: "meters",
        primaryAreaUnit: "hectares",
        secondaryAreaUnit: "sqmeters",
        thousandsSep: " "
      }
    };
  },

  computed: {
    areLocationsSet() {
      return this.locations !== null && this.locations.length > 0;
    },

    isLocationSet() {
      return (
        this.location !== null &&
        this.location.lat !== null &&
        this.location.lng !== null
      );
    },

    ...mapState("map", ["defaultLayer"])
  },

  created() {
    // SETTING DEFAULT ZOOM LEVEL
    if (this.isLocationSet || this.areLocationsSet) this.zoom = 15;
    else this.zoom = 6;
  },

  mounted() {
    this.initMap();
  },

  beforeDestroy() {
    navigator.geolocation.clearWatch(this.gpsID);
    this.map.off("baselayerchange", this.handleLayerChange);
  },

  watch: {
    showMap(newVal) {
      if (newVal && this.map) this.map.invalidateSize();
    },

    location: {
      handler: function(newVal, oldVal) {
        if (
          newVal &&
          (newVal.lat !== oldVal.lat || newVal.lng !== oldVal.lng)
        ) {
          if (this.mode === "multiple") return;

          if (this.isLocationSet) {
            this.addMarker(newVal);
            this.map.off("click");
          } else {
            if (this.marker) this.map.removeLayer(this.marker);
            this.marker = null;
          }
        }
      }
    },

    locations: {
      handler: function(newVal) {
        if (this.mode === "multiple") this.setMarkers(newVal);
      },
      deep: true
    },

    currentLocation: function(newVal, oldVal) {
      // Centers map on GPS marker on 1st update and only if there are no other markers
      if (newVal && oldVal === null) {
        if (!this.isLocationSet && !this.areLocationsSet)
          this.centerMapOnMarker(newVal, 12);
      }

      // if (newVal !== null && this.marker !== null) {
      //   this.setZoom()
      // } else if (newVal === null && this.marker !== null) {
      //   this.map.setView(this.marker._latlng, this.zoom);
      // }
    }
  },

  methods: {
    ...mapActions("map", ["updateDefaultLayer"]),

    initMap() {
      this.map = L.map("map", {
        layers: [this.tileProviders[0].leafletObject],
        scrollWheelZoom: true
      }).setView(this.center, this.zoom);

      let baseLayers = {};
      this.tileProviders.forEach(provider => {
        baseLayers[provider.name] = provider.leafletObject;
      });
      let overlayMaps = {};
      this.overlayMaps.forEach(
        provider => (overlayMaps[provider.name] = provider.leafletObject)
      );

      L.control.layers(baseLayers, overlayMaps).addTo(this.map);
      L.control.scale({ imperial: false }).addTo(this.map);

      // Default layer
      if (this.defaultLayer) {
        this.map.removeLayer(baseLayers["OpenStreetMap"]);
        this.map.addLayer(baseLayers[this.defaultLayer]);
        if (this.defaultLayer === "Maaameti fotokaart") {
          this.map.addLayer(this.overlayMaps[0].leafletObject);
        }
      }

      // Fullscreen
      this.map.addControl(new window.L.Control.Fullscreen());
      // LeafletMeasure
      if (this.module && (this.module === "site" || this.module === "project"))
        this.map.addControl(new window.L.Control.Measure(this.measureOptions));

      if (this.gpsCoords === true) this.trackPosition();

      //LAYERS CHANGED
      this.map.on("baselayerchange", this.handleLayerChange);

      //ZOOM ACTIVATED
      this.map.on("zoomend", event => (this.zoom = event.target._zoom));

      if (this.mode === "multiple") this.setMarkers(this.locations);

      if (this.mode === "single") {
        if (this.isLocationSet) {
          this.addMarker(this.location);
          this.map.setView(this.marker._latlng, this.zoom);
        } else {
          this.map.on("click", event => this.updateCoordinates(event.latlng));
        }
      }
    },

    handleLayerChange(event) {
      this.updateDefaultLayer(event.name);

      this.tileProviders.forEach(tile => {
        if (tile.name === event.name) {
          this.map.options.minZoom = tile.minZoom;
          this.map.options.maxZoom = tile.maxZoom;
        }
      });

      if (event.name && event.name === "Maaameti fotokaart") {
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

    //SET GROUP OF MARKERS
    setMarkers(newVal) {
      if (newVal && newVal.length > 0) {
        if (this.markerLayer !== null) this.map.removeLayer(this.markerLayer);
        this.markers = [];

        newVal.forEach(entity => {
          if (entity.latitude && entity.longitude) {
            let marker = L.marker(
              {
                lat: parseFloat(entity.latitude),
                lng: parseFloat(entity.longitude)
              },
              { icon: this.markerIcon }
            );

            if (entity.id) {
              marker.on("click", () =>
                window.open(
                  location.origin + "/site/" + entity.id,
                  "",
                  "width=800,height=750"
                )
              );
            }

            if (entity.name) {
              marker.bindTooltip(entity.name, {
                permanent: true,
                direction: "right",
                offset: [10, -23]
              });
            }
            this.markers.push(marker);
          }
        });

        // Adding marker layer to map
        this.markerLayer = L.layerGroup(this.markers);
        this.map.addLayer(this.markerLayer);

        let bounds = new L.featureGroup(this.markers).getBounds();
        this.map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        // If response is empty then remove markers
        if (this.markerLayer !== null) this.map.removeLayer(this.markerLayer);
        this.markers = [];
      }
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

    updateCoordinates(coordinates, method, GPSPosition) {
      this.$emit("update-coordinates", coordinates, method, GPSPosition);
      this.map.off("click");
    },

    addMarker(latlng) {
      if (this.marker !== null) this.map.removeLayer(this.marker);

      let location = [parseFloat(latlng.lat), parseFloat(latlng.lng)];

      this.marker = L.marker(location, {
        icon: this.markerIcon,
        draggable: true,
        clickable: false,
        zIndexOffset: 100
      })
        .addTo(this.map)
        .on("dragend", event => this.updateCoordinates(event.target._latlng));

      // Recenter after every coordinate change
      this.map.setView(this.marker._latlng, this.zoom);
    },

    trackPosition() {
      if (navigator.geolocation) {
        this.gpsID = navigator.geolocation.watchPosition(
          this.successGeo,
          this.errorGeo
        );
      } else
        this.toastError({
          text: "Geolocation is not supported by this browser."
        });
    },

    successGeo(position) {
      if (position !== null) {
        if (this.currentLocation !== null)
          this.map.removeLayer(this.currentLocation);

        this.currentLocation = L.marker(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          { icon: this.gpsIcon, zIndexOffset: -1 }
        )
          .addTo(this.map)
          .on("click", event => this.handleGPSMarkerClick(event, position));

        this.currentLocation.bindTooltip("GPS", {
          permanent: true,
          direction: "right",
          offset: [10, -23]
        });
      }
    },

    errorGeo(error) {
      this.toastError({ text: error.message });
    },

    handleGPSMarkerClick(event, position) {
      this.addMarker(event.latlng);
      this.updateCoordinates(event.latlng, "GPS", position);
    },

    setZoom() {
      let featureGroup = [];
      featureGroup.push(this.currentLocation);
      if (this.marker !== null) {
        featureGroup.push(this.marker);
        let bounds = new L.featureGroup(featureGroup).getBounds();
        this.map.fitBounds(bounds);
        this.map.setZoom(this.map.getBoundsZoom(bounds) - 2);
      }
    },

    centerMapOnMarker(marker, zoomLevel) {
      this.map.setView(marker.getLatLng(), zoomLevel);
    },

    /* Code from:  http://www.maaamet.ee/rr/geo-lest/files/geo-lest_function_php.txt */
    geoToLest(north, east) {
      let LAT = north * (Math.PI / 180);
      let LON = east * (Math.PI / 180);
      let a = 6378137.0;
      let F = 298.257222100883;
      let RF = F;
      F = 1 / F;
      let B0 = (57.0 + 31.0 / 60.0 + 3.194148 / 3600.0) * (Math.PI / 180);
      let L0 = 24.0 * (Math.PI / 180);
      let FN = 6375000.0;
      let FE = 500000.0;
      let B1 = (59.0 + 20.0 / 60.0) * (Math.PI / 180);
      let B2 = 58.0 * (Math.PI / 180);
      // let xx = north - FN;
      // let yy = east - FE;
      let f1 = 1 / RF;
      let er = 2.0 * f1 - f1 * f1;
      let e = Math.sqrt(er);
      let t1 = Math.sqrt(
        ((1.0 - Math.sin(B1)) / (1.0 + Math.sin(B1))) *
          Math.pow((1.0 + e * Math.sin(B1)) / (1.0 - e * Math.sin(B1)), e)
      );
      let t2 = Math.sqrt(
        ((1.0 - Math.sin(B2)) / (1.0 + Math.sin(B2))) *
          Math.pow((1.0 + e * Math.sin(B2)) / (1.0 - e * Math.sin(B2)), e)
      );
      let t0 = Math.sqrt(
        ((1.0 - Math.sin(B0)) / (1.0 + Math.sin(B0))) *
          Math.pow((1.0 + e * Math.sin(B0)) / (1.0 - e * Math.sin(B0)), e)
      );
      let t = Math.sqrt(
        ((1.0 - Math.sin(LAT)) / (1.0 + Math.sin(LAT))) *
          Math.pow((1.0 + e * Math.sin(LAT)) / (1.0 - e * Math.sin(LAT)), e)
      );
      let m1 =
        Math.cos(B1) / Math.pow(1.0 - er * Math.sin(B1) * Math.sin(B1), 0.5);
      let m2 =
        Math.cos(B2) / Math.pow(1.0 - er * Math.sin(B2) * Math.sin(B2), 0.5);
      let n = (Math.log(m1) - Math.log(m2)) / (Math.log(t1) - Math.log(t2));
      let FF = m1 / (n * Math.pow(t1, n));
      let p0 = a * FF * Math.pow(t0, n);
      let FII = n * (LON - L0);
      let p = a * FF * Math.pow(t, n);
      n = p0 - p * Math.cos(FII) + FN;
      e = p * Math.sin(FII) + FE;

      return [n, e];
    }
  }
};
</script>

<style scoped>
.clean-icon {
  background: unset;
  border: unset;
}
</style>
