<template>
  <div>
    <vs-button class="ml-2 my-1 hidden-sm"
               size="small"
               color="warning"
               type="filled"
               @click="downloadRIS"
               icon-after
               icon="fa-file-download"
               icon-pack="fas"
               :title="$t('buttons.downloadRIS')">{{ $t('buttons.downloadRIS') }}</vs-button>

    <vs-button class="ml-2 mb-2 d-sm-none"
               radius
               color="warning"
               type="filled"
               @click="downloadRIS"
               icon="fa-file-download"
               icon-pack="fas"
               :title="$t('buttons.downloadRIS')"></vs-button>
  </div>
</template>

<script>
  import {toastInfo} from "../../../assets/js/iziToast/iziToast";

  export default {
    name: "ExportRis",
    props: {
      id: {
        type: String,
        required: true
      },
      data: {
        type: Object,
      },
    },
    methods: {
      downloadRIS() {
        console.log('TODO: Download .ris file');
        toastInfo({ text: 'Successfully downloaded reference_' + this.id + '.ris' })
      }
    }
  }
</script>

<style scoped>
  @media (max-width: 575.98px) {
    .hidden-sm {
      display: none;
    }
  }
</style>
