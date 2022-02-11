<template>
  <div class="web-news">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('web_news') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('web_news') ? 'green--text' : 'red--text'"
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
          <!-- TITLE_ET -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="web_news.title_et"
                :color="bodyActiveColor"
                :label="$t('web_news.title_et')"
              />
            </v-col>
          </v-row>

          <!-- TITLE_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="web_news.title_en"
                :color="bodyActiveColor"
                :label="$t('web_news.title_en')"
              />
            </v-col>
          </v-row>

          <!-- TEXT_ET -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-model="web_news.text_et"
                :label="$t('web_news.text_et')"
              />
            </v-col>
          </v-row>

          <!-- TEXT_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-model="web_news.text_en"
                :label="$t('web_news.text_en')"
              />
            </v-col>
          </v-row>

          <!-- IS_PRIVATE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <checkbox-wrapper
                v-model="web_news.is_private"
                :color="bodyActiveColor"
                :label="$t('common.is_private')"
                @change="web_news.is_private = !web_news.is_private"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import Editor from "@/components/partial/inputs/Editor";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";

export default {
  name: "WebNews",

  components: {
    Editor,
    CheckboxWrapper,
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

  mixins: [formManipulation, autocompleteMixin, detailViewUtilsMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    this.loadFullInfo();
  },

  methods: {
    setInitialData() {
      return {
        web_news: {
          id: null,
          title_et: null,
          title_en: null,
          text_en: null,
          text_et: null,
          is_private: false,
        },
        requiredFields: [],
        block: {
          info: true,
        },
      };
    },
  },
};
</script>

<style scoped></style>
