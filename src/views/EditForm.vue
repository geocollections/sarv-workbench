<template>
  <div class="edit-form">

    <div class="row mt-4">
      <div class="col">
        <p class="h2">{{ $t($route.meta.heading) }}: <b>{{$route.params.id}}</b></p>
      </div>
    </div>

    <router-view v-on:data-loaded="test"/>
    <!-- LOGS -->
    <log v-if="locality !== null" table="locality" :data="locality"></log>
  </div>
</template>

<script>
  import Log from '@/components/partial/Log.vue'
  export default {
    name: "EditForm",
    components: {
      Log
    },
    data(){
      return {
        locality : null
      }
    },
    metaInfo () {
      return {
        title: this.$t(this.$route.meta.title) + ' ' + this.$route.params.id
      }
    },
    methods: {
      test(data) {
        this.locality = data
      }
    }
  }
</script>
