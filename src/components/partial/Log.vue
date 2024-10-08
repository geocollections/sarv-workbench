<template>
  <v-card
    class="log mt-2"
    v-if="logs.length > 0"
    :color="bodyColor.split('n-')[0] + 'n-5'"
    elevation="4"
  >
    <v-card-title class="pt-2 pb-1">
      <div class="card-title--clickable" @click="block.logs = !block.logs">
        <span>{{ $t("logs.title") }}</span>
        <v-icon right>fas fa-history</v-icon>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click="block.logs = !block.logs" :color="bodyActiveColor">
        <v-icon>{{
          block.logs ? "fas fa-angle-up" : "fas fa-angle-down"
        }}</v-icon>
      </v-btn>
    </v-card-title>

    <transition>
      <div v-show="block.logs" class="pa-1">
        <div class="row no-gutters">
          <div class="col px-1 pb-1">
            <div class="table-responsive mb-0">
              <table class="table table-hover table-bordered mb-0">
                <thead class="thead-light">
                  <tr>
                    <th>{{ $t("logs.user") }}</th>
                    <th>{{ $t("logs.time") }}</th>
                    <th>{{ $t("logs.command") }}</th>
                    <th>{{ $t("logs.changes") }}</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="entity in logs" :key="entity.id">
                    <td>
                      <b>{{ entity.user }}</b>
                    </td>
                    <td>
                      {{ $dayjs(entity.time).format("DD.MM.YYYY | HH:mm:ss") }}
                    </td>
                    <td>{{ entity.command }}</td>
                    <td style="max-width: 25rem; padding: 0.3rem; margin: 0">
                      <div style="max-height: 10rem !important; overflow: auto">
                        <div
                          v-for="(changes, field) in handleChanges(
                            entity.changes
                          )"
                          :key="field"
                        >
                          <div
                            class="mb-3"
                            v-if="
                              changes &&
                              (changes.old !== '' ||
                                (changes.old === '' &&
                                  (changes.new !== null ||
                                    changes.new !== ''))) &&
                              (changes.new !== null ||
                                (changes.new === null &&
                                  (changes.old !== null ||
                                    changes.old !== ''))) &&
                              changes.old !== changes.new
                            "
                          >
                            <div class="log-title mb-1">{{ field }}</div>

                            <div v-for="(item, index) in changes" :key="index">
                              <div
                                class="pa-1"
                                :title="$t('logs.newValue')"
                                :class="{ 'list-item-new': index === 'new' }"
                                v-if="index === 'new'"
                              >
                                <div class="list-titles">
                                  <div v-if="typeof item === 'object' && item">
                                    {{ item.join() }}
                                  </div>

                                  <div v-else>{{ item }}</div>
                                </div>
                              </div>

                              <div
                                class="pa-1"
                                :title="$t('logs.oldValue')"
                                :class="{ 'list-item-old': index === 'old' }"
                                v-if="index === 'old'"
                              >
                                <div class="list-titles">
                                  <div v-if="typeof item === 'object' && item">
                                    {{ item.join() }}
                                  </div>

                                  <div v-else>{{ item }}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </v-card>
</template>

<script>
import { fetchSpecificLogs } from "@/assets/js/api/apiCalls";

export default {
  props: {
    table: {
      type: String,
    },
    objectData: {
      type: Object,
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
  name: "Log",
  data() {
    return {
      block: { logs: false },
      logs: [],
    };
  },
  watch: {
    objectData: {
      handler: function () {
        this.getLogs();
      },
      immediate: true,
    },
  },
  methods: {
    getLogs() {
      fetchSpecificLogs({
        table_name: this.table,
        row_id: this.objectData.id,
        order_by: "-id",
      }).then((response) => {
        if (response.status === 200) {
          if (response.data.count > 0) {
            this.logs = response.data.results;
          } else {
            this.logs = [];
          }
        }
      });
    },

    /**
     * Basically converts json string from api to valid json object.
     *
     * @param changes, json string from api which shows new and old values
     * @returns {{}|any}, Empty object or JSON
     */
    handleChanges(changes) {
      if (
        typeof changes !== "undefined" &&
        changes !== null &&
        changes.trim().length > 0
      ) {
        try {
          return JSON.parse(changes);
        } catch (e) {
          return {};
        }
      } else return {};
    },
  },
};
</script>

<style scoped>
.log {
  width: 100%;
  font-size: 0.8em;
}

.log .table th,
.table td {
  padding: 0.3rem;
}

.log-title {
  font-weight: bold;
  font-size: larger;
}

.list-item-new {
  background-color: rgba(45, 167, 68, 0.3);
}

.list-item-old {
  background-color: rgba(220, 53, 69, 0.3);
}

.card-title--clickable:hover {
  cursor: pointer;
  opacity: 0.8;
}

.table-bordered {
  border: 1px solid #dee2e6;
}

.table-bordered thead th,
.table-bordered thead td {
  border-bottom-width: 2px;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
  border-bottom-width: 2px;
}

.table-bordered td,
.table-bordered th {
  border: 1px solid #dee2e6;
  border-bottom-color: rgb(222, 226, 230);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;
  border-collapse: collapse;
}

.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.table td,
.table th {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

th {
  text-align: inherit;
}
</style>
