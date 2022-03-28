<template>
  <div class="related-data-table-wrapper">
    <TableWrapper v-bind="$attrs" v-on="$listeners">
      <template #item.action="{ item }">
        <v-btn
          icon
          @click="editItem(item)"
          color="green"
          :title="$t('buttons.edit')"
          small
        >
          <v-icon small>far fa-edit</v-icon>
        </v-btn>
        <v-btn
          v-if="$route.meta.isEdit"
          icon
          @click="deleteItem(item)"
          color="red"
          :title="$t('buttons.delete')"
          small
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
      </template>
    </TableWrapper>

    <RelatedDataDeleteDialog
      :dialog="deleteDialog"
      @cancel="cancelDeletion"
      @delete="runDeletion"
    />
  </div>
</template>

<script>
import relatedDataMixin from "@/mixins/relatedDataMixin";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "RelatedDataTableWrapper",
  components: { TableWrapper, RelatedDataDeleteDialog },
  mixins: [relatedDataMixin],
};
</script>
