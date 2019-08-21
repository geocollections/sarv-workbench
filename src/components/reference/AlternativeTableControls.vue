<template>
  <div class="row">
    <!-- HEIGHT -->
    <div class="col-sm-3 mb-2">
      <div class="row">
        <div class="col lbl-right">
          <label :for="`table-col-height`">
            {{ $t('references.alternativeTableHeight') }}:
            <strong>{{ alternativeTableControls.height }}</strong>
            rem
          </label>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <b-form-input id="table-col-height" v-model="alternativeTableControls.height" type="range" :min="0" :max="50" step="0.2"/>
        </div>
      </div>
    </div>

    <!-- WIDTH -->
    <div class="col-sm-3 mb-2">
      <div class="row">
        <div class="col lbl-right">
          <label :for="`table-col-width`">
            {{ $t('references.alternativeTableWidth') }}:
            <strong>{{ alternativeTableControls.width }}</strong>
            rem
          </label>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <b-form-input id="table-col-width" v-model="alternativeTableControls.width" type="range" :min="0" :max="50" step="0.2"/>
        </div>
      </div>
    </div>

    <!-- SIZE -->
    <div class="col-sm-3 mb-2">
      <div class="row">
        <div class="col lbl-right">
          <label :for="`table-font-size`">
            {{ $t('references.alternativeTableSize') }}:
            <strong>{{ alternativeTableControls.size }}</strong>
            px
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <b-form-input id="table-font-size" v-model="alternativeTableControls.size" type="range" :min="0" :max="50" step="0.5"/>
        </div>
      </div>
    </div>

    <!-- RESET -->
    <div class="col-sm-3 mb-2">
      <div class="row">
        <div class="col">
          <b-button variant="danger" @click="resetControls">
            <font-awesome-icon icon="undo" />
            {{ $t('references.alternativeTableResetButton') }}
          </b-button>
        </div>
      </div>
    </div>

    <div class="col-sm-12">
      <label :for="`field-control`">Fields:</label>
      <vue-multiselect v-model="alternativeTableControls.fields"
                       id="field-control"
                       :multiple="true"
                       :options="columns"
                       :preserve-search="true"
                       :close-on-select="false"
                       :clear-on-select="false"
                       :show-labels="false">
      </vue-multiselect>
    </div>
  </div>
</template>

<script>
  import fontAwesomeLib from "../../mixins/fontAwasomeLib";
  import VueMultiselect from 'vue-multiselect'

  export default {
    name: "AlternativeTableControls",
    components: {
      VueMultiselect,
    },
    props: {
      alternativeTableControls: {
        type: Object
      },
      columns: {
        type: Array
      }
    },
    mixins: [fontAwesomeLib],

    created() {
      this.alternativeTableControls.fields = this.columns
    },

    methods: {
      resetControls() {
        this.$emit('set-default-controls', true)
      },
    }
  }
</script>

<style scoped>

</style>
