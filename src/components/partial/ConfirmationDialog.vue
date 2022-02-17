<template>
  <div class="confirmation-dialog">
    <v-toolbar style="display: none">
      <v-dialog
        :value="dialog"
        max-width="500px"
        style="z-index: 50000"
        persistent
      >
        <v-card :color="bodyColor.split('n-')[0] + 'n-5'">
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
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: "ConfirmationDialog",

  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
  },
};
</script>
