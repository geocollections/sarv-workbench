<template>
  <div class="edit-form">

    <div class="row mt-4">
      <div class="col">
        <p class="h2">{{ $t($route.meta.heading) }}: <b>{{$route.params.id}}</b></p>
      </div>
    </div>

    <router-view v-on:data-loaded="setData"/>
    <!-- LOGS -->
    <log v-if="data !== null" :table="$route.meta.table" :data="data"></log>
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
        data : null
      }
    },
    metaInfo () {
      return {
        title: this.$t(this.$route.meta.title) + ' ' + this.$route.params.id
      }
    },
    methods: {
      setData(data) {
        this.data = data
      }
    }
  }
</script>
