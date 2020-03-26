<template>
  <v-content class="loan-print">
    <lang-buttons style="z-index: 10" :is-dark="false" class="d-print-none" />

    <v-container fluid>
      <v-skeleton-loader
        v-if="isLoading"
        type="list-item@2, article, table-heading, table-thead, table-tbody, article, table-tfoot"
        elevation="2"
        height="100%"
        class="pa-2"
      />
      <v-card v-else-if="loan" class="pa-2">
        <v-row no-gutters class="text-center">
          <v-col cols="12"
            >Geological collections of the Department of Geology, Tallinn
            University of Technology</v-col
          >
          <v-col cols="12" style="font-size: 0.7rem;"
            >Ehitajate tee 5, 19086 Tallinn, Estonia; phone: +372 6203010;
            http://taltech.ee/geoloogia-instituut; e-mail: gi@taltech.ee</v-col
          >
          <v-col>
            <v-divider class="mt-1" style="border-color: black;"></v-divider>
          </v-col>
        </v-row>

        <v-row no-gutters class="text-center">
          <v-col cols="12">
            <div class="h4 font-weight-bold">
              <div v-if="loanSpecimens.length > 0">
                Shipping invoice of collection specimens (Loan No.
                {{ loan.loan_number }})
              </div>
              <div v-else-if="loanSamples.length > 0">
                Shipping invoice of geological samples No.
                {{ loan.loan_number }}
              </div>
              <div v-else>Shipping invoice No. {{ loan.loan_number }}</div>
            </div>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <div>
              To:
            </div>

            <div>
              {{ loan.borrower__title }}
              <b>{{ loan.borrower__forename }} {{ loan.borrower__surename }}</b>
            </div>

            <div>
              {{ loan.borrower_institution__agent }}
            </div>

            <div>
              {{ loan.borrower__address }}
            </div>

            <div>
              {{ loan.borrower__address1 }}
            </div>

            <div>
              {{ loan.borrower__address2 }}
            </div>

            <div class="my-5">
              TODO: URL
            </div>
          </v-col>
        </v-row>

        <div>
          The
          {{
            loanSamples.length > 0
              ? "samples listed below are"
              : "material listed below is"
          }}
          sent as...
        </div>

        <div class="mb-5">
          The material will be delivered as...
        </div>

        <v-row
          no-gutters
          v-if="loanSpecimens.length > 0"
          style="border: 1px solid black"
        >
          <v-col cols="12" class="pa-1">
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">nr.</th>
                    <th class="text-left">Name</th>
                    <th class="text-left">Locality</th>
                    <th class="text-left">Stratigraphy</th>
                    <th class="text-left">Collector</th>
                    <th class="text-left">Loan remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in loanSpecimens" :key="item.id">
                    <td>{{ item.specimen_id }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>

        <v-row
          no-gutters
          v-if="loanSamples.length > 0"
          style="border: 1px solid black"
        >
          <v-col cols="12" class="pa-1">
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">#</th>
                    <th class="text-left">Sample ID</th>
                    <th class="text-left">Sample number</th>
                    <th class="text-left">Locality</th>
                    <th class="text-left">Depth (m)</th>
                    <th class="text-left">Collector</th>
                    <th class="text-left">Link</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in loanSamples" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.sample }}</td>
                    <td>{{ item.sample__number }}</td>
                    <td>{{ item.sample__locality__locality_en }}</td>
                    <td>{{ item.sample__depth }}</td>
                    <td>{{ item.sample__agent_collected__agent }}</td>
                    <td>
                      <a
                        :href="
                          `https://geocollections.info/sample/${item.sample}`
                        "
                        class="sarv-link"
                        target="LoanSampleWindow"
                      >
                        {{
                          `https://geocollections.info/sample/${item.sample}`
                        }}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>

        <v-row v-if="loanSpecimens.length > 0"> </v-row>

        <v-row no-gutters class="mt-5" style="border: 1px solid black">
          <v-col cols="12" class="pa-1">
            <div v-if="loanSpecimens.length > 0" class="font-weight-bold">
              Please return a signed copy of this invoice to: Department of
              Geology, Tallinn University of Technology.
            </div>

            <div v-else-if="loanSamples.length > 0" class="font-weight-bold">
              Conditions of using the samples and the data thereof
            </div>
            Todo: text 3
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12"></v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-content>
</template>

<script>
import {
  fetchLoan,
  fetchLoanSamples,
  fetchLoanSpecimens
} from "../../assets/js/api/apiCalls";
import LangButtons from "../partial/LangButtons";

export default {
  name: "LoanPrint",
  components: { LangButtons },
  data: () => ({
    loan: null,
    isLoading: false,
    loanSpecimens: [],
    loanSamples: []
  }),
  watch: {
    "$route.params.id": {
      handler(newVal) {
        this.fetchLoanInfo(newVal);
      },
      immediate: true
    }
  },
  methods: {
    async fetchLoanInfo(id) {
      this.isLoading = true;
      let loanResponse = await fetchLoan(id);

      if (loanResponse?.data?.results?.[0])
        this.loan = loanResponse?.data?.results?.[0];

      let loanSpecimensResponse = await fetchLoanSpecimens(id);
      let loanSamplesResponse = await fetchLoanSamples(id);

      if (loanSpecimensResponse?.data?.results)
        this.loanSpecimens = loanSpecimensResponse?.data?.results;
      if (loanSamplesResponse?.data?.results)
        this.loanSamples = loanSamplesResponse?.data?.results;

      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}
/* BOOTSTRAP OVERRIDE */
.container--fluid {
  max-width: 100%;
}
</style>
