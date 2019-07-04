<template>
  <button class="btn btn-primary"
          :disabled="sendingData"
          @click="addNewDoi()">
    <i class="far fa-plus-square"></i>
    {{ $t('edit.buttons.saveNewDoi') }}
  </button>
</template>

<script>
  import {fetchAddAttachmentLink, fetchAddDoi, fetchAddDoiAgent} from "../../assets/js/api/apiCalls";
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

          let doi = this.buildDoiObject(this.object);

          let doiFormData = new FormData();
          doiFormData.append('data', JSON.stringify(doi));

          let response = await fetchAddDoi(doiFormData).then(response => response, error => toastError({text: 'DOI upload failed!'}))

          if (response) {

            this.addRelatedAttachmentLink(response.body.id, this.data.id)
            this.addRelatedDoiAgent(response.body.id, this.formData)

            this.$router.push({path: '/doi/' + response.body.id})
          }

          this.sendingData = false;

        } else toastInfo({text: this.$t('messages.userCancelled')})
      },

      buildDoiObject(object) {
        if (object === 'reference') {
          return {
            creators: this.formData.author,
            publication_year: this.formData.year,
            title: this.formData.title,
            title_alternative: this.formData.title_original,
            language: this.formData.language ? this.formData.language.id : null,
            publisher: this.formData.publisher,
            abstract: this.formData.abstract,
            reference: this.formData.id,
            subjects: this.formData.author_keywords + this.formData.tags,
            resource_type: 12,
            version: 1.0,
            formats: 'pdf',
          }
        } else if (object === 'photoArchive') {
          return {}
        }
         else if (object === 'specimenImage') {
           return {}
        }
         else if (object === 'otherFiles') {
          return {
            creators: this.formData.author_free,
            publication_year: new Date().getFullYear(),
            title: this.data.title_en,
            title_alternative: this.data.title,
            publisher: 'SARV: Geoscience Data Platform',
            abstract: this.formData.description_en,
            subjects: this.formData.tags ? this.formData.tags.map(word => word['name']).join('|') : null,
            resource_type: 14,
            version: 1.0,
            formats: this.data.attachment_format__value,
            is_private: this.formData.is_private,
            licence: this.formData.licence ? this.formData.licence.id : null,
            copyright_agent: this.formData.copyright_agent ? this.formData.copyright_agent.id : null,
            // sizes: this.data.size_mb, Todo: Attachment table size field?
          }
        } else if (object === 'digitisedReference') {
           return {}
        }

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

      addRelatedDoiAgent(doiId, formData) {
        let author = {};

        if ((this.object === 'photoArchive' || this.object === 'specimenImage' || this.object === 'otherFiles') && formData.author) {
          author = {
            doi: doiId,
            agent: formData.author.id,
            name: formData.author.surename + ', ' + formData.author.forename,
            affiliation: formData.author.affiliation ? formData.author.affiliation : null, // Todo: Add to author object
            orcid: formData.author.orcid ? formData.author.orcid : null, // Todo: Add to author object
          }
        } else if (this.object === 'digitisedReference' && formData.copyright_agent) {
          author = {
            doi: doiId,
            agent: formData.copyright_agent.id,
            name: formData.copyright_agent.surename + ', ' + formData.copyright_agent.forename,
            affiliation: formData.copyright_agent.affiliation ? formData.copyright_agent.affiliation : null, // Todo: Add to author object
            orcid: formData.copyright_agent.orcid ? formData.copyright_agent.orcid : null, // Todo: Add to author object
          }
        }

        let doiAgentFormData = new FormData();
        doiAgentFormData.append('data', JSON.stringify(author));

        fetchAddDoiAgent(doiAgentFormData)
          .then(
            response => this.toastResponseMessages(response),
            errResponse => toastError({text: 'Doi Agent upload failed!'})
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
