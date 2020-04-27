<template>
  <v-btn
    class="text-none"
    :disabled="sendingData"
    @click="addNewDoi()"
    color="blue"
    dark
  >
    <v-icon left>far fa-plus-square</v-icon>
    {{ $t("edit.buttons.saveNewDoi") }}
  </v-btn>
</template>

<script>
import { fetchAddDoi } from "../../assets/js/api/apiCalls";
import toastMixin from "../../mixins/toastMixin";
import { mapActions } from "vuex";

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    rawData: {
      type: Object
    },
    relatedData: {
      type: Object
    },
    attachment: {
      type: Array
    },
    object: {
      type: String,
      default: "reference",
      required: true
    }
  },
  name: "NewDoiButton",
  mixins: [toastMixin],
  data() {
    return {
      sendingData: false
    };
  },
  methods: {
    ...mapActions("search", ["setLoadingState", "setLoadingType"]),

    addNewDoi() {
      if (confirm(this.$t(this.object + ".doiConfirmation"))) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");

        let doi = this.buildDoiObject(this.object);
        if (typeof doi !== "undefined") {
          let doiFormData = new FormData();
          // Todo: Format objects
          doiFormData.append("data", JSON.stringify(doi));

          fetchAddDoi(doiFormData).then(
            response => {
              if (response && response.data) {
                if (typeof response.data.message !== "undefined")
                  this.toastSuccess({ text: response.data.message });
                else if (typeof response.data.error !== "undefined")
                  this.toastError({ text: response.data.error });

                if (response.data.id)
                  this.$router.push({ path: "/doi/" + response.data.id });
              }
            },
            () => {
              this.toastError({ text: "DOI upload failed!" });
            }
          );
        }

        this.setLoadingState(false);
      } else this.toastInfo({ text: this.$t("messages.userCancelled") });
    },

    buildDoiObject(object) {
      let doiObject;

      if (object === "reference") {
        doiObject = {
          creators: this.data.author,
          publication_year: this.data.year,
          title: this.data.title,
          title_alternative: this.data.title_original,
          language: this.data.language ? this.data.language.id : null,
          publisher: this.data.publisher,
          abstract: this.data.abstract,
          reference: this.data.id,
          subjects:
            this.relatedData.keyword && this.relatedData.keyword.length > 0
              ? this.relatedData.keyword.map(item => item.keyword).join(", ")
              : null,
          resource_type: 12,
          version: "1.0",
          formats: "pdf",
          related_data: {}
        };

        if (this.attachment)
          doiObject.related_data.attachment = [
            { attachment: this.attachment[0].id }
          ];
        if (
          this.relatedData.locality_reference &&
          this.relatedData.locality_reference.length > 0
        ) {
          doiObject.related_data.doi_geolocation = this.relatedData.locality_reference.map(
            item => {
              return {
                id: item.locality
              };
            }
          );
        }
      } else if (object === "attachment") {
        console.log(this.data);
        doiObject = {
          creators: this.data.author
            ? this.data.author.agent
            : this.data.author_free,
          publication_year: new Date().getFullYear(),
          title: this.data.description_en
            ? this.data.description_en
            : this.data.image_description_en,
          title_alternative: this.data.description
            ? this.data.description
            : this.data.image_description,
          publisher: "SARV: Geoscience Data Platform",
          abstract: this.data.description_en,
          subjects:
            this.relatedData.keyword && this.relatedData.keyword.length > 0
              ? this.relatedData.keyword.map(item => item.keyword).join(", ")
              : null,
          resource_type: 14,
          version: "1.0",
          formats: this.rawData.attachment_format__value
            ? this.rawData.attachment_format__value
            : this.rawData.uuid_filename.split(".")[1],
          is_private: this.data.is_private,
          licence: this.data.licence ? this.data.licence.id : null,
          copyright_agent: this.data.copyright_agent
            ? this.data.copyright_agent.id
            : null,
          related_data: {
            attachment: [
              { attachment: this.data.id, remarks: this.data.remarks }
            ]
          }
        };

        if (this.data.author) {
          doiObject.related_data.doi_agent = {
            affiliation: this.data.author.institution_name
              ? this.data.author.institution_name
              : null,
            agent: this.data.author.id,
            name: this.data.author.agent,
            orcid: this.data.author.orcid ? this.data.author.orcid : null
          };
        } else if (this.data.author_free) {
          doiObject.related_data.doi_agent = { name: this.data.author_free };
        }

        if (this.data.locality) {
          doiObject.related_data.doi_geolocation = [
            { id: this.data.locality.id }
          ];
        } else if (this.data.image_place) {
          doiObject.related_data.doi_geolocation = [
            {
              place: this.data.image_place,
              point_latitude: this.data.image_latitude
                ? this.data.image_latitude
                : null,
              point_longitude: this.data.image_longitude
                ? this.data.image_longitude
                : null
            }
          ];
        }
      }
      return doiObject;
    }
  }
};
</script>

<style scoped></style>
