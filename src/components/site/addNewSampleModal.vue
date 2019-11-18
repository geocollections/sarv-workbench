<template>
  <b-modal
    id="newSampleForm"
    header-bg-variant="dark"
    header-text-variant="light"
    centered
    size="xl"
    lazy
    scrollable
    ref="newSampleForm"
    :title="$t('header.samples')"
    @hide="hideModal"
  >
    <sample></sample>

    <template slot="modal-footer">
      <div class="col">
        <button
          class="btn btn-success mr-2 mb-2"
          :disabled="sendingData"
          @click="$root.$emit('add-new-sample-from-modal', 'SAVE_AND_LEAVE')"
        >
          <i class="fas fa-door-open"></i>
          {{ $t($route.meta.isEdit ? "edit.buttons.save" : "add.buttons.add") }}
        </button>
        <button
          class="btn btn-success mr-2 mb-2"
          :disabled="sendingData"
          @click="$root.$emit('add-new-sample-from-modal', 'SAVE')"
        >
          <i class="fas fa-save"></i>
          {{ $t("add.buttons.addAnother") }}</button
        ><!--$route.meta.isEdit? 'edit.buttons.saveAndContinue':-->
        <button
          class="btn btn-danger mr-2 mb-2"
          :disabled="sendingData"
          @click="hideModal"
        >
          <i class="fas fa-ban"></i>
          {{
            $t(
              $route.meta.isEdit
                ? "edit.buttons.cancelWithoutSaving"
                : "add.buttons.clearFields"
            )
          }}
        </button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import Sample from "../sample/Sample";

export default {
  name: "addNewSample",
  components: { Sample },
  props: {
    sendingData: {
      type: Boolean
    }
  },
  mounted() {
    this.$parent.$on("show-new-sample-modal", this.showModal);
    this.$root.$on("close-new-sample-modal", this.hideModal);
  },
  methods: {
    showModal() {
      this.$refs.newSampleForm.show();
    },
    hideModal() {
      // this.$root.$off('add-new-sample-from-modal')
      this.$root.$emit("reload-linked-samples");
      this.$refs.newSampleForm.hide();
    }
  }
};
</script>

<style scoped></style>
