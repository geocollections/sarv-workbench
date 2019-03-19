<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'attachment_link'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'attachment_link'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('reference.reference') }}</th>
            <th v-if="relatedData.insert.attachment_link.reference"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.attachment_link">
            <td>{{entity.original_filename}}
            </td>
            <td v-if="relatedData.insert.attachment_link.reference"></td>
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
              </vue-multiselect>
            </td>
            <td style="padding: 0.6em!important;" class="text-center delete-relation" @click="relatedData.insert.attachment_link = {}" v-if="relatedData.insert.attachment_link.reference">
              <font-awesome-icon icon="times"></font-awesome-icon>
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
      name: "SampleAttachment",
      props: {
        relatedData: Object,
        autocomplete: Object,
        activeTab: String
      },
      mixins: [autocompleteFieldManipulation],
      methods: {
        createAttachmentRelation() {
          let createRelationWith = { object: 'sample', data: this.$parent.sample,
            info: this.$t('messages.sampleAttachmentRelationInfo',
              { data: `ID: ${this.$parent.sample.id} (${this.$parent.sample.number})` })};
          this.$store.commit('CREATE_RELATION_OBJECT', { createRelationWith })
          this.$router.push({ path:'/attachment/add/other_file'})
        }
      }
    }
</script>

<style scoped>
  .table { 
	font-size: 0.9rem; 
  }
  .table td, .table th {
	padding: 0.25rem 0.4rem;  
  }
  .related-input-data td{
    /*min-width: 10em !important;*/
    padding: 0.2em!important;
  }
  .multiselect {
    line-height: 1;
    z-index: 999 !important;
    width: 100%;
    min-width: 10em!important;
  
  }
  .multiselect__tags {
	border: none;
 font-size: 0.8rem;
  }
  input, .multiselect__single, .multiselect__input, .multiselect__tags, .multiselect__tag-icon:after, .multiselect__option:after, .multiselect__option--selected  {
	font-size: 0.9rem !important;
    font-weight: light;
  padding:0.25rem;
  } 
  input {
	border: none;
  }
</style>
