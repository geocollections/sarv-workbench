<template>
  <div id="#tab-reference" class="tab-reference row" :class="{active: activeTab === 'attachment_link'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'attachment_link'">
      <div class="table-responsive-sm" style="max-width: 30em">
        <table class="table table-hover table-bordered related-table">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('reference.reference') }}<font-awesome-icon class="ml-2" icon="link"/></th>
            <th class="btn-th"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.attachment_link"  :style="{ backgroundColor : entity.editMode ? '#F8F9FA' : ''  }">
            <td  v-if="!entity.editMode">{{entity.original_filename}}</td>
            <td  v-if="entity.editMode">
              <vue-multiselect v-model="entity.new.attachment"
                               id="attachment"
                               label="original_filename"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.attachment"
                               :options="autocomplete.attachment"
                               @search-change="autocompleteAttachmentSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.original_filename }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td style="padding: 0.6em!important;">
              <button  v-show="entity.editMode" class="float-left btn btn-sm btn-success" @click="$emit('related-data-modified', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="entity.allowRemove" class="float-right btn btn-sm btn-danger" @click="removeRow(entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>

              <button  v-show="!entity.editMode" class="float-left btn btn-sm btn-outline-success" @click="$emit('edit-row', entity)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button v-show="!entity.allowRemove" class="float-right btn btn-sm btn-outline-danger" @click="$emit('allow-remove-row', entity)" :disabled="sendingData"><font-awesome-icon icon="trash-alt"/></button>
            </td>
          </tr>
          <tr class="related-input-data">
            <td>
              <vue-multiselect v-model="relatedData.insert.attachment_link.attachment"
                               id="attachment_insert"
                               label="original_filename"
                               track-by="id"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.attachment"
                               :options="autocomplete.attachment"
                               @search-change="autocompleteAttachmentSearch"
                               :internal-search="false"
                               :preserve-search="true"
                               :clear-on-select="false"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.original_filename }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </td>
            <td style="padding: 0.6em!important;">
              <!--<button class="float-left btn btn-sm btn-outline-success" @click="addRelatedData(activeTab)" :disabled="sendingData">S</button>-->
              <button class="float-left btn btn-sm btn-success" @click="$emit('related-data-added', activeTab)" :disabled="sendingData"><font-awesome-icon icon="pencil-alt"/></button>
              <button class="float-right btn btn-sm btn-danger" @click="relatedData.insert.attachment_link = {}" :disabled="sendingData"><font-awesome-icon icon="times"/></button>
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

  import formManipulation  from '../../../mixins/formManipulation';
  import autocompleteMixin  from '../../../mixins/autocompleteMixin';

    export default {
      name: "SampleAttachment",
      props: {
        relatedData: Object,
        autocomplete: Object,
        activeTab: String
      },
      mixins: [formManipulation,autocompleteMixin],
      methods: {
        createAttachmentRelation() {
          //SAMPLE form has wrapper. because of this sample is not parent anymore but parent of wrapper
          // Todo: Should send sample in prop not use $parent
          let createRelationWith = { object: 'sample', data: this.$parent.$parent.sample,
            info: this.$t('messages.sampleAttachmentRelationInfo',
              { data: `ID: ${this.$parent.$parent.sample.id} (${this.$parent.$parent.sample.number})` })};
          this.$store.commit('CREATE_RELATION_OBJECT', { createRelationWith })
          this.$router.push({ path:'/attachment/add/other_file'})
        }
      }
    }
</script>
<style scoped>

</style>
