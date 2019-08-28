<template>
    <div class="object-does-not-exist">
      <div class="alert alert-info">
        <p class="text-center h5">
          {{ $t('messages.ObjectDoesNotExist1') }}
          <strong>{{object}}</strong>
          {{ $t('messages.ObjectDoesNotExist2') }}
          <strong>{{id}}</strong>
          {{ $t('messages.ObjectDoesNotExist3') }}
        </p>

        <p class="text-center my-1">
          <router-link class="p-3" :to="{ path: `/${object}` }">
            {{ $t('messages.ObjectDoesNotExist4') }}
            <strong>{{object}}</strong>
            {{ $t('messages.ObjectDoesNotExist5') }}
          </router-link>
        </p>
      </div>
    </div>
</template>

<script>
  export default {
    name: "ObjectDoesNotExist",
    props: {
      id: {
        type: String,
      },
      object: {
        type: String,
      }
    }
  }
</script>

<style scoped>

</style>
