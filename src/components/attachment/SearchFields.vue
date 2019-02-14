<template>
  <div class="search-fields">


    <div class="row">

      <!-- IMAGE_NUMBER -->
      <div class="col-sm-2">
        <label :for="`image_number`">{{ $t('edit.imageNumber') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input v-model="searchParameters.image_number" id="image_number" type="text"></b-form-input>
      </div>

      <!-- FILENAME -->
      <div class="col-sm-2">
        <label :for="`filename`">{{ $t('edit.filename') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input v-model="searchParameters.filename" id="filename" type="text"></b-form-input>
      </div>
    </div>


    <div class="row">

      <!-- SPECIMEN -->
      <div class="col-sm-2">
        <label :for="`specimen`">{{ $t('edit.specimen') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input v-model="searchParameters.specimen" id="specimen" type="text"></b-form-input>
      </div>

      <!-- IMAGE INFO -->
      <div class="col-sm-2">
        <label :for="`image_info`">{{ $t('edit.imageInfo') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="image_info" v-model="searchParameters.imageInfo" type="text"></b-form-input>
      </div>
    </div>

    <div class="row">

      <!-- LOCALITY -->
      <div class="col-sm-2">
        <label :for="`locality`">{{ $t('edit.locality') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="locality" v-model="searchParameters.locality" type="text"></b-form-input>
      </div>

      <!-- TODO: Add author search for admins -->
      <!--<div class="col-sm-2">-->
      <!--<label :for="`author`">{{ $t('edit.author') }}:</label>-->
      <!--</div>-->

    </div>

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <b-form-checkbox-group v-model="searchParameters.specimen_image_attachment">

          <b-form-checkbox value="2">
            {{ $t('edit.photoArchive') }}
          </b-form-checkbox>

          <b-form-checkbox value="1">
            {{ $t('edit.specimenImage') }}
          </b-form-checkbox>

          <b-form-checkbox value="3">
            {{ $t('edit.otherFiles') }}
          </b-form-checkbox>

          <b-form-checkbox value="4">
            {{ $t('edit.digitisedReference') }}
          </b-form-checkbox>

        </b-form-checkbox-group>
      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: "SearchFields",
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/',
        searchParameters: {
          image_number: null,
          filename: null,
          specimen: null,
          imageInfo: null,
          locality: null,
          specimen_image_attachment: ['2', '1', '3', '4'],
        },
      }
    },

    watch: {
      'searchParameters': {
        handler: function (newVal, oldVal) {
          console.log(newVal)
          const fields = this.buildFields(newVal)

          // Saves user preferences to local storage
          this.$localStorage.set('myFilesPreferences', newVal.specimen_image_attachment)

          this.$emit('search-data', fields, newVal.specimen_image_attachment)
        },
        deep: true
      }
    },

    created: function () {
      // Gets user preferences from local storage
      const myFilesPreferences = this.$localStorage.get('myFilesPreferences', 'fallbackValue')

      // Initial Attachments.vue search is triggered here, if user has preferences
      // then search is emitted in watcher otherwise it is emitted here.
      if (myFilesPreferences !== 'fallbackValue' && myFilesPreferences.length > 0) {
        this.searchParameters.specimen_image_attachment = myFilesPreferences
      } else {
        const fields = this.buildFields(this.searchParameters)
        this.$emit('search-data', fields, this.searchParameters.specimen_image_attachment)
      }
    },

    methods: {

      buildFields(data) {
        let fields = ''

        if (data.image_number !== null && data.image_number.trim().length > 0) {
          fields += 'image_number__icontains=' + data.image_number
        }

        if (data.filename !== null && data.filename.trim().length > 0) {
          fields += '&multi_search=value:' + data.filename + ';fields:original_filename,uuid_filename;lookuptype:icontains'
        }

        if (data.specimen !== null && data.specimen.trim().length > 0) {
          fields += '&multi_search=value:' + data.specimen + ';fields:specimen__id,specimen__specimen_id;lookuptype:icontains'
        }

        if (data.imageInfo !== null && data.imageInfo.trim().length > 0) {
          fields += '&multi_search=value:' + data.imageInfo + ';fields:description,description_en,image_place,image_object,image_people,image_description,image_description_en,tags;lookuptype:icontains'
        }

        if (data.locality !== null && data.locality.trim().length > 0) {
          fields += '&multi_search=value:' + data.locality + ';fields:locality__locality,locality__locality_en;lookuptype:icontains'
        }

        if (data.specimen_image_attachment.length > 0 && data.specimen_image_attachment.length <= 3) {
          fields += '&specimen_image_attachment__in=' + data.specimen_image_attachment
        }

        // If all checkboxes are unchecked then there won't be any results, that's why zero is added.
        if (data.specimen_image_attachment.length === 0) {
          fields += '&specimen_image_attachment=0'
        }

        if (fields.startsWith('&')) fields = fields.substring(1)

        return fields
      },
    }
  }
</script>

<style scoped>

</style>
