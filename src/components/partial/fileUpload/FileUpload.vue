<template>
  <div class="file-upload">
    <v-row no-gutters>
      <v-col cols="12">
        <label :for="`file-input`">test</label>
        <v-file-input id="file-input"></v-file-input>
      </v-col>
    </v-row>

    <v-card
      flat
      class="d-flex flex-lg-row flex-column"
      :class="appSettings.bodyColor"
    >
      <v-card flat class="ma-1">
        <v-btn
          class="text-none"
          :color="appSettings.bodyActiveColor"
          :dark="appSettings.bodyActiveColorDark"
        >
          <v-icon left small>fas fa-camera-retro</v-icon>
          {{ $t("add.inputs.photoInput") }}
        </v-btn>
      </v-card>

      <v-card flat class="ma-1">
        <v-btn
          class="text-none"
          :color="appSettings.bodyActiveColor"
          :dark="appSettings.bodyActiveColorDark"
        >
          <v-icon left small>fas fa-video</v-icon>
          {{ $t("add.inputs.videoInput") }}
        </v-btn>
      </v-card>

      <v-card flat class="ma-1">
        <v-btn
          class="text-none"
          :color="appSettings.bodyActiveColor"
          :dark="appSettings.bodyActiveColorDark"
        >
          <v-icon left small>fas fa-microphone</v-icon>
          {{ $t("add.inputs.audioInput") }}
        </v-btn>
      </v-card>

      <v-card flat class="ma-1">
        <v-btn
          class="text-none"
          color="amber"
          :dark="appSettings.bodyActiveColorDark"
          @click="useExisting = !useExisting"
        >
          <v-icon left small>fas fa-exchange-alt</v-icon>
          {{
            useExisting
              ? $t("add.inputs.newFile")
              : $t("add.inputs.existingFile")
          }}
        </v-btn>
      </v-card>

      <v-spacer></v-spacer>

      <v-card flat class="ma-1">
        <v-btn
          class="text-none"
          color="red"
          :dark="appSettings.bodyActiveColorDark"
        >
          <v-icon left small>far fa-trash-alt</v-icon>
          <!--          {{ arrayOfFiles.length > 1 ? $tc('add.buttons.resetFile', 2) : $tc('add.buttons.resetFile', 1) }}-->
          {{ $tc("add.buttons.resetFile", 2) }}
        </v-btn>
      </v-card>
    </v-card>
    <v-row no-gutters>
      <v-col cols="12"></v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "FileUpload",
  props: {
    isExistingToggleable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapState(["appSettings"])
  },
  data: () => ({
    useExisting: false
  })
};
</script>

<style scoped></style>
