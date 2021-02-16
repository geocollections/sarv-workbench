import getters from "@/store/modules/tableHeaders/getters";
import actions from "@/store/modules/tableHeaders/actions";
import mutations from "@/store/modules/tableHeaders/mutations";

const state = {
  attachment: [],
  reference: [],
  library: [],
  journal: [],
  keyword: [],
  doi: [],
  project: [],
  site: [],
  area: [],
  locality: [],
  stratigraphy: [],
  sample: [],
  sample_series: [],
  preparation: [],
  analysis: [],
  analysis_parameter: [],
  analysis_method: [],
  taxon: [],
  classification: [],
  rock: [],
  specimen: [],
  collection: [],
  selection_series: [],
  agent: [],
  drillcore: [],
  drillcore_box: [],
  dataset: [],
  defaults: {
    attachment: [
      "uuid_filename",
      "id",
      "attachment_format",
      "image_number",
      "author",
      "date_created",
      "specimen",
      "reference",
      "specimen_image_attachment",
      "is_private",
      "link"
    ],
    reference: [
      "id",
      "author",
      "year",
      "title",
      "author",
      "journal",
      "volume",
      "pages",
      "is_estonian_reference",
      "link",
      "doi",
      "attachment",
      "url"
    ],
    library: ["id", "title", "author_txt", "is_private", "link"],
    journal: [
      "id",
      "journal_name",
      "journal_short",
      "journal_original",
      "publisher",
      "remarks"
    ],
    keyword: [],
    doi: [

    ],
    project: [

    ],
    site: [],
    area: [],
    locality: [],
    stratigraphy: [],
    sample: [],
    sample_series: [],
    preparation: [],
    analysis: [
      "id",
      "sample",
      "sample__number",
      "sample__locality__locality",
      "sample__depth",
      "analysis_method__analysis_method",
      "date",
      "lab_txt",
      "agent",
      "link"
    ],
    analysis_parameter: [],
    analysis_method: [],
    taxon: [],
    classification: [],
    rock: [],
    specimen: [],
    collection: [],
    selection_series: [],
    agent: [
      "id",
      "agent",
      "forename",
      "surename",
      "institution_name",
      "institution",
      "remarks",
      "type"
    ],
    drillcore: [],
    drillcore_box: [],
    dataset: [],
    accession: [
      "number",
      "date_signed",
      "agent_andis",
      "agent_vottis",
      "number_items",
      "description",
      "id"
    ]
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
