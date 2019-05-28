<template>
  <div id="#tab-attachment" class="tab-attachment row" :class="{active: activeTab === 'attachment_link'}" role="tabpanel">
    <div class="col-sm-12" v-if="activeTab === 'attachment_link'">
      <multimedia-component v-on:file-uploaded="$parent.addFiles" :recordOptions="true" :active-tab="activeTab"/>
      <file-table :attachments="relatedData.attachment_link" :object="'doi'"
                  v-if="relatedData.attachment_link.length > 0"/>
    </div>
  </div>
</template>

<script>
  import MultimediaComponent from "../../partial/MultimediaComponent";
  import FileTable from "../../partial/FileTable";

  export default {
    components: {
      MultimediaComponent,
      FileTable
    },
    name: "DoiFiles",
    props: {
      relatedData: Object,
      activeTab: String
    },
  }
</script>

<style scoped>

</style>
