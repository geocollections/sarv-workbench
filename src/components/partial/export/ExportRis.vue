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
  import {toastError, toastInfo} from "../../../assets/js/iziToast/iziToast";

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
        let filename = 'reference_' + this.id + '.ris';
        let risString = this.convertJsonToRis(this.data);

        if (risString.length === 0) {
          toastError({ text: 'Download failed: Not enough data!' });
          return
        }

        let file = new Blob([risString], {type: 'text/plain'});

        if (window.navigator.msSaveOrOpenBlob) // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
          let a = document.createElement("a");
          let url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }

        toastInfo({ text: 'Successfully downloaded reference_' + this.id + '.ris' })
      },

      convertJsonToRis(jsonObject) {
        let risString = '';

        if (jsonObject) {
          // If type is missing then return immediately
          if (jsonObject.type && jsonObject.type.ris_type) risString += 'TY  - ' + jsonObject.type.ris_type + '\n';
          else return '';

          if (jsonObject.title) risString += 'TI  - ' + jsonObject.title + '\n';
          if (jsonObject.author) {
            if (jsonObject.author.includes('.,')) { // Multiple authors
              jsonObject.author.split('.,').forEach(author => {
                if (author.charAt(author.length - 1) === '.') risString += 'AU  - ' + author.trim() + '\n';
                else risString += 'AU  - ' + author.trim() + '.\n'
              });
            } else risString += 'AU  - ' + jsonObject.author.trim() + '\n'
          }
          if (jsonObject.year) risString += 'PY  - ' + jsonObject.year + '\n';
          if (jsonObject.journal && jsonObject.journal.journal_name) {
            risString += 'T2  - ' + jsonObject.journal.journal_name + '\n';
            risString += 'JO  - ' + jsonObject.journal.journal_name + '\n';
          }
          if (jsonObject.volume) risString += 'VL  - ' + jsonObject.volume + '\n';
          if (jsonObject.number) risString += 'IS  - ' + jsonObject.number + '\n';
          if (jsonObject.pages) {
            if (jsonObject.pages.includes('-')) {
              let startAndEndPage = jsonObject.pages.split('-');
              if (startAndEndPage[0]) risString += 'SP  - ' + startAndEndPage[0] + '\n';
              if (startAndEndPage[1]) risString += 'EP  - ' + startAndEndPage[1] + '\n';
            }
          }
          if (jsonObject.language && jsonObject.language.iso1) risString += 'LA  - ' + jsonObject.language.iso1 + '\n';
          if (jsonObject.doi) risString += 'DO  - ' + jsonObject.doi + '\n';
          if (jsonObject.url) risString += 'UR  - ' + jsonObject.url + '\n';
          if (jsonObject.author_keywords) {
            if (jsonObject.author_keywords.includes(',')) jsonObject.author_keywords.split(',').forEach(keyword => risString += 'KW  - ' + keyword.trim() + '\n');
            else risString += 'KW  - ' + jsonObject.author_keywords + '\n'
          }
          if (jsonObject.abstract) risString += 'AB  - ' + jsonObject.abstract + '\n';
          risString += 'ER  - ';
        }

        return risString
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
