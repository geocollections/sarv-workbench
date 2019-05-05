<template>
  <div class="doi">
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- GENERAL INFO -->
    <fieldset class="border p-2" ref="info">
      <legend class="w-auto" @click="block.info = !block.info"
              :style="!block.info ? {'color':'blue'} : ''">
        {{ $t('doi.generalInfo') }}
        <font-awesome-icon icon="project-diagram"/>
      </legend>
      <transition name="fade">
        <div v-if="block.info">

          <!-- DOI, YEAR and RESOURCE TYPE -->
          <div class="row">
            <div class="col-md-4">
              <label class="p-0" :for="`identifier`">{{ $t('doi.identifier') }}:</label>
              <b-form-input id="identifier" v-model="doi.identifier" type="text"></b-form-input>
            </div>

            <div class="col-md-4">
              <label class="p-0" :for="`publication_year`">{{ $t('doi.year') }}:</label>
              <b-form-input id="publication_year" v-model="doi.publication_year" type="number"></b-form-input>
            </div>

            <div class="col-md-4">
              <label class="p-0" :for="`resource_type`">{{ $t('doi.resourceTypeGeneral') }}:</label>
              <vue-multiselect v-model="doi.resource_type"
                               id="resource_type"
                               :options="autocomplete.resource_types"
                               track-by="id"
                               label="value"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.value }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>



        </div>
      </transition>

      <!-- RESOURCE -->
      <div class="row">
        <div class="col-sm-12 mb-2">
          <label class="p-0" :for="`resource`">{{ $t('doi.resource') }}:</label>
          <b-form-input id="resource" v-model="doi.resource" type="text"></b-form-input>
        </div>
      </div>

      <!-- TITLE -->
      <div class="row">
        <div class="col-sm-2">
          <label :for="`title`">{{ $t('doi.title') }}:</label>
        </div>

        <div class="col-sm-10">
          <b-form-input id="title" v-model="doi.title" type="text"></b-form-input>
        </div>
      </div>

      <!-- CREATORS -->
      <div class="row">
        <div class="col-sm-2">
          <label :for="`creators`">{{ $t('doi.creators') }}:</label>
        </div>

        <div class="col-sm-10">
          <b-form-input id="creators" v-model="doi.creators" type="text"></b-form-input>
        </div>
      </div>

      <!-- PUBLISHER, OWNER and LANGUAGE -->
      <div class="row">
        <div class="col-sm-2">
          <label :for="`publisher`">{{ $t('doi.publisher') }}:</label>
        </div>

        <div class="col-sm-2 mb-2">
        </div>


        <div class="col-sm-2">
          <label :for="`copyright_agent`">{{ $t('doi.copyright_agent') }}:</label>
        </div>

        <div class="col-sm-2 mb-2">
          <b-form-input id="copyright_agent" v-model="doi.copyright_agent" type="text"></b-form-input>
        </div>


        <div class="col-sm-2">
          <label :for="`language`">{{ $t('doi.language') }}:</label>
        </div>

        <div class="col-sm-4 mb-2">
          <vue-multiselect v-model="doi.language"
                           id="language"
                           :options="autocomplete.languages"
                           track-by="id"
                           :label="commonLabel"
                           :placeholder="$t('add.inputs.autocomplete')"
                           :show-labels="false">
            <template slot="singleLabel" slot-scope="{ option }">
              <strong>{{ $i18n.locale=== 'ee' ? option.value : option.value_en }}</strong>
            </template>
            <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
          </vue-multiselect>
        </div>
      </div>

      <!-- VERSION, FORMATS and SIZES -->
      <div class="row">
        <div class="col-sm-2">
          <label :for="`version`">{{ $t('doi.version') }}:</label>
        </div>

        <div class="col-sm-2 mb-2">
          <b-form-input id="version" v-model="doi.version" type="text"></b-form-input>
        </div>


        <div class="col-sm-2">
          <label :for="`formats`">{{ $t('doi.formats') }}:</label>
        </div>

        <div class="col-sm-2 mb-2">
          <b-form-input id="formats" v-model="doi.formats" type="text"></b-form-input>
        </div>


        <div class="col-sm-2">
          <label :for="`sizes`">{{ $t('doi.sizes') }}:</label>
        </div>

        <div class="col-sm-2 mb-2">
          <b-form-input id="sizes" v-model="doi.sizes" type="text"></b-form-input>
        </div>
      </div>

      <!-- SUBJECTS -->
      <div class="row">
        <div class="col-sm-2">
          <label :for="`subjects`">{{ $t('doi.subjects') }}:</label>
        </div>

        <div class="col-sm-10 mb-2">
          <b-form-input id="subjects" v-model="doi.subjects" type="text"></b-form-input>
        </div>
      </div>

      <!-- ABSTRACT -->
      <div class="row">
        <div class="col-sm-2">
          <label :for="`abstract`">{{ $t('doi.abstract') }}:</label>
        </div>

        <div class="col-sm-10 mb-2">
          <b-form-textarea id="abstract" v-model="doi.abstract" type="text" :rows="1" :max-rows="20"></b-form-textarea>
        </div>
      </div>

      <!-- TODO: COPYRIGHT and LICENCE -->
      <div class="row">

      </div>

      <!-- METHODS -->
      <div class="row">
        <div class="col-sm-2">
          <label :for="`methods`">{{ $t('doi.methods') }}:</label>
        </div>

        <div class="col-sm-10 mb-2">
          <b-form-textarea id="methods" v-model="doi.methods" type="text" :rows="1" :max-rows="20"></b-form-textarea>
        </div>
      </div>
    </fieldset>

    <!-- TODO: PRIMARY REFERENCE -->
    <fieldset></fieldset>

    <!-- TODO: PRIMARY DATASET -->
    <fieldset></fieldset>

    <!-- REMARKS -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">
        {{ $t('doi.remarks') }}
        <font-awesome-icon icon="pen-fancy"/>
      </legend>

      <div class="row">
        <div class="col-sm-2">
          <label :for="`remarks`">{{ $t('doi.remarks') }}:</label>
        </div>

        <div class="col-sm-10 mb-2">
          <b-form-textarea id="remarks" v-model="doi.remarks" type="text" :rows="1" :max-rows="20"></b-form-textarea>
        </div>
      </div>
    </fieldset>

    <!-- TODO: DATACITE CREATED and UPDATED -->

    <!-- IS PRIVATE -->

  </div>
</template>

<script>
  export default {
    name: "Doi"
  }
</script>

<style scoped>
  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
