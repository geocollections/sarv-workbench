<template>
  <div
    id="#tab-reference-list"
    class="tab-pane row no-gutters"
    :class="{ active: activeTab === 'library_reference_list' }"
    role="tabpanel"
  >
    <div v-if="activeTab === 'library_reference_list'">
      <div class="row p-1" v-for="(entity, index) in data" :key="index">
        <div class="col-sm-12 list-row">
          <!--<span>
          <router-link :to="{ path: '/reference/' + entity.reference }">
            <b>{{ index + 1 }}.</b>
          </router-link>
        </span>-->

          <span v-if="entity.reference__author">
            {{ entity.reference__author }},
          </span>

          <span v-if="entity.reference__year">
            {{ entity.reference__year }}.
          </span>

          <span v-if="entity.reference__title">
            {{ entity.reference__title }}.
          </span>

          <span v-if="entity.reference__book">
            {{ entity.reference__book }},
          </span>

          <span v-if="entity.reference__publisher">
            {{ entity.reference__publisher }}.
          </span>

          <span v-if="entity.reference__publisher_place">
            {{ entity.reference__publisher_place }}.
          </span>

          <span v-if="entity.reference__journal__journal_name">
            <i>{{ entity.reference__journal__journal_name }}</i
            >,
          </span>

          <span v-if="entity.reference__volume">
            <b>{{ entity.reference__volume }}</b
            >,
          </span>

          <span v-if="entity.reference__number">
            {{ entity.reference__number }},
          </span>

          <span v-if="entity.reference__pages">
            {{ entity.reference__pages }}.
          </span>

          <span v-if="entity.reference__doi">
            <a :href="'https://doi.org/' + entity.reference__doi"
              >https://doi.org/ {{ entity.reference__doi }}</a
            >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Array,
    activeTab: String,
  },
  name: "LibraryReferenceListView",
};
</script>

<style scoped>
.list-row {
  padding-left: 6rem;
  text-indent: -4rem;
}
</style>
