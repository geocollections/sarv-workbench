<template>
  <div class="file-information" v-if="data">
    <!-- LINK -->
    <div v-if="!data.is_private">
      <div>
        <!-- REFERENCE -->
        <a
          v-if="reference"
          class="no-underline external-link"
          :href="'https://kirjandus.geoloogia.info/reference/' + data.id"
          target="ReferenceWindow"
        >
          <b>{{ $t("edit.referenceLink") }}</b> &nbsp;<i
            class="fas fa-file"
          ></i>
        </a>

        <!-- FILE -->
        <a
          v-else
          class="no-underline external-link"
          :href="'https://geocollections.info/file/' + data.id"
          target="GeocollectionsWindow"
        >
          <b>{{ $t("edit.link") }}</b>
        </a>
      </div>
    </div>

    <!-- IMAGE NUMBER -->
    <div v-if="data.image_number != null">
      {{ $t("edit.imageNumber") }}: <b>{{ data.image_number }}</b>
    </div>

    <!-- FILENAME -->
    <div v-if="data.filename != null">
      {{ $t("edit.filename") }}: <b>{{ data.filename }}</b>
    </div>

    <!-- FILE SIZE -->
    <div v-if="data.size_mb != null">
      {{ $t("edit.size_mb") }}:
      <span v-if="data.size_mb < 0.1">
        <b>{{ $t("edit.size_mb_under") }} 0.1</b>
      </span>
      <b v-else>{{ data.size_mb }}</b>
      MB
    </div>

    <!-- ORIGINAL FILENAME -->
    <div v-if="data.original_filename != null">
      {{ $t("edit.original_filename") }}:
      <b>{{ data.original_filename }}</b>
    </div>

    <!-- ATTACHMENT FORMAT VALUE -->
    <div v-if="data.attachment_format__value != null">
      {{ $t("edit.attachment_format_value") }}:
      <b>{{ data.attachment_format__value }}</b>
    </div>

    <!-- IMAGE WIDTH -->
    <div v-if="data.image_width != null">
      {{ $t("edit.image_width") }}: <b>{{ data.image_width }}</b>
    </div>

    <!-- IMAGE HEIGHT -->
    <div v-if="data.image_height != null">
      {{ $t("edit.image_height") }}: <b>{{ data.image_height }}</b>
    </div>

    <!-- DATE ADDED -->
    <div v-if="data.date_added != null">
      {{ $t("edit.date_added") }}:
      <b>{{ new Date(data.date_added).toLocaleDateString() }}</b>
    </div>

    <!-- USER ADDED -->
    <div v-if="data.user_added != null">
      {{ $t("edit.user_added") }}: <b>{{ data.user_added }}</b>
    </div>

    <!-- DATE CHANGED -->
    <div v-if="data.date_changed != null">
      {{ $t("edit.date_changed") }}:
      <b>{{ new Date(data.date_changed).toLocaleDateString() }}</b>
    </div>

    <!-- USER CHANGED -->
    <div v-if="data.user_changed != null">
      {{ $t("edit.user_changed") }}: <b>{{ data.user_changed }}</b>
    </div>
  </div>
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

.file-information > div {
  padding: 12px 12px 0;
}
</style>
