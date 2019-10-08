<template>
  <tbody v-if="response.count > 0">
  <tr v-for="entity in response.results">

    <td>
      <router-link :to="{ path: '/journal/' + entity.id }" :title="$t('editJournal.editMessage')">
        {{ entity.id }}
      </router-link>
    </td>

    <td>
      <router-link :to="{ path: '/journal/' + entity.id }" :title="$t('editJournal.editMessage')">
        {{ entity.journal_name }}
      </router-link>
    </td>

    <td>{{ entity.journal_short }}</td>

    <td>{{ entity.journal_original }}</td>

    <td>{{ entity.publisher }}</td>

    <td>{{ entity.remarks }}</td>

  </tr>
  </tbody>
</template>

<script>
  export default {
    name: "JournalTable",
    props: {
      response: {
        type: Object
      },
    },
  }
</script>

<style scoped>

</style>
