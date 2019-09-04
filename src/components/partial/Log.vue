<template>
  <fieldset class="log border-top px-2 mb-2" v-if="logs.length > 0">
    <legend class="w-auto my-0 mb-1" :class="{'text-primary': !block.logs}" @click="block.logs = !block.logs">
      {{ $t('logs.title') }}
      <font-awesome-icon icon="history"/>
    </legend>

    <transition name="fade">
      <div class="row" v-show="block.logs">
        <div class="col">

          <div class="table-responsive">
            <table class="table table-hover table-bordered">
              <thead class="thead-light">
              <tr>
                <th>{{ $t('logs.user') }}</th>
                <th>{{ $t('logs.time') }}</th>
                <th>{{ $t('logs.command') }}</th>
                <th>{{ $t('logs.changes') }}</th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="entity in logs">
                <td><b>{{ entity.user }}</b></td>
                <td>{{ entity.time | moment('DD.MM.YYYY | HH:mm:ss')}}</td>
                <td>{{ entity.command }}</td>
                <td style="max-width: 25rem; padding:0.3rem; margin: 0;">
                  <div style="max-height: 10rem !important; overflow: auto;">
                    <div v-for="(changes, field) in handleChanges(entity.changes)">

                      <vs-list>
                        <vs-list-header class="mb-0" :title="field" color="primary"></vs-list-header>

                        <div v-for="(item, index) in changes">

                          <div class="vs-list--item"
                               :title="$t('logs.newValue')"
                               :class="{ 'list-item-new': index === 'new' }"
                               v-if="index === 'new'">

                            <div class="list-titles">
                              <div class="vs-list--subtitle" v-if="typeof item === 'object'">
                                  {{ item.join(', ') }}
                              </div>

                              <div class="vs-list--subtitle" v-else>{{ item }}</div>
                            </div>
                          </div>

                          <div class="vs-list--item"
                               :title="$t('logs.oldValue')"
                               :class="{ 'list-item-old': index === 'old' }"
                               v-if="index === 'old'">

                            <div class="list-titles">
                              <div class="vs-list--subtitle" v-if="typeof item === 'object'">
                                {{ item.join(', ') }}
                              </div>

                              <div class="vs-list--subtitle" v-else>{{ item }}</div>
                            </div>
                          </div>
                        </div>

                      </vs-list>


                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </transition>


  </fieldset>
</template>

<script>
  import {fetchSpecificLogs} from "@/assets/js/api/apiCalls";
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

  import {faHistory} from '@fortawesome/free-solid-svg-icons'

  library.add(faHistory)

  export default {
    props: ['table', 'data', 'formattedData'],
    name: "Log",
    data() {
      return {
        block: {logs: false},
        logs: []
      }
    },
    components: {
      FontAwesomeIcon
    },
    watch: {
      'formattedData': {
        handler: function (newVal, oldVal) {
          this.getLogs()
        },
        immediate: true,
      },
    },
    methods: {
      getLogs() {
        fetchSpecificLogs({
          table_name: this.table,
          row_id: this.data.id,
          order_by: '-id',
        }).then(response => {
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.logs = response.body.results;
            } else {
              this.logs = []
            }
          }
        }, errResponse => {
        })
      },

      /**
       * Basically converts string from api to valid json. (Todo: API should return valid JSON string)
       *
       * @param changes, string from api which shows new and old values but is not valid json string yet
       * @returns {{}|any}, Empty object or JSON
       */
      handleChanges(changes) {
        if (changes !== null && changes.trim().length > 0) {
          // Todo: FIx that if some field contains ' then it should not get replaced, better fix would be API to send correct json format
          // example error reference/10835
          let validJsonString = changes.replace(/'/g, '"');
          //
          // Exceptions
          // Todo: Combine these regular expressions!!!
          if (validJsonString.includes('"None"')) validJsonString = validJsonString.replace(/"None"/g, 'None');
          if (validJsonString.includes('None')) validJsonString = validJsonString.replace(/None/g, '"None"');

          if (validJsonString.includes('"True"')) validJsonString = validJsonString.replace(/"True"/g, 'True');
          if (validJsonString.includes('True')) validJsonString = validJsonString.replace(/True/g, '"True"');

          if (validJsonString.includes('"False"')) validJsonString = validJsonString.replace(/"False"/g, 'False');
          if (validJsonString.includes('False')) validJsonString = validJsonString.replace(/False/g, '"False"');

          if (validJsonString.includes('datetime.datetime')) validJsonString = validJsonString.replace(/datetime.datetime\((.*?)\)/g, '"$&"');

          return JSON.parse(validJsonString)
        } else return {}
      },
    }
  }
</script>

<style scoped>
  .log {
    width: 100%;
    font-size: 0.8em;
  }

  .log .table th, .table td {
    padding: 0.3rem;
  }

  .list-item-new {
    background-color: rgba(45, 167, 68, 0.3);
  }

  .list-item-old {
    background-color: rgba(220, 53, 69, 0.3);
  }

</style>
