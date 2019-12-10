<template>
  <div class="test">
    <file-upload
      show-existing
      :record-options="true"
      :record-image="true"
      :record-video="true"
      :record-audio="true"
      accept-multiple
    />
  </div>
</template>

<script>
import FileUpload from "../fileUpload/FileUpload";
export default {
  name: "Test",
  components: {FileUpload}
};
</script>

<style scoped></style>
