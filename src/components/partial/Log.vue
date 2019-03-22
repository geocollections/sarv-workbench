<template>
  <div class="log" v-if="logs.length > 0">

    <div class="row">

      <div class="col">
        <p class="h3">{{ $t('logs.title') }}:</p>
      </div>

    </div>


    <div class="row">
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
                  <div style="max-height: 5rem !important; overflow: auto;">{{ entity.changes }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
  import { fetchSpecificLogs } from "@/assets/js/api/apiCalls";

  export default {
    props: ['table', 'data', 'formattedData'],
    name: "Log",
    data() {
      return {
        logs: []
      }
    },
    watch: {
      'formattedData':{
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
        }, errResponse => {})
      }
    }
  }
</script>

<style scoped>
.log  {
	width: 100%;
	margin-top: 1rem;
	font-size: 0.8em;
}
.log .table th, .table td {
	padding: 0.3rem;
}
</style>
