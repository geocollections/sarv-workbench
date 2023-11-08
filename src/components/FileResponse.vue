<template>
  <div class="file-response">
    <!--  Todo: Different files  -->
    <img :src="src" />
  </div>
</template>

<script>
import { fetchRawFile } from "@/assets/js/api/apiCalls";

export default {
  name: "TestFiles",
  data() {
    return {
      file: null,
      src: null,
    };
  },
  computed: {
    contentType() {
      return this.file?.headers?.["content-type"];
    },
  },
  async mounted() {
    this.file = await fetchRawFile({
      size: this.$route.params.size,
      uuid: this.$route.params.uuid,
      extension: this.$route.params.extension,
    });
    this.src = URL.createObjectURL(this.file.data);
  },
};
</script>

<style scoped></style>
