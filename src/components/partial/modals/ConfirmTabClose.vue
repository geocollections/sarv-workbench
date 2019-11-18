<template>
  <div class="confirmation-tab">
    <b-modal
      id="confirm-tab-close"
      header-bg-variant="dark"
      header-text-variant="light"
      centered
      lazy
      scrollable
      :title="title"
    >
      <p class="my-2 h5">{{ $t("confirmation.relatedDataQuestion") }}</p>

      <template slot="modal-footer">
        <b-button
          variant="outline-success"
          @click="$bvModal.hide('confirm-tab-close')"
        >
          <i class="far fa-edit"></i>
          {{ this.$t("confirmation.continue") }}
        </b-button>

        <b-button
          variant="outline-success"
          @click="$root.$emit('user-choice', 'SAVE')"
        >
          <i class="far fa-save"></i>
          {{ this.$t("confirmation.saveTab") }}
        </b-button>

        <b-button
          variant="outline-danger"
          @click="$root.$emit('user-choice', 'LEAVE')"
        >
          <i class="fas fa-ban"></i>
          {{ this.$t("confirmation.leave") }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "ConfirmTabClose",
  props: {
    title: {
      type: String,
      default: null
    }
  }
};
</script>

<style>
#confirm-tab-close___BV_modal_outer_ {
  z-index: 40000 !important; /* Overlays everything, because sidebar is ar 39999 */
}
</style>
