<template>
  <v-main class="loan-print">
    <lang-buttons style="z-index: 10" :is-dark="false" class="d-print-none" />
    <v-container>
      <v-skeleton-loader
        v-if="isLoading"
        type="list-item@2, article, table-heading, table-thead, table-tbody, article, table-tfoot"
        elevation="2"
        height="100%"
        class="pa-2 d-print-none"
      />
      <template v-else-if="loan">
        <v-row no-gutters v-if="loan.returned">
          <v-col cols="12" class="red--text font-weight-bold">
            {{ $t("loan_print.has_returned") }}
          </v-col>
        </v-row>

        <v-row no-gutters class="text-center mt-4">
          <v-col cols="12">
            <div
              style="font-size: 1.2rem"
              v-translate="{
                et: loan.loaner__institution__institution_name,
                en: loan.loaner__institution__institution_name_en,
              }"
            />
          </v-col>
          <v-col cols="12" style="font-size: 0.8rem">
            {{ loanReturnAddress }}
          </v-col>
          <v-col cols="12">
            <v-divider class="mt-1" style="border-color: black"></v-divider>
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
                {{ $t("loan_print.heading_default") }}
                {{ loan.loan_number }}
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
                    en: loan.borrower__profession_en,
                  }"
                ></span
              ></span>
            </div>

            <div
              v-translate="{
                et: loan.borrower_institution__institution_name,
                en: loan.borrower_institution__institution_name_en,
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
                en: loan.borrower_institution__country__value_en,
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
            <div>
              {{ $t("loan_print.specimen_info") }}
              <span
                v-translate="{
                  et: ' ',
                  en: ' for ',
                }"
              ></span>
              <span
                v-translate="{
                  et: loan.type__value,
                  en: loan.type__value_en,
                }"
              ></span>
              <span v-if="loan.project">
                (<b>{{ loan.project }}</b
                >)</span
              >

              <!-- NOTE: Do not show when digital loan -->
              <template v-if="loan.type !== 7">
                {{ $t("loan_print.specimen_info2") }}
                <span
                  v-translate="{
                    et: loan.loaner__institution__institution_name,
                    en: loan.loaner__institution__institution_name_en,
                  }"
                ></span>
                {{ $t("loan_print.specimen_info3") }}

                <span class="font-weight-bold">{{ loan.date_end }}</span>
              </template>
              .
            </div>

            <div v-if="loan.delivery_method__value" class="mt-2">
              {{ $t("loan_print.specimen_info4") }}
              <span
                v-translate="{
                  et: loan.delivery_method__value,
                  en: loan.delivery_method__value_en,
                }"
              ></span>
              <span v-if="loan.deliverer">
                <span
                  v-translate="{
                    et: ' ',
                    en: ' by ',
                  }"
                ></span>
                {{ loan.deliverer__agent
                }}<span
                  v-translate="{
                    et: ' poolt.',
                    en: '.',
                  }"
                ></span>
              </span>
            </div>
          </v-col>

          <v-col cols="12" v-else-if="loanSamples.length > 0">
            <div>
              {{ $t("loan_print.sample_info") }}
              {{ loan.borrower__forename }}
              {{ loan.borrower__surename }} (<span
                v-translate="{
                  et: loan.borrower_institution__institution_name,
                  en: loan.borrower_institution__institution_name_en,
                }"
              ></span
              >)
              <span
                v-translate="{
                  et: ' ',
                  en: ' for ',
                }"
              ></span>
              <span
                v-translate="{
                  et: loan.type__value,
                  en: loan.type__value_en,
                }"
              ></span>
              <span v-if="loan.project"> ({{ loan.project }})</span>
              <span
                v-translate="{
                  et: ' jaoks.',
                  en: '.',
                }"
              ></span>
              {{ $t("loan_print.sample_info2") }}
            </div>

            <div class="mt-2">
              {{ $t("loan_print.sample_info3") }}
              <span
                v-translate="{
                  et: loan.delivery_method__value,
                  en: loan.delivery_method__value_en,
                }"
              ></span>
              <span
                v-translate="{
                  et: ' ',
                  en: ' by ',
                }"
              ></span>
              <span>{{ loan.deliverer__agent }}</span>
              <span
                v-translate="{
                  et: ' poolt',
                  en: '',
                }"
              ></span
              >.
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="loanSpecimens.length > 0">
          <v-col cols="12">
            <div class="font-weight-bold">
              {{ $t("loan_print.table_heading_specimen") }} ({{
                loanSpecimens.length
              }})
            </div>
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
                  <tr v-for="(item, index) in loanSpecimens" :key="item.id">
                    <td>
                      {{ index + 1 }}.
                      <span class="font-weight-bold">
                        {{ item.specimen__database__acronym }}
                        {{ item.specimen__specimen_id }}
                      </span>
                    </td>
                    <td>
                      <div
                        v-if="
                          names &&
                          names.length > 0 &&
                          names.find(
                            (specimen) => specimen.id === item.specimen
                          )
                        "
                      >
                        <div
                          v-if="
                            names.find(
                              (specimen) => specimen.id === item.specimen
                            ).taxonId
                          "
                        >
                          <i
                            v-translate="{
                              et: names.find(
                                (specimen) => specimen.id === item.specimen
                              ).name,
                              en: names.find(
                                (specimen) => specimen.id === item.specimen
                              ).name_en,
                            }"
                          />
                        </div>

                        <div
                          v-else-if="
                            names.find(
                              (specimen) => specimen.id === item.specimen
                            ).rockId
                          "
                        >
                          <i
                            v-translate="{
                              et: names.find(
                                (specimen) => specimen.id === item.specimen
                              ).name,
                              en: names.find(
                                (specimen) => specimen.id === item.specimen
                              ).name_en,
                            }"
                          />
                        </div>

                        <i
                          v-else
                          v-translate="{
                            et: names.find(
                              (specimen) => specimen.id === item.specimen
                            ).name,
                            en: names.find(
                              (specimen) => specimen.id === item.specimen
                            ).name_en,
                          }"
                        />
                      </div>
                    </td>
                    <td
                      v-translate="{
                        et: item.specimen__locality__locality,
                        en: item.specimen__locality__locality_en,
                      }"
                    ></td>
                    <td
                      v-translate="{
                        et: item.specimen__stratigraphy__stratigraphy,
                        en: item.specimen__stratigraphy__stratigraphy_en,
                      }"
                    ></td>
                    <td>{{ item.specimen__agent_collected__agent }}</td>
                    <td>{{ item.remarks }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>

        <v-row
          v-if="loanSamples.length > 0"
          no-gutters
          :class="{ 'mt-2': loanSpecimens.length > 0 }"
        >
          <v-col cols="12">
            <div class="font-weight-bold">
              {{ $t("loan_print.table_heading_sample") }} ({{
                loanSamples.length
              }})
            </div>
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
                        :href="`https://geocollections.info/sample/${item.sample}`"
                        class="sarv-link"
                        target="LoanSampleWindow"
                        style="word-break: break-all"
                      >
                        {{ `geocollections.info/sample/${item.sample}` }}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>

        <div style="page-break-inside: avoid">
          <v-row no-gutters class="pt-10" v-if="loanSpecimens.length > 0">
            <!-- When loan is not digital show signature lines -->
            <template v-if="loan.type !== 7">
              <v-col cols="4">
                <div class="text-center" style="color: transparent">.</div>
                <div style="border-bottom: 1px solid black"></div>
                <div class="text-center">
                  {{ loan.borrower__forename }} {{ loan.borrower__surename }}
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-center" style="color: transparent">.</div>
                <div style="border-bottom: 1px solid black"></div>
                <div class="text-center">
                  {{ loanerSignature }}
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-center">{{ loan.date_start }}</div>
                <div style="border-bottom: 1px solid black"></div>
                <div class="text-center">{{ $t("loan_print.date") }}</div>
              </v-col>
            </template>
            <template v-else>
              <v-col cols="4" class="px-2">
                <div>{{ $t("loan_print.loaner") }}</div>
                <div class="font-weight-bold">
                  {{ loanerSignature }}
                </div>
              </v-col>
              <v-col cols="4">
                <div>{{ $t("loan_print.date") }}</div>
                <div class="font-weight-bold">{{ loan.date_start }}</div>
              </v-col>
            </template>
          </v-row>

          <v-row no-gutters class="my-5" style="border: 1px solid black">
            <v-col cols="12" class="pa-1" v-if="loanSpecimens.length > 0">
              <template v-if="loan.type !== 7">
                <div class="font-weight-bold mt-4 mb-3">
                  {{ $t("loan_print.specimen_extra0") }}
                  <span
                    v-translate="{
                      et: loan.loaner__institution__institution_name,
                      en: loan.loaner__institution__institution_name_en,
                    }"
                  />
                  {{ $t("loan_print.specimen_extra0a") }}
                </div>

                <div class="my-3">
                  {{ $t("loan_print.specimen_extra1") }}
                  <span class="font-weight-bold">{{
                    loanSpecimens.length
                  }}</span>
                  {{ $t("loan_print.specimen_extra2") }}
                  <span>{{ loan.date_end }}</span>
                  {{ $t("loan_print.specimen_extra3") }}
                  <span
                    v-translate="{
                      et: loan.loaner__institution__institution_name,
                      en: loan.loaner__institution__institution_name_en,
                    }"
                  />
                </div>

                <div class="my-3">
                  {{ $t("loan_print.specimen_extra4") }}
                </div>
              </template>

              <div class="my-3">
                {{ $t("loan_print.specimen_extra5") }}
                <span
                  v-translate="{
                    et: loan.loaner__institution__institution_name,
                    en: loan.loaner__institution__institution_name_en,
                  }"
                />
                {{ $t("loan_print.specimen_extra5a") }}
              </div>

              <div class="mt-3 mb-4">
                <b>{{ $t("loan_print.specimen_extra6") }}</b
                >: {{ loan.special }}
              </div>
            </v-col>

            <v-col cols="12" class="pa-2" v-else-if="loanSamples.length > 0">
              <div class="font-weight-bold mt-4 mb-3">
                {{ $t("loan_print.sample_extra") }}
              </div>

              <div class="my-3">
                {{ $t("loan_print.sample_extra1") }}
                <span
                  v-translate="{
                    et: loan.loaner__institution__institution_name,
                    en: loan.loaner__institution__institution_name_en,
                  }"
                ></span
                >.
                {{ $t("loan_print.sample_extra1a") }}
                <a
                  href="https://geocollections.info"
                  class="sarv-link"
                  target="GeocollectionsWindow"
                  >https://geocollections.info</a
                >
              </div>

              <div class="my-3">
                {{ $t("loan_print.sample_extra2") }}
                <span
                  v-translate="{
                    et: loan.loaner__institution__institution_name + '.',
                    en: loan.loaner__institution__institution_name_en,
                  }"
                ></span>
                {{ $t("loan_print.sample_extra2a") }}
                <span
                  v-translate="{
                    et: loan.loaner__institution__institution_name,
                    en: loan.loaner__institution__institution_name_en,
                  }"
                ></span
                >.
                {{ $t("loan_print.sample_extra2b") }}
              </div>

              <div class="mt-3 mb-4">
                <b>{{ $t("loan_print.sample_extra3") }}</b> {{ loan.special }}
              </div>
            </v-col>
          </v-row>

          <!-- Show only when not digital loan -->
          <v-row v-if="loan.type !== 7" no-gutters class="mt-15 mb-4">
            <v-col cols="4" class="pr-2">
              <div style="border-bottom: 1px solid black"></div>
              <div v-if="loanSpecimens.length > 0">
                <div class="text-center">
                  {{ $t("loan_print.name_and_signature") }}
                </div>
              </div>
              <div v-else-if="loanSamples.length > 0">
                <div class="text-center" v-if="loanerSignature">
                  {{ loanerSignature }}
                </div>
                <div class="text-center" v-else>
                  {{ $t("loan_print.signature") }}
                </div>
              </div>
            </v-col>
            <v-col cols="4">
              <div style="border-bottom: 1px solid black"></div>
              <div class="text-center">{{ $t("loan_print.date") }}</div>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-container>
  </v-main>
</template>

<script>
import {
  fetchLoan,
  fetchLoanSamples,
  fetchLoanSpecimens,
  fetchSpecimenIdentificationGeologiesList,
  fetchSpecimenIdentificationsList,
} from "../../assets/js/api/apiCalls";
import LangButtons from "../partial/LangButtons";

export default {
  name: "LoanPrint",
  components: { LangButtons },
  data: () => ({
    loan: null,
    isLoading: false,
    loanSpecimens: [],
    loanSamples: [],
    names: [],
  }),
  computed: {
    loanReturnAddress() {
      let address = "";
      if (this.loan.loaner__institution__address)
        address += this.loan.loaner__institution__address;
      if (this.loan.loaner__institution__address1)
        address += `, ${this.loan.loaner__institution__address1}`;
      if (this.loan.loaner__institution__address2)
        address += `, ${this.loan.loaner__institution__address2}`;
      if (this.loan.loaner__institution__phone)
        address += `; tel: ${this.loan.loaner__institution__phone}`;
      if (this.loan.loaner__institution__http)
        address += `; ${this.loan.loaner__institution__http}`;
      if (this.loan.loaner__institution__email)
        address += `; e-mail: ${this.loan.loaner__institution__email}`;

      return address;
    },

    loanerSignature() {
      let signature = "";
      if (this.loan.loaner__forename && this.loan.loaner__surename)
        signature += `${this.loan.loaner__forename} ${this.loan.loaner__surename}`;
      else signature += `${this.loan.loaner__agent}`;
      if (this.$i18n.locale === "ee" && this.loan.loaner__profession)
        signature += `, ${this.loan.loaner__profession}`;
      else if (this.loan.loaner__profession_en)
        signature += `, ${this.loan.loaner__profession_en}`;
      return signature;
    },
  },
  watch: {
    "$route.params.id": {
      handler(newVal) {
        this.fetchLoanInfo(newVal);
      },
      immediate: true,
    },
    loanSpecimens: {
      handler(newVal) {
        this.getNames(newVal);
      },
      deep: true,
    },
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

      this.loanSpecimens.sort(this.compareSpecimens);

      this.isLoading = false;
    },

    // Currently, only supports specimen_id-s which are in the form of '123-123'
    // There could be some other forms like '123-123-123' or 'G1:123:123'
    compareSpecimens(a, b) {
      const firstColl = parseInt(a?.specimen__specimen_id?.split("-")?.[0]);
      const firstNr = parseInt(a?.specimen__specimen_id?.split("-")?.[1]);
      const secondColl = parseInt(b?.specimen__specimen_id?.split("-")?.[0]);
      const secondNr = parseInt(b?.specimen__specimen_id?.split("-")?.[1]);

      if (firstColl > secondColl) {
        return 1;
      }
      if (firstColl < secondColl) {
        return -1;
      }
      if (firstColl === secondColl) {
        if (firstNr > secondNr) {
          return 1;
        }
        if (firstNr < secondNr) {
          return -1;
        }
        return 0;
      }
      return 0;
    },

    async getNames(listOfSpecimens) {
      if (listOfSpecimens && listOfSpecimens.length > 0) {
        let listOfIds = listOfSpecimens.map((specimen) => specimen.specimen);

        const taxonResponse = await fetchSpecimenIdentificationsList(listOfIds);
        const rockResponse = await fetchSpecimenIdentificationGeologiesList(
          listOfIds
        );

        if (taxonResponse.status === 200 && rockResponse.status === 200) {
          let taxonList = [];
          let rockList = [];

          if (taxonResponse.data.count > 0) {
            taxonList = taxonResponse.data.results.map((entity) => {
              return {
                id: entity.specimen_id,
                name: entity.taxon__taxon ? entity.taxon__taxon : entity.name,
                name_en: entity.taxon__taxon
                  ? entity.taxon__taxon
                  : entity.name,
                taxonId: entity.taxon_id,
              };
            });
          }

          if (rockResponse.data.count > 0) {
            rockList = rockResponse.data.results.map((entity) => {
              let name = "";
              let name_en = "";

              if (entity.rock__name && !entity.name) name = entity.rock__name;
              else if (
                entity.rock__name &&
                entity.name &&
                entity.rock__name !== entity.name
              )
                name = entity.name + " | " + entity.rock__name;
              else name = entity.name;

              if (entity.rock__name_en && !entity.name_en)
                name_en = entity.rock__name_en;
              else if (
                entity.rock__name_en &&
                entity.name_en &&
                entity.rock__name_en !== entity.name_en
              )
                name_en = entity.name_en + " | " + entity.rock__name_en;
              else name_en = entity.name_en;

              if (entity.rock__formula_html) {
                name += " | " + entity.rock__formula_html;
                name_en += " | " + entity.rock__formula_html;
              }

              return {
                id: entity.specimen_id,
                name: name,
                name_en: name_en,
                rockId: entity.rock_id,
              };
            });
          }

          if (taxonList.length > 0 && rockList.length > 0) {
            rockList.forEach((taxon) => {
              let item = taxonList.find((rock) => taxon.id === rock.id);
              item ? this.names.push(item) : this.names.push(taxon);
            });
            taxonList.forEach((taxonItem) => {
              let secondItem = rockList.find(
                (rockItem) => taxonItem.id === rockItem.id
              );
              secondItem
                ? this.names.push(secondItem)
                : this.names.push(taxonItem);
            });
          } else if (taxonList.length > 0) this.names = taxonList;
          else if (rockList.length > 0) this.names = rockList;
        }
      }
    },
  },
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
