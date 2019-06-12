<template>
  <div class="confirm-page-close">

    <b-modal id="confirm-page-close"
             header-bg-variant="dark"
             header-text-variant="light"
             centered
             lazy
             scrollable
             :title="title">
      <p class="my-2 h5">{{ $t('confirmation.question') }}</p>

      <template slot="modal-footer">
        <b-button variant="outline-success" @click="$bvModal.hide('confirm-page-close')">
          <i class="far fa-edit"></i>
          {{ this.$t('confirmation.continue') }}
        </b-button>

        <b-button variant="outline-success" @click="$bvModal.hide('confirm-page-close')">
          <i class="far fa-save"></i>
          {{ this.$t('confirmation.save') }}
        </b-button>

        <b-button variant="outline-danger" @click="$bvModal.hide('confirm-page-close')">
          <i class="fas fa-ban"></i>
          {{ this.$t('confirmation.leave') }}
        </b-button>
      </template>

    </b-modal>

  </div>
</template>

<script>
  export default {
    name: "ConfirmPageClose",
    props: {
      title: {
        type: String,
        default: null
      },
    },
  }
</script>

<style>
  #confirm-page-close___BV_modal_outer_ {
    z-index: 40000 !important; /* Overlays everything, because sidebar is ar 39999 */
  }
</style>
