<template>
  <div class="library">
    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- AUTHOR AND YEAR -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`author`">{{ $t('library.author') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="author" :state="isDefinedAndNotNull(author.author)" v-model="author.author" type="text"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`year`">{{ $t('library.year') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="year" v-model="library.year" type="number"></b-form-input>
      </div>
    </div>

    <!-- TITLE -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`title`">{{ $t('library.title') }}:</label>
      </div>

      <div class="col-sm-10">
        <b-form-input id="title" v-model="library.title" type="text"></b-form-input>
      </div>
    </div>

    <!-- TITLE_EN -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`title_en`">{{ $t('library.title_en') }}:</label>
      </div>

      <div class="col-sm-10">
        <b-form-input id="title_en" v-model="library.title_en" type="text"></b-form-input>
      </div>
    </div>

    <!-- KEYWORDS -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`keywords`">{{ $t('library.keywords') }}:</label>
      </div>

      <div class="col-sm-10">
        <b-form-input id="keywords" v-model="library.keywords" type="text"></b-form-input>
      </div>
    </div>

    <!-- ABSTRACT AND ABSTRACT_EN -->
    <div class="row">
      <div class="col-sm-2">
        <label :for="`abstract`">{{ $t('library.abstract') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="abstract" v-model="author.abstract" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>


      <div class="col-sm-2">
        <label :for="`abstract_en`">{{ $t('library.abstract_en') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-textarea id="abstract_en" v-model="author.abstract_en" type="text" size="sm"
                         :rows="1" :max-rows="20"></b-form-textarea>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {faTimes} from '@fortawesome/free-solid-svg-icons'
  import { fetchLibrary } from "../../assets/js/api/apiCalls";
  import cloneDeep from 'lodash/cloneDeep'
  import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
  import formManipulation  from './../mixins/formManipulation'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'

  library.add(faTimes)

  export default {
    name: "Library",
    components: {
      FontAwesomeIcon,
      VueMultiselect,
      Spinner,
    },
    mixins: [formManipulation,autocompleteFieldManipulation],
    data() {
      return {
        autocomplete: {
          loaders: {
            locality:false,
            stratigraphy_top:false,
            stratigraphy_base:false,
            agent:false,
            reference:false,
            synonym:false,
            attachment:false,
            stratigraphy:false
          },
          localityTypes: [],
          locality: [],
          extent: [],
          coordPrecision: [],
          coordMethod: [],
          reference:[],
          agent: [],
          country: [],
          county: [],
          parish: [],
          stratigraphy_top: [],
          stratigraphy_base: [],
          synonym:[],
          attachment: [],
          stratigraphy: []
        },
        requiredFields: ['author'],
        author: {}
      }
    },
    created() {
      if (this.$route.meta.isEdit) {
        this.sendingData = true
        fetchLibrary(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response)
          if (handledResponse.length > 0) {
            this.author = this.handleResponse(response)[0]
            this.fillAutocompleteFields(this.author)
            this.removeUnnecessaryFields();
            this.$emit('data-loaded', this.author)
            this.$emit('set-object','library')
            this.sendingData = false;
          } else {
            this.sendingData = false;
          }
        })
      }
    },
    methods: {
      removeUnnecessaryFields(){
        // let copyFields = ['id','locality','locality_en','number','code','latitude','longitude','elevation','depth',
        //   'coordx','coordy','coord_system','stratigraphy_top_free','stratigraphy_base_free','maaamet_pa_id','eelis',
        //   'remarks_location','remarks','is_private', 'type','parent','extent','coord_det_precision','coord_det_method',
        //   'coord_det_agent','country','stratigraphy_top','stratigraphy_base']
        //
        // let vm = this;
        // //copy only certain fields
        // Object.entries(this.locality).forEach(entry => {
        //   if (copyFields.indexOf(entry[0]) < 0) {
        //     delete vm.locality[entry[0]]
        //   }
        // });
      },

      fillAutocompleteFields(obj){
        // this.author.type = {value:obj.type__value,value_en:obj.type__value_en,id:obj.type__id}
        // this.author.parent = {locality:obj.parent__locality,locality_en:obj.parent__locality_en,id:obj.parent__id}
        // this.author.extent = {value:obj.extent__value,value_en:obj.extent__value_en,id:obj.extent__id}
        // this.author.coord_det_precision = {value:obj.coord_det_precision__value,value_en:obj.coord_det_precision__value_en,id:obj.coord_det_precision__id}
        // this.author.coord_det_method = {value:obj.coord_det_method__value,value_en:obj.coord_det_method__value_en,id:obj.coord_det_method__id}
        // this.author.coord_det_agent = {agent:obj.coord_det_agent__agent,id:obj.coord_det_agent__id}
        // this.author.country = {value:obj.country__value,value_en:obj.country__value_en,id:obj.country__id}
        // this.author.stratigraphy_top = {stratigraphy:obj.stratigraphy_top__stratigraphy,stratigraphy_en:obj.stratigraphy_top__stratigraphy_en,id:obj.stratigraphy_top__id}
        // this.author.stratigraphy_base = {stratigraphy:obj.stratigraphy_base__stratigraphy,stratigraphy_en:obj.stratigraphy_base__stratigraphy_en,id:obj.stratigraphy_base__id}
      },
    }
  }
</script>

<style scoped>

</style>
