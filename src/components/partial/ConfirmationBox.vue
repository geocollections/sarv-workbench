<template>
  <div class="confirmation-box">

    <b-modal id="confirmation"
             header-bg-variant="dark"
             header-text-variant="light"
             v-model="show"
             centered
             lazy
             scrollable
             ref="confirmation"
             :title="titleExtra ? titleExtra : $t(title)">
      <p class="my-2 h5">{{ this.$t('confirmation.question') }}</p>

      <template slot="modal-footer">
        <b-button variant="outline-danger" v-on:click="$emit('user-choice', 'LEAVE')">{{ this.$t('confirmation.leave') }}</b-button>
        <b-button variant="outline-success" v-on:click="$emit('user-choice', 'CONTINUE')">{{ this.$t('confirmation.continue') }}</b-button>
        <b-button variant="outline-success" v-on:click="$emit('user-choice', 'SAVE')">{{ this.$t('confirmation.save') }}</b-button>
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
    data() {
      return {
        show: true
      }
    }
  }
</script>

<style scoped>

</style>
