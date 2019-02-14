<template>
  <div class="lang-buttons p-3">
    <span @click="changeLang('ee')" class="p-2">EST &nbsp;<span
      class="flag-icon flag-icon-ee flag-icon-squared circle-flag"></span></span>
    <span @click="changeLang('en')" class="p-2">ENG &nbsp;<span
      class="flag-icon flag-icon-gb flag-icon-squared circle-flag"></span></span>
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

  .circle-flag {
    border-radius: 100%;
  }
</style>
