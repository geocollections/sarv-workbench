<template>
  <div class="file-preview" v-if="data">

    <!-- TODO: Maybe add if clause so that images are opened in 'large' format -->
    <a href="javascript:void(0)"
       v-if="data.uuid_filename && data.uuid_filename !== null"
       :title="getFileLink({filename: data.uuid_filename})"
       @click="openUrlInNewWindow({url: getFileLink({filename: data.uuid_filename})})">
      <img class="image-preview"
           v-if="data.uuid_filename.endsWith('jpg') || data.uuid_filename.endsWith('jpeg') || data.uuid_filename.endsWith('png')"
           :src="getFileLink({size: 'medium', filename: data.uuid_filename})" alt="NO IMAGE"/>
      <i v-else class="fas fa-file fa-3x"></i>

    </a>

    <i v-else class="fas fa-file fa-3x"></i>

  </div>
</template>

<script>
  export default {
    props: ['data'],
    name: "FilePreview",
    methods: {
      getFileLink(params) {
        if (params.size) {
          return 'https://files.geocollections.info/' + params.size
            + '/' + params.filename.substring(0,2)
            + '/' + params.filename.substring(2,4)
            + '/' + params.filename;
        } else {
          return 'https://files.geocollections.info/' + params.filename.substring(0,2)
            + '/' + params.filename.substring(2,4)
            + '/' + params.filename;
        }
      },

      openUrlInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        if (typeof (params.height) === 'undefined') {
          params.height = 750;
        }
        window.open(params.url, '', 'width=' + params.width + ',height=' + params.height);
      },
    }
  }
</script>

<style scoped>

</style>
