<template>
  <div id="#tab-attachment" class="tab-pane row" :class="{active: activeTab === 'attachment'}" role="tabpanel">
    <div class="col-sm-8" v-if="activeTab === 'attachment'">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>{{ $t('attachments.link') }}</th>
            <th>{{ $t('attachments.remarks') }}</th>
            <th v-if="relatedData.insert.attachment.id"></th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(entity, index) in relatedData.attachment">
            <td>{{ entity.original_filename}}</td>
            <td>{{ entity.remarks }}</td>
            <td v-if="relatedData.insert.attachment.id"></td>
          </tr>
          <tr class="related-input-data">
            <td>
              <vue-multiselect style="min-width: 300px!important" class="align-middle" v-model="relatedData.insert.attachment.attachment" deselect-label="Can't remove this value"
                               label="original_filename" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                               :loading="autocomplete.loaders.attachment"
                               :options="autocomplete.attachment" :searchable="true" @search-change="autcompleteAttachmentSearch"
                               :allow-empty="true"  :show-no-results="false"
                               :open-direction="'bottom'">
                <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.original_filename }}</strong> </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect></td>
            <td><b-form-input v-model="relatedData.insert.attachment.remarks" type="text"/></td>
            <td style="padding: 0.6em!important;" class="text-center delete-relation" @click="relatedData.insert.attachment = {}"  v-if="relatedData.insert.attachment.id">
              <font-awesome-icon icon="times"></font-awesome-icon>
            </td>
          </tr>
          </tbody>
        </table>
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

      mixins: [autocompleteFieldManipulation]
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
