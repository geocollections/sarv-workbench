<template>
  <div v-if="count > 0">
    <drillcore-box-list-view
      :data="result"
      :title="{
        et: result[0].drillcore_box__drillcore__drillcore,
        en: result[0].drillcore_box_drillcore__drillcore_en
      }"
    >
      <template v-slot:itemTitle="{ item }">
        <h5
          v-translate="{
            et: `Kast nr. ${item.drillcore_box__number} (${item.drillcore_box__depth_start} - ${item.drillcore_box__depth_end} m)`,
            en: `Box nr. ${item.drillcore_box__number} (${item.drillcore_box__depth_start} - ${item.drillcore_box__depth_end} m)`
          }"
        ></h5>
      </template>
    </drillcore-box-list-view>
  </div>
</template>

<script>
import { fetchRelatedDrillcoreBoxImages } from "@/assets/js/api/apiCalls";
import formManipulation from "@/mixins/formManipulation";
import DrillcoreBoxListView from "@/components/drillcore_box/DrillcoreBoxListView";
export default {
  name: "DrillcorePrint",
  components: { DrillcoreBoxListView },
  data() {
    return {
      count: 0,
      result: []
    };
  },
  mixins: [formManipulation],
  created() {
    const query = fetchRelatedDrillcoreBoxImages(this.$route.params.id, {
      page: 1,
      paginateBy: 1000,
      sortBy: ["drillcore_box__depth_start"],
      sortDesc: [false]
    });
    query.then(response => {
      this.count = response.data.count;
      this.result = this.handleResponse(response);
    });
  }
};
</script>

<style scoped></style>
