<template>
  <button class="btn btn-primary"
          :disabled="sendingData"
          @click="addNewDoi()">
    <i class="far fa-plus-square"></i>
    {{ $t('edit.buttons.saveNewDoi') }}
  </button>
</template>

<script>
  import {fetchAddAttachmentLink, fetchAddDoi} from "../../assets/js/api/apiCalls";
  import {toastError, toastInfo, toastSuccess} from "../../assets/js/iziToast/iziToast";

  export default {
    props: {
      data: {
        type: Object,
        required: true
      },
      formData: {
        type: Object,
        required: true
      },
      object: {
        type: String,
        default: 'reference',
        required: true
      },
    },
    name: "NewDoiButton",
    data() {
      return {
        sendingData: false
      }
    },
    methods: {
      async addNewDoi() {
        if (confirm(this.$t(this.object + '.doiConfirmation'))) {
          this.sendingData = true;

          let doi = {};
          // Todo: Use formData prop!
          if (this.object === 'reference') {
            doi = {
              creators: this.data.author,
              publication_year: this.data.year,
              title: this.data.title,
              title_alternative: this.data.title_original,
              language: this.data.language.id,
              publisher: this.data.publisher,
              abstract: this.data.abstract,
              reference: this.data.id,
              subjects: this.data.author_keywords + this.data.tags,
              resource_type: 12,
              version: 1.0,
              formats: 'pdf',
            };
          } else if (this.object === 'attachment') {
            doi = {
              creators: this.data.author_free,
              publication_year: new Date().getFullYear(),
              title: this.data.title_en,
              title_alternative: this.data.title,
              publisher: 'SARV: Geoscience Data Platform',
              abstract: this.data.description_en,
              subjects: this.data.tags,
              resource_type: 14,
              version: 1.0,
              formats: this.data.attachment_format__value,
              is_private: this.data.is_private,
              licence: this.data.licence,
              copyright_agent: this.data.copyright_agent,
              // sizes: this.data.size_mb, Todo: Attachment table size field?
            };
          }

          let doiFormData = new FormData();
          doiFormData.append('data', JSON.stringify(doi));

          let response = await fetchAddDoi(doiFormData).then(response => response, error => toastError({text: 'DOI upload failed!'}))

          console.log(response)

          if (typeof response !== 'undefined') {

            this.addRelatedAttachmentLink(response.body.id, this.data.id)

            this.$router.push({path: '/doi/' + response.body.id})
          }

          this.sendingData = false;

        } else toastInfo({text: this.$t('messages.userCancelled')})
      },

      addRelatedAttachmentLink(doiId, attachmentId) {
        let attachmentLinkFormData = new FormData();
        attachmentLinkFormData.append('data', JSON.stringify({ doi: doiId, attachment: attachmentId }));

        fetchAddAttachmentLink(attachmentLinkFormData)
          .then(
            response => this.toastResponseMessages(response),
            errResponse => toastError({text: 'Attachment Link upload failed!'})
          );
      },

      toastResponseMessages(response) {
        if (typeof response.body.message !== 'undefined') toastSuccess({text: response.body.message});
        if (typeof response.body.error !== 'undefined') toastError({text: response.body.error});
      }
    }
  }
</script>

<style scoped>

</style>
