<template>
  <div class="log">

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
                <th>User</th>
                <th>Time</th>
                <th>Command</th>
                <th>Muutused</th>

              </tr>
            </thead>

            <tbody>
              <tr v-for="entity in logs">
                <td><b>{{ entity.user }}</b></td>
                <td>{{ entity.time | moment('DD.MM.YYYY | HH:mm:ss')}}</td>
                <td>{{ entity.command }}</td>
                <td style="max-width: 30rem; padding:0.3rem; margin: 0;"><div style="height: 2rem !important; overflow: auto;">{{ entity.changes }}</div></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
  export default {
    props: ['table', 'id'],
    name: "Log",
    data() {
      return {
        apiUrl: 'https://rwapi.geocollections.info/log/',
        logs: []
      }
    },
    watch: {
      'id':{
        handler: function (newVal, oldVal) {
          this.getLogs()
        },
        immediate: true
      }
    },
    methods: {
      getLogs() {
        this.$http.get(this.apiUrl, {
          params: {
            table_name: this.table,
            row_id: this.id,
            order_by: '-id',
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) {
              this.logs = response.body.results;
            } else {
              this.logs = []
            }
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
        })
      }
    }
  }
</script>

<style scoped>
.log  {
	width: 100%;
	margin-top: 2rem; 
	font-size: 0.8em;
}
</style>
