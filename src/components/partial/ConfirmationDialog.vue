<template>
  <div class="confirmation-dialog">
    <v-dialog
      :value="dialog"
      max-width="500px"
      style="z-index: 50000"
      persistent
    >
      <v-card>
        <v-card-title
          class="title text-center"
          :class="bodyColor.split('n-')[0] + 'n-5'"
          style="word-break: break-word"
        >
          {{ $t("messages.confirmation") }}
        </v-card-title>

        <v-card-actions class="justify-center justify-space-around flex-wrap">
          <v-btn
            color="red"
            text
            @click.native="$emit('action:dialog', 'close')"
          >
            {{ $t("messages.confirmationClose") }}
          </v-btn>
          <v-btn
            color="blue"
            text
            @click.native="$emit('action:dialog', 'continue')"
          >
            {{ $t("messages.confirmationCont") }}
          </v-btn>
          <v-btn
            color="green"
            text
            @click.native="$emit('action:dialog', 'save')"
          >
            {{ $t("messages.confirmationSave") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ConfirmationDialog",

  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    }
  }
};
</script>

<style>
.v-overlay--active {
  z-index: 60001 !important;
}

.v-dialog__content--active {
  z-index: 60002 !important;
}
</style>
