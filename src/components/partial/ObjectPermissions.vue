<template>
  <v-card
    class="object-permissions mt-2"
    :color="bodyColor.split('n-')[0] + 'n-5'"
    elevation="4"
  >
    <v-card-title class="pt-2 pb-1">
      <div
        class="card-title--clickable"
        @click="block.permissions = !block.permissions"
      >
        <span>{{ $t("permissions.title") }}</span>
        <v-icon right>fas fa-cogs</v-icon>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="block.permissions = !block.permissions"
        :color="bodyActiveColor"
      >
        <v-icon>{{
          block.logs ? "fas fa-angle-up" : "fas fa-angle-down"
        }}</v-icon>
      </v-btn>
    </v-card-title>

    <transition>
      <div v-show="block.permissions" class="pa-1">
        <v-row no-gutters>
          <!-- VIEW AND EDIT -->
          <v-col cols="12" md="6" class="pa-1">
            <v-card
              :color="bodyColor.split('n-')[0] + 'n-5'"
              flat
              hover
              class="pa-1"
            >
              <v-row no-gutters>
                <v-col cols="12" class="pa-1 font-weight-bold">
                  <span>{{ $t("permissions.change_perms_title") }}</span>
                  <span
                    ><v-icon small right :color="bodyActiveColor"
                      >far fa-edit</v-icon
                    ></span
                  >
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12" sm="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="object_permissions.change_group"
                    :color="bodyActiveColor"
                    :items="autocomplete.groups"
                    :loading="autocomplete.loaders.groups"
                    item-text="name"
                    :label="$t('permissions.group')"
                    :multiple="true"
                    v-on:chip:close="
                      object_permissions.change_group.splice(
                        object_permissions.change_group.findIndex(
                          (item) => item.id === $event.id
                        ),
                        1
                      )
                    "
                    :menu-props="{ maxHeight: 208 }"
                  />
                </v-col>

                <v-col cols="12" sm="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="object_permissions.change_user"
                    :color="bodyActiveColor"
                    :items="autocomplete.users"
                    :loading="autocomplete.loaders.users"
                    item-text="username"
                    :label="$t('permissions.user')"
                    :multiple="true"
                    v-on:chip:close="
                      object_permissions.change_user.splice(
                        object_permissions.change_user.findIndex(
                          (item) => item.id === $event.id
                        ),
                        1
                      )
                    "
                    :menu-props="{ maxHeight: 208 }"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- VIEW -->
          <v-col cols="12" md="6" class="pa-1">
            <v-card
              :color="bodyColor.split('n-')[0] + 'n-5'"
              flat
              hover
              class="pa-1"
            >
              <v-row no-gutters>
                <v-col cols="12" class="pa-1 font-weight-bold">
                  <span>{{ $t("permissions.view_perms_title") }}</span>
                  <span
                    ><v-icon small right :color="bodyActiveColor"
                      >fas fa-eye</v-icon
                    ></span
                  >
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12" sm="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="object_permissions.view_group"
                    :color="bodyActiveColor"
                    :items="autocomplete.groups"
                    :loading="autocomplete.loaders.groups"
                    item-text="name"
                    :label="$t('permissions.group')"
                    :multiple="true"
                    v-on:chip:close="
                      object_permissions.view_group.splice(
                        object_permissions.view_group.findIndex(
                          (item) => item.id === $event.id
                        ),
                        1
                      )
                    "
                    :menu-props="{ maxHeight: 208 }"
                  />
                </v-col>

                <v-col cols="12" sm="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="object_permissions.view_user"
                    :color="bodyActiveColor"
                    :items="autocomplete.users"
                    :loading="autocomplete.loaders.users"
                    item-text="username"
                    :label="$t('permissions.user')"
                    :multiple="true"
                    v-on:chip:close="
                      object_permissions.view_user.splice(
                        object_permissions.view_user.findIndex(
                          (item) => item.id === $event.id
                        ),
                        1
                      )
                    "
                    :menu-props="{ maxHeight: 208 }"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="pa-1">
            <div class="v-messages theme--light">
              <div class="v-messages__wrapper mb-1">
                <div class="v-messages__message">
                  {{ $t("permissions.update_message") }}
                </div>
              </div>
            </div>

            <v-btn
              :color="bodyActiveColor"
              dark
              :title="$t('permissions.update')"
              @click="updatePermissions"
            >
              {{ $t("permissions.update") }}
              <v-icon small right>fas fa-users-cog</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </transition>
  </v-card>
</template>

<script>
import AutocompleteWrapper from "./inputs/AutocompleteWrapper";
import toastMixin from "@/mixins/toastMixin";

export default {
  name: "ObjectPermissions",
  components: { AutocompleteWrapper },
  mixins: [toastMixin],
  props: {
    objectData: {
      type: Object,
      required: true,
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },

  data: () => ({
    block: { permissions: false },
    autocomplete: {
      loaders: {
        users: false,
        groups: false,
      },
      users: [],
      groups: [],
    },
    object_permissions: {
      view_group: [],
      change_group: [],
      view_user: [],
      change_user: [],
    },
  }),

  computed: {
    table() {
      return this.$route.meta.object;
    },
  },

  watch: {
    objectData: {
      handler: function (newVal) {
        if (newVal && newVal.id) {
          if (newVal.id.toString() === this.$route.params.id) {
            this.getObjectPerms();
            this.getAutocompletes();
          }
        }
      },
      immediate: true,
    },
  },

  methods: {
    async getObjectPerms() {
      if (this.objectData.id && this.table) {
        const response = await this.$api.rw.getObjectPermissions(
          this.table,
          this.objectData.id
        );
        if (response?.user) this.assignPerms(response.user, "user");
        if (response?.group) this.assignPerms(response.group, "group");
      }
    },

    // Todo: Review (rethink logic how it would be easiest for the users) + Add delete perms
    assignPerms(arrayOfPerms, identifier) {
      if (arrayOfPerms && arrayOfPerms.length > 0) {
        arrayOfPerms.forEach((perm) => {
          let object = {};

          if (identifier === "user") {
            object.id = perm.user_id;
            object.username = perm.user__username;

            if (perm.permission__codename.includes("change")) {
              this.object_permissions.change_user.push(object);
            } else if (perm.permission__codename.includes("view")) {
              this.object_permissions.view_user.push(object);
            }
          } else {
            object.id = perm.group_id;
            object.name = perm.group__name;

            if (perm.permission__codename.includes("change")) {
              this.object_permissions.change_group.push(object);
            } else if (perm.permission__codename.includes("view")) {
              this.object_permissions.view_group.push(object);
            }
          }
        });
      }
    },

    async updatePermissions() {
      let perms_data = this.buildPermissionData();

      let url = `${this.table}/${this.objectData.id}/permissions`;
      let formData = new FormData();
      formData.set("user_perms", JSON.stringify(perms_data.user_perms));
      formData.set("group_perms", JSON.stringify(perms_data.group_perms));

      const response = await this.$api.rw.post(url, formData);
    },

    buildPermissionData() {
      let permission_data = {
        user_perms: [],
        group_perms: [],
      };
      let table = this.table;
      if (table.includes("_")) table = table.replace("_", "");

      Object.keys(this.object_permissions).forEach((key) => {
        if (this.object_permissions[key].length > 0) {
          let object = key.includes("group") ? "group_id" : "user_id";
          let perm = key.includes("view") ? `view_${table}` : `change_${table}`;

          this.object_permissions[key].forEach((entity) => {
            let perm_object = {
              [object]: entity.id,
              perm: perm,
            };
            if (key.includes("group"))
              permission_data.group_perms.push(perm_object);
            else permission_data.user_perms.push(perm_object);
          });
        }
      });

      return permission_data;
    },

    async getAutocompletes() {
      const groups = await this.$api.rw.get("group", {
        options: {
          itemsPerPage: 1000,
        },
      });
      const users = await this.$api.rw.get("user", {
        options: {
          itemsPerPage: 1000,
        },
      });

      this.autocomplete.groups = groups?.results;
      this.autocomplete.users = users?.results;
    },

    handleResponse(response) {
      if (response.status === 200) {
        return response.data.count > 0 ? response.data.results : [];
      }
    },
  },
};
</script>
