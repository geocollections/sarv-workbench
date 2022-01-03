<template>
  <div class="imageset">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('imageset') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('imageset') ? 'green--text' : 'red--text'"
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="pa-1">
          <!-- NUMBER and AUTHOR -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1" v-if="$route.meta.isEdit">
              <input-wrapper
                v-model="imageset.imageset_number"
                :color="bodyActiveColor"
                :label="$t('imageset.imagesetNumber')"
                :readonly="$route.meta.isEdit"
                :disabled="$route.meta.isEdit"
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-1" v-else>
              <input-wrapper
                v-model="imageset.imageset_number"
                :color="bodyActiveColor"
                :label="$t('imageset.imagesetNumber')"
                use-custom-state
                :error="
                  !(
                    isNotEmpty(imageset.imageset_number) &&
                    !imagesetNumberExists
                  )
                "
                :success="
                  isNotEmpty(imageset.imageset_number) && !imagesetNumberExists
                "
                name="imageset_number"
              />
              <div
                class="m-0 caption"
                v-if="
                  !(
                    isNotEmpty(imageset.imageset_number) &&
                    !imagesetNumberExists
                  )
                "
              >
                <div v-if="imagesetNumberExists">
                  {{ $t("add.errors.imagesetNumberExists") }}.
                </div>
                <div v-else>{{ $t("add.errors.imagesetNumber") }}.</div>
              </div>
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="imageset.author"
                :color="bodyActiveColor"
                :items="autocomplete.author"
                :loading="autocomplete.loaders.author"
                item-text="agent"
                :label="$t('common.author')"
                use-state
                is-link
                route-object="agent"
                is-searchable
                :disabled="$route.meta.isEdit"
                :readonly="$route.meta.isEdit"
                v-on:search:items="autocompleteAgentSearch($event, 'author')"
                name="author"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="imageset.imageset_series"
                :color="bodyActiveColor"
                :label="$t('imageset.imageset_series')"
                name="description"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="imageset.description"
                :color="bodyActiveColor"
                :label="$t('common.description')"
                name="description"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- CLEAR LOCAL STORAGE -->
    <v-row no-gutters class="mt-3" v-if="!$route.meta.isEdit">
      <v-col cols="12">
        <v-btn color="yellow" @click="clearLocalStorage">
          {{ $t("buttons.clearLocalStorage") }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
import { fetchIsImagesetNumberInImageset } from "@/assets/js/api/apiCalls";
import InputWrapper from "../../components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "../../components/partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../../components/partial/inputs/TextareaWrapper";
import { fetchImageset } from "@/assets/js/api/apiCalls";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";

export default {
  name: "Imageset",

  components: {
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
  },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true,
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    detailViewUtilsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  computed: {
    ...mapState("detail", ["imagesetDetail"]),
  },

  created() {
    if (this.imagesetDetail) this.imageset = cloneDeep(this.imagesetDetail);

    this.loadFullInfo();

    if (!this.$route.meta.isEdit) {
      this.imageset.author = {
        id: this.getCurrentAgent.id,
        agent: this.getCurrentAgent.agent,
        forename: this.getCurrentAgent.forename,
        surename: this.getCurrentAgent.surename,
      };
      this.autocomplete.author.push(this.imageset.author);
    }
  },

  watch: {
    "imageset.imageset_number": function (newVal) {
      if (newVal && newVal.trim().length > 0) {
        this.isInImagesetTable(newVal);
      }
    },
  },

  methods: {
    setInitialData() {
      return {
        autocomplete: {
          loaders: {
            author: false,
          },
          author: [],
        },
        requiredFields: ["imageset_number", "author"],
        imageset: {
          id: null,
          imageset_number: null,
          author: null,
          description: null,
        },
        imagesetNumberExists: false,
        block: { info: true },
      };
    },

    isInImagesetTable(query) {
      fetchIsImagesetNumberInImageset(query).then((response) => {
        if (response.status === 200) {
          this.imagesetNumberExists = response.data.count > 0;
        }
      });
    },

    clearLocalStorage() {
      this.resetFields("imagesetDetail");
      this.toastInfo({ text: this.$t("messages.defaultsRemoved") });
    },
  },
};
</script>

<style scoped></style>
