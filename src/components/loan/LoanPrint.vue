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
        <v-row no-gutters v-if="loan.returned">
          <v-col cols="12" class="red--text font-weight-bold">
            {{ $t("loan_print.has_returned") }}
          </v-col>
        </v-row>

        <v-row no-gutters class="text-center mt-4">
          <v-col cols="12">{{ $t("loan_print.title") }}</v-col>
          <v-col cols="12" style="font-size: 0.7rem;">{{
            $t("loan_print.title_address")
          }}</v-col>
          <v-col cols="12">
            <v-divider class="mt-1" style="border-color: black;"></v-divider>
          </v-col>
        </v-row>

        <v-row no-gutters class="text-center">
          <v-col cols="12">
            <div class="h4 font-weight-bold">
              <div v-if="loanSpecimens.length > 0">
                {{ $t("loan_print.heading_specimen") }}
                {{ loan.loan_number }}
              </div>
              <div v-else-if="loanSamples.length > 0">
                {{ $t("loan_print.heading_sample") }}
                {{ loan.loan_number }}
              </div>
              <div v-else>
                {{ $t("loan_print.heading_default") }} {{ loan.loan_number }}
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <div>
              {{ $t("loan_print.to") }}
            </div>

            <div>
              {{ loan.borrower__title }}
              <b>{{ loan.borrower__forename }} {{ loan.borrower__surename }}</b>
              <span
                v-if="loan.borrower__profession || loan.borrower__profession_en"
                >,
                <span
                  v-translate="{
                    et: loan.borrower__profession,
                    en: loan.borrower__profession_en
                  }"
                ></span
              ></span>
            </div>

            <div
              v-translate="{
                et: loan.borrower_institution__institution_name,
                en: loan.borrower_institution__institution_name_en
              }"
            ></div>

            <div>
              {{ loan.borrower_institution__address }}
            </div>

            <div>
              {{ loan.borrower_institution__address1 }}
            </div>

            <div>
              {{ loan.borrower_institution__address2 }}
            </div>

            <div
              v-translate="{
                et: loan.borrower_institution__country__value,
                en: loan.borrower_institution__country__value_en
              }"
            ></div>

            <div>
              {{ loan.borrower_institution__phone }}
            </div>

            <div>
              {{ loan.borrower_institution__email }}
            </div>

            <div>
              {{ loan.borrower_institution__http }}
            </div>
          </v-col>
        </v-row>

        <v-row no-gutters class="my-5">
          <v-col cols="12" v-if="loanSpecimens.length > 0">
            <div>todo</div>
          </v-col>

          <v-col cols="12" v-else-if="loanSamples.length > 0">
            <div>
              {{ $t("loan_print.sample_info") }}
              {{ loan.borrower__forename }} {{ loan.borrower__surename }} (<span
                v-translate="{
                  et: loan.borrower_institution__institution_name,
                  en: loan.borrower_institution__institution_name_en
                }"
              ></span
              >).
              {{ $t("loan_print.sample_info2") }}
            </div>

            <div>
              {{ $t("loan_print.sample_info3") }}
              <span
                v-translate="{
                  et: loan.delivery_method__value,
                  en: loan.delivery_method__value_en
                }"
              ></span>
              <span
                v-translate="{
                  et: ' ',
                  en: ' by '
                }"
              ></span>
              <span>{{ loan.borrower__surename }}</span>
              <span
                v-translate="{
                  et: ' poolt',
                  en: ''
                }"
              ></span
              >.
            </div>
          </v-col>
        </v-row>

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
          <v-col cols="12" class="pa-1" v-if="loanSpecimens.length > 0">
            <div class="font-weight-bold">
              Please return a signed copy of this invoice to: Department of
              Geology, Tallinn University of Technology.
            </div>
          </v-col>

          <v-col cols="12" class="pa-2" v-else-if="loanSamples.length > 0">
            <div class="font-weight-bold mt-3 mb-2">
              {{ $t("loan_print.sample_extra") }}
            </div>

            <div class="my-2">
              {{ $t("loan_print.sample_extra1")
              }}<a
                href="https://geocollections.info"
                class="sarv-link"
                target="GeocollectionsWindow"
                >https://geocollections.info</a
              >
            </div>

            <div class="my-2">
              {{ $t("loan_print.sample_extra2") }}
            </div>

            <div class="mt-2 mb-3">
              <b>{{ $t("loan_print.sample_extra3") }}</b> {{ loan.special }}
            </div>
          </v-col>
        </v-row>

        <v-row no-gutters class="mt-12 mb-4">
          <v-col cols="4"></v-col>
          <v-col cols="4" class="pr-2">
            <div style="border-bottom: 1px solid black;"></div>
            <div class="text-center" v-if="loan.database === 1">{{ $t("loan_print.chief_curator") }}</div>
            <div class="text-center" v-else>{{ $t("loan_print.signature") }}</div>
          </v-col>
          <v-col cols="4">
            <div style="border-bottom: 1px solid black;"></div>
            <div class="text-center">{{ $t("common.date") }}</div>
          </v-col>
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
