<template>
  <div class="attachment-wrapper">
    <slot name="loader"></slot>

    <slot name="locked-info" v-if="$route.meta.isEdit && isLocked"></slot>

    <slot name="file-input" v-if="!$route.meta.isEdit"></slot>

    <slot name="file-output" v-if="$route.meta.isEdit"></slot>

    <slot name="photo-archive" v-if="isPhotoArchive">
      <slot name="map"></slot>
    </slot>

    <slot name="specimen-image" v-if="isSpecimenImage"></slot>

    <slot name="other-file" v-if="isOtherFile">
      <slot name="map"></slot>
    </slot>

    <slot name="digitised-reference" v-if="isDigitisedReference"></slot>

    <slot name="change-type" v-if="$route.meta.isEdit"></slot>

    <slot name="checkbox"></slot>

    <slot name="local-storage" v-if="!$route.meta.isEdit"></slot>
  </div>
</template>

<script>
  export default {
    name: "AttachmentWrapper",
    props: {
      isPhotoArchive: {
        type: Boolean,
      },
      isSpecimenImage: {
        type: Boolean,
      },
      isOtherFile: {
        type: Boolean,
      },
      isDigitisedReference: {
        type: Boolean,
      },
      isLocked: {
        type: Boolean,
      },
    }
  }
</script>

<style scoped>

</style>
