<template>
  <div class="list-view">
    <div class="row">
      <div class="col">

        <div class="list" v-for="(entity, index) in data">

          <div class="list-row ml-2 p-1">
            <!--<span>
              <router-link :to="{ path: '/reference/' + entity.id }" :title="$t('editReference.editMessage')">
                <b>{{(page - 1) * paginateBy + index + 1}}.</b>
              </router-link>
            </span>-->
            
            
            <span v-if="entity.author" class="ablack">
              <router-link :to="{ path: '/reference/' + entity.id }" :title="$t('editReference.editMessage')">
                {{ entity.author }},
              </router-link>
            </span>

            <span v-if="entity.year">
              {{ entity.year }}.
            </span>

            <span v-if="entity.title">
              {{ entity.title }}.
            </span>

            <span v-if="entity.book_editor || entity.book">
              <i>In: </i> 
            </span>
              
            <span v-if="entity.book_editor">
              {{ entity.book_editor }} (ed.), 
            </span>
              
            <span v-if="entity.book">
              <i>{{ entity.book }}</i>. 
            </span>

            <span v-if="entity.publisher">
              {{ entity.publisher }},
            </span>

            <span v-if="entity.publisher_place">
              {{ entity.publisher_place }}.
            </span>

            <span v-if="entity.journal__journal_name">
              <i>{{ entity.journal__journal_name }}</i> 
            </span>

            <span v-if="entity.volume">
              {{ entity.volume }},
            </span>

            <span v-if="entity.number">
              {{ entity.number }},
            </span>

            <span v-if="entity.pages && entity.journal__journal_name">
              {{ entity.pages }}.
            </span>
            
            <span v-else-if="entity.pages">
              pp. {{ entity.pages }}.
            </span>
              
            <!-- TODO: DOI LINK -->
            <span v-if="entity.doi">
              <a href="javascript:void(0)" @click="openDOI({doi: entity.doi})">
                 https://doi.org/{{ entity.doi }} 
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
  .list/*:not(:first-child)*/ {
    /*border-top: dotted 1.2pt #ccc;*/
    padding: 0.2em 0 0 4em;
    text-indent: -4em;  
  }

  .list-row {
    font-size: 1rem;
  }

  .green-link {
    color: #FF5100;
  }

  .red-link {
    color: #B43900;
  }
  
  .ablack a:link, .ablack a:visited {
	  color: #000;
  }
</style>
