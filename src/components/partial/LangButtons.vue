<template>
  <div class="lang-buttons pa-2">
    <v-btn
      text
      :dark="isDark"
      @click="changeLang('ee')"
      large
      class="font-weight-bold"
    >
      EST <span class="flag flag-ee flag-squared flag-circle ml-1"></span>
    </v-btn>
    <v-btn
      text
      :dark="isDark"
      @click="changeLang('en')"
      large
      class="font-weight-bold"
    >
      ENG<span class="flag flag-en flag-squared flag-circle ml-1"></span>
    </v-btn>
  </div>
</template>

<script>

export default {
  name: "lang-buttons",
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    changeLang(lang) {
      if (this.$localStorage.get("geocollectionsFileUploadLang") === lang)
        return;
      this.$i18n.locale = lang;
      this.$localStorage.set("geocollectionsFileUploadLang", lang);
      this.toastInfo({ text: this.$t("messages.langChange") });
    }
  }
};
</script>

<style scoped>
.lang-buttons {
  /*text-align: right;*/
  position: absolute;
  right: 0;
}

.flag {
  position: relative;
  display: inline-block;
  width: 1.33333333em;
  line-height: 1em;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}

.flag:before {
  content: "\A0";
}

.flag-ee {
  background-image: url("../../assets/ee.svg");
}

.flag-en {
  background-image: url("../../assets/en.svg");
}

.flag-squared {
  width: 1em;
}

.flag-circle {
  border-radius: 100%;
}
</style>
