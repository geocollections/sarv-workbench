<template>
  <div class="scroll-to-links mb-2"
       v-if="$route.meta.isEdit && activeSearchParams !== null && typeof activeSearchParams.block !== 'undefined' && activeSearchParams.block !== null">

    <b-button-group size="sm" class="d-block">
      <b-button v-for="(value, name, index) in activeSearchParams.block"
                class="m-1"
                style="border-radius: 0.25rem"
                :key="name"
                variant="outline-primary"
                v-scroll-to="'#block-' + name">
        <i :class="getIconPack(name) + ' ' + getIcon(name)"></i>
        {{ $t('sidebar.' + $route.meta.table + '.' + name) }}
      </b-button>
    </b-button-group>

  </div>
</template>

<script>
  export default {
    name: "ScrollToLinks",
    computed: {
      activeSearchParams() {
        return this.$store.state['activeSearchParams']
      },
    },
    methods: {
      getIcon(name) {
        if (name === 'info') return 'fa-project-diagram';
        if (name === 'description') return 'fa-pen-fancy';
        if (name === 'members') return 'fa-user-friends';
        if (name === 'files') return 'fa-folder-open';
        if (name === 'sites') return 'fa-globe-americas';
        if (name === 'location') return 'fa-globe';
        if (name === 'samples') return 'fa-vial';
        if (name === 'digital') return 'fa-file-pdf';
        if (name === 'libraries') return 'fa-book';
        if (name === 'localities') return 'fa-map-marked';
        if (name === 'requiredFields') return 'fa-check';
        if (name === 'referenceAndDataset') return 'fa-book';
        if (name === 'datacite') return 'fa-sitemap'
        if (name === 'relatedInfo') return 'fa-project-diagram'
        if (name === 'map') return 'fa-map'
        if (name === 'additionalInfo') return 'fa-project-diagram'
      },

      getIconPack(name) {
        return 'fas'
      },
    }
  }
</script>

<style scoped>

</style>
