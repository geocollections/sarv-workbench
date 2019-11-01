<template>
  <div class="specimen-image-view mx-3 mb-3" v-if="data.length > 0">
    <v-row class="mx-0">
      <v-col
        v-for="(image, index) in data"
        :key="index"
        class="d-flex child-flex my-3"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-card
              flat
              class="d-flex"
              :to="{ path: '/specimen/' + image.specimen_id }"
              hover
              :title="$t('editSpecimen.editMessage')"
            >
              <v-img
                max-height="400"
                :src="getFileUrl(image.uuid_filename, 'small')"
                :lazy-src="getFileUrl(image.uuid_filename, 'small')"
                class="grey lighten-2"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>

              <v-fade-transition>
                <v-overlay v-if="hover" absolute color="teal lighten-2">
                  <span class="font-weight-bold mx-2" v-if="image.specimen__database__acronym && image.specimen__specimen_id">
                    {{ image.specimen__database__acronym }} {{ image.specimen__specimen_id }}
                  </span>
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "SpecimenImageView",
  props: {
    data: {
      type: Array
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
