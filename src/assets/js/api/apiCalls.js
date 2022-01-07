import Vue from "vue";
import qs from "qs";
import VueIzitoast from "vue-izitoast";

const axios = require("axios");

const api = {
  // url: "https://rwapi.geocollections.info/",
  url: "http://localhost:7000/api/",
  checkDoiUrl: "https://api.crossref.org/works/",
  solrUrl: "https://api.geocollections.info/solr/",
  publicApi: "https://api.geocollections.info/",
};

const attachmentFields =
  "id,uuid_filename,description,description_en,original_filename,date_created,attachment_format__value,author__agent,image_number";

// // Add a request interceptor
// axios.interceptors.request.use(function (config) {
//   if (config.url.includes("rwapi") && !config.url.includes("/egf/")) {
//     let csrftoken = Vue.$cookies.get("csrftoken");
//     config.withCredentials = true;
//     config.headers["X-CSRFTOKEN"] = csrftoken;
//   }
//
//   return config;
// });
//
// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//   if (response.status === 200 && response.config.url.includes("rwapi")) {
//     // Showing Missing permissions message
//     if (response.data.error_permissions) {
//       Vue.prototype.toast.error(
//         response.data.error_permissions,
//         "Missing permissions",
//         {
//           position: "topCenter",
//           timeout: 5000,
//           closeOnEscape: true,
//           pauseOnHover: false,
//           displayMode: "replace",
//         }
//       );
//     }
//
//     // Destroying session and redirecting to login view
//     if (response.data.error_not_logged_in) {
//       Vue.$cookies.remove("csrftokenLocalhost", null, "localhost");
//       Vue.$cookies.remove("csrftoken", null, "geocollections.info");
//       Vue.prototype.toast.error("Please log back in", "Session expired", {
//         position: "topCenter",
//         timeout: 5000,
//         closeOnEscape: true,
//         pauseOnHover: false,
//         displayMode: "replace",
//       });
//       router.push({ path: "/" });
//     }
//
//     // Showing link error message
//     if (response.data.link_error) {
//       Vue.prototype.toast.error(response.data.link_error, "Error", {
//         position: "topCenter",
//         timeout: 99999999999,
//         pauseOnHover: false,
//         displayMode: "replace",
//       });
//     }
//   }
//
//   return response;
// });

async function get(child = "", customUrl) {
  let url = api.url + child;
  if (customUrl) url = customUrl + child;
  const service = axios.create({
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
  });

  try {
    return await service.get(url);
  } catch (err) {
    if (err.response.status === 403) {
      const table = child.includes("/") ? child.split("/")[0] : child;
      Vue.prototype.toast.error(
        `Table: <b>${table}</b>. You do not have permission to perform this action.`,
        "Forbidden",
        {
          position: "topCenter",
          timeout: 5000,
          closeOnEscape: true,
          pauseOnHover: false,
          displayMode: "replace",
        }
      );
    } else {
      Vue.prototype.toast.error(JSON.stringify(err?.response?.data), {
        position: "topCenter",
        timeout: 5000,
        closeOnEscape: true,
        pauseOnHover: false,
        displayMode: "replace",
      });
    }
    return err?.response?.data ?? `URL: '${url}' MESSAGE: ${err.message}`;
  }
}

async function post(child, data, customUrl, method) {
  let url = api.url + child;
  if (customUrl && customUrl.length > 0) url = customUrl + child + "/";
  const service = axios.create({
    method,
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
  });

  try {
    const res = await service({ url, data });
    Vue.prototype.toast.success(
      method === "post" ? "Record added" : "Record changed",
      "OK",
      {
        position: "topCenter",
        timeout: 5000,
        pauseOnHover: false,
      }
    );
    return res?.data;
  } catch (err) {
    if (err?.response?.status === 403) {
      const table = child.includes("/") ? child.split("/")[0] : child;
      Vue.prototype.toast.error(
        `Table: <b>${table}</b>. You do not have permission to perform this action.`,
        "Forbidden",
        {
          position: "topCenter",
          timeout: 5000,
          closeOnEscape: true,
          pauseOnHover: false,
          displayMode: "replace",
        }
      );
    } else {
      Vue.prototype.toast.error(JSON.stringify(err?.response?.data), {
        position: "topCenter",
        timeout: 5000,
        closeOnEscape: true,
        pauseOnHover: false,
        displayMode: "replace",
      });
    }
    return err?.response?.data ?? `URL: '${url}' MESSAGE: ${err.message}`;
  }
}

async function post_delete(child, returnErrorResponse = false) {
  let url = `${api.url}delete/${child}`;

  try {
    return await axios.delete(url);
  } catch (error) {
    // console.log(error.response);
    if (returnErrorResponse) return error.response;
    else return error.request();
  }
}

/*******************
 *** LOGIN START ***
 *******************/

export function fetchLogin(userData) {
  return post(`login/`, userData);
}

export function fetchLoginId() {
  return get(`loginid/`);
}

export function fetchLogout() {
  return get(`logout/`);
}

export function fetchIsLoggedIn() {
  return get(`is_logged_in/login_state`);
}

/*******************
 ***  LOGIN END  ***
 *******************/

export function postRequest(url, data, customUrl = "", method = "post") {
  return post(url, data, customUrl, method);
}

/*************************
 *** ATTACHMENTS START ***
 *************************/
export function fetchAttachment(id) {
  return get(`attachment/?id=${id}&format=json`);
}

export function fetchListImageType() {
  return get(`list_image_type/?format=json`);
}

export function fetchAttachmentKeyword(id) {
  return get(`attachment_keyword/?attachment=${id}&format=json`);
}

export function fetchListAttachmentType() {
  return get(`list_attachment_type/?format=json`);
}

export function fetchAttachmentLinkCollections(id) {
  return get(
    `attachment_link/?attachment=${id}&collection__isnull=false&fields=collection,collection__name,collection__name_en&format=json`
  );
}

export function fetchAttachmentLinkSpecimens(id) {
  return get(
    `attachment_link/?attachment=${id}&specimen__isnull=false&fields=specimen,specimen_id,specimen__coll__number&format=json`
  );
}

export function fetchAttachmentLinkSamples(id) {
  return get(
    `attachment_link/?attachment=${id}&sample__isnull=false&fields=sample,sample__number&format=json`
  );
}

export function fetchAttachmentLinkSampleSeries(id) {
  return get(
    `attachment_link/?attachment=${id}&sample_series__isnull=false&fields=sample_series,sample_series__name&format=json`
  );
}

export function fetchAttachmentLinkAnalyses(id) {
  return get(
    `attachment_link/?attachment=${id}&analysis__isnull=false&fields=analysis,analysis__sample__number&format=json`
  );
}

export function fetchAttachmentLinkDatasets(id) {
  return get(
    `attachment_link/?attachment=${id}&dataset__isnull=false&fields=dataset,dataset__name,dataset__name_en&format=json`
  );
}

export function fetchAttachmentLinkDois(id) {
  return get(
    `attachment_link/?attachment=${id}&doi__isnull=false&fields=doi,doi__identifier&format=json`
  );
}

export function fetchAttachmentLinkLocalities(id) {
  return get(
    `attachment_link/?attachment=${id}&locality__isnull=false&fields=locality,locality__locality,locality__locality_en&format=json`
  );
}

export function fetchAttachmentLinkDrillcores(id) {
  return get(
    `attachment_link/?attachment=${id}&drillcore__isnull=false&fields=drillcore,drillcore__drillcore,drillcore__drillcore_en&format=json`
  );
}

export function fetchAttachmentLinkDrillcoreBoxes(id) {
  return get(
    `attachment_link/?attachment=${id}&drillcore_box__isnull=false&fields=drillcore_box,drillcore_box__drillcore__drillcore,drillcore_box__drillcore__drillcore_en&format=json`
  );
}

export function fetchAttachmentLinkPreparations(id) {
  return get(
    `attachment_link/?attachment=${id}&preparation__isnull=false&fields=preparation,preparation__preparation_number&format=json`
  );
}

export function fetchAttachmentLinkReferences(id) {
  return get(
    `attachment_link/?attachment=${id}&reference__isnull=false&fields=reference,reference__reference&format=json`
  );
}

export function fetchAttachmentLinkStorages(id) {
  return get(
    `attachment_link/?attachment=${id}&storage__isnull=false&fields=storage,storage__location,storage__contents&format=json`
  );
}

export function fetchAttachmentLinkProjects(id) {
  return get(
    `attachment_link/?attachment=${id}&project__isnull=false&fields=project,project__name,project__name_en&format=json`
  );
}

export function fetchAttachmentLinkSites(id) {
  return get(
    `attachment_link/?attachment=${id}&site__isnull=false&fields=site,site__name,site__name_en&format=json`
  );
}

export function fetchAttachmentLinkLocalityDescriptions(id) {
  return get(
    `attachment_link/?attachment=${id}&locality_description__isnull=false&fields=locality_description,locality_description__description&format=json`
  );
}

export function fetchAttachmentLinkTaxa(id) {
  return get(
    `attachment_link/?attachment=${id}&taxon__isnull=false&fields=taxon,taxon__taxon,taxon__author_year&format=json`
  );
}

/*************************
 ***  ATTACHMENTS END  ***
 *************************/

/************************
 *** REFERENCES START ***
 ************************/

export function fetchReference(id) {
  return get(`reference/?id=${id}&format=json`);
}

function fetchReferenceIDsUsingReferenceKeyword(data) {
  let searchFields = "";

  if (data.author !== null && data.author.trim().length > 0) {
    searchFields += `reference__author__${
      data.author__lookuptype || "icontains"
    }=${data.author}`;
  }
  if (data.year !== null && data.year.trim().length > 0) {
    searchFields += `&reference__year__${
      data.year__lookuptype || "icontains"
    }=${data.year}`;
  }
  if (data.title !== null && data.title.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.title +
      ";fields:reference__title,reference__title_original;lookuptype:" +
      `${data.title__lookuptype || "icontains"}`;
  }
  if (data.bookJournal !== null && data.bookJournal.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.bookJournal +
      ";fields:reference__book,reference__book_editor,reference__journal__journal_name;lookuptype:" +
      `${data.bookJournal__lookuptype || "icontains"}`;
  }
  if (data.abstractRemarks && data.abstractRemarks.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.abstractRemarks +
      ";fields:reference__abstract,reference__remarks;lookuptype:" +
      `${data.abstractRemarks__lookuptype || "icontains"}`;
  }
  if (data.keywords !== null && data.keywords.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.keywords
    };fields:keyword__keyword,keyword_txt;lookuptype:${
      data.keywords__lookuptype || "icontains"
    }`;
  }
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `&reference__id__${data.id__lookuptype || "icontains"}=${
      data.id
    }`;
  }
  if (
    data.libraryAuthorIdTitle &&
    data.libraryAuthorIdTitle.trim().length > 0
  ) {
    searchFields +=
      "&multi_search=value:" +
      data.libraryAuthorIdTitle +
      ";fields:reference__libraryreference__library__author__id,reference__libraryreference__library__author__agent,reference__libraryreference__library__author_txt,reference__libraryreference__library__id,reference__libraryreference__library__title,reference__libraryreference__library__title_en;lookuptype:" +
      `${data.libraryAuthorIdTitle__lookuptype || "icontains"}&distinct=true`;
  }
  if (data.userAdded && data.userAdded.trim().length > 0) {
    searchFields += `&reference__user_added__${
      data.userAdded__lookuptype || "icontains"
    }=${data.userAdded}`;
  }
  if (data.isEstonianReference) {
    searchFields += `&reference__is_estonian_reference=${data.isEstonianReference}`;
  }
  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  return get(`reference_keyword/?${searchFields}&fields=reference&format=json`);
}

export function fetchReferenceKeyword(id) {
  return get(`reference_keyword/?reference=${id}&format=json`);
}

export function fetchAttachmentLink(id) {
  return get(`attachment_link/?reference=${id}&format=json`);
}

export function fetchLocalityReferenceForReference(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );

  return get(
    `locality_reference/?reference=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchListReferenceTypes() {
  return get(`list_reference_type/?format=json`);
}

export function fetchListLanguages() {
  return get(`list_language/?format=json`);
}

export function fetchAttachmentForReference(id) {
  return get(
    `attachment/?reference=${id}&fields=${attachmentFields}&format=json`
  );
}

export function fetchLibrariesForReference(id) {
  return get(
    `library_reference/?reference=${id}&fields=library,library__title,library__title_en&format=json`
  );
}

export function fetchAddReferenceToLibrary(data) {
  return post(`add/library_reference/`, data);
}

export function fetchListLocalityReferenceType() {
  return get(`list_locality_reference_type/?format=json`);
}

export function fetchLinkedStratigraphyReference(referenceID, data) {
  let fields =
    "id,reference,stratigraphy,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,stratigraphy__type,stratigraphy__type__value,stratigraphy__type__value_en,stratigraphy__rank,stratigraphy__rank__value,stratigraphy__rank__value_en,stratigraphy__scope,stratigraphy__scope__value,stratigraphy__scope__value_en";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  return get(
    `stratigraphy_reference/?reference=${referenceID}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
  );
}

export function fetchLinkedTaxonReference(referenceID, data) {
  const fields =
    "id,taxon,author_year,taxon_epithet,parent_id,parent__taxon,fossil_group__taxon,reference";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);
  return get(
    `taxon/?reference=${referenceID}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
  );
}

/************************
 ***  REFERENCES END  ***
 ************************/

/******************
 *** LOGS START ***
 ******************/

export function fetchSpecificLogs(data) {
  return get(
    `log/?table_name=${data.table_name}&row_id=${data.row_id}&order_by=${data.order_by}&format=json`
  );
}

export function fetchLatestLogs(data) {
  return get(
    `log/?user=${data.user}&command=${data.command}&order_by=-id&paginate_by=10&fields=time,user,command,changes,table_name,row_id`
  );
}

/******************
 *** LOGS END ***
 ******************/

/**********************
 *** LOCALITY START ***
 **********************/
export function fetchListLocalityTypes() {
  return get(`list_locality_type/?format=json`);
}

export function fetchListLocalityExtent() {
  return get(`list_locality_extent/?format=json`);
}

export function fetchListCoordinateMethod() {
  return get(`list_coordinate_method/?format=json`);
}

export function fetchListCoordinatePrecision() {
  return get(`list_coordinate_precision/?format=json`);
}

export function fetchListCountry() {
  return get(`list_country/?format=json`);
}

export function autocompleteSearch(query) {
  return get(`${query}&format=json`);
}

export function fetchLocality(id) {
  return get(`locality/?id=${id}&format=json`);
}

export function fetchLocalityReference(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `locality_reference/?locality__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchLocalitySynonym(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `locality_synonym/?locality_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchLocalityAttachment(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attach_link__locality__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
  );
}

export function fetchLocalityStratigraphy(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `locality_stratigraphy/?locality_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchLocalityDescriptions(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `locality_description/?locality=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

/**********************
 ***  LOCALITY END  ***
 **********************/

/************************
 ***  SAMPLES START  ***
 ************************/
export function fetchSample(id) {
  return get(`sample/?id=${id}&format=json`);
}

export function fetchSamplePurpose() {
  return get(`list_sample_purpose/?order_by=value&format=json`);
}

export function fetchFossilGroup() {
  return get(`taxon/?fields=taxon,id&is_fossil_group=1&format=json`);
}

export function fetchSampleRelatedAnalysis(id) {
  return get(`analysis/?sample=${id}&fields=id&format=json`);
}

export function fetchSampleRelatedPreparation(id) {
  return get(`preparation/?sample=${id}&fields=id&format=json`);
}

export function fetchAnalysisMethod() {
  return get(`analysis_method/?order_by=analysis_method&format=json`);
}

export function fetchSampleAnalysis(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `analysis/?sample__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSamplePreparation(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `preparation/?sample__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchTaxonList(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `taxon_list/?sample=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchLSampleAttachment(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attach_link__sample__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
  );
}

export function fetchSampleReference(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `sample_reference/?sample__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchLatestSampleInSite(siteId) {
  return get(
    `sample/?site__id=${siteId}&order_by=-id&paginate_by=1&format=json`
  );
}

/************************
 ***  SAMPLES END  ***
 ************************/

/***********************
 *** LIBRARIES START ***
 ***********************/

export function fetchLibrary(id) {
  return get(`library/?id=${id}&format=json`);
}

export function fetchLibraryReference(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `library_reference/?library=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchLibraryAgent(id) {
  return get(`library_agent/?library=${id}&format=json`);
}

export function fetchListLibraries(id) {
  return get(`library_agent/?agent=${id}&format=json`);
}

export function fetchChangeLibraryState(id, data) {
  return post(`change/library/${id}`, data);
}

export function fetchActiveLibraryList(libraryId) {
  return get(
    `library_reference/?library=${libraryId}&fields=reference,id&reference__isnull=false&format=json`
  );
}

export function fetchRemoveReferenceFromLibrary(id) {
  return post_delete(`library_reference/${id}`);
}

export function fetchMultiRemoveReferencesFromLibrary(data) {
  return post(`delete_multi/library_reference/`, data);
}

export function fetchMultiAddReferencesToLibrary(data) {
  return post(`add_multi/library_reference/`, data);
}

/***********************
 ***  LIBRARIES END  ***
 ***********************/

/*****************
 *** DOI START ***
 *****************/
export function fetchDoi(id) {
  return get(`doi/?id=${id}&format=json`);
}

export function fetchDoiUsingEGF(id) {
  return get(`egf/${id}`);
}

export function fetchDoiResourceType() {
  return get(`doi_resource_type/?format=json`);
}

export function fetchDoiPublisher() {
  return get(`doi_publisher/?format=json`);
}

// export function fetchListTitleTranslatedLanguages() {
//   return get(`title_translated_language/?format=json`)
// }

export function fetchListLicences() {
  return get(`list_licence/?format=json`);
}

export function fetchDoiCheck(doi) {
  return get(doi, api.checkDoiUrl);
}

export function fetchDoiAttachment(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attach_link__doi__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
  );
}

export function fetchDoiAgent(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `doi_agent/?doi=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchDoiAgentType() {
  return get(`doi_agent_type/?format=json`);
}

export function fetchDoiRelatedIdentifier(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `doi_related_identifier/?doi=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchDoiGeolocation(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `doi_geolocation/?doi=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchDoiDate(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `doi_date/?doi=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchDoiRelatedIdentifierType() {
  return get(`doi_related_identifier_type/?format=json`);
}

export function fetchDoiRelationType() {
  return get(`doi_relation_type/?format=json`);
}

export function fetchDoiDateType() {
  return get(`doi_date_type/?format=json`);
}

export function fetchAddDoi(data) {
  return post(`add/doi/`, data);
}

export function fetchAddDoiGeolocation(data) {
  return post(`add/doi_geolocation/`, data);
}

export function fetchAddDoiAgent(data) {
  return post(`add/doi_agent/`, data);
}

export function fetchCheckMetadataInDataCite(id) {
  return get(`datacite/check_metadata/${id}`);
}

export function fetchCheckDoiUrlInDataCite(id) {
  return get(`datacite/check_doi/${id}`);
}

export function fetchRegisterMetadataToDataCite(id) {
  return get(`datacite/register_metadata/${id}`);
}

export function fetchRegisterDoiUrlToDataCite(id) {
  return get(`datacite/register_doi/${id}`);
}

/*****************
 ***  DOI END  ***
 *****************/

/*****************************
 *** ATTACHMENT LINK START ***
 *****************************/

export function fetchAddAttachmentLink(data) {
  return post(`add/attachment_link/`, data);
}

/*****************************
 ***  ATTACHMENT LINK END  ***
 *****************************/

/**********************
 *** PROJECTS START ***
 **********************/

export function fetchProject(id) {
  return get(`project/?id=${id}&format=json`);
}

export function fetchProjectAgent(id) {
  return get(
    `project/${id}?fields=id,projectagent__agent,projectagent__agent__agent&format=json`
  );
}

export function fetchProjectAttachment(id, page = 1) {
  return get(
    `attachment/?attach_link__project__id=${id}&page=${page}&paginate_by=100&fields=${attachmentFields}&format=json`
  );
}

export function fetchLinkedSite(data, projectId) {
  let fields =
    "id,name,name_en,number,project,project__name,project__name_en,date_start,date_end,latitude,longitude";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  return get(
    `site/?project=${projectId}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
  );
}

export function fetchProjectType() {
  return get(`project_type/?order_by=name&format=json`);
}

export function fetchActiveProjects(projectIds) {
  return get(
    `project/?id__in=${projectIds}&fields=id,name,name_en&format=json`
  );
}

/**********************
 ***  PROJECTS END  ***
 **********************/

/******************
 *** SITE START ***
 ******************/

export function fetchSite(id) {
  return get(`site/?id=${id}&format=json`);
}

export function fetchSiteAttachment(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attach_link__site__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
  );
}

export function fetchLinkedSamples(data, siteID) {
  let fields =
    "id,number,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en,depth_interval,depth,rock,rock_en";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `id=${data.id}`;
  }
  if (data.number && data.number.trim().length > 0) {
    searchFields += `&multi_search=value:${data.number};fields:number,number_additional,number_field;lookuptype:icontains`;
  }
  if (data.depth && data.depth.trim().length > 0) {
    searchFields += `&multi_search=value:${data.depth};fields:depth;lookuptype:icontains`;
  }
  if (data.depth_interval && data.depth_interval.trim().length > 0) {
    searchFields += `&multi_search=value:${data.depth_interval};fields:depth_interval;lookuptype:icontains`;
  }
  if (data.stratigraphy && data.stratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${data.stratigraphy};fields:stratigraphy__stratigraphy_en,stratigraphy__stratigraphy;lookuptype:icontains`;
  }
  if (data.lithostratigraphy && data.lithostratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${data.lithostratigraphy};fields:lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en;lookuptype:icontains`;
  }
  if (data.rock && data.rock.trim().length > 0) {
    searchFields += `&multi_search=value:${data.rock};fields:rock_en,rock;lookuptype:icontains`;
  }
  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `sample/?site__id=${siteID}&${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `sample/?site__id=${siteID}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchLastSiteName(projectId) {
  return get(
    `site/?project=${projectId}&fields=name&order_by=-id&paginate_by=1&format=json`
  );
}

export function fetchSiteLocalityDescriptions(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `locality_description/?site=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSiteLocalityReferences(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `locality_reference/?site=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchListSiteType() {
  return get(`site_type`);
}

/******************
 ***  SITE END  ***
 ******************/

/***************************
 *** ANALYSIS LINK START ***
 ***************************/

export function fetchAnalysis(id) {
  return get(`analysis/?id=${id}&format=json`);
}

export function fetchLabs() {
  return get(`lab/?format=json`);
}

export function fetchInstruments() {
  return get(`lab_instrument/?format=json`);
}

export function fetchAnalysisAttachment(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attach_link__analysis__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
  );
}

export function fetchAnalysisResults(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `analysis_results/?analysis=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

/***************************
 ***  ANALYSIS LINK END  ***
 ***************************/

/*********************
 *** JOURNAL START ***
 *********************/

export function fetchJournal(id) {
  return get(`journal/?id=${id}&format=json`);
}

export function fetchJournalForReference(name) {
  return get(
    `journal/?multi_search=value:${name};fields:journal_name,journal_short,journal_long,journal_original,journal_abbr;lookuptype:iexact`
  );
}

/*********************
 ***  JOURNAL END  ***
 *********************/

/**********************
 *** IMAGESET START ***
 **********************/

export function fetchAddImageset(data) {
  return post(`add/imageset/`, data);
}

export function fetchIsImagesetNumberInImageset(imagesetNumber) {
  return get(`imageset/?imageset_number=${imagesetNumber}&format=json`);
}

/**********************
 ***  IMAGESET END  ***
 **********************/

/**********************
 *** SPECIMEN START ***
 **********************/

export function fetchSpecimen(id) {
  return get(`specimen/?id=${id}&format=json`);
}

export function fetchSpecimens(data, dynamicSearch) {
  const fields =
    "specimen_id,collection,coll,coll__number,specimen_nr,number_field,type,type__value,type__value_en,subtype_id,subtype_id__value,subtype_id__value_en,fossil,fossil__value,fossil__value_en,kind,kind,kind,classification,classification__class_field,part,number_pieces,locality,locality__locality,locality__locality_en,locality_free,locality_free_en,locality_is_private,depth,depth_interval,sample_number,sample,sample__number,parent,parent__specimen_id,remarks_collecting,stratigraphy,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en,stratigraphy_free,agent_collected,agent_collected__agent,agent_collected_free,date_collected,date_collected_free,remarks,remarks_internal,tags,presence,presence__value,presence__value_en,storage,storage__location,location,status,status__value,status__value_en,original_status,original_status__value,original_status__value_en,is_private,accession,accession__number,deaccession,deaccession__number,user_added,date_added,user_changed,date_changed,database,database__acronym,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.idSpecimen && data.idSpecimen.trim().length > 0) {
    searchFields += `&id__${data.idSpecimen__lookuptype || "icontains"}=${
      data.idSpecimen
    }`;
  }

  if (data.specimenNr && data.specimenNr.trim().length > 0) {
    searchFields += `multi_search=value:${
      data.specimenNr
    };fields:specimen_id,specimen_nr;lookuptype:${
      data.specimenNr__lookuptype || "icontains"
    }`;
  }

  if (data.collNumber && data.collNumber.trim().length > 0) {
    searchFields += `&coll__number__${
      data.collNumber__lookuptype || "icontains"
    }=${data.collNumber}`;
  }

  if (data.fossil && data.fossil.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.fossil
    };fields:specimenidentification__name,specimenidentification__taxon__taxon;lookuptype:${
      data.fossil__lookuptype || "icontains"
    }`;
  }

  if (data.mineralRock && data.mineralRock.trim().length > 0) {
    // Todo: Duplicate records issue, but distinct makes it slow
    if (data.fossil && data.fossil.trim().length > 0)
      searchFields += "&distinct=true";
    searchFields += `&multi_search=value:${
      data.mineralRock
    };fields:specimenidentificationgeologies__name,specimenidentificationgeologies__name_en,specimenidentificationgeologies__rock__name,specimenidentificationgeologies__rock__name_en;lookuptype:${
      data.mineralRock__lookuptype || "icontains"
    }`;
  }

  if (data.locality && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.locality
    };fields:locality__locality,locality__locality_en,locality_free;lookuptype:${
      data.locality__lookuptype || "icontains"
    }`;
  }

  if (data.stratigraphy && data.stratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.stratigraphy
    };fields:stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,stratigraphy_free,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en;lookuptype:${
      data.stratigraphy__lookuptype || "icontains"
    }`;
  }

  if (data.agent_collected && data.agent_collected.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.agent_collected
    };fields:agent_collected__agent,agent_collected__forename,agent_collected__surename,agent_collected_free;lookuptype:${
      data.agent_collected__lookuptype || "icontains"
    }`;
  }

  if (data.storage && data.storage.trim().length > 0) {
    searchFields += `&storage__location__${
      data.storage__lookuptype || "icontains"
    }=${data.storage}`;
  }

  if (data.selectionId && data.selectionId.trim().length > 0) {
    searchFields += `&selection__selection__id__${
      data.selectionId__lookuptype || "icontains"
    }=${data.selectionId}`;
  }

  if (data.selection && data.selection.trim().length > 0) {
    searchFields += `&selection__selection__name__${
      data.selection__lookuptype || "icontains"
    }=${data.selection}`;
  }

  if (data.loan && data.loan.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.loan
    };fields:loanspecimen__loan__id,loanspecimen__loan__loan_number;lookuptype:${
      data.loan__lookuptype || "icontains"
    }`;
  }

  if (data.reference && data.reference.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.reference
    };fields:specimenreference__reference__reference,specimenreference__reference__id;lookuptype:${
      data.reference__lookuptype || "icontains"
    }`;
  }

  if (data.classification && data.classification.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.classification
    };fields:classification__class_field,classification__class_en,classification__class_lat,classification__class_en_synonym,classification__class_synonym;lookuptype:${
      data.classification__lookuptype || "icontains"
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) return `?${searchFields}`;
  else return "";
  //
  // if (searchFields.length > 0) {
  //   return get(
  //     `specimen/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
  //   );
  // } else {
  //   return get(
  //     `specimen/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
  //   );
  // }
}

export function fetchSpecimenImages(data, dynamicSearch) {
  let searchFields = "";

  if (data.idSpecimen && data.idSpecimen.trim().length > 0) {
    searchFields += `multi_search=value:${
      data.idSpecimen
    };fields:specimen__id,specimen__specimen_id,specimen__specimen_nr;lookuptype:${
      data.idSpecimen__lookuptype || "icontains"
    }`;
  }

  if (data.specimenNr && data.specimenNr.trim().length > 0) {
    searchFields += `&specimen__specimen_nr__${
      data.specimenNr__lookuptype || "icontains"
    }=${data.specimenNr}`;
  }

  if (data.collNumber && data.collNumber.trim().length > 0) {
    searchFields += `&specimen__coll__number__${
      data.collNumber__lookuptype || "icontains"
    }=${data.collNumber}`;
  }

  if (data.fossil && data.fossil.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.fossil
    };fields:specimen__specimenidentification__name,specimen__specimenidentification__taxon__taxon;lookuptype:${
      data.fossil__lookuptype || "icontains"
    }`;
  }

  if (data.mineralRock && data.mineralRock.trim().length > 0) {
    // Todo: Duplicate records issue, but distinct makes it slow
    if (data.fossil && data.fossil.trim().length > 0)
      searchFields += "&distinct=true";
    searchFields += `&multi_search=value:${
      data.mineralRock
    };fields:specimen__specimenidentificationgeologies__name,specimen__specimenidentificationgeologies__name_en,specimen__specimenidentificationgeologies__rock__name,specimen__specimenidentificationgeologies__rock__name_en;lookuptype:${
      data.mineralRock__lookuptype || "icontains"
    }`;
  }

  if (data.locality && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.locality
    };fields:specimen__locality__locality,specimen__locality__locality_en,specimen__locality_free;lookuptype:${
      data.locality__lookuptype || "icontains"
    }`;
  }

  if (data.stratigraphy && data.stratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.stratigraphy
    };fields:specimen__stratigraphy__stratigraphy,specimen__stratigraphy__stratigraphy_en,specimen__stratigraphy_free,specimen__lithostratigraphy__stratigraphy,specimen__lithostratigraphy__stratigraphy_en;lookuptype:${
      data.stratigraphy__lookuptype || "icontains"
    }`;
  }

  if (data.agent_collected && data.agent_collected.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.agent_collected
    };fields:specimen__agent_collected__agent,specimen__agent_collected__forename,specimen__agent_collected__surename,specimen__agent_collected_free;lookuptype:${
      data.agent_collected__lookuptype || "icontains"
    }`;
  }

  if (data.storage && data.storage.trim().length > 0) {
    searchFields += `&specimen__storage__location__${
      data.storage__lookuptype || "icontains"
    }=${data.storage}`;
  }

  if (data.selectionId && data.selectionId.trim().length > 0) {
    searchFields += `&specimen__selection__selection__id__${
      data.selectionId__lookuptype || "icontains"
    }=${data.selectionId}`;
  }

  if (data.selection && data.selection.trim().length > 0) {
    searchFields += `&specimen__selection__selection__name__${
      data.selection__lookuptype || "icontains"
    }=${data.selection}`;
  }

  if (data.loan && data.loan.trim().length > 0) {
    searchFields += `&multi_search=value:${data.loan};fields:specimen__loanspecimen__loan__id,specimen__loanspecimen__loan__loan_number;lookuptype:iexact`;
  }

  searchFields += buildDynamicSearch(dynamicSearch, "specimen__");

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);
  if (searchFields.length > 0)
    return `?${searchFields}&specimen_image_attachment=1`;
  else return `?specimen_image_attachment=1`;
}

export function fetchDirectSpecimenImages(specimenId) {
  return get(`attachment/?specimen=${specimenId}&format=json`);
}

export function fetchListSpecimenKind() {
  return get(`list_specimen_kind/?format=json`);
}

export function fetchListSpecimenOriginalStatus() {
  return get(`list_specimen_original_status/?format=json`);
}

export function fetchListSpecimenPresence() {
  return get(`list_specimen_presence/?format=json`);
}

export function fetchListSpecimenStatus() {
  return get(`list_specimen_status/?format=json`);
}

export function fetchListSpecimenType() {
  return get(`list_specimen_type/?format=json`);
}

export function fetchListSpecimenSubtype() {
  return get(`list_specimen_subtype/?format=json`);
}

export function fetchListHistoryType() {
  return get(`list_history_type/?format=json`);
}

export function fetchAccession() {
  return get(`accession/?format=json`);
}

export function fetchDeaccession() {
  return get(`deaccession/?format=json`);
}

export function fetchSpecimenIdentifications(specimenId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  if (searchParameters) {
    return get(
      `specimen_identification/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
    );
  }
}

export function fetchSpecimenIdentificationGeologies(
  specimenId,
  searchParameters
) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  if (searchParameters) {
    return get(
      `specimen_identification_geology/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
    );
  }
}

export function fetchSpecimenIdentificationsList(listOfIds) {
  let fields = "taxon__taxon,taxon_id,specimen_id";
  return get(
    `specimen_identification/?specimen_id__in=${listOfIds}&current=true&fields=${fields}&format=json`
  );
}

export function fetchSpecimenIdentificationGeologiesList(listOfIds) {
  let fields =
    "name,name_en,rock__name,rock__name_en,rock__formula_html,rock_id,specimen_id";
  return get(
    `specimen_identification_geology/?specimen_id__in=${listOfIds}&current=true&fields=${fields}&order_by=name&format=json`
  );
}

export function fetchSpecimenReferences(specimenId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `specimen_reference/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSpecimenDescriptions(specimenId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `specimen_description/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSpecimenAttachments(specimenId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attach_link__specimen__id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
  );
}

export function fetchSpecimenLocations(specimenId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `specimen_location/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSpecimenHistory(specimenId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `specimen_history/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSpecimenAnalyses(specimenId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `analysis/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchListIdentificationType() {
  return get(`list_identification_type/?format=json`);
}

export function fetchListUnit() {
  return get(`list_unit/?format=json`);
}

export function fetchMultiChangeSpecimen(data) {
  return post(`change_multi/specimen/`, data);
}

/**********************
 ***  SPECIMEN END  ***
 **********************/

/************************
 *** COLLECTION START ***
 ************************/
export function fetchCollection(id) {
  return get(`collection/?id=${id}&format=json`);
}

export function fetchListCollectionType() {
  return get(`list_collection_type/?format=json`);
}

/************************
 ***  COLLECTION END  ***
 ************************/

/*******************
 *** TAXON START ***
 *******************/
export function fetchTaxon(id) {
  return get(`taxon/?id=${id}&format=json`);
}

export function fetchTaxonRank() {
  return get(`taxon_rank/?format=json`);
}

export function fetchTaxonSubclass(taxonId, searchParameters) {
  let fields = "id,taxon,parent_id,parent__taxon,author_year,remarks";
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `taxon/?parent_id=${taxonId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
  );
}

export function fetchTaxonSynonym(taxonId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `taxon_synonym/?taxon_id=${taxonId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchTaxonTypeSpecimen(taxonId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `taxon_type_specimen/?taxon_id=${taxonId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchTaxonOccurrence(taxonId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `taxon_occurrence/?taxon_id=${taxonId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchTaxonOpinion(taxonId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `taxon_opinion/?taxon_id=${taxonId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchTaxonCommonName(taxonId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `taxon_common_name/?taxon_id=${taxonId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchTaxonDescription(taxonId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `taxon_description/?taxon_id=${taxonId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchTaxonPage(taxonId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `taxon_page/?taxon_id=${taxonId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchTaxonAttachments(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attach_link__taxon=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
  );
}

export function fetchTaxonImage(taxonId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `taxon_image/?taxon_id=${taxonId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchTaxonTypeType() {
  return get(`taxon_type_type/?format=json`);
}

export function fetchTaxonOpinionType() {
  return get(`taxon_opinion_type/?format=json`);
}

export function fetchTaxonByTaxonTypeId(taxonTypeId) {
  return get(`taxon/?id=${taxonTypeId}&fields=id,taxon&format=json`);
}

/*******************
 ***  TAXON END  ***
 *******************/

/*********************
 *** KEYWORD START ***
 *********************/

export function fetchKeyword(id) {
  return get(`keyword/?id=${id}&format=json`);
}

export function fetchReferenceKeywordIDs(referenceID) {
  return get(
    `reference_keyword/?reference=${referenceID}&fields=keyword&format=json`
  );
}

export function fetchListKeywords() {
  return get(`keyword/?format=json`);
}

export function fetchKeywordRelation(keywordId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `keyword_relation/?keyword=${keywordId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchKeywordRelationReverse(keywordId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `keyword_relation/?related_keyword=${keywordId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchKeywordRelationType() {
  return get(`keyword_relation_type/?format=json`);
}

/*********************
 ***  KEYWORD END  ***
 *********************/

/*******************
 *** AGENT START ***
 *******************/

export function fetchAgent(id) {
  let fields = `id,agent,type,type__value,type__value_en,forename,surename,institution,institution__agent,institution__institution_name,institution__institution_name_en,institution_name,institution_name_en,title,profession,profession_en,address,address1,address2,http,orcid,country__value,country__value_en,country,country_txt,phone,email,date_born,date_deceased,old_name,new_name,remarks`;
  return get(`agent/?id=${id}&fields=${fields}&format=json`);
}

export function fetchAgentUsingName(name) {
  return get(
    `agent/?multi_search=value:${name};fields:id,agent,forename,surename;lookuptype:icontains&page=1&paginate_by=1&fields=id,agent,institution__institution_name_en,orcid`
  );
}

export function fetchListAgentType() {
  return get(`agent_type/?format=json`);
}

/*******************
 ***  AGENT END  ***
 *******************/

/******************************
 *** SELECTION SERIES START ***
 ******************************/
export function fetchSelectionSerie(id) {
  return get(`selection_series/?id=${id}&format=json`);
}

/******************************
 ***  SELECTION SERIES END  ***
 ******************************/

/***********************
 *** SELECTION START ***
 ***********************/

export function fetchAddItemToSelection(data) {
  return post(`add/selection/`, data);
}

export function fetchIdsUsingSelection(id, table) {
  return get(
    `selection/?selection=${id}&${table}!=null&fields=${table}&format=json`
  );
}

export function fetchSelectedSpecimens(selectionSeriesId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `selection/?selection=${selectionSeriesId}&specimen!=null&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSelectedSamples(selectionSeriesId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `selection/?selection=${selectionSeriesId}&sample!=null&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSelectedAttachments(selectionSeriesId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `selection/?selection=${selectionSeriesId}&attachment!=null&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSelectedLocalities(selectionSeriesId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `selection/?selection=${selectionSeriesId}&locality!=null&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSelectedReferences(selectionSeriesId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `selection/?selection=${selectionSeriesId}&reference!=null&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSelectedTaxa(selectionSeriesId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `selection/?selection=${selectionSeriesId}&taxon!=null&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSelectedAnalyses(selectionSeriesId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `selection/?selection=${selectionSeriesId}&analysis!=null&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchActiveSelectionSeriesList(table, selectionSeriesId) {
  return get(
    `selection/?selection=${selectionSeriesId}&fields=id,${table}&${table}__isnull=false&format=json`
  );
}

export function fetchRemoveRecordFromSelection(id) {
  return post_delete(`selection/${id}`);
}

export function fetchMultiRemoveRecordFromSelection(data) {
  return post(`delete_multi/selection/`, data);
}

export function fetchMultiAddRecordToSelection(data) {
  return post(`add_multi/selection/`, data);
}

export function fetchAllSelections(id) {
  return get(`selection/?selection=${id}&fields=id`);
}

/***********************
 ***  SELECTION END  ***
 ***********************/

/***********************
 *** DRILLCORE START ***
 ***********************/

export function fetchDrillcore(id) {
  return get(`drillcore/?id=${id}&format=json`);
}

export function fetchListDrillcoreStorage() {
  return get(`list_drillcore_storage/?format=json`);
}

export function fetchRelatedDrillcoreBoxes(drillcoreId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `drillcore_box/?drillcore=${drillcoreId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchRelatedDrillcoreBoxImages(drillcoreId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment_link/?drillcore_box__drillcore=${drillcoreId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json&fields=attachment__uuid_filename,drillcore_box__drillcore__drillcore,drillcore_box__drillcore__drillcore_en,drillcore_box,drillcore_box__depth_start,drillcore_box__depth_end,drillcore_box__number`
  );
}

export function fetchDrillcoreStudies(drillcoreId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `drillcore_study/?drillcore=${drillcoreId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchDrillcoreAttachments(drillcoreId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attach_link__drillcore__id=${drillcoreId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
  );
}

/***********************
 ***  DRILLCORE END  ***
 ***********************/

/***************************
 *** DRILLCORE BOX START ***
 ***************************/

export function fetchDrillcoreBox(id) {
  return get(`drillcore_box/?id=${id}&format=json`);
}

export function fetchDrillcoreBoxImages(data, dynamicSearch) {
  let fields =
    "attachment__uuid_filename,drillcore_box__drillcore,drillcore_box__drillcore__drillcore,drillcore_box__drillcore__drillcore_en,drillcore_box__number,drillcore_box__number_meters,drillcore_box__diameter,drillcore_box__depth_start,drillcore_box__depth_end,drillcore_box__depth_other,drillcore_box__stratigraphy_base,drillcore_box__stratigraphy_base__stratigraphy,drillcore_box__stratigraphy_base__stratigraphy_en,drillcore_box__stratigraphy_top,drillcore_box__stratigraphy_top__stratigraphy,drillcore_box__stratigraphy_top__stratigraphy_en,drillcore_box__stratigraphy_base_free,drillcore_box__stratigraphy_top_free,drillcore_box__stratigraphy_free,drillcore_box__location,drillcore_box__storage,drillcore_box__storage__location,drillcore_box__remarks,drillcore_box__user_added,drillcore_box__date_added,drillcore_box__user_changed,drillcore_box__date_changed,drillcore_box__database,drillcore_box__database__acronym,drillcore_box__id";
  let searchFields = "";

  if (data.storage && data.storage.trim().length > 0) {
    searchFields += `drillcore_box__storage__location__${
      data.storage__lookuptype || "icontains"
    }=${data.storage}`;
  }

  if (data.drillcore && data.drillcore.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.drillcore
    };fields:drillcore_box__drillcore__drillcore,drillcore_box__drillcore__drillcore_en;lookuptype:${
      data.drillcore__lookuptype || "icontains"
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch, "drillcore_box__");

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  // if (data.user_added && data.user_added.trim().length > 0) {
  //   searchFields += `&user_added__${data.user_added__lookuptype ||
  //     "icontains"}=${data.user_added}`;
  // }
  // if (data.date_added && data.date_added.trim().length > 0) {
  //   searchFields += `&date_added__${data.date_added__lookuptype ||
  //     "icontains"}=${data.date_added}`;
  // }

  if (searchFields.length > 0) {
    return get(
      `attachment_link/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&fields=${fields}&format=json&drillcore_box__isnull=false`
    );
  } else {
    return get(
      `attachment_link/?page=${data.page}&paginate_by=${data.paginateBy}&fields=${fields}&format=json&drillcore_box__isnull=false`
    );
  }
}

export function fetchDrillcoreBoxAttachments(drillcoreBoxId, searchParameters) {
  let fields =
    "id,uuid_filename,description,description_en,original_filename,date_created,attachment_format__value,author__agent,image_number,is_preferred,is_private";
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attach_link__drillcore_box__id=${drillcoreBoxId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
  );
}

/***************************
 ***  DRILLCORE BOX END  ***
 ***************************/

/*************************
 *** PREPARATION START ***
 *************************/

export function fetchPreparation(id) {
  return get(`preparation/?id=${id}&format=json`);
}

export function fetchLinkedTaxa(data, prepId) {
  const fields =
    "id,taxon,taxon__taxon,taxon__author_year,taxon__taxon_epithet,taxon__parent_id,taxon__parent__taxon,taxon__fossil_group__taxon,taxon__reference";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `id=${data.id}`;
  }

  if (data.taxon && data.taxon.trim().length > 0) {
    searchFields += `&taxon__icontains=${data.taxon}`;
  }

  if (data.author_year && data.author_year.trim().length > 0) {
    searchFields += `&author_year__icontains=${data.author_year}`;
  }

  if (data.parent__taxon && data.parent__taxon.trim().length > 0) {
    searchFields += `&parent__taxon__icontains=${data.parent__taxon}`;
  }

  if (data.taxon_epithet && data.taxon_epithet.trim().length > 0) {
    searchFields += `&taxon_epithet__icontains=${data.taxon_epithet}`;
  }

  if (data.user_added && data.user_added.trim().length > 0) {
    searchFields += `&user_added__icontains=${data.user_added}`;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `taxon_list/?preparation=${prepId}${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `taxon_list/?preparation=${prepId}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

/*************************
 ***  PREPARATION END  ***
 *************************/

/*********************
 *** DATASET START ***
 *********************/

export function fetchDataset(id) {
  return get(`dataset/?id=${id}&format=json`);
}

export function fetchDatasetAuthors(datasetId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `dataset_author/?dataset=${datasetId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchDatasetReferences(datasetId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `dataset_reference/?dataset=${datasetId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchDatasetAnalyses(datasetId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `dataset_analysis/?dataset=${datasetId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchDatasetGeolocation(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `dataset_geolocation/?dataset=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

/*********************
 ***  DATASET END  ***
 *********************/

/**************************
 *** STRATIGRAPHY START ***
 **************************/

export function fetchStratigraphy(id) {
  return get(`stratigraphy/?id=${id}&format=json`);
}

export function fetchListStratigraphyType() {
  return get(`list_stratigraphy_type/?format=json`);
}

export function fetchListStratigraphyRank() {
  return get(`list_stratigraphy_rank/?format=json`);
}

export function fetchListStratigraphyScope() {
  return get(`list_stratigraphy_scope/?format=json`);
}

export function fetchListStratigraphyStatus() {
  return get(`list_stratigraphy_status/?format=json`);
}

export function fetchListStratotypeType() {
  return get(`list_stratotype_type/?format=json`);
}

export function fetchStratigraphyReferences(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `stratigraphy_reference/?stratigraphy=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchStratigraphyStratotypes(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `stratigraphy_stratotype/?stratigraphy=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchStratigraphySynonyms(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `stratigraphy_synonym/?stratigraphy=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchStratigraphyCatalogue(data) {
  let orSearch = `or_search=hierarchy_string__icontains:${data.stringLito};hierarchy_string__icontains:${data.string};parent__hierarchy_string__icontains:${data.string};age_chronostratigraphy__hierarchy_string__icontains:${data.string}`;
  let fields =
    "id,stratigraphy,stratigraphy_en,index_main,index_additional,author_free,year,etymon,etymon_en,age_chronostratigraphy,age_chronostratigraphy__stratigraphy,age_chronostratigraphy__stratigraphy_en,parent,parent__stratigraphy,parent__stratigraphy_en,remarks,status__value,status__value_en";
  return get(
    `stratigraphy/?scope=3&rank!=null&rank!=0&rank!=1&rank!=2&rank!=3&${orSearch}&fields=${fields}&order_by=stratigraphy,stratigraphy_en`
  );
}

export function fetchStratigraphyCatalogueStratotypes(listOfIds) {
  let fields =
    "stratigraphy,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,stratotype_type__value,stratotype_type__value_en,reference,reference__reference,remarks";
  return get(
    `stratigraphy_stratotype/?stratigraphy__in=${listOfIds}&fields=${fields}`
  );
}

export function fetchStratigraphyCatalogueReferences(listOfIds) {
  let fields = "reference,reference__reference,stratigraphy";
  return get(
    `stratigraphy_reference/?stratigraphy__in=${listOfIds}&fields=${fields}`
  );
}

/**************************
 ***  STRATIGRAPHY END  ***
 **************************/

/******************
 *** AREA START ***
 ******************/

export function fetchArea(id) {
  return get(`area/?id=${id}&format=json`);
}

export function fetchListAreaTypes() {
  return get(`area_type`);
}

export function fetchListMaakond() {
  return get(`list_maakond`);
}

export function fetchLinkedAreaSites(data, areaId) {
  let fields =
    "id,name,name_en,number,project,project__name,project__name_en,date_start,date_end,latitude,longitude";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  return get(
    `site/?area=${areaId}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
  );
}

export function fetchAreaLocalityReferences(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `locality_reference/?area=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

/******************
 ***  AREA END  ***
 ******************/

/**********************
 *** LOCATION START ***
 **********************/
export function fetchLocation(id) {
  return get(`location/?id=${id}&format=json`);
}

export function fetchLocationImages(data, dynamicSearch) {
  let fields =
    "attachment__uuid_filename,storage__location,storage__parent_location,storage__parent_location__location,storage__location_location,storage__contents,storage__agent,storage__agent__agent,storage__date_collected_free,storage__stratigraphy_free,storage__number_items,storage__number_items_registered,storage__remarks,storage__database,storage__database__acronym,storage__user_added,storage__date_added,storage__user_changed,storage__date_changed,storage__id";
  let searchFields = "";

  if (data.id && data.id.trim().length > 0) {
    searchFields += `storage__id__${data.id__lookuptype || "icontains"}=${
      data.id
    }`;
  }

  if (data.location && data.location.trim().length > 0) {
    searchFields += `&storage__location__${
      data.location__lookuptype || "icontains"
    }=${data.location}`;
  }
  if (data.location_location && data.location_location.trim().length > 0) {
    searchFields += `&storage__location_location__${
      data.location_location__lookuptype || "icontains"
    }=${data.location_location}`;
  }
  if (data.stratigraphy_free && data.stratigraphy_free.trim().length > 0) {
    searchFields += `&storage__stratigraphy_free__${
      data.stratigraphy_free__lookuptype || "icontains"
    }=${data.stratigraphy_free}`;
  }
  if (data.agent && data.agent.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.agent
    };fields:storage__agent__id,storage__agent__agent,storage__agent__forename,storage__agent__surename;lookuptype:${
      data.agent__lookuptype || "icontains"
    }`;
  }
  // if (data.user_added && data.user_added.trim().length > 0) {
  //   searchFields += `&user_added__${data.user_added__lookuptype ||
  //     "icontains"}=${data.user_added}`;
  // }
  // if (data.date_added && data.date_added.trim().length > 0) {
  //   searchFields += `&date_added__${data.date_added__lookuptype ||
  //     "icontains"}=${data.date_added}`;
  // }
  if (data.contents && data.contents.trim().length > 0) {
    searchFields += `&storage__contents__${
      data.contents__lookuptype || "icontains"
    }=${data.contents}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch, "storage__");

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `attachment_link/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&fields=${fields}&format=json&storage__id__isnull=false`
    );
  } else {
    return get(
      `attachment_link/?page=${data.page}&paginate_by=${data.paginateBy}&fields=${fields}&format=json&storage__id__isnull=false`
    );
  }
}

export function fetchLocationAttachment(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attach_link__storage__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
  );
}

export function fetchLocationSpecimens(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `specimen/?storage=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchLocationSamples(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `sample/?storage=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchMultiChangeLocation(table, data) {
  return post(`change_multi/${table}/`, data);
}

/**********************
 ***  LOCATION END  ***
 **********************/

/******************
 *** ROCK START ***
 ******************/
export function fetchRock(id) {
  return get(`rock/?id=${id}&format=json`);
}


export function fetchListRockType() {
  return get(`rock_type/?format=json`);
}

export function fetchListRockRank() {
  return get(`rock_rank/?format=json`);
}

export function fetchRockClassifications(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `rock_tree/?parent_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchRockMinerals(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `rock_mineral/?rock_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchRockElements(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `rock_element/?rock_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchRockProperties(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `rock_property/?rock_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchRockImages(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `rock_image/?rock_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchRockLocalities(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `rock_locality/?rock_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchRockSynonyms(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `rock_synonym/?rock_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchRockReferences(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `rock_reference/?rock_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchRockTrees(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `rock_tree/?rock_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchListRockMineralType() {
  return get(`rock_mineral_type/?format=json`);
}

export function fetchListElement() {
  return get(`list_element/?format=json`);
}

export function fetchListRockPropertyType() {
  return get(`rock_property_type/?format=json`);
}

/******************
 ***  ROCK END  ***
 ******************/

/*******************
 *** VISIT START ***
 *******************/

export function fetchVisit(id) {
  return get(`visit/?id=${id}&format=json`);
}
/*******************
 ***  VISIT END  ***
 *******************/

/******************
 *** LOAN START ***
 ******************/

export function fetchLoan(id) {
  return get(`loan/?id=${id}&format=json`);
}

export function fetchListLoanType() {
  return get(`list_loan_type/?format=json`);
}

export function fetchListLoanDeliveryMethod() {
  return get(`list_loan_delivery_method/?format=json`);
}

export function fetchLoanSpecimens(id, searchParameters) {
  if (!searchParameters) {
    searchParameters = {
      page: 1,
      paginateBy: 1000,
      sortBy: ["specimen__specimen_id"],
      sortDesc: [false],
    };
  }
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `loan_specimen/?loan=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchLoanSamples(id, searchParameters) {
  if (!searchParameters) {
    searchParameters = {
      page: 1,
      paginateBy: 1000,
      sortBy: ["sample"],
      sortDesc: [true],
    };
  }
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `loan_sample/?loan=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchMultiAddLoanLists(table, data) {
  return post(`add_multi/${table}/`, data);
}

/******************
 ***  LOAN END  ***
 ******************/

/***********************
 *** ACCESSION START ***
 ***********************/

export function fetchAccessionDetail(id) {
  return get(`accession/?id=${id}&format=json`);
}
/***********************
 ***  ACCESSION END  ***
 ***********************/

/*************************
 *** DEACCESSION START ***
 *************************/

export function fetchDeaccessionDetail(id) {
  return get(`deaccession/?id=${id}&format=json`);
}
/*************************
 ***  DEACCESSION END  ***
 *************************/

/**********************
 *** WEB_NEWS START ***
 **********************/

export function fetchWebNewsDetail(id) {
  return get(`web_news/?id=${id}&format=json`);
}
/**********************
 ***  WEB_NEWS END  ***
 **********************/

/***********************
 *** WEB_PAGES START ***
 ***********************/

export function fetchWebPagesDetail(id) {
  return get(`web_pages/?id=${id}&format=json`);
}
/***********************
 ***  WEB_PAGES END  ***
 ***********************/

/*************************
 *** TAXON_PAGES START ***
 *************************/

export function fetchTaxonPagesDetail(id) {
  return get(`taxon_page/?id=${id}&format=json`);
}
/*************************
 ***  TAXON_PAGES END  ***
 *************************/

/******************************
 *** SITE_GROUNDWATER START ***
 ******************************/

export function fetchSiteGroundwater(id) {
  return get(`site_groundwater/?id=${id}&format=json`);
}

export function fetchSiteGroundwaterUsingSite(siteId) {
  return get(`site_groundwater/?site=${siteId}&format=json`);
}

/******************************
 ***  SITE_GROUNDWATER END  ***
 ******************************/

/************************
 *** SARV_ISSUE START ***
 ************************/

export function fetchSarvIssue(id, currentUserId) {
  return get(
    `sarv_issue/?or_search=to_user:${currentUserId};from_user:${currentUserId}&id=${id}&format=json`
  );
}

export function fetchActiveSarvIssues(currentUserId) {
  return get(
    `sarv_issue/?to_user=${currentUserId}&or_search=response__isnull:true;response:%20&order_by=-id&format=json`
  );
}

export function fetchSarvIssues(data, currentUserId, dynamicSearch) {
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.title !== null && data.title.trim().length > 0) {
    searchFields += `title__${data.title__lookuptype || "icontains"}=${
      data.title
    }`;
  }

  if (data.description !== null && data.description.trim().length > 0) {
    searchFields += `&description__${
      data.description__lookuptype || "icontains"
    }=${data.description}`;
  }

  if (data.from_user !== null && data.from_user.trim().length > 0) {
    searchFields += `&from_user__username__${
      data.from_user__lookuptype || "icontains"
    }=${data.from_user}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `sarv_issue/?${searchFields}&multi_search=value:${currentUserId};fields:to_user,from_user&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&format=json`
    );
  } else {
    return get(
      `sarv_issue/?multi_search=value:${currentUserId};fields:to_user,from_user&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&format=json`
    );
  }
}

/************************
 ***  SARV_ISSUE END  ***
 ************************/

/************************
 *** SARV_SESSION START ***
 ************************/

export function fetchLastLoggedInDate(currentUserId) {
  return get(
    `sarv_session/?userid=${currentUserId}&order_by=-id&paginate_by=1&session_end!=null&format=json`
  );
}

export function fetchCurrentlyActiveUsers() {
  return get(
    `sarv_session/?session_end=null&active=1&paginate_by=100&order_by=-session_start&format=json`
  );
}

/************************
 ***  SARV_SESSION END  ***
 ************************/

/***************************
 *** SAMPLE_SERIES START ***
 **************************/

export function fetchSampleSeriesDetail(id) {
  return get(`sample_series/?id=${id}&format=json`);
}

export function fetchSampleSeriesSamples(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `sample/?series=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchSampleSeriesAttachments(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attach_link__sample_series=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

/***************************
 ***  SAMPLE_SERIES END  ***
 **************************/

/***********************************
 ***  ANALYSIS_PARAMETERS START  ***
 **********************************/
export function fetchAnalysisParameter(id) {
  return get(`analysis_parameter/?id=${id}&format=json`);
}

/*********************************
 ***  ANALYSIS_PARAMETERS END  ***
 ********************************/

/********************************
 ***  ANALYSIS_METHODS START  ***
 *******************************/
export function fetchAnalysisMethodDetail(id) {
  return get(`analysis_method/?id=${id}&format=json`);
}

/******************************
 ***  ANALYSIS_METHODS END  ***
 *****************************/

/**********************
 *** IMAGESET START ***
 **********************/

export function fetchImageset(id) {
  return get(`imageset/?id=${id}&format=json`);
}

/**********************
 ***  IMAGESET END  ***
 **********************/

/***********************
 *** UNIVERSAL START ***
 ***********************/

export function fetchChangeRecordState(table, id, stateData) {
  return post("change/" + table + "/" + id, stateData);
}

export function fetchDeleteRecord(table, id) {
  return post_delete(`${table}/${id}`);
}

export function fetchAllFields(table, data = null) {
  // if (data.show_all) return get(`fields/${table}?show_all=true`);
  // else return get(`fields/${table}`);
  return get(`dynamic_fields/${table}`);
}

export function fetchRotateImage(data) {
  return post("rotate_image/", data);
}

/***********************
 ***  UNIVERSAL END  ***
 ***********************/

/*************************
 *** PERMISSIONS START ***
 *************************/

export function fetchGroups() {
  return get(`group/?format=json`);
}

export function fetchUsers() {
  return get(`user/?format=json`);
}

export function fetchObjectPermissions(id, table) {
  return get(`${table}/${id}/getpermissions?format=json`);
}

export function fetchObjectGroupPermissions(id, table, permissionName) {
  return get(
    `group_object_permission/?object_pk=${id}&content_type__model=${table}&permission__codename=${permissionName}&format=json`
  );
}

export function fetchObjectUserPermissions(id, table, permissionName) {
  return get(
    `user_object_permission/?object_pk=${id}&content_type__model=${table}&permission__codename=${permissionName}&format=json`
  );
}

/*************************
 ***  PERMISSIONS END  ***
 *************************/

/*********************
 *** HELPERS START ***
 *********************/

function buildOrderBy(sortBy, sortDesc) {
  if (sortBy && sortDesc && sortBy.length > 0 && sortDesc.length > 0) {
    let orderBy = "";

    sortBy.forEach((field, index) => {
      orderBy += (sortDesc[index] ? "-" : "") + field + ",";
    });

    if (orderBy.length > 0) orderBy = orderBy.substring(0, orderBy.length - 1);
    else orderBy = "-id";

    return orderBy;
  } else return "-id";
}

function buildDynamicSearch(data, prefix = "") {
  let result = "";
  if (data?.length > 0) {
    data.forEach((item) => {
      if (item.value)
        result += `&${prefix}${item.id}__${item.lookUpType}=${item.value}`;
    });
  }
  return result;
}

/*********************
 ***  HELPERS END  ***
 *********************/
