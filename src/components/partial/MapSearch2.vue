<template>
  <div id="map" style="width: 300px"></div>
</template>

<script>

  export default {
        name: "MapSearch2",
        data() {
          return {
            map: null,
            componentKey: 0,
          }
        },
        mounted(){
          this.forceRerender()
          this.initMap()
        },
        methods:{
          initMap(){


            //Maa-ameti poolt pakutavad TMS teenused on kättesaadavad aadressil https://tiles.maaamet.ee/tm/tms/1.0.0/
            //NB! Antud näide kasutab TMS@3857 (@GMC) projektsiooni!

            //Palume kasutada  URL-i, kus päringut on täiendatud lisaparameetritega, mille abil on võimalik vastava teenuse päringud statistika jaoks logidest välja filtreerida.
            //NÄITEKS: &ASUTUS=MAAAMET&KESKKOND=LIVE&IS=TMSNAIDE
            var tmshybriid = new L.TileLayer('https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{y}.png&ASUTUS=MAAAMET&KESKKOND=LIVE&IS=TMSNAIDE', {
              continuousWorld: true,
              attribution: "Map: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
              tms: true,
              worldCopyJump: true,
              maxZoom: 15,
              minZoom: 6,
              zIndex: 2,
              updateWhenIdle: false

            });
            //Palume kasutada  URL-i, kus päringut on täiendatud lisaparameetritega, mille abil on võimalik vastava teenuse päringud statistika jaoks logidest välja filtreerida.
            //NÄITEKS: &ASUTUS=MAAAMET&KESKKOND=LIVE&IS=TMSNAIDE
            var tmsfoto = new L.TileLayer('https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{y}.jpg&ASUTUS=MAAAMET&KESKKOND=LIVE&IS=TMSNAIDE', {
              continuousWorld: true,
              attribution: "Map: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
              tms: true,
              worldCopyJump: true,
              maxZoom: 18,
              minZoom: 6,
              zIndex: 1,
              updateWhenIdle: false
            });


            this.map = L.map('map', {
              maxZoom: 18,
              minZoom: 6,
              dragging: true,
              touchZoom: true,
              scrollWheelZoom: true,
              keyboard: false,
              zoomControl: true
            });

            this.map.fitBounds([
              [60.28165, 30.624],
              [57.17855, 19.46739]
            ]);


            this.map.addLayer(tmsfoto);
            this.map.addLayer(tmshybriid);

          },
          forceRerender() {
            this.componentKey += 1;
          }
        }

    }
</script>

<style scoped>

</style>
