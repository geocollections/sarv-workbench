<template>
  <div id="#tab-attachment" class="tab-pane row" :class="{active: activeTab === 'attachment_link'}" role="tabpanel">
    <div class="col-sm-8" v-if="activeTab === 'attachment_link'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('attachments.link') }}</th>
            <th>{{ $t('attachments.remarks') }}</th>
            <th v-if="relatedData.insert.attachment_link.attachment"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.attachment_link">
            <td>{{ entity.original_filename}}</td>
            <td>{{ entity.remarks }}</td>
            <td v-if="relatedData.insert.attachment_link.attachment"></td>
          </tr>
          <tr class="related-input-data">
            <td>
              <vue-multiselect style="min-width: 300px!important" class="align-middle" v-model="relatedData.insert.attachment_link.attachment" deselect-label="Can't remove this value"
                               label="original_filename" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.attachment"
                               :options="autocomplete.attachment" :searchable="true" @search-change="autcompleteAttachmentSearch"
                               :allow-empty="true"  :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.original_filename }}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect></td>
            <td><b-form-input v-model="relatedData.insert.attachment_link.remarks" type="text"/></td>
            <td style="padding: 0.6em!important;" class="text-center delete-relation" @click="relatedData.insert.attachment_link = {}"  v-if="relatedData.insert.attachment_link.attachment">
              <font-awesome-icon icon="times"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="col-12 p-0 mb-3" style="margin-top: -15px!important;">
        <b-form-text >{{$t('messages.localityAttachmentInfo')}}&ensp;
          <a href="javascript:void(0)" @click="createAttachmentRelation">
            <font-awesome-icon icon="external-link-alt"/>
          </a>
        </b-form-text>
      </div>
    </div>
  </div>
</template>

<script>
  import autocompleteFieldManipulation  from './../../mixins/autocompleFormManipulation';
    export default {
        name: "LocalityAttachment",
      props: {
        relatedData: Object,
        autocomplete: Object,
        activeTab: String
      },
      mixins: [autocompleteFieldManipulation],
      methods: {
        createAttachmentRelation() {
          let createRelationWith = { object: 'locality', data: this.$parent.locality,
            info: this.$t('messages.localityAttachmentRelationInfo',
            { data: `ID: ${this.$parent.locality.id} ${this.$i18n.locale === 'ee' ? this.$parent.locality.locality : this.$parent.locality.locality_en}` })};
          this.$store.commit('CREATE_RELATION_OBJECT', { createRelationWith });
          this.$router.push({ path:'/attachment/add/other_file'})
          // this.$router.push({path:'/attachment/add/other_file', query: Object.assign({}, this.$route.query, { newKey: 'newValue' }) })
          // this.windowOpenNewTab('/attachment/add/other_file',{}, { createLocalityRelation: this.$parent.locality})
        }
      }
    }
</script>

<style scoped>
  .related-input-data td{
    /*min-width: 10em !important;*/
    padding: 0.2em!important;
  }

  .multiselect {
    line-height: 1;
    z-index: 999 !important;
    width: 100%;
    min-width: 20em!important
  }
</style>
