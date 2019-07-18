<template>
  <div class="add-attachment">

    <div class="row mt-4 page-title">
      <div class="col-sm-4">
        <p class="h2">{{ $t('add.newAttachment') }}</p>
      </div>

      <div class="col-sm-8 text-right">
        <ul class="nav nav-pills nav-fill">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/attachment/add/photo_archive' }">{{ $t('add.photoArchive') }}</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/attachment/add/specimen_image' }">{{ $t('add.specimenImage') }}</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/attachment/add/other_file' }">{{ $t('add.otherFiles') }}</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/attachment/add/digitised_reference' }">{{ $t('add.digitisedReference') }}</router-link>
          </li>
        </ul>

      </div>
    </div>

    <b-alert show variant="warning" v-if="createRelationWith.data !== null">
      {{ createRelationWith.info }}
      <a class="small" href="javascript:void(0)" @click="navigateBack">
        <font-awesome-icon icon="external-link-alt"/>
      </a>
    </b-alert>
    <router-view/>

  </div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

  library.add(faExternalLinkAlt)
  export default {
    name: "AddAttachment",
    components: {
      FontAwesomeIcon
    },
    metaInfo () {
      return {
        title: this.$t('titles.addAttachment')
      }
    },
    computed: {
      createRelationWith () { return this.$store.state['createRelationWith'] }
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('REMOVE_RELATION_OBJECT')
      next()
    },
    methods:{
      navigateBack() {
        this.$router.push({ path:'/'+this.createRelationWith.object+'/'+this.createRelationWith.data.id})
      }
    }
  }
</script>

<style scoped>
  .router-link-active {
    color: #fff;
    background-color: #007bff;
  }

</style>
