<template>
  <div v-if="sidebarList.results && sidebarList.results.length > 0">
    <vue-multiselect v-model="activeLibrary"
                     id="active_library"
                     :options="sidebarList.results"
                     track-by="id"
                     :label="$i18n.locale === 'ee' ? 'library__title' : 'library__title_en'"
                     :placeholder="$t('reference.chooseActiveLibrary')"
                     :show-labels="false">
      <template slot="singleLabel" slot-scope="{ option }">
        <strong>{{ this.$i18n.locale === 'ee' ? option.library__title : option.library__title_en }}</strong>
      </template>
      <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
    </vue-multiselect>
  </div>
</template>

<script>
  import VueMultiselect from "vue-multiselect/src/Multiselect";

  export default {
    name: "chooseActiveLibrary",
    components: {VueMultiselect},
    computed: {
      sidebarList() {
        return this.$store.state['sidebarList']
      },

      activeLibrary: {
        get: function () {
          if (this.$store.state['activeLibrary']) return this.$store.state['activeLibrary'];
          else return ''
        },

        set: function (newValue) {
          this.$store.dispatch('ACTIVE_LIBRARY', newValue)
        }

      }
    },
  }
</script>

<style scoped>

</style>
