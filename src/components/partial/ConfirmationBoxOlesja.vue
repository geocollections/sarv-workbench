<template>
  <div class="confirmation-box">

    <b-modal id="confirmation"
             header-bg-variant="dark"
             header-text-variant="light"
             centered
             lazy
             scrollable
             ref="confirmation"
             :title="title">
      <p class="my-2 h5">{{ this.$t(customQuestion ? customQuestion : 'confirmation.question') }}</p>

      <template slot="modal-footer">
        <b-button variant="outline-success" @click="$root.$emit('user-choice', 'CONTINUE')">
          <i class="far fa-edit"></i>
          {{ this.$t('confirmation.continue') }}
        </b-button>

        <b-button variant="outline-success" @click="$root.$emit('user-choice', 'SAVE')">
          <i class="far fa-save"></i>
          {{ this.$t('confirmation.save') }}
        </b-button>

        <b-button variant="outline-danger" @click="$root.$emit('user-choice', 'LEAVE')">
          <i class="fas fa-ban"></i>
          {{ this.$t('confirmation.leave') }}
        </b-button>
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
      customQuestion: {
        type: String,
        default: null
      },
      table: {
        type: String,
        default: 'attachment'
      }
    },
    name: "ConfirmationBox",
    data() {
      return {
        show: true
      }
    },
    mounted(){
      this.$root.$on('show-confirmation', this.showModal);
      this.$root.$on('close-confirmation', this.hideModal);
    },
    methods: {
      showModal(){
        this.$refs.confirmation.show();
      },
      hideModal(){
        this.$refs.confirmation.hide()
      }
    }
  }
</script>

<style>
  #confirmation___BV_modal_outer_ {
    z-index: 40000 !important; /* Overlays everything, because sidebar is ar 39999 */
  }

</style>
