<template>
  <div class="confirmation-box">

    <b-modal id="confirmation"
             no-close-on-esc
             no-close-on-backdrop
             hide-header-close
             header-bg-variant="dark"
             header-text-variant="light"
             centered
             lazy
             ref="confirmation"
             :title="titleExtra ? titleExtra : $t(title)">
      <p class="my-2 h5">{{ this.$t('confirmation.question') }}</p>

      <template slot="modal-footer">
        <b-button variant="outline-danger" @click="buttonPressed('LEAVE')">{{ this.$t('confirmation.leave') }}</b-button>
        <b-button variant="outline-success" @click="buttonPressed('CONTINUE')">{{ this.$t('confirmation.continue') }}</b-button>
        <b-button variant="outline-success" @click="buttonPressed('SAVE')">{{ this.$t('confirmation.save') }}</b-button>
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
      table: {
        type: String,
        default: 'attachment'
      }
    },
    name: "ConfirmationBox",
    methods: {
      buttonPressed(value) {
        // TODO: Somehow this does not run before router push
        this.$refs.confirmation.hide()

        if (value === 'LEAVE') {
          this.$router.push({ path: '/' + this.table })
        }

        if (value === 'CONTINUE') {
          // DO NOTHING
        }

        if (value === 'SAVE') {
          this.$emit('save')
        }
      },

    }
  }
</script>

<style scoped>

</style>
