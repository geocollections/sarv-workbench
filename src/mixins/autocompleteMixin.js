import { autocompleteSearch } from "@/assets/js/api/apiCalls";
import { mapGetters } from "vuex";
import debounce from "lodash/debounce";

// Todo: Rename to autocompleteSearchMixin
const autocompleteMixin = {
  computed: {
    commonLabel() {
      return this.$i18n.locale === "ee" ? "value" : "value_en";
    },
    localityLabel() {
      return this.$i18n.locale === "ee" ? "locality" : "locality_en";
    },
    stratigraphyLabel() {
      return this.$i18n.locale === "ee" ? "stratigraphy" : "stratigraphy_en";
    },
    nameLabel() {
      return this.$i18n.locale === "ee" ? "name" : "name_en";
    },
    analysisMethodLabel() {
      return this.$i18n.locale === "ee" ? "analysis_method" : "method_en";
    },
    instrumentLabel() {
      return this.$i18n.locale === "ee" ? "instrument" : "instrument_en";
    },
    labLabel() {
      return this.$i18n.locale === "ee" ? "lab" : "lab_en";
    },
    licenceLabel() {
      return this.$i18n.locale === "ee" ? "licence" : "licence_en";
    },
    classLabel() {
      return this.$i18n.locale === "ee" ? "class_field" : "class_en";
    },
    maakondLabel() {
      return this.$i18n.locale === "ee" ? "maakond" : "maakond_en";
    },
    propertyLabel() {
      return this.$i18n.locale === "ee" ? "property" : "property_en";
    },
    keywordCategoryLabel() {
      return this.$i18n.locale === "ee"
        ? "keyword_category__name"
        : "keyword_category__name_en";
    },
    libraryTitle() {
      return this.$i18n.locale === "ee"
        ? "library__title"
        : "library__title_en";
    },
    rankLabel() {
      return this.$i18n.locale === "ee" ? "rank" : "rank_en";
    },
    drillcoreLabel() {
      return this.$i18n.locale === "ee" ? "drillcore" : "drillcore_en";
    },
    institutionLabel() {
      return this.$i18n.locale === "ee"
        ? "institution_name"
        : "institution_name_en";
    },
    parameterNameLabel() {
      return this.$i18n.locale === "ee"
        ? "parameter_name"
        : "parameter_name_en";
    },
    ...mapGetters("user", ["getCurrentAgent"]),
  },
  methods: {
    autocompleteAnalysisSearch(value) {
      this.$_autocompleteMixin_search(value, "analysis", "analysis");
    },
    autocompletePreparationSearch(value) {
      this.$_autocompleteMixin_search(value, "preparation", "preparation");
    },
    autocompleteParentProjectSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "parent_project",
        "parent_project"
      );
    },
    autocompleteProjectSearch(value) {
      this.$_autocompleteMixin_search(value, "project", "project");
    },
    autocompleteAreaSearch(value) {
      this.$_autocompleteMixin_search(value, "area", "area");
    },
    autocompleteLocalitySearch(value) {
      this.$_autocompleteMixin_search(value, "locality", "locality");
    },
    autocompleteLocalitySearch2(value) {
      this.$_autocompleteMixin_search(value, "locality", "locality");
    },
    autocompleteTaxonSearch(value) {
      this.$_autocompleteMixin_search(value, "taxon", "taxon");
    },
    autocompleteTaxonParentSearch(value) {
      this.$_autocompleteMixin_search(value, "taxon", "parent");
    },
    autocompleteTaxonFossilGroupSearch(value) {
      this.$_autocompleteMixin_search(value, "taxon", "fossil_group");
    },
    autocompleteTypeTaxonSearch(value) {
      this.$_autocompleteMixin_search(value, "taxon", "type_taxon");
    },
    autocompleteStratigraphySearch(value) {
      this.$_autocompleteMixin_search(value, "stratigraphy", "stratigraphy");
    },
    autocompleteChronostratigraphySearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "chronostratigraphy",
        "stratigraphy"
      );
    },
    autocompleteLithostratigraphySearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "lithostratigraphy",
        "lithostratigraphy"
      );
    },
    autocompleteLithostratigraphySearch2(value) {
      this.$_autocompleteMixin_search(
        value,
        "lithostratigraphy",
        "lithostratigraphy"
      );
    },
    autocompleteStorageSearch(value) {
      this.$_autocompleteMixin_search(value, "storage", "storage", 2);
    },
    autocompleteAdditionalStorageSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "storage_additional",
        "storage_additional"
      );
    },
    autocompleteStratigraphyTopSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "stratigraphy_top",
        "stratigraphy_top"
      );
    },
    autocompleteStratigraphyBaseSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "stratigraphy_base",
        "stratigraphy_base"
      );
    },
    autocompleteAgentSearch(value, options = "agent") {
      this.$_autocompleteMixin_search(value, "agent", options);
    },
    autocompleteOwnerSearch(value) {
      this.$_autocompleteMixin_search(value, "owner", "agent");
    },
    autocompleteOwner2Search(value) {
      this.$_autocompleteMixin_search(value, "owner", "owner");
    },
    autocompleteIdentificationAgentSearch(value) {
      this.$_autocompleteMixin_search(value, "agent", "identification_agent");
    },
    autocompleteCopyrightAgentSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "copyright_agent",
        "copyright_agent"
      );
    },
    autocompleteAgentDigitisedSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "agent_digitised",
        "agent_digitised"
      );
    },
    autocompleteProjectAgentSearch(value) {
      this.$_autocompleteMixin_search(value, "projectagent", "projectagent");
    },
    autocompleteLibraryAgentSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "library_agent",
        "library_agent",
        1
      );
    },
    autocompleteLibraryAgentSearch2(value) {
      this.$_autocompleteMixin_search(
        value,
        "library_agent_search",
        "library",
        1
      );
    },
    autocompleteRockSearch(value, options = "rock") {
      this.$_autocompleteMixin_search(value, "rock", options);
    },
    autocompleteSampleSeriesSearch(value) {
      this.$_autocompleteMixin_search(value, "series", "series");
    },
    autocompleteSampleSearch(value) {
      this.$_autocompleteMixin_search(value, "sample", "sample", 1);
    },
    autocompleteSpecimenSearch(value, options = "specimen") {
      this.$_autocompleteMixin_search(value, "specimen", options);
    },
    autocompleteSiteSearch(value) {
      this.$_autocompleteMixin_search(value, "site", "site");
    },
    autocompleteReferenceSearch(value) {
      this.$_autocompleteMixin_search(value, "reference", "reference");
    },
    autocompleteTranslatedReferenceSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "reference",
        "translated_reference"
      );
    },
    autocompleteSynonymSearch(value) {
      this.$_autocompleteMixin_search(value, "synonym", "synonym");
    },
    autocompleteAttachmentSearch(value) {
      this.$_autocompleteMixin_search(value, "attachment", "attachment");
    },
    autocompletePublicAttachmentSearch(value) {
      this.$_autocompleteMixin_search(value, "attachment_public", "attachment");
    },
    autocompletePublicAttachmentImageSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "attachment_public_image",
        "attachment"
      );
    },
    autocompleteJournalSearch(value) {
      this.$_autocompleteMixin_search(value, "journals", "journals", 1);
    },
    autocompleteLibrarySearch(value) {
      this.$_autocompleteMixin_search(value, "library", "library", 1);
    },
    autocompleteDoiReferenceSearch(value) {
      this.$_autocompleteMixin_search(value, "reference", "reference");
    },
    autocompleteDatasetSearch(value) {
      this.$_autocompleteMixin_search(value, "dataset", "dataset", 1);
    },
    autocompleteLabSearch(value) {
      this.$_autocompleteMixin_search(value, "lab", "lab", 1);
    },
    autocompleteInstrumentSearch(value) {
      this.$_autocompleteMixin_search(value, "instrument", "instrument", 1);
    },
    autocompleteDoiAgentSearch(value) {
      this.$_autocompleteMixin_search(value, "doi_agent", "doi_agent");
    },
    autocompleteCollSearch(value) {
      this.$_autocompleteMixin_search(value, "coll", "coll", 2);
    },
    autocompleteDrillcoreSearch(value) {
      this.$_autocompleteMixin_search(value, "drillcore", "drillcore");
    },
    autocompleteAgentCollectedSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "agent_collected",
        "agent_collected",
        2
      );
    },
    autocompleteClassificationSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "classification",
        "classification",
        2
      );
    },
    autocompleteKeywordSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "keyword",
        "keyword",
        1,
        "",
        false
      );
      // this.$_autocompleteMixin_search(value, 'keyword_group_by', 'keyword', 1, this.keywordCategoryLabel)
    },
    autocompleteKeywordCategorySearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "keyword_category",
        "keyword_category",
        1
      );
    },
    autocompleteRelatedKeywordSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "related_keyword",
        "related_keyword",
        1
      );
    },
    autocompleteAnalysisMethodSearch(value, options = "analysis_method") {
      this.$_autocompleteMixin_search(value, "analysis_method", options, 1);
    },
    autocompleteImagesetSearch(value) {
      this.$_autocompleteMixin_search(value, "imageset", "imageset", 2);
    },
    autocompleteRelatedDataSearch(value, id) {
      this.$_autocompleteMixin_search(
        value,
        "attach_link__" + id,
        "attach_link__" + id,
        2
      );
    },
    autocompleteInstitutionSearch(value) {
      this.$_autocompleteMixin_search(value, "institution", "institution", 2);
    },
    autocompleteStratigraphyParentSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "stratigraphy",
        "parent_stratigraphy",
        2
      );
    },
    autocompleteAgeChronostratigraphySearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "stratigraphy",
        "age_chronostratigraphy",
        2
      );
    },
    autocompleteRockClassificationSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "rock_classification",
        "rock_classification",
        2
      );
    },
    autocompleteAnalysisParameterSearch(value, options = "analysis_parameter") {
      this.$_autocompleteMixin_search(value, "analysis_parameter", options, 1);
    },
    autocompleteUserSearch(value) {
      this.$_autocompleteMixin_search(value, "user", "user", 2);
    },
    autocompleteSelectionSeriesSearch(value) {
      this.$_autocompleteMixin_search(
        value,
        "selection_series",
        "selection_series",
        2
      );
    },

    /**
     * Initiates autocomplete search and sets results to autocomplete object.
     * @param value - User inputted search value
     * @param type - String which is used for building search queries
     * @param options - String which will toggle loader state and sets results to autocomplete object
     * @param minLength {Integer} - Minimum length needed to trigger search
     * @param groupByField {String} - Field used to group results
     * @param clearAutocomplete {Boolean} - If set to false then autocomplete won't get cleared when multiselect field is cleared (needed in reference keywords search)
     */
    $_autocompleteMixin_search: debounce(function (
      value,
      type,
      options,
      minLength = 3,
      groupByField,
      clearAutocomplete = true
    ) {
      if (value) {
        if (value.length < minLength) {
          if (clearAutocomplete) this.autocomplete[options] = [];
        } else if (value.length >= minLength) {
          let query = buildAutocompleteQuery(
            type,
            value,
            this.getCurrentAgent,
            groupByField
          );
          if (query.length === 0) return;

          this.autocomplete.loaders[options] = true;
          autocompleteSearch(query).then((response) => {
            this.autocomplete.loaders[options] = false;
            this.autocomplete[options] = handleResponse(response);
          });
        }
      }
    },
    500),
  },
};

/**
 * Handles API response and returns list of items.
 * @param response - Response from API
 * @returns {List} - List of results or if count is 0 then empty list.
 */
function handleResponse(response) {
  if (response.status === 200)
    return response.data.count > 0 ? response.data.results : [];
}

/**
 *
 * @param type - Search type of which query is built
 * @param value - User search input
 * @param currentUser - Current logged in user
 * @param groupByField - Field used with &group_by=
 * @returns {string} - Search string
 */
function buildAutocompleteQuery(type, value, currentUser, groupByField) {
  switch (type) {
    case "analysis":
      return `analysis/?search=${value}&search_fields=id&fields=id,analysis_method__analysis_method,analysis_method__method_en`;
    case "preparation":
      return `preparation/?or_search=preparation_number__icontains:${value} OR id__icontains:${value}&fields=id,preparation_number`;
    case "locality":
      return `locality/?or_search=id__icontains:${value} OR locality__icontains:${value} OR locality_en__icontains:${value}&fields=id,locality,locality_en,longitude,latitude`;
    case "storage_additional":
    case "storage":
      return `location/?search=${value}&search_fields=location&fields=id,location`;
    case "stratigraphy":
    case "stratigraphy_top":
    case "stratigraphy_base":
      return `stratigraphy/?or_search=id__icontains:${value} OR stratigraphy__icontains:${value} OR stratigraphy_en__icontains:${value}&fields=id,stratigraphy,stratigraphy_en,hierarchy_string`;
    case "chronostratigraphy":
      return `stratigraphy/?type=1&or_search=id__icontains:${value} OR stratigraphy__icontains:${value} OR stratigraphy_en__icontains:${value}&fields=id,stratigraphy,stratigraphy_en`;
    case "lithostratigraphy":
      return `stratigraphy/?type=2&or_search=id__icontains:${value} OR stratigraphy__icontains:${value} OR stratigraphy_en__icontains:${value}&fields=id,stratigraphy,stratigraphy_en`;
    case "projectagent":
    case "library_agent":
    case "agent":
    case "owner":
    case "agent_digitised":
    case "agent_collected":
    case "copyright_agent":
    case "doi_agent":
      return `agent/?or_search=id__icontains:${value} OR agent__icontains:${value} OR forename__icontains:${value} OR surename__icontains:${value}&fields=id,agent,forename,surename,orcid`;
    case "institution":
      return `agent/?or_search=id__icontains:${value} OR agent__icontains:${value} OR institution_name__icontains:${value} OR institution_name_en__icontains:${value}&fields=id,agent,institution_name,institution_name_en`;
    case "rock":
      return `rock/?or_search=name__icontains:${value} OR name_en__icontains:${value}&fields=id,name,name_en`;
    case "project":
    case "parent_project":
      return `project/?or_search=name__icontains:${value} OR name_en__icontains:${value}&fields=id,name,name_en`;
    case "area":
      return `area/?or_search=name__icontains:${value} OR name_en__icontains:${value}&fields=id,name,name_en`;
    case "site":
      return `site/?or_search=name__icontains:${value} OR name_en__icontains:${value}&fields=id,name,name_en`;
    case "dataset":
      return `dataset/?or_search=name__icontains:${value} OR name_en__icontains:${value}&fields=id,name,name_en`;
    case "sample":
      return `sample/?search=${value}&search_fields=number&fields=id,number`;
    case "series":
      return `sample_series/?search=${value}&search_fields=name&fields=id,name`;
    case "specimen":
      return `specimen/?or_search=specimen_id__icontains:${value} OR coll__number__icontains:${value}&fields=id,specimen_id,coll__number`;
    case "reference":
      return `reference/?or_search=id__icontains:${value} OR reference__icontains:${value}&fields=id,reference,pages,figures,remarks`;
    case "synonym":
      return `locality_synonym/?search=${value}&search_fields=synonym&fields=id,synonym,reference,pages,remarks`;
    case "attachment":
      return `attachment/?or_search=id__icontains:${value} OR author__agent__icontains:${value} OR original_filename__icontains:${value} OR description__icontains:${value} OR description_en__icontains:${value}&fields=id,uuid_filename,description,description_en,original_filename,date_created,attachment_format,author__agent,image_number,is_preferred,is_private,remarks`;
    case "attachment_public":
      return `attachment/?or_search=id__icontains:${value} OR author__agent__icontains:${value} OR original_filename__icontains:${value} OR description__icontains:${value} OR description_en__icontains:${value}&is_private=false&fields=id,author,original_filename,description,description_en,remarks,uuid_filename`;
    case "attachment_public_image":
      return `attachment/?or_search=id__icontains:${value} OR author__agent__icontains:${value} OR original_filename__icontains:${value} OR description__icontains:${value} OR description_en__icontains:${value}&is_private=0&attachment_format__value__icontains=image&fields=id,author,original_filename,description,description_en,remarks,uuid_filename,attachment_format`;
    case "taxon":
      return `taxon/?search=${value}&search_fields=taxon&fields=id,taxon,hierarchy_string`;
    case "library":
      return `library/?or_search=id__icontains:${value} OR title__icontains:${value} OR title_en__icontains:${value}&author=${currentUser.id}&fields=id,title,title_en`;
    case "journals":
      return `journal/?or_search=id__icontains:${value} OR journal_name__icontains:${value} OR journal_short__icontains:${value}`;
    case "library_agent_search": // Todo: This should be done through library not library_agent
      return `library_agent/?agent=${currentUser.id}&or_search=library__title__icontains:${value} OR library__title_en__icontains:${value}&fields=library&nest=1`;
    case "coll":
      return `collection/?search=${value}&search_fields=number&fields=id,number`;
    case "classification":
      return `classification/?or_search=id__icontains:${value} OR class_field__icontains:${value} OR class_en__icontains:${value}&fields=id,class_field,class_en`;
    case "keyword":
    case "related_keyword":
      return `keyword/?or_search=id__icontains:${value} OR keyword__icontains:${value}`;
    case "keyword_category":
      return `keyword_category/?or_search=name__icontains:${value} OR name_en__icontains:${value}&fields=id,name,name_en`;
    case "analysis_method":
      return `analysis_method/?or_search=analysis_method__icontains:${value} OR method_en__icontains:${value}&fields=id,analysis_method,method_en`;
    case "drillcore":
      return `drillcore/?or_search=drillcore__icontains:${value} OR drillcore_en__icontains:${value}&fields=id,drillcore,drillcore_en`;
    case "analysis_parameter":
      return `analysis_parameter/?or_search=parameter__icontains:${value} OR parameter_name__icontains:${value} OR parameter_name_en__icontains:${value}&fields=id,parameter,parameter_name,parameter_name_en,parameter_html`;
    case "imageset":
      return `imageset/?or_search=user_added:${currentUser.forename} OR author__id:${currentUser.id}&search=${value}&search_fields=imageset_number`;
    case "user":
      return `user/?search=${value}&search_fields=username&fields=id,username`;
    case "rock_classification":
      return `rock_classification/?or_search=id__icontains:${value} OR name__icontains:${value} OR name_en__icontains:${value}&fields=id,name,name_en`;
    case "selection_series":
      return `selection_series/?or_search=id__icontains:${value} OR tablename__icontains:${value} OR remarks__icontains:${value}&fields=id,name,tablename,remarks`;
    case "attach_link__collection":
    case "attach_link__dataset":
    case "attach_link__project":
    case "attach_link__site":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,name,name_en;lookuptype:icontains&fields=id,name,name_en`;
    case "attach_link__specimen":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,specimen_id,coll__number;lookuptype:icontains&fields=id,specimen_id,coll__number`;
    case "attach_link__sample":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,number;lookuptype:icontains&fields=id,number`;
    case "attach_link__sample_series":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,name;lookuptype:icontains&fields=id,name`;
    case "attach_link__analysis":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,sample__number;lookuptype:icontains&fields=id,sample__number`;
    case "attach_link__doi":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,identifier;lookuptype:icontains&fields=id,identifier`;
    case "attach_link__locality":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,locality,locality_en;lookuptype:icontains&fields=id,locality,locality_en`;
    case "attach_link__drillcore":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,drillcore,drillcore_en;lookuptype:icontains&fields=id,drillcore,drillcore_en`;
    case "attach_link__drillcore_box":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,drillcore__drillcore,drillcore__drillcore_en,number;lookuptype:icontains&fields=id,drillcore__drillcore,drillcore__drillcore_en,number`;
    case "attach_link__preparation":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,preparation_number;lookuptype:icontains&fields=id,preparation_number`;
    case "attach_link__reference":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,reference;lookuptype:icontains&fields=id,reference`;
    case "attach_link__locality_description":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,description;lookuptype:icontains&fields=id,description`;
    case "attach_link__taxon":
      return `${
        type.split("__")[1]
      }/?multi_search=value:${value};fields:id,taxon;lookuptype:icontains&fields=id,taxon,author_year`;
    case "attach_link__storage":
      return `location/?multi_search=value:${value};fields:id,location,contents;lookuptype:icontains&fields=id,location,contents`;
    default:
      return "";
  }
}

export default autocompleteMixin;
