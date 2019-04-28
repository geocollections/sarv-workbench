<template>
  <div class="row">
    <!-- HEIGHT -->
    <div class="col-sm-3 mb-2">
      <div class="row">
        <div class="col lbl-right">
          <label :for="`table-col-height`">{{ $t('references.alternativeTableHeight') }} (rem):</label>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <b-form-input id="table-col-height" v-model="alternativeTableControls.height" type="number"/>
        </div>
      </div>
    </div>

    <!-- WIDTH -->
    <div class="col-sm-3 mb-2">
      <div class="row">
        <div class="col lbl-right">
          <label :for="`table-col-width`">{{ $t('references.alternativeTableWidth') }} (rem):</label>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <b-form-input id="table-col-width" v-model="alternativeTableControls.width" type="number"/>
        </div>
      </div>
    </div>

    <!-- SIZE -->
    <div class="col-sm-3 mb-2">
      <div class="row">
        <div class="col lbl-right">
          <label :for="`table-font-size`">{{ $t('references.alternativeTableSize') }} (px):</label>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <b-form-input id="table-font-size" v-model="alternativeTableControls.size" type="number"/>
        </div>
      </div>
    </div>

    <!-- RESET -->
    <div class="col-sm-3 mb-2">
      <div class="row">
        <div class="col">
          <b-button variant="danger" @click="resetControls">{{ $t('references.alternativeTableResetButton') }}</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AlternativeTableControls",
    props: {
      alternativeTableControls: {
        type: Object
      }
    },

    watch: {
      'controls': {
        handler: function (newVal, oldVal) {
          this.$emit('controls-changed', newVal)
        },
        deep: true
      }
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
