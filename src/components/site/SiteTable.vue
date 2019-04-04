<template>
  <tbody>
  <tr v-for="entity in response.results" @click="addOrRemoveSite(entity)" :style="{ backgroundColor : findCurrentRecord(selectedSites, entity.id) > -1 ? '#8cfaa1' : 'white'  }">

    <td>
      <router-link :to="{ path: '/site/' + entity.id }" :title="$t('editSite.editMessage')">{{
        entity.id }}
      </router-link>
    </td>
    <td v-translate="{ et: entity.name, en: entity.name_en }"></td>
    <td v-translate="{ et: entity.project__name, en: entity.project__name_en }"></td>
    <!--<td>{{entity.date_start}}</td>-->
    <!--<td>{{entity.date_end}}</td>-->
    <!--<td>{{entity.date_free}}</td>-->
  </tr>
  </tbody>
</template>

<script>
  import findIndex from 'lodash/findIndex';
    export default {
      name: "SiteTable",
      props: {
        response: {
          type: Object
        },
      },
      data(){
        return { selectedSites: [] }
      },

      methods:{
        addOrRemoveSite(entity) {
          let indexOfRecordInSelectedList = this.findCurrentRecord(this.selectedSites, entity.id);

          if(indexOfRecordInSelectedList === -1) {
            this.selectedSites.push(entity);
            this.$root.$emit('add-site', entity)
          } else {
            this.selectedSites.splice(indexOfRecordInSelectedList,1);
            this.$root.$emit('remove-site', entity)
          }


        },
        findCurrentRecord(list,id) {
          return findIndex(list, function(item) {
            return item.id === id
          })
        },
      }
    }
</script>

<style scoped>

</style>
