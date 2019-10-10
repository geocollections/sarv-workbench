<template>
  <v-content class="footer">
    <v-footer :class="{ 'bottom-options-margin': isEditOrAddView }" color="blue darken-4" dark>

      <v-row no-gutters>
        <v-col>
          <img :src="require('../../../assets/img/sarv_logo.png')" style="height: 60px; padding-bottom: 10px;" /><br />
          <a href="https://natarc.ut.ee" target="_blank" rel="noopener">NATARC</a> 2018-2019.
          {{ $t('footer.info') }},
          <a href="mailto:olle.hints@taltech.ee">olle.hints@taltech.ee</a>
        </v-col>
      </v-row>

    </v-footer>
  </v-content>
</template>

<script>
  export default {
    name: "AppFooter",
    computed: {
      isEditOrAddView() {
        return typeof this.$route.meta.isEdit !== 'undefined'
      }
    }
  }
</script>

<style scoped>
  .footer {
    font-size: 0.7rem;
    text-align: center;
    /*position: sticky;*/
    /*bottom: 0;*/
    /*width: 100%;*/
  }

  .bottom-options-margin {
    margin-bottom: 56px;
  }
</style>
