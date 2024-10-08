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
        <span>{{ $t("permissions.title_default") }}</span>
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
        <v-card-text class="py-0">
          {{ $t("permissions.default_permissions_message") }}
        </v-card-text>
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
                    v-model="object_permissions.groups_change"
                    :color="bodyActiveColor"
                    :items="autocomplete.groups"
                    :loading="autocomplete.loaders.groups"
                    item-text="name"
                    :label="$t('permissions.group')"
                    :multiple="true"
                    v-on:chip:close="
                      object_permissions.groups_change.splice(
                        object_permissions.groups_change.findIndex(
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
                    v-model="object_permissions.users_change"
                    :color="bodyActiveColor"
                    :items="autocomplete.users"
                    :loading="autocomplete.loaders.users"
                    item-text="username"
                    :label="$t('permissions.user')"
                    :multiple="true"
                    v-on:chip:close="
                      object_permissions.users_change.splice(
                        object_permissions.users_change.findIndex(
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
                    v-model="object_permissions.groups_view"
                    :color="bodyActiveColor"
                    :items="autocomplete.groups"
                    :loading="autocomplete.loaders.groups"
                    item-text="name"
                    :label="$t('permissions.group')"
                    :multiple="true"
                    v-on:chip:close="
                      object_permissions.groups_view.splice(
                        object_permissions.groups_view.findIndex(
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
                    v-model="object_permissions.users_view"
                    :color="bodyActiveColor"
                    :items="autocomplete.users"
                    :loading="autocomplete.loaders.users"
                    item-text="username"
                    :label="$t('permissions.user')"
                    :multiple="true"
                    v-on:chip:close="
                      object_permissions.users_view.splice(
                        object_permissions.users_view.findIndex(
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
        <v-btn
          class="mx-3 mb-3"
          :color="bodyActiveColor"
          dark
          @click="handleSave"
          >{{ $t("edit.buttons.save") }}</v-btn
        >
      </div>
    </transition>
  </v-card>
</template>

<script>
import AutocompleteWrapper from "./inputs/AutocompleteWrapper";
import {
  fetchDatabaseGroups,
  fetchObjectGroupPermissions,
  fetchObjectPermissions,
  fetchObjectUserPermissions,
  fetchUserDefaultPermissions,
  changeUserDefaultPermissions,
  fetchUsers,
  postRequest,
} from "../../assets/js/api/apiCalls";
import toastMixin from "../../mixins/toastMixin";

export default {
  name: "DefaultObjectPermissions",
  components: { AutocompleteWrapper },
  mixins: [toastMixin],
  props: {
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
    block: { permissions: true },
    autocomplete: {
      loaders: {
        users: false,
        groups: false,
      },
      users: [],
      groups: [],
    },
    object_permissions: {
      groups_view: [],
      groups_change: [],
      users_view: [],
      users_change: [],
    },
  }),
  async mounted() {
    const defaultPerms = await fetchUserDefaultPermissions();
    this.object_permissions = defaultPerms.data;
    this.getAutocompletes();
  },
  methods: {
    getObjectPerms() {
      if (this.objectData.id && this.table) {
        fetchObjectPermissions(this.objectData.id, this.table).then(
          (response) => {
            if (response.status === 200) {
              if (
                typeof response.data.user !== "undefined" &&
                response.data.user !== null &&
                response.data.user.length > 0
              ) {
                this.assignPerms(response.data.user, "user");
              }

              if (
                typeof response.data.group !== "undefined" &&
                response.data.group !== null &&
                response.data.group.length > 0
              ) {
                this.assignPerms(response.data.group, "group");
              }
            }
          }
        );
      }
    },

    assignPerms(arrayOfPerms, identifier) {
      if (arrayOfPerms && arrayOfPerms.length > 0) {
        arrayOfPerms.forEach((perm) => {
          let object = {};

          if (identifier === "user") {
            object.id = perm.user_id;
            object.username = perm.user__username;

            if (perm.permission__codename.includes("change")) {
              this.object_permissions.users_change.push(object);
            } else {
              this.object_permissions.users_view.push(object);
            }
          } else {
            object.id = perm.group_id;
            object.name = perm.group__name;

            if (perm.permission__codename.includes("change")) {
              this.object_permissions.groups_change.push(object);
            } else {
              this.object_permissions.groups_view.push(object);
            }
          }
        });
      }
    },

    updatePermissions() {
      let perms_data = this.buildPermissionData();

      let url = `${this.table}/${this.objectData.id}/setpermissions`;
      let formData = new FormData();
      formData.append("data", JSON.stringify(perms_data));

      postRequest(url, formData).then(
        (response) => {
          if (response.status === 200) {
            if (response.data) {
              if (response.data.error) {
                this.toastError({ text: response.data.error });
              } else {
                if (this.$i18n.locale === "ee") {
                  this.toastSuccess({ text: response.data.message_et });
                } else {
                  this.toastSuccess({ text: response.data.message });
                }
              }
            }
          }
        },
        (errResponse) => {
          this.toastError({ text: this.$t("messages.uploadError") });
        }
      );
    },

    buildPermissionData() {
      let permission_data = [];
      let table = this.table;
      if (table.includes("_")) table = table.replace("_", "");

      Object.keys(this.object_permissions).forEach((key) => {
        if (this.object_permissions[key].length > 0) {
          let object = key.includes("group") ? "group" : "user";
          let perm = key.includes("view") ? `view_${table}` : `change_${table}`;

          this.object_permissions[key].forEach((entity) => {
            let perm_object = {
              [object]: entity.id,
              perm: perm,
            };
            permission_data.push(perm_object);
          });
        }
      });

      return permission_data;
    },

    getAutocompletes() {
      fetchDatabaseGroups().then((response) => {
        this.autocomplete.groups = this.handleResponse(response).map(
          (databaseGroup) => {
            return {
              id: databaseGroup.group,
              name: databaseGroup.acronym,
            };
          }
        );
      });

      fetchUsers().then((response) => {
        this.autocomplete.users = this.handleResponse(response);
      });
    },

    handleResponse(response) {
      if (response.status === 200) {
        return response.data.count > 0 ? response.data.results : [];
      }
    },
    async handleSave() {
      const permsData = {
        groups_view: this.object_permissions.groups_view.map((perm) => perm.id),
        groups_change: this.object_permissions.groups_change.map(
          (perm) => perm.id
        ),
        users_view: this.object_permissions.users_view.map((perm) => perm.id),
        users_change: this.object_permissions.users_change.map(
          (perm) => perm.id
        ),
      };
      const res = await changeUserDefaultPermissions(permsData);

      if (res.status === 200) {
        this.toastSuccess({ text: this.$t("messages.settingsSaveSuccess") });
      } else {
        this.toastError({ text: this.$t("messages.settingsSaveFail") });
      }
    },
  },
};
</script>

<style scoped></style>
