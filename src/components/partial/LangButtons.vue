<template>
  <div class="lang-buttons p-3">
    <span @click="changeLang('ee')" class="p-2">EST &nbsp;<span
      class="flag flag-ee flag-squared flag-circle"></span></span>
    <span @click="changeLang('en')" class="p-2">ENG &nbsp;<span
      class="flag flag-en flag-squared flag-circle"></span></span>
  </div>
</template>

<script>
  import { toastInfo } from "@/assets/js/iziToast/iziToast";

  export default {
    name: "lang-buttons",
    methods: {

      changeLang(lang) {
        if (this.$localStorage.get('geocollectionsFileUploadLang') === lang) return;
        this.$i18n.locale = lang
        this.$localStorage.set('geocollectionsFileUploadLang', lang)
        toastInfo({text: this.$t('messages.langChange')})
      },
    }
  }
</script>

<style scoped>
  .lang-buttons {
    position: absolute;
    right: 0;
  }

  .lang-buttons > span:hover {
    cursor: pointer;
    background-color: #f8f9fa;
  }

  .lang-buttons > span:active {
    font-weight: bold;
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
