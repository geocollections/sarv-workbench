<template>
  <div class="photo_archive">

    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$t('add.overlay') + ' ' + loadingPercent + '%'"></spinner>

    <fieldset class="border p-2 mb-2" :style="!validate('photo_archive') ? 'border-color: #dc3545!important;' : ''">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.requiredFields, 'text-danger': !validate('photo_archive') }" @click="block.requiredFields = !block.requiredFields">
        {{ $t('doi.requiredFields') }}
        <font-awesome-icon v-if="validate('photo_archive')" color="#28a745" icon="check"/>
        <font-awesome-icon v-if="!validate('photo_archive')" color="#dc3545" icon="exclamation-triangle"/>
      </legend>

      <transition name="fade">
        <div v-if="block.requiredFields">

          <div class="row">
            <multimedia-component v-if="attachment.length === 0" v-on:file-uploaded="addFiles" :recordOptions="true"
                                  acceptable-format="image/*" :accept-multiple="true"/>
            <file-table :attachments="attachment" object="photo_archive" v-if="attachment.length > 0"/>
          </div>

        </div>
      </transition>

    </fieldset>


  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import formManipulation from "../mixins/formManipulation";
  import autocompleteFieldManipulation from "../mixins/autocompleFormManipulation";
  import MultimediaComponent from "../partial/MultimediaComponent";
  import FileTable from "../partial/FileTable";

  export default {
    components: {
      Spinner,
      MultimediaComponent,
      FileTable
    },
    mixins: [formManipulation, autocompleteFieldManipulation],
    name: "PhotoArchiveNew",

    data() {
      return this.setInitialData()
    },

    watch: {
      '$route.params.id': {
        handler: function (newval, oldval) {
          this.reloadData()
        },
        deep: true
      },
    },

    methods: {
      setInitialData() {
        return {
          searchHistory: 'photoArchiveSearchHistory',
          relatedData: this.setDefaultRelatedData(),
          copyFields: [],
          autocomplete: {
            loaders: {
            },
          },
          requiredFields: ['reference', 'year', 'author', 'title'],
          photo_archive: {},
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters(),
          attachment: {},
          block: {requiredFields: true, info: true }
        }
      },
    }
  }
</script>

<style scoped>

</style>
