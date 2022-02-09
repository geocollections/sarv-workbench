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

          <span v-if="entity.reference.author">
            {{ entity.reference.author }},
          </span>

          <span v-if="entity.reference.year">
            {{ entity.reference.year }}.
          </span>

          <span v-if="entity.reference.title">
            {{ entity.reference.title }}.
          </span>

          <span v-if="entity.reference.book">
            {{ entity.reference.book }},
          </span>

          <span v-if="entity.reference.publisher">
            {{ entity.reference.publisher }}.
          </span>

          <span v-if="entity.reference.publisher_place">
            {{ entity.reference.publisher_place }}.
          </span>

          <span v-if="entity.reference.journal.journal_name">
            <i>{{ entity.reference.journal.journal_name }}</i
            >,
          </span>

          <span v-if="entity.reference.volume">
            <b>{{ entity.reference.volume }}</b
            >,
          </span>

          <span v-if="entity.reference.number">
            {{ entity.reference.number }},
          </span>

          <span v-if="entity.reference.pages">
            {{ entity.reference.pages }}.
          </span>

          <span v-if="entity.reference.doi">
            <a :href="'https://doi.org/' + entity.reference.doi"
              >https://doi.org/ {{ entity.reference.doi }}</a
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
