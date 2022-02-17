<template>
  <v-dialog
    :value="dialog"
    max-width="320"
    style="z-index: 50000"
    @click:outside="$emit('cancel')"
    @keydown="$emit('cancel')"
  >
    <v-card>
      <v-card-title class="headline">{{ $t("messages.delete") }}</v-card-title>
      <v-card-text>{{ $t("messages.confirm_deleting") }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          small
          class="white--text"
          @click="$emit('cancel')"
          >{{ $t("buttons.cancel") }}</v-btn
        >
        <v-btn
          small
          color="red darken-1"
          @click="$emit('delete')"
          class="white--text"
        >
          <v-icon left small>fas fa-exclamation-triangle</v-icon
          >{{ $t("buttons.delete") }}
          <v-icon right small>fas fa-exclamation-triangle</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "RelatedDataDeleteDialog",
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
};
</script>
