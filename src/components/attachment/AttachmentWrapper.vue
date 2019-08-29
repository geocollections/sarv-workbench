<template>
  <div class="attachment-wrapper">
    <slot name="loader"></slot>
    <slot name="file-input" v-if="!$route.meta.isEdit"></slot>
    <slot name="photo_archive" v-if="isPhotoArchive"></slot>
    <slot name="specimen_image" v-if="isSpecimenImage"></slot>
    <slot name="other_file" v-if="isOtherFile"></slot>
    <slot name="digitised_reference" v-if="isDigitisedReference"></slot>
    <slot name="checkbox"></slot>
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
    }
  }
</script>

<style scoped>

</style>
