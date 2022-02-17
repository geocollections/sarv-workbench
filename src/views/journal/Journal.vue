<template>
  <div class="journal">
    <!-- REQUIRED INFO -->
    <v-card
      class="mt-2"
      id="block-requiredFields"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.requiredFields = !block.requiredFields"
        >
          <span :class="validate('journal') ? 'green--text' : 'red--text'">{{
            $t("common.requiredFields")
          }}</span>
          <v-icon
            right
            :class="validate('journal') ? 'green--text' : 'red--text'"
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.requiredFields = !block.requiredFields"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.requiredFields ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.requiredFields" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="journal.journal_name"
                :color="bodyActiveColor"
                :label="$t('journal.journalName')"
                use-state
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-generalInfo"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{ $t("common.generalInfo") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
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
          <!-- JOURNAL SHORT and PUBLISHER -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="journal.journal_short"
                :color="bodyActiveColor"
                :label="$t('journal.journalShort')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="journal.publisher"
                :color="bodyActiveColor"
                :label="$t('journal.publisher')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="journal.remarks"
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
import formSectionsMixin from "@/mixins/formSectionsMixin";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";

export default {
  name: "Journal",

  components: {
    TextareaWrapper,
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

  mixins: [formManipulation, formSectionsMixin, detailViewUtilsMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    this.loadFullInfo();
  },

  methods: {
    setInitialData() {
      return {
        requiredFields: ["journal_name"],
        journal: {
          id: null,
          journal_name: null,
          journal_short: null,
          publisher: null,
          remarks: null,
        },
        block: { requiredFields: true, info: true },
      };
    },
  },
};
</script>
