<template>
  <tbody v-if="response.count > 0">
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/keyword/' + entity.id }" :title="$t('keyword.editMessage')">
        <span class="hover-eye">
          {{entity.id }}
          <i class="far fa-eye"></i>
        </span>
      </router-link>
    </td>

    <td>{{ entity.keyword }}</td>

    <td v-translate="{et: entity.language__value, en: entity.language__value_en}"></td>

    <td v-translate="{et: entity.keyword_category__name, en: entity.keyword_category__name_en}"></td>

    <td>{{ entity.related_keyword__keyword }}</td>
  </tr>
  </tbody>
</template>

<script>
  export default {
    name: "KeywordTable",
    props: {
      response: {
        type: Object
      },
    },
  }
</script>

<style scoped>
  .hover-eye > i {
    opacity: 0;
    -webkit-transition: opacity 100ms ease-in;
    transition: opacity 100ms ease-in;
  }
  .hover-eye:hover > i, .hover-eye:active > i {
    opacity: 1;
    -webkit-transition: opacity 100ms ease-in;
    transition: opacity 100ms ease-in;
  }
</style>
