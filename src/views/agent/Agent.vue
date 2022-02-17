<template>
  <div class="agent">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('agent') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon right :class="validate('agent') ? 'green--text' : 'red--text'"
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
        <div v-show="block.info" class="px-1 pt-1 pb-2">
          <!-- NAME -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="agent.agent"
                :color="bodyActiveColor"
                :label="$t('common.name')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- TYPE and INSTITUTION -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="agent.type"
                :color="bodyActiveColor"
                :items="autocomplete.agent_type"
                :loading="autocomplete.loaders.agent_type"
                :item-text="commonLabel"
                :label="$t('common.type')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="agent.institution"
                :color="bodyActiveColor"
                :items="autocomplete.institution"
                :loading="autocomplete.loaders.institution"
                item-text="agent"
                :label="$t('agent.institution')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteInstitutionSearch"
              />
            </v-col>
          </v-row>

          <!-- FORENAME and SURENAME -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1 pb-0">
              <input-wrapper
                v-model="agent.forename"
                :color="bodyActiveColor"
                :label="$t('common.forename')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1 pb-0">
              <input-wrapper
                v-model="agent.surename"
                :color="bodyActiveColor"
                :label="$t('common.surename')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- OTHER INFO -->
    <v-card
      class="mt-2"
      id="block-details"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.details = !block.details"
        >
          <span>{{ $t("agent.details") }}</span>
          <v-icon right>fas fa-info</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.details = !block.details"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.details ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.details" class="pa-1">
          <!-- INSTITUTION_NAME and INSTITUTION_NAME_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="agent.institution_name"
                :color="bodyActiveColor"
                :label="$t('agent.institution_name')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="agent.institution_name_en"
                :color="bodyActiveColor"
                :label="$t('agent.institution_name_en')"
              />
            </v-col>
          </v-row>

          <!-- TITLE, PROFESSION and PROFESSION_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="agent.title"
                :color="bodyActiveColor"
                :label="$t('agent.title')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="agent.profession"
                :color="bodyActiveColor"
                :label="$t('agent.profession')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="agent.profession_en"
                :color="bodyActiveColor"
                :label="$t('agent.profession_en')"
              />
            </v-col>
          </v-row>

          <!-- ADDRESS, ADDRESS1 and ADDRESS2 -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="agent.address"
                :color="bodyActiveColor"
                :label="$t('agent.address')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="agent.address1"
                :color="bodyActiveColor"
                :label="$t('agent.address1')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="agent.address2"
                :color="bodyActiveColor"
                :label="$t('agent.address2')"
              />
            </v-col>
          </v-row>

          <!-- HTTP and ORCID -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="agent.http"
                :color="bodyActiveColor"
                :label="$t('agent.http')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="agent.orcid"
                :color="bodyActiveColor"
                :label="$t('agent.orcid')"
              />
            </v-col>
          </v-row>

          <!-- COUNTRY and COUNTRY_TXT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="agent.country"
                :color="bodyActiveColor"
                :items="autocomplete.list_country"
                :loading="autocomplete.loaders.list_country"
                :item-text="commonLabel"
                :label="$t('agent.country')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="agent.country_txt"
                :color="bodyActiveColor"
                :label="$t('agent.country_txt')"
              />
            </v-col>
          </v-row>

          <!-- PHONE and EMAIL -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="agent.phone"
                :color="bodyActiveColor"
                :label="$t('agent.phone')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="agent.email"
                :color="bodyActiveColor"
                :label="$t('agent.email')"
              />
            </v-col>
          </v-row>

          <!-- DATE_BORN and DATE_DECEASED -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <date-wrapper
                v-model="agent.date_born"
                :color="bodyActiveColor"
                :label="$t('agent.date_born')"
                v-on:date:clear="agent.date_born = null"
                v-on:date:update="updateUserInputtedDate('date_born', $event)"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <date-wrapper
                v-model="agent.date_deceased"
                :color="bodyActiveColor"
                :label="$t('agent.date_deceased')"
                v-on:date:clear="agent.date_deceased = null"
                v-on:date:update="
                  updateUserInputtedDate('date_deceased', $event)
                "
              />
            </v-col>
          </v-row>

          <!-- OLD_NAME and NEW_NAME -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="agent.old_name"
                :color="bodyActiveColor"
                :label="$t('agent.old_name')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="agent.new_name"
                :color="bodyActiveColor"
                :label="$t('agent.new_name')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REMARKS -->
    <v-card
      class="mt-2"
      id="block-description"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.description = !block.description"
        >
          <span>{{ $t("common.description") }}</span>
          <v-icon right>fas fa-pen-fancy</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.description = !block.description"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.description ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.description" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="agent.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import DateWrapper from "@/components/partial/inputs/DateWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";

export default {
  name: "Agent",
  components: {
    TextareaWrapper,
    DateWrapper,
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
  created() {
    this.loadFullInfo();
  },
  methods: {
    setInitialData() {
      return {
        listOfAutocompleteTables: ["list_country", "agent_type"],
        autocomplete: {
          loaders: {
            agent_type: false,
            institution: false,
            list_country: false,
          },
          agent_type: [],
          institution: [],
          list_country: [],
        },
        requiredFields: ["agent", "type"],
        agent: {},
        block: {
          info: true,
          details: true,
          description: true,
        },
        menuDateBorn: false,
        menuDateDeceased: false,
      };
    },
  },
};
</script>
