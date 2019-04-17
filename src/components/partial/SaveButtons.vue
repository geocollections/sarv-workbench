<template>
  <div class="row mt-3 mb-3">
    <div class="col">
      <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="$emit('button-clicked', 'SAVE_AND_LEAVE', object, isRelationSavedSeparately)" :title="$t('edit.buttons.saveAndLeave') ">
        <font-awesome-icon icon="door-open"/>
        {{ $t('edit.buttons.saveAndLeave') }}</button>
      <button class="btn btn-success mr-2 mb-2 pr-5 pl-5" :disabled="sendingData" @click="$emit('button-clicked', 'SAVE', object, isRelationSavedSeparately)" :title="$t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') " >
        <font-awesome-icon icon="save"/>
        {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}
        <!--{{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}-->
      </button>
      <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="$emit('button-clicked', 'CANCEL', object)"  :title="$t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') ">
        <font-awesome-icon icon="ban"/>
        {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}</button>
    </div>
  </div>
</template>

<script>
  import fontAwasomeLib  from './../mixins/fontAwasomeLib'
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
      mixins: [fontAwasomeLib],
    }
</script>

<style scoped>

</style>
