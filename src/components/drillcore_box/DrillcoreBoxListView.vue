<template>
  <v-container class="list-row" v-if="data.length > 0">
    <v-row v-if="title">
      <v-col>
        <h2 class="text-center" v-translate="title" />
      </v-col>
    </v-row>
    <v-row v-for="(box, index) in data" :key="index">
      <v-col cols="12">
        <v-divider v-if="index > 0"  class="d-print-none"/>
        <div class="py-2 d-flex align-center flex-column">
          <v-img
            max-width="700"
            max-height="500"
            contain
            :lazy-src="getFileUrl(box.attachment__uuid_filename, 'small')"
            :src="getFileUrl(box.attachment__uuid_filename, 'medium')"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>
          <router-link
            :to="{ path: '/drillcore_box/' + box.drillcore_box }"
            :title="$t('editDrillcoreBox.editMessage')"
            class="sarv-link pt-2 ma-0"
            :class="`${bodyActiveColor}--text`"
          >
            <slot name="itemTitle" v-bind:item="box"></slot>
          </router-link>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <div v-else>
    <div
      class="text-center"
      v-translate="{ et: 'Andmed puuduvad', en: 'No data available' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "DrillcoreBoxListView",
  props: {
    data: {
      type: Array
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    },
    title: {
      type: Object
    }
  },
  methods: {
    getFileUrl(uuid, size = null) {
      if (size) {
        return `https://files.geocollections.info/${size}/${uuid.substring(
          0,
          2
        )}/${uuid.substring(2, 4)}/${uuid}`;
      } else {
        return `https://files.geocollections.info/${uuid.substring(
          0,
          2
        )}/${uuid.substring(2, 4)}/${uuid}`;
      }
    }
  }
};
</script>

<style scoped></style>
