<template>
  <div class="geocollection-link">

    <div class="row mb-2">
      <div class="col">
        <a v-if="!isPrivate" class="no-underline" :href="'http://geocollections.info/' + this.table + '/' + this.id" target="_blank" rel="noopener noreferrer">

          <b v-if="table === 'attachment'">{{ $t('edit.link') }}</b>
          <b v-else>{{ $t('edit.referenceLink') }}</b>
        </a>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: ['attachment', 'reference', 'formattedData'],
    name: "GeocollectionsLink",
    data() {
      return {
        isPrivate: true,
        id: null,
        table: 'attachment',
      }
    },

    watch: {
      'attachment' (newVal, oldVal) {
        if (Object.keys(newVal).length !== 0 && newVal.constructor === Object) {
          this.isPrivate = newVal.is_private
          this.id = newVal.id
        }
      },
      'reference' (newVal, oldVal) {
        if (Object.keys(newVal).length !== 0 && newVal.constructor === Object) {
          this.isPrivate = newVal.is_private
          this.id = newVal.id
          this.table = 'reference'
        }
      },
      'formattedData' (newVal, oldVal) {
        if (newVal.length > 0) {
          const json = JSON.parse(newVal)
          this.isPrivate = json.is_private === '1'
        }
      }
    }

  }
</script>

<style scoped>

</style>
