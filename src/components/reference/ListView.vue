<template>
  <div class="list-view">
    <div class="row">
      <div class="col">

        <div class="list" v-for="(entity, index) in data">

          <div class="list-row ml-2 p-1">
            <span>
              <router-link :to="{ path: '/reference/' + entity.id }" :title="$t('editReference.editMessage')">
                <b>{{(page - 1) * paginateBy + index + 1}}.</b>
              </router-link>
            </span>

            <span v-if="entity.author">
              {{ entity.author }},
            </span>

            <span v-if="entity.year">
              {{ entity.year }}.
            </span>

            <span v-if="entity.title">
              {{ entity.title }}.
            </span>

            <span v-if="entity.book">
              {{ entity.book }},
            </span>

            <span v-if="entity.publisher">
              {{ entity.publisher }}.
            </span>

            <span v-if="entity.publisher_place">
              {{ entity.publisher_place }}.
            </span>

            <span v-if="entity.journal__journal_name">
              <i>{{ entity.journal__journal_name }}</i>,
            </span>

            <span v-if="entity.name">
              <b>{{ entity.volume }}</b>,
            </span>

            <span v-if="entity.pages">
              {{ entity.pages }}.
            </span>

            <!-- TODO: DOI LINK -->
            <span v-if="entity.doi">
              <a href="javascript:void(0)" @click="openDOI({doi: entity.doi})">
                <b>DOI </b>
              </a>
            </span>

            <span>
              <a v-if="entity.attachment__filename" class="green-link" href="javascript:void(0)" @click="openPdf({pdf: entity.attachment__filename})">
                <b>PDF</b>
              </a>
              <a v-if="entity.attachment__filename === null && entity.url" class="red-link" :href="entity.url" target="_blank" rel="noopener noreferrer">
                <b>PDF</b>
              </a>
            </span>

            <!-- TODO: PDF LINK -->
            <!--<span data-ng-if="entity.reference__attachment__filename && entity.reference__attachment__filename != null">-->
              <!--<a href data-ng-click="detailCtrl.service.openUrlInNewWindow({url: detailCtrl.service.getFileLink({filename: entity.reference__attachment__filename})})">-->
                <!--<b style="color: green">PDF</b>-->
              <!--</a>-->
            <!--</span>-->

            <!-- TODO: PDF LINK -->
            <!--<span data-ng-if="entity.reference__attachment__filename === null-->
                            <!--&& (entity.reference__url && entity.reference__url !== null)">-->
              <!--<a href data-ng-click="detailCtrl.service.openUrlInNewWindow({url: entity.reference__url})">-->
                <!--<b style="color: red">PDF</b>-->
              <!--</a>-->
            <!--</span>-->
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['data', 'page', 'paginateBy'],
    name: "ListView",
    methods: {
      openDOI(params) {
        // TODO: Check for correct doi address
        window.open('https://doi.org/' + params.doi, '', 'width=1000,height=900')
      },

      openPdf(params) {
        window.open('https://files.geocollections.info/' + params.pdf.substring(0, 2) + '/' + params.pdf.substring(2, 4) + '/' + params.pdf, '', 'width=1000,height=900')
      },
    }
  }
</script>

<style scoped>
  .list:not(:first-child) {
    border-top: dotted 1.2pt #ccc
  }

  .list-row {
    font-size: 0.9rem;
  }

  .green-link {
    color: green;
  }

  .red-link {
    color: red;
  }
</style>
