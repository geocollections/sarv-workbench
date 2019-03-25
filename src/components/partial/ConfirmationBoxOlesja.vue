<template>
  <div class="confirmation-box">

    <b-modal id="confirmation"
             header-bg-variant="dark"
             header-text-variant="light"
             centered
             lazy
             scrollable
             ref="confirmation"
             :title="titleExtra ? titleExtra : $t(title)">
      <p class="my-2 h5">{{ this.$t(customQuestion ? customQuestion : 'confirmation.question') }}</p>

      <template slot="modal-footer">
        <b-button variant="outline-danger" @click="$root.$emit('user-choice', 'LEAVE')">{{ this.$t('confirmation.leave') }}</b-button>
        <b-button variant="outline-success" @click="$root.$emit('user-choice', 'CONTINUE')">{{ this.$t('confirmation.continue') }}</b-button>
        <b-button variant="outline-success" @click="$root.$emit('user-choice', 'SAVE')">{{ this.$t('confirmation.save') }}</b-button>
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
      titleExtra: {
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

<style scoped>

</style>
