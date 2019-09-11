<template>
  <div class="row mt-3 mb-3">
    <div class="col">
      <button class="btn btn-success mr-2 mb-2" :disabled="sendingData"
              @click="$emit('button-clicked', 'SAVE_AND_LEAVE', object, isRelationSavedSeparately)"
              :title="$t('edit.buttons.saveAndLeave') ">
        <i class="fas fa-door-open"></i>
        {{ $t('edit.buttons.saveAndLeave') }}
      </button>
      <button class="btn btn-success mr-2 mb-2 pr-5 pl-5" :disabled="sendingData"
              @click="$emit('button-clicked', 'SAVE', object, isRelationSavedSeparately)"
              :title="$t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') ">
        <i class="fas fa-save"></i>
        {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}
        <!--{{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}-->
      </button>
      <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData"
              @click="$emit('button-clicked', 'CANCEL', object)"
              :title="$t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') ">
        <i class="fas fa-ban"></i>
        {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SaveButtons",
    props: {
      object: {
        type: String,
        default: null
      },
      sendingData: {
        type: Boolean,
        default: false
      },
      isRelationSavedSeparately: {
        type: Boolean,
        default: false
      },
    },
  }
</script>

<style scoped>

</style>
