<template>
  <v-row class="file-information" v-if="data">
    <v-col cols="12">
      <!-- LINK -->
      <v-row
        class="mt-0"
        v-if="(reference && !data.is_private) || !data.is_private"
      >
        <v-col cols="12" sm="12">
          <!-- REFERENCE -->
          <a
            v-if="reference && !data.is_private"
            class="no-underline external-link"
            :href="'http://kirjandus.geoloogia.info/reference/' + this.data.id"
            target="ReferenceWindow"
          >
            <b>{{ $t("edit.referenceLink") }}</b> &nbsp;<i
              class="fas fa-file"
            ></i>
          </a>

          <!-- FILE -->
          <a
            v-else-if="!data.is_private"
            class="no-underline external-link"
            :href="'http://geocollections.info/file/' + this.data.id"
            target="GeocollectionsWindow"
          >
            <b>{{ $t("edit.link") }}</b>
          </a>
        </v-col>
      </v-row>

      <!-- IMAGE NUMBER -->
      <v-row
        class="mt-0"
        v-if="data.image_number && data.image_number !== null"
      >
        <v-col cols="12">
          {{ $t("edit.imageNumber") }}: <b>{{ data.image_number }}</b>
        </v-col>
      </v-row>

      <!-- FILENAME -->
      <v-row class="mt-0" v-if="data.filename && data.filename !== null">
        <v-col cols="12">
          {{ $t("edit.filename") }}: <b>{{ data.filename }}</b>
        </v-col>
      </v-row>

      <!-- FILE SIZE -->
      <v-row
        class="mt-0"
        v-if="typeof data.size_mb !== 'undefined' && data.size_mb !== null"
      >
        <v-col cols="12">
          {{ $t("edit.size_mb") }}:
          <span v-if="data.size_mb < 0.1">
            <b>{{ $t("edit.size_mb_under") }} 0.1</b>
          </span>
          <b v-else>{{ data.size_mb }}</b>
          MB
        </v-col>
      </v-row>

      <!-- ORIGINAL FILENAME -->
      <v-row
        class="mt-0"
        v-if="data.original_filename && data.original_filename !== null"
      >
        <v-col cols="12">
          {{ $t("edit.original_filename") }}:
          <b>{{ data.original_filename }}</b>
        </v-col>
      </v-row>

      <!-- ATTACHMENT FORMAT VALUE -->
      <v-row
        class="mt-0"
        v-if="
          data.attachment_format__value &&
          data.attachment_format__value !== null
        "
      >
        <v-col cols="12">
          {{ $t("edit.attachment_format_value") }}:
          <b>{{ data.attachment_format__value }}</b>
        </v-col>
      </v-row>

      <!-- IMAGE WIDTH -->
      <v-row class="mt-0" v-if="data.image_width && data.image_width !== null">
        <v-col cols="12">
          {{ $t("edit.image_width") }}: <b>{{ data.image_width }}</b>
        </v-col>
      </v-row>

      <!-- IMAGE HEIGHT -->
      <v-row
        class="mt-0"
        v-if="data.image_height && data.image_height !== null"
      >
        <v-col cols="12">
          {{ $t("edit.image_height") }}: <b>{{ data.image_height }}</b>
        </v-col>
      </v-row>

      <!-- DATE ADDED -->
      <v-row class="mt-0" v-if="data.date_added && data.date_added !== null">
        <v-col cols="12">
          {{ $t("edit.date_added") }}:
          <b>{{ new Date(data.date_added).toLocaleDateString() }}</b>
        </v-col>
      </v-row>

      <!-- USER ADDED -->
      <v-row class="mt-0" v-if="data.user_added && data.user_added !== null">
        <v-col cols="12">
          {{ $t("edit.user_added") }}: <b>{{ data.user_added }}</b>
        </v-col>
      </v-row>

      <!-- DATE CHANGED -->
      <v-row
        class="mt-0"
        v-if="data.date_changed && data.date_changed !== null"
      >
        <v-col cols="12">
          {{ $t("edit.date_changed") }}:
          <b>{{ new Date(data.date_changed).toLocaleDateString() }}</b>
        </v-col>
      </v-row>

      <!-- USER CHANGED -->
      <v-row
        class="mt-0"
        v-if="
          data.user_changed && data.user_changed !== null && data.user_changed
        "
      >
        <v-col cols="12">
          {{ $t("edit.user_changed") }}: <b>{{ data.user_changed }}</b>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["data", "reference"],
  name: "FileInformation",
};
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}

.external-link:hover {
  opacity: 0.7;
}
</style>
