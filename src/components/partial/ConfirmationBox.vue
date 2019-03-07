<template>
  <div class="confirmation-box">


    <!-- Add these props if ready
             no-close-on-esc
             no-close-on-backdrop
             hide-header-close
    -->
    <b-modal id="confirmation"
             centered
             :title="$t(title)">
      <p class="my-4">{{ this.$t('confirmation.question') }}</p>

      <template slot="modal-footer">
        <b-button variant="danger">{{ this.$t('confirmation.leave') }}</b-button>
        <b-button variant="success">{{ this.$t('confirmation.continue') }}</b-button>
        <b-button variant="success">{{ this.$t('confirmation.save') }}</b-button>
      </template>

    </b-modal>

  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: null
      },
    },
    name: "ConfirmationBox"
  }
</script>

<style scoped>

</style>
