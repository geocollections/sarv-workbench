import Vue from "vue";
import router from "../../../router";
import store from "../../../store";
import axios from "axios";

const api = {
  url: `${import.meta.env.VITE_API_URL}/api/v0/private/`,
  baseUrl: `${import.meta.env.VITE_API_URL}/`,
  accountsUrl: `${import.meta.env.VITE_API_URL}/accounts/`,
  dataciteUrl: `${import.meta.env.VITE_API_URL}/datacite/`,
  checkDoiUrl: "https://api.crossref.org/works/",
  solrUrl: "https://api.geocollections.info/solr/",
  publicApi: "https://api.geocollections.info/",
};

const attachmentFields =
  "id,uuid_filename,description,description_en,original_filename,date_created,attachment_format__value,author__agent,image_number";

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  if (
    config.url.includes("rwapi") &&
    !config.url.includes("/login/") &&
    !config.url.includes("/idcard") &&
    !config.url.includes("/egf/")
  ) {
    let csrftoken = Vue.$cookies.get("csrftoken");
    config.withCredentials = true;
    config.headers["X-CSRFTOKEN"] = csrftoken;
    if (store.state?.user?.authUser?.token) {
      config.headers[
        "Authorization"
      ] = `Token ${store?.state?.user?.authUser?.token}`;
    }
  }

  return config;
});

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    if (response.status === 200 && response.config.url.includes("rwapi")) {
      // Showing Missing permissions message
      if (response.data.error_permissions) {
        Vue.prototype.toast.error(
          response.data.error_permissions,
          "Missing permissions",
          {
            position: "topCenter",
            timeout: 5000,
            closeOnEscape: true,
            pauseOnHover: false,
            displayMode: "replace",
          }
        );
      }

      // Destroying session and redirecting to login view
      if (response.data.error_not_logged_in) {
        Vue.$cookies.remove("csrftokenLocalhost", null, "localhost");
        Vue.$cookies.remove("csrftoken", null, "geocollections.info");
        Vue.prototype.toast.error("Please log back in", "Session expired", {
          position: "topCenter",
          timeout: 5000,
          closeOnEscape: true,
          pauseOnHover: false,
          displayMode: "replace",
        });
        router.push({ path: "/" });
      }

      // Showing link error message
      if (response.data.link_error) {
        Vue.prototype.toast.error(response.data.link_error, "Error", {
          position: "topCenter",
          timeout: 99999999999,
          pauseOnHover: false,
          displayMode: "replace",
        });
      }
    }

    return response;
  },
  async (error) => {
    if (error.status === 401) {
      await store.dispatch("user/setAuthUser", null);
    }
    return Promise.reject(error);
  }
);

async function get(child = "", customUrl) {
  let url = api.url + child;
  if (customUrl) url = customUrl + child;
  try {
    return await axios.get(url);
  } catch (error) {
    return error.response;
  }
}

async function post(
  child,
  data,
  customUrl = "",
  returnErrorResponse = false,
  config = {}
) {
  let url = api.url + child;
  if (customUrl && customUrl.length > 0) url = customUrl + child + "/";
  let useLoginOptions = false;
  let loginOptions;

  if (child.includes("login")) {
    const form = new FormData();
    form.append("user", data.user);
    form.append("pwd", data.pwd);

    useLoginOptions = true;
    loginOptions = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: form,
      url,
    };
  }

  try {
    if (useLoginOptions) return await axios(loginOptions);
    else return await axios.post(url, data, config);
  } catch (error) {
    return error.response;
  }
}

async function put(
  child,
  data,
  customUrl = "",
  returnErrorResponse = false,
  config = {}
) {
  let url = api.url + child;
  if (customUrl && customUrl.length > 0) url = customUrl + child + "/";

  try {
    return await axios.put(url, data, config);
  } catch (error) {
    return error.response;
  }
}

async function post_delete(child) {
  let url = `${api.url}delete/${child}`;

  try {
    return await axios.delete(url);
  } catch (error) {
    return error.response;
  }
}

/*******************
 *** LOGIN START ***
 *******************/

export function fetchLogin(userData) {
  return post(`v0/login`, userData, api.accountsUrl);
}

export function fetchLoginOrcid(code) {
  return post(`v0/dj-rest-auth/orcid`, { code: code }, api.accountsUrl, true);
}

export function fetchLoginId() {
  return get(
    `?redirect_uri=${import.meta.env.VITE_API_URL}/accounts/idcard/`,
    "https://idcard.geoloogia.info/"
  );
}

export function fetchLogout() {
  return post(`knox/auth/logout`, {}, api.accountsUrl);
}

export function fetchIsLoggedIn() {
  return get(`v0/login_state`, api.accountsUrl);
}

/*******************
 ***  LOGIN END  ***
 *******************/

export function postRequest(url, data, customUrl = "", config = {}) {
  return post(url, data, customUrl, config);
}

/*************************
 *** ATTACHMENTS START ***
 *************************/

export function fetchAttachments(data, dynamicSearch) {
  let fields =
    "original_filename,filename,specimen_image_attachment,type,type__value,type__value_en,attachment_format,attachment_format__value,author,author__agent,author_free,date_created,date_created_free,device,device__name,device_txt,date_digitised,date_digitised_free,agent_digitised,agent_digitised__agent,device_digitised,device_digitised__name,copyright_agent,copyright_agent__agent,licence,licence__licence,licence__licence_en,description,description_en,size_mb,remarks,tags,stars,is_private,is_preferred,is_locked,specimen,specimen__specimen_id,locality,locality__locality,locality__locality_en,drillcore,drillcore__drillcore,drillcore__drillcore_en,drillcore_box,drillcore_box__number,reference,reference__reference,drillcore_image_id,image_id,imageset,imageset__imageset_number,specimen_image_id,image_number,image_type,image_type__value,image_type__value_en,image_width,image_height,image_category,image_category__value,image_category__value_en,image_object,image_place,image_people,image_latitude,image_longitude,image_altitude,image_scalebar,image_description,image_description_en,storage,user_added,date_added,user_changed,date_changed,database,database__acronym,uuid_filename,id,upload,uuid";

  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }
  if (data.image_number !== null && data.image_number.trim().length > 0) {
    searchFields += `image_number__${
      data.image_number__lookuptype || "icontains"
    }=${data.image_number}`;
  }
  if (data.filename !== null && data.filename.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.filename +
      ";fields:original_filename,uuid_filename;lookuptype:" +
      `${data.filename__lookuptype || "icontains"}`;
  }
  if (data.specimen !== null && data.specimen.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.specimen +
      ";fields:specimen__id,specimen__specimen_id;lookuptype:" +
      `${data.specimen__lookuptype || "icontains"}`;
  }
  if (data.imageInfo !== null && data.imageInfo.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.imageInfo +
      ";fields:description,description_en,image_place,image_object,image_people,image_description,image_description_en,tags;lookuptype:" +
      `${data.imageInfo__lookuptype || "icontains"}`;
  }
  if (data.locality !== null && data.locality.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.locality +
      ";fields:locality__locality,locality__locality_en;lookuptype:" +
      `${data.locality__lookuptype || "icontains"}`;
  }

  if (data.selection && data.selection.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.selection +
      ";fields:selection__selection__name,selection__selection__id;lookuptype:" +
      `${data.selection__lookuptype || "icontains"}`;
  }

  if (data.author && data.author.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.author +
      ";fields:author__agent,author__forename,author__surename,author_free,user_added;lookuptype:" +
      `${data.author__lookuptype || "icontains"}`;
  }

  if (
    data.specimen_image_attachment.length > 0 &&
    data.specimen_image_attachment.length <= 3
  ) {
    searchFields +=
      "&specimen_image_attachment__in=" + data.specimen_image_attachment;
  }
  // If all checkboxes are unchecked then there won't be any results, that's why zero is added.
  if (data.specimen_image_attachment.length === 0) {
    searchFields += "&specimen_image_attachment=0";
  }
  if (data.keyword !== null && data.keyword.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.keyword +
      ";fields:attachmentkeyword__keyword__keyword,description,description_en,image_place,image_object,image_people,image_description,image_description_en,tags;lookuptype:" +
      `${data.keyword__lookuptype || "icontains"}&distinct=true`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `attachment/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `attachment/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

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

export function fetchRecentImages(currentUserId) {
  return get(
    `attachment/?author_id=${currentUserId}&image_latitude!=null&order_by=-id&paginate_by=30&fields=image_latitude,image_longitude,id,image_place`
  );
}

export function fetchRecentFiles(currentUserId, paginateBy) {
  return get(
    `attachment/?author_id=${currentUserId}&order_by=-id&paginate_by=${paginateBy}`
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

export async function fetchReferences(data, dynamicSearch) {
  const fields =
    "reference,author,author_original,year,type,type__ris_type,type__value,type__value_en,language,language__value,language__value_en,title,title_original,title_translated,title_translated_language,title_translated_language__value,title_translated_language__value_en,book,book_original,book_translated,book_translated_language,book_translated_language__value,book_translated_language__value_en,book_editor,publisher,publisher_place,journal,journal__journal_name,journal_txt,journal_additional,volume,number,pages,figures,doi,url,issn,isbn,abstract,author_keywords,tags,remarks,remarks_private,is_oa,licence,licence__licence,licence__licence_en,egf,is_private,is_locked,location_txt,is_estonian_reference,is_estonian_author,parent_reference,parent_reference__reference,translated_reference,translated_reference__reference,user_added,date_added,user_changed,date_changed,id,uuid,attachment__filename";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);
  // This (solr search) overrides regular search fields
  if (data.solrSearch && data.solrSearch.trim().length > 0) {
    let start = (data.page - 1) * data.paginateBy;
    return get(
      `reference/?q=${data.solrSearch}&rows=${data.paginateBy}&start=${start}&format=json`,
      api.solrUrl
    );
  }

  let searchFields = "";

  if (data.author !== null && data.author.trim().length > 0) {
    searchFields += `author__${data.author__lookuptype || "icontains"}=${
      data.author
    }`;
  }
  if (data.year !== null && data.year.trim().length > 0) {
    searchFields += `&year__${data.year__lookuptype || "icontains"}=${
      data.year
    }`;
  }
  if (data.title !== null && data.title.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.title +
      ";fields:title,title_original;lookuptype:" +
      `${data.title__lookuptype || "icontains"}`;
  }
  if (data.bookJournal !== null && data.bookJournal.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.bookJournal +
      ";fields:book,book_editor,journal__journal_name;lookuptype:" +
      `${data.bookJournal__lookuptype || "icontains"}`;
  }
  if (data.abstractRemarks && data.abstractRemarks.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.abstractRemarks +
      ";fields:abstract,remarks;lookuptype:" +
      `${data.abstractRemarks__lookuptype || "icontains"}`;
  }
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `&id__${data.id__lookuptype || "icontains"}=${data.id}`;
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
  if (
    data.libraryAuthorIdTitle &&
    data.libraryAuthorIdTitle.trim().length > 0
  ) {
    searchFields +=
      "&multi_search=value:" +
      data.libraryAuthorIdTitle +
      ";fields:reference_libraries__library__author__id,reference_libraries__library__author__agent,reference_libraries__library__author_txt,reference_libraries__library__id,reference_libraries__library__title,reference_libraries__library__title_en;lookuptype:" +
      `${data.libraryAuthorIdTitle__lookuptype || "icontains"}&distinct=true`;
  }
  if (data.userAdded && data.userAdded.trim().length > 0) {
    searchFields += `&user_added__${
      data.userAdded__lookuptype || "icontains"
    }=${data.userAdded}`;
  }
  if (data.keywords !== null && data.keywords.trim().length > 0) {
    searchFields += `&reference_keyword__keyword__keyword__${
      data.keywords__lookuptype || "icontains"
    }=${data.keywords}`;
  }
  if (data.isEstonianReference) {
    searchFields += `&is_estonian_reference=${data.isEstonianReference}`;
  }
  if (data.isEstonianAuthor) {
    searchFields += `&is_estonian_author=${data.isEstonianAuthor}`;
  }
  searchFields += buildDynamicSearch(dynamicSearch);
  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    // Not using 'fields' because of alternative table
    // return get(`reference/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
    return get(
      `reference/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    // Not using 'fields' because of alternative table
    // return get(`reference/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
    return get(
      `reference/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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
    `reference/?id=${id}&fields=attachment__id,attachment__attachment_format__value,attachment__author__agent,attachment__description,attachment__description_en,attachment__original_filename,attachment__uuid_filename&format=json`
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

export function fetchReferenceStratigraphy(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `stratigraphy_reference/?reference=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
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

export function fetchLocalities(data, dynamicSearch) {
  const fields =
    "locality,locality_en,number,code,type,type__value,type__value_en,parent,parent__locality,parent__locality_en,latitude,longitude,elevation,coord_det_precision,coord_det_precision__value,coord_det_precision__value_en,coord_det_method,coord_det_method__value,coord_det_method__value_en,coord_det_agent,coord_det_agent__agent,coord_system,epsg,coordx,coordy,extent,extent__value,extent__value_en,country,country__value,country__value_en,maakond,maakond__maakond,maakond__maakond_en,vald,vald__vald,vald__vald_en,asustusyksus,asustusyksus__asustusyksus,asustusyksus__asustusyksus_en,remarks_location,depth,stratigraphy_base,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en,stratigraphy_top,stratigraphy_top__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_base_free,stratigraphy_top_free,eelis,maaamet_pa_id,is_private,remarks,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.locality !== null && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.locality
    };fields:locality_en,locality;lookuptype:${
      data.locality__lookuptype || "icontains"
    }`;
  }

  if (data.number !== null && data.number.trim().length > 0) {
    searchFields += `&number__${data.number__lookuptype || "icontains"}=${
      data.number
    }`;
  }

  if (data.country !== null && data.country.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.country
    };fields:country__value_en,country__value;lookuptype:${
      data.country__lookuptype || "icontains"
    }`;
  }

  if (data.agent !== null && data.agent.trim().length > 0) {
    searchFields += `&user_added__${data.agent__lookuptype || "icontains"}=${
      data.agent
    }`;
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

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `locality/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `locality/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

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
    `attachment/?attachment_link__locality__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
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
export function fetchLocalityImage(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `locality_image/?locality_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
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

export function fetchSamples(data, dynamicSearch) {
  const fields =
    "number,number_additional,number_field,igsn,series,series__name,parent_sample,parent_sample__number,parent_specimen,parent_specimen__specimen_id,sample_purpose,sample_purpose__value,sample_purpose__value_en,sample_type,locality,locality__locality,locality__locality_en,site,site__name,site__name_en,locality_free,latitude1,longitude1,x1,y1,epsg,coordinate_accuracy,depth,depth_interval,stratigraphy,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,lithostratigraphy,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en,stratigraphy_free,stratigraphy_bed,soil_horizon,agent_collected,agent_collected__agent,agent_collected_free,date_collected,date_collected_free,classification_rock,classification_rock__name,classification_rock__name_en,rock,rock_en,fossils,palaeontology,analysis,mass,location,location_additional,storage,storage__location,storage_additional,storage_additional__location,remarks,user_added,date_added,user_changed,date_changed,owner,owner__agent,is_private,database__acronym,id,number,database__name_label";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.number !== null && data.number.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.number
    };fields:number,number_additional,number_field;lookuptype:${
      data.number__lookuptype || "icontains"
    }`;
  }

  if (data.locality !== null && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.locality
    };fields:locality__locality_en,locality__locality,locality_free,site__name,site__name_en,site__id;lookuptype:${
      data.locality__lookuptype || "icontains"
    }`;
  }

  if (data.depth !== null && data.depth.trim().length > 0) {
    //searchFields += '&depth__exact='+data.depth
    searchFields += `&multi_search=value:${
      data.depth
    };fields:depth,depth_interval;lookuptype:${
      data.depth__lookuptype || "icontains"
    }`;
  }
  if (data.stratigraphy !== null && data.stratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.stratigraphy
    };fields:stratigraphy__stratigraphy_en,stratigraphy__stratigraphy,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en;lookuptype:${
      data.stratigraphy__lookuptype || "icontains"
    }`;
  }

  if (data.agent !== null && data.agent.trim().length > 0) {
    searchFields += `&agent_collected__agent__${
      data.agent__lookuptype || "icontains"
    }=${data.agent}`;
  }

  if (data.storage && data.storage.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.storage
    };fields:storage__location,storage__id,storage_additional__id,storage_additional__location;lookuptype:${
      data.storage__lookuptype || "icontains"
    }`;
  }

  if (data.site !== null && data.site.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.site
    };fields:site__id,site__name,site__project__id,site__project__name;lookuptype:${
      data.site__lookuptype || "icontains"
    }`;
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
    };fields:loansample__loan__id,loansample__loan__loan_number;lookuptype:${
      data.loan__lookuptype || "icontains"
    }`;
  }

  if (data.series && data.series.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.series
    };fields:series__id,series__name;lookuptype:${
      data.series__lookuptype || "icontains"
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `sample/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `sample/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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
    `attachment/?attachment_link__sample__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
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

export function fetchRecentSamples(currentUserId) {
  return get(
    `sample/?agent_collected__id=${currentUserId}&locality__id!=null&order_by=-id&paginate_by=30&fields=locality__locality,locality__latitude,locality__longitude,locality__id`
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

export function fetchLibraries(data, dynamicSearch) {
  const fields =
    "title,title_en,title_short,title_short_en,abstract,abstract_en,author,author__agent,author_txt,year,publisher,doi,keywords,remarks,is_private,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.author_txt !== null && data.author_txt.trim().length > 0) {
    searchFields += `author_txt__${
      data.author_txt__lookuptype || "icontains"
    }=${data.author_txt}`;
  }

  if (data.year !== null && data.year.trim().length > 0) {
    searchFields += `&year__${data.year__lookuptype || "icontains"}=${
      data.year
    }`;
  }

  if (data.title !== null && data.title.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.title
    };fields:title,title_en;lookuptype:${
      data.title__lookuptype || "icontains"
    }`;
  }

  if (data.reference !== null && data.reference.trim().length > 0) {
    searchFields += `&libraryreference_library__reference__reference__${
      data.reference__lookuptype || "icontains"
    }=${data.reference}&distinct=true`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `library/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `library/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchLibrariesFromLibraryAgent(data, agent) {
  const fields =
    "id,library,library__author_txt,library__title,library__title_en,agent,agent__agent,agent__surename,agent__forename,library__is_private";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  // Using typeof check because for active libraries (reference view uses active libraries but search data will be related to referneces)
  if (
    typeof data.author_txt !== "undefined" &&
    data.author_txt !== null &&
    data.author_txt.trim().length > 0
  ) {
    searchFields += `&library__author_txt__${
      data.author_txt__lookuptype || "icontains"
    }=${data.author_txt}`;
  }

  if (
    typeof data.year !== "undefined" &&
    data.year !== null &&
    data.year.trim().length > 0
  ) {
    searchFields += `&library__year__${data.year__lookuptype || "icontains"}=${
      data.year
    }`;
  }

  if (
    typeof data.title !== "undefined" &&
    data.title !== null &&
    data.title.trim().length > 0
  ) {
    searchFields += `&multi_search=value:${
      data.title
    };fields:library__title,library__title_en;lookuptype:${
      data.title__lookuptype || "icontains"
    }`;
  }

  if (
    typeof data.reference !== "undefined" &&
    data.reference !== null &&
    data.reference.trim().length > 0
  ) {
    searchFields += `&library__libraryreference_library__reference__reference__${
      data.reference__lookuptype || "icontains"
    }=${data.reference}&distinct=true`;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `library_agent/?agent=${agent.id}&${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `library_agent/?agent=${agent.id}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchDois(data, dynamicSearch) {
  const fields =
    "identifier,creators,title,title_alternative,title_translated,title_translated_language,title_translated_language__value,title_translated_language__value_en,publisher,publication_year,subjects,reference,reference__reference,dataset,dataset__name,dataset__name_en,language,language__value,language__value_en,resource_type,resource_type__value,resource,version,sizes,formats,abstract,methods,date_txt,is_private,owner,owner__agent,copyright_agent,copyright_agent__agent,licence,licence__licence,licence__licence_en,egf,remarks,user_added,date_added,user_changed,date_changed,database,database__acronym,datacite_created,datacite_updated,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.identifier !== null && data.identifier.trim().length > 0) {
    searchFields += `&identifier__${
      data.identifier__lookuptype || "icontains"
    }=${data.identifier}`;
  }

  if (data.creators !== null && data.creators.trim().length > 0) {
    searchFields += `&creators__${data.creators__lookuptype || "icontains"}=${
      data.creators
    }`;
  }

  if (
    data.publication_year !== null &&
    data.publication_year.trim().length > 0
  ) {
    searchFields += `&publication_year__${
      data.publication_year__lookuptype || "icontains"
    }=${data.publication_year}`;
  }

  if (data.title !== null && data.title.trim().length > 0) {
    searchFields += `&title__${data.title__lookuptype || "icontains"}=${
      data.title
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `doi/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `doi/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchDoi(id) {
  return get(`doi/?id=${id}&format=json`);
}

export function fetchDoiUsingEGF(id) {
  return get(`egf/${id}`, api.baseUrl);
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
    `attachment/?attachment_link__doi__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
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
  return get(`metadata/${id}/`, api.dataciteUrl);
}

export function fetchCheckDoiUrlInDataCite(id) {
  return get(`doi/${id}/`, api.dataciteUrl);
}

export function fetchRegisterMetadataToDataCite(id) {
  return post(`metadata/${id}/`, "", api.dataciteUrl);
}

export function fetchRegisterDoiUrlToDataCite(id) {
  return post(`doi/${id}/`, "", api.dataciteUrl);
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
    `project/${id}?fields=id,project_agent__agent,project_agent__agent__agent&format=json`
  );
}

export function fetchProjectAttachment(id, page = 1) {
  return get(
    `attachment/?attachment_link__project__id=${id}&page=${page}&paginate_by=100&fields=${attachmentFields}&format=json`
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

export function fetchProjects(data, dynamicSearch) {
  const fields =
    "name,name_en,number,project_type,project_type__name,project_type__name_en,parent_project,parent_project__name,parent_project__name_en,date_start,date_end,date_free,description,remarks,owner,owner__agent,is_private,user_added,date_added,user_changed,date_changed,id,timestamp";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `&id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.name !== null && data.name.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.name
    };fields:name,name_en;lookuptype:${data.name__lookuptype || "icontains"}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);
  if (searchFields.length > 0) {
    return get(
      `project/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `project/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchSites(data, dynamicSearch) {
  let fields =
    "project,project__name,project__name_en,locality,locality__locality,locality__locality,area,area__name,area__name_en,site_type,site_type__value,site_type__value,name,name_en,number,latitude,longitude,location_accuracy,elevation,elevation_accuracy,coord_det_precision,coord_det_precision__value,coord_det_precision__value_en,coord_det_method,coord_det_method__value,coord_det_method__value_en,coord_det_agent,coord_det_agent__agent,epsg,coordx,coordy,extent,depth,date_start,date_end,date_free,remarks_location,description,remarks,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `&id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.name !== null && data.name.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.name
    };fields:name,name_en;lookuptype:${data.name__lookuptype || "icontains"}`;
  }

  if (data.number !== null && data.number.trim().length > 0) {
    searchFields += `&number__${data.number__lookuptype || "icontains"}=${
      data.number
    }`;
  }

  if (data.project !== null && data.project.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.project
    };fields:project__name,project__name_en;lookuptype:${
      data.project__lookuptype || "icontains"
    }`;
  }

  if (data.date_start !== null) {
    let dateStart = data.date_start;

    if (typeof dateStart === "string") dateStart = dateStart.split("T")[0];
    else {
      dateStart.setHours(0, -dateStart.getTimezoneOffset(), 0, 0);
      dateStart = dateStart.toISOString().split("T")[0];
    }
    searchFields += `&date_start__gte=${dateStart}`;
  }

  if (data.date_end !== null) {
    let dateEnd = data.date_end;
    if (typeof dateEnd === "string") dateEnd = dateEnd.split("T")[0];
    else {
      dateEnd.setHours(0, -dateEnd.getTimezoneOffset(), 0, 0);
      dateEnd = dateEnd.toISOString().split("T")[0];
    }

    searchFields += `&date_end__lte=${dateEnd}`;
  }

  // if (data.date_start !== null && data.date_start.trim().length > 0) {
  //   searchFields += `&date_start__gt=${data.date_start}`
  // }

  if (data.coords_not_null === true) {
    searchFields += `&latitude__isnull=False&longitude__isnull=False`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    // return data.coords_not_null === true ? get(`site/?${searchFields}&order_by=${data.orderBy}&fields=id, latitude, longitude&format=json`):
    return get(
      `site/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    // return data.coords_not_null === true ? get(`site/?order_by=${data.orderBy}&fields=id, latitude, longitude&format=json`):

    return get(
      `site/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchSite(id) {
  return get(`site/?id=${id}&format=json`);
}

export function fetchSiteAttachment(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attachment_link__site__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
  );
}

export function fetchLinkedSamples(data, siteID) {
  let fields =
    "id,number,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en,depth_interval,depth,rock,rock_en";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `id__iexact=${data.id}`;
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

export function fetchRecentSites(currentUserId) {
  return get(
    `site/?project__project_agent__agent=${currentUserId}&order_by=-id&paginate_by=30&fields=name,latitude,longitude,id`
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

export function fetchAnalyses(data, dynamicSearch) {
  const fields =
    "material,sample,sample__number,sample__locality,sample__locality__locality,sample__locality__locality_en,sample__depth,specimen,specimen__specimen_id,dataset,dataset__name,dataset__name_en,reference,reference__reference,analysis_method,analysis_method__analysis_method,analysis_method__method_en,method_details,method_details_en,mass,date,date_end,date_free,lab,lab__lab,lab__lab_en,lab_txt,lab_sample_number,lab_analysis_number,instrument,instrument__instrument,instrument__instrument_en,instrument_txt,agent,agent__agent,agent_txt,owner,owner__agent,is_private,location,storage,storage__location,remarks,user_added,date_added,user_changed,date_changed,database,database__acronym,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.analysis_method !== null && data.analysis_method.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.analysis_method
    };fields:analysis_method__analysis_method,analysis_method__method_en;lookuptype:${
      data.analysis_method__lookuptype || "icontains"
    }`;
  }

  if (data.agentAndLab !== null && data.agentAndLab.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.agentAndLab
    };fields:agent__agent,lab_txt;lookuptype:${
      data.agentAndLab__lookuptype || "icontains"
    }`;
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

  if (data.sample && data.sample.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.sample
    };fields:sample__id,sample__number,sample__number_additional;lookuptype:${
      data.sample__lookuptype || "icontains"
    }`;
  }

  if (data.datasetId && data.datasetId.trim().length > 0) {
    searchFields += `&dataset__id__${
      data.datasetId__lookuptype || "icontains"
    }=${data.datasetId}`;
  }

  // if (typeof agent !== "undefined" && agent !== null) {
  //   searchFields += `&or_search=agent__id:${agent.id};user_added:${agent.user};owner__id:${agent.id}`;
  // }
  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);
  if (searchFields.length > 0) {
    return get(
      `analysis/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `analysis/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchAnalysisAttachment(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attachment_link__analysis__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
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

export function fetchJournals(data, dynamicSearch) {
  let fields =
    "journal_name,journal_short,journal_long,journal_abbr,journal_original,issn,publisher,publisher_place,http,former_journal,former_journal__journal_name,following_journal,following_journal__journal_name,oldname,newname,remarks,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.journal !== null && data.journal.trim().length > 0) {
    searchFields += `multi_search=value:${
      data.journal
    };fields:journal_name,journal_short,journal_original;lookuptype:${
      data.journal__lookuptype || "icontains"
    }`;
  }

  if (data.publisher !== null && data.publisher.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.publisher
    };fields:publisher,publisher_place;lookuptype:${
      data.publisher__lookuptype || "icontains"
    }`;
  }

  if (data.remarks !== null && data.remarks.trim().length > 0) {
    searchFields += `&remarks__${data.remarks__lookuptype || "icontains"}=${
      data.remarks
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `journal/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `journal/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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
    "specimen_id,collection,coll,coll__number,specimen_nr,number_field,type,type__value,type__value_en,subtype_id,subtype_id__value,subtype_id__value_en,fossil,fossil__value,fossil__value_en,kind,kind,kind,classification,classification__class_field,part,number_pieces,locality,locality__locality,locality__locality_en,locality_free,locality_free_en,locality_is_private,depth,depth_interval,sample_number,sample,sample__number,parent,parent__specimen_id,remarks_collecting,stratigraphy,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en,stratigraphy_free,agent_collected,agent_collected__agent,agent_collected_free,date_collected,date_collected_free,remarks,remarks_internal,tags,presence,presence__value,presence__value_en,storage,storage__location,location,status,status__value,status__value_en,original_status,original_status__value,original_status__value_en,is_private,accession,accession__number,deaccession,deaccession__number,user_added,date_added,user_changed,date_changed,database,database__acronym,id,database__name,database__name_en,database__name_label";
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
    };fields:specimen_identification__name,specimen_identification__taxon__taxon;lookuptype:${
      data.fossil__lookuptype || "icontains"
    }`;
  }

  if (data.mineralRock && data.mineralRock.trim().length > 0) {
    // Todo: Duplicate records issue, but distinct makes it slow
    if (data.fossil && data.fossil.trim().length > 0)
      searchFields += "&distinct=true";
    searchFields += `&multi_search=value:${
      data.mineralRock
    };fields:specimen_identification_geology__name,specimen_identification_geology__name_en,specimen_identification_geology__rock__name,specimen_identification_geology__rock__name_en;lookuptype:${
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

  if (searchFields.length > 0) {
    return get(
      `specimen/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `specimen/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchSpecimenImages(data, dynamicSearch) {
  const fields =
    "id,specimen_id,size_mb,original_filename,uuid_filename,user_added,date_added,specimen__specimen_id,specimen__collection,specimen__coll,specimen__coll__number,specimen__specimen_nr,specimen__number_field,specimen__type,specimen__type__value,specimen__type__value_en,specimen__subtype_id,specimen__subtype_id__value,specimen__subtype_id__value_en,specimen__fossil,specimen__fossil__value,specimen__fossil__value_en,specimen__kind,specimen__kind,specimen__kind,specimen__classification,specimen__classification__class_field,specimen__part,specimen__number_pieces,specimen__locality,specimen__locality__locality,specimen__locality__locality_en,specimen__locality_free,specimen__locality_free_en,specimen__locality_is_private,specimen__depth,specimen__depth_interval,specimen__sample_number,specimen__sample,specimen__sample__number,specimen__parent,specimen__parent__specimen_id,specimen__remarks_collecting,specimen__stratigraphy,specimen__stratigraphy__stratigraphy,specimen__stratigraphy__stratigraphy_en,specimen__lithostratigraphy__stratigraphy,specimen__lithostratigraphy__stratigraphy_en,specimen__stratigraphy_free,specimen__agent_collected,specimen__agent_collected__agent,specimen__agent_collected_free,specimen__date_collected,specimen__date_collected_free,specimen__remarks,specimen__remarks_internal,specimen__tags,specimen__presence,specimen__presence__value,specimen__presence__value_en,specimen__storage,specimen__storage__location,specimen__location,specimen__status,specimen__status__value,specimen__status__value_en,specimen__original_status,specimen__original_status__value,specimen__original_status__value_en,specimen__is_private,specimen__accession,specimen__accession__number,specimen__deaccession,specimen__deaccession__number,specimen__user_added,specimen__date_added,specimen__user_changed,specimen__date_changed,specimen__database,specimen__database__acronym,specimen__id";
  let searchFields = "";
  let orderBy = "";

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
    };fields:specimen__specimen_identification__name,specimen__specimen_identification__taxon__taxon;lookuptype:${
      data.fossil__lookuptype || "icontains"
    }`;
  }

  if (data.mineralRock && data.mineralRock.trim().length > 0) {
    // Todo: Duplicate records issue, but distinct makes it slow
    if (data.fossil && data.fossil.trim().length > 0)
      searchFields += "&distinct=true";
    searchFields += `&multi_search=value:${
      data.mineralRock
    };fields:specimen__specimen_identification_geology__name,specimen__specimen_identification_geology__name_en,specimen__specimen_identification_geology__rock__name,specimen__specimen_identification_geology__rock__name_en;lookuptype:${
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

  orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (searchFields.length > 0) {
    return get(
      `attachment/?${searchFields}&specimen_image_attachment=1&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `attachment/?specimen_image_attachment=1&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchDatabase() {
  return get(`database/?format=json`);
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
    `attachment/?attachment_link__specimen__id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
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

export function fetchRecentSpecimens(currentUserId) {
  return get(
    `specimen/?agent_collected__id=${currentUserId}&locality__id!=null&order_by=-id&paginate_by=30&fields=locality__locality,locality__latitude,locality__longitude,locality__id`
  );
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

export function fetchCollections(data, dynamicSearch) {
  const fields =
    "id,number,collection_id,name,name_long,name_en,name_long_en,type,type__value,type__value_en,classification,classification__class_field,agent,agent__agent,locality,locality__locality,locality__locality_en,stratigraphy,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,number_objects,number_types,reference,reference__reference,remarks,user_added,date_added,user_changed,date_changed,database,database__acronym";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.number && data.number.trim().length > 0) {
    searchFields += `&collection_id__${
      data.number__lookuptype || "icontains"
    }=${data.number}`;
  }

  if (data.name && data.name.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.name
    };fields:name,name_en,name_long,name_long_en;lookuptype:${
      data.name__lookuptype || "icontains"
    }`;
  }

  if (data.agent && data.agent.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.agent
    };fields:agent__id,agent__agent,agent__forename,agent__surename;lookuptype:${
      data.agent__lookuptype || "icontains"
    }`;
  }

  if (data.locality && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.locality
    };fields:locality__id,locality__locality,locality__locality_en;lookuptype:${
      data.locality__lookuptype || "icontains"
    }`;
  }

  if (data.reference && data.reference.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.reference
    };fields:reference__id,reference__reference;lookuptype:${
      data.reference__lookuptype || "icontains"
    }`;
  }

  if (data.classification && data.classification.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.classification
    };fields:classification__id,classification__class_field,classification__class_en,classification__class_lat,classification__class_synonym,classification__class_en_synonym;lookuptype:${
      data.classification__lookuptype || "icontains"
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `collection/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `collection/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

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

export function fetchTaxa(data, dynamicSearch) {
  const fields =
    "taxon,author_year,taxon_epithet,taxon_full_name,taxon_original_name,reference,reference__reference,parent,parent__taxon,fossil_group,fossil_group__taxon,synonym_of,synonym_of_reference_id,hierarchy_string,rank,rank__rank,rank_original,rank_original__rank,type_taxon,type_taxon__taxon,type_taxon_txt,stratigraphy_base,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en,stratigraphy_top,stratigraphy_top__stratigraphy,stratigraphy_top__stratigraphy_en,in_estonia,in_baltoscandia,is_fossil,is_private,is_valid,is_fossil_group,sort,taxon_id_pbdb,taxon_id_plutof,taxon_id_tol,taxon_id_eol,taxon_id_nrm,remarks,owner,is_authorized,user_authorized,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.taxon && data.taxon.trim().length > 0) {
    searchFields += `&taxon__${data.taxon__lookuptype || "icontains"}=${
      data.taxon
    }`;
  }

  if (data.author_year && data.author_year.trim().length > 0) {
    searchFields += `&author_year__${
      data.author_year__lookuptype || "icontains"
    }=${data.author_year}`;
  }

  if (data.parent__taxon && data.parent__taxon.trim().length > 0) {
    searchFields += `&parent__taxon__${
      data.parent__taxon__lookuptype || "icontains"
    }=${data.parent__taxon}`;
  }

  if (data.taxon_epithet && data.taxon_epithet.trim().length > 0) {
    searchFields += `&taxon_epithet__${
      data.taxon_epithet__lookuptype || "icontains"
    }=${data.taxon_epithet}`;
  }

  if (data.user_added && data.user_added.trim().length > 0) {
    searchFields += `&user_added__${
      data.user_added__lookuptype || "icontains"
    }=${data.user_added}`;
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

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `taxon/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `taxon/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

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
    `taxon_page/?taxon=${taxonId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

export function fetchTaxonAttachments(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attachment_link__taxon=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
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

export function fetchKeywords(data, listOfIDs, dynamicSearch) {
  let fields =
    "keyword,language,language__value,language__value_en,keyword_category,keyword_category__name,keyword_category__name_en,related_keyword,related_keyword__keyword,is_primary,is_preferred,is_private,description,remarks,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (listOfIDs && listOfIDs.length > 0) {
    searchFields += `id__in=${listOfIDs}`;
  }
  if (data.id && data.id.trim().length > 0) {
    searchFields += `&id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }
  if (data.term && data.term.trim().length > 0) {
    searchFields += `&keyword__${data.term__lookuptype || "icontains"}=${
      data.term
    }`;
  }
  if (data.language && data.language.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.language
    };fields:language__value,language__value_en;lookuptype:${
      data.language__lookuptype || "icontains"
    }`;
  }
  if (data.keyword_category && data.keyword_category.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.keyword_category
    };fields:keyword_category__name,keyword_category__name_en;lookuptype:${
      data.keyword_category__lookuptype || "icontains"
    }`;
  }
  if (data.related_keyword && data.related_keyword.trim().length > 0) {
    searchFields += `&related_keyword__keyword__icontains=${data.related_keyword}`;
  }
  if (data.is_primary) {
    searchFields += `&is_primary=${data.is_primary}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `keyword/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `keyword/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchAgents(data, dynamicSearch) {
  const fields =
    "agent,type,type__value,type__value_en,forename,middlename,surename,title,profession,profession_en,institution,institution__agent,institution_name,institution_name_en,address,address1,address2,country,country__value,country__value_en,country_txt,phone,email,http,old_name,new_name,date_born,date_deceased,orcid,remarks,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.agent && data.agent.trim().length > 0) {
    searchFields += `&agent__${data.agent__lookuptype || "icontains"}=${
      data.agent
    }`;
  }

  if (data.forename && data.forename.trim().length > 0) {
    searchFields += `&forename__${data.forename__lookuptype || "icontains"}=${
      data.forename
    }`;
  }

  if (data.surename && data.surename.trim().length > 0) {
    searchFields += `&surename__${data.surename__lookuptype || "icontains"}=${
      data.surename
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `agent/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `agent/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchSelectionSeries(data, dynamicSearch) {
  let fields =
    "name,tablename,remarks,user_added,date_added,user_changed,date_changed,database,database__acronym,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `&id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }
  if (data.name && data.name.trim().length > 0) {
    searchFields += `&name__${data.name__lookuptype || "icontains"}=${
      data.name
    }`;
  }
  if (data.remarks && data.remarks.trim().length > 0) {
    searchFields += `&remarks__${data.remarks__lookuptype || "icontains"}=${
      data.remarks
    }`;
  }
  if (data.user_added && data.user_added.trim().length > 0) {
    searchFields += `&user_added__${
      data.user_added__lookuptype || "icontains"
    }=${data.user_added}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `selection_series/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `selection_series/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

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

export function fetchDrillcores(data, dynamicSearch) {
  const fields =
    "drillcore,drillcore_en,locality,locality__locality,locality__locality_en,year,agent,agent__agent,depository,depository__value,depository__value_en,location,storage,storage__location,boxes,box_numbers,number_meters,direction_lr,depth,igsn,remarks,database,database__acronym,uid,gid,is_private,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.drillcore && data.drillcore.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.drillcore
    };fields:drillcore,drillcore_en,locality__locality,locality__locality_en;lookuptype:${
      data.drillcore__lookuptype || "icontains"
    }`;
  }

  if (data.boxes && data.boxes.trim().length > 0) {
    searchFields += `&boxes__${data.boxes__lookuptype || "icontains"}=${
      data.boxes
    }`;
  }

  if (data.locality && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.locality
    };fields:depth,locality__depth;lookuptype:${
      data.locality__lookuptype || "icontains"
    }`;
  }

  if (data.storage && data.storage.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.storage
    };fields:storage__location,depository__value;lookuptype:${
      data.storage__lookuptype || "icontains"
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `drillcore/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `drillcore/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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
    `attachment/?attachment_link__drillcore__id=${drillcoreId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
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

export function fetchDrillcoreBoxes(data, dynamicSearch) {
  const fields =
    "drillcore,drillcore__drillcore,drillcore__drillcore_en,number,number_meters,diameter,depth_start,depth_end,depth_other,stratigraphy_base,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en,stratigraphy_top,stratigraphy_top__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_base_free,stratigraphy_top_free,stratigraphy_free,location,storage,storage__location,remarks,user_added,date_added,user_changed,date_changed,database,database__acronym,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.storage && data.storage.trim().length > 0) {
    searchFields += `storage__location__${
      data.storage__lookuptype || "icontains"
    }=${data.storage}`;
  }

  if (data.drillcore && data.drillcore.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.drillcore
    };fields:drillcore__drillcore,drillcore__drillcore_en;lookuptype:${
      data.drillcore__lookuptype || "icontains"
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `drillcore_box/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `drillcore_box/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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
    `attachment/?attachment_link__drillcore_box__id=${drillcoreBoxId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
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

export function fetchPreparations(data, dynamicSearch) {
  const fields =
    "preparation_number,sample,sample__number,analysis,sample_number,taxon,taxon__taxon,agent,agent__agent,agent_txt,date_prepared,date_prepared_txt,identification_agent,identification_agent__agent,identification_date,identification_remarks,location,storage,storage__location,owner,owner__agent,is_private,remarks,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.preparation_number && data.preparation_number.trim().length > 0) {
    searchFields += `preparation_number__${
      data.preparation_number__lookuptype || "icontains"
    }=${data.preparation_number}`;
  }
  if (
    data.sample__locality__locality &&
    data.sample__locality__locality.trim().length > 0
  ) {
    searchFields += `sample__locality__locality__${
      data.sample__locality__locality__lookuptype || "icontains"
    }=${data.sample__locality__locality}`;
  }
  if (
    data.sample__number_additional &&
    data.sample__number_additional.trim().length > 0
  ) {
    searchFields += `sample__number_additional__${
      data.sample__number_additional__lookuptype || "icontains"
    }=${data.sample__number_additional}`;
  }

  if (data.stratigraphy !== null && data.stratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.stratigraphy
    };fields:sample__stratigraphy__stratigraphy_en,sample__stratigraphy__stratigraphy,sample__lithostratigraphy__stratigraphy,sample__lithostratigraphy__stratigraphy_en;lookuptype:${
      data.stratigraphy__lookuptype || "icontains"
    }`;
  }
  if (data.sample__depth !== null && data.sample__depth.trim().length > 0) {
    //searchFields += '&depth__exact='+data.depth
    searchFields += `&multi_search=value:${
      data.sample__depth
    };fields:sample__depth,sample__depth_interval;lookuptype:${
      data.sample__depth__lookuptype || "icontains"
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `preparation/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `preparation/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchPreparationAttachment(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment/?attachment_link__preparation__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
  );
}

export function fetchLinkedTaxa(data, prepId) {
  const fields =
    "id,taxon,taxon__taxon,taxon__author_year,taxon__taxon_epithet,taxon__parent_id,taxon__parent__taxon,taxon__fossil_group__taxon,taxon__reference";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `id__iexact=${data.id}`;
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
export function fetchPreparationTaxonList(id, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `taxon_list/?preparation=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
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

export function fetchDatasets(data, dynamicSearch) {
  const fields =
    "title,creators,publication_year,resource,name,name_en,description,description_en,dataset_html,date,date_txt,is_private,owner,owner__agent,owner_txt,copyright_agent,copyright_agent__agent,licence,licence__licence,licence__licence_en,remarks,user_added,date_added,user_changed,date_changed,database,database__acronym,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.name && data.name.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.name
    };fields:title,title_translated,title_alternative;lookuptype:${
      data.name__lookuptype || "icontains"
    }`;
  }

  if (data.owner && data.owner.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.owner
    };fields:owner__id,owner__agent,owner__forename,owner__surename,owner_txt;lookuptype:${
      data.owner__lookuptype || "icontains"
    }`;
  }

  if (data.date && data.date.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.date
    };fields:date,date_txt;lookuptype:${data.date__lookuptype || "icontains"}`;
  }

  if (data.remarks && data.remarks.trim().length > 0) {
    searchFields += `&remarks__${data.remarks__lookuptype || "icontains"}=${
      data.remarks
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `dataset/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `dataset/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchMultiAddDatasetLists(table, data) {
  return post(`add_multi/${table}/`, data);
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

export function fetchStratigraphies(data, dynamicSearch) {
  const fields =
    "stratigraphy,stratigraphy_en,stratigraphy_original,author_free,year,etymon,etymon_en,original_locality,original_rank,index_main,index_main_html,index_additional,index_additional_html,index_old,color_code_cgmw,color_code_additional,hierarchy_string,parent,parent__stratigraphy,parent__stratigraphy_en,type,type__value,type__value_en,rank,rank__value,rank__value_en,scope,scope__value,scope__value_en,status,status__value,status__value_en,region,region_en,lithology,lithology_en,max_thickness,description,description_en,definition,definition_en,age_base,age_top,age_precision,age_reference,age_reference__reference,age_chronostratigraphy,age_chronostratigraphy__stratigraphy,age_chronostratigraphy__stratigraphy_en,sort_within_parent,approved_ics,approved_esk,maaamet_kood,is_private,remarks,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.stratigraphy && data.stratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.stratigraphy
    };fields:stratigraphy,stratigraphy_en;lookuptype:${
      data.stratigraphy__lookuptype || "icontains"
    }`;
  }

  if (data.type && data.type.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.type
    };fields:type__value,type__value_en;lookuptype:${
      data.type__lookuptype || "icontains"
    }`;
  }

  if (data.rank && data.rank.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.rank
    };fields:rank__value,rank__value_en;lookuptype:${
      data.rank__lookuptype || "icontains"
    }`;
  }

  if (data.scope && data.scope.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.scope
    };fields:scope__value,scope__value_en;lookuptype:${
      data.scope__lookuptype || "icontains"
    }`;
  }

  if (data.parent && data.parent.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.parent
    };fields:parent__id,parent__stratigraphy,parent__stratigraphy_en;lookuptype:${
      data.parent__lookuptype || "icontains"
    }`;
  }

  if (data.indexes && data.indexes.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.indexes
    };fields:index_main,index_additional,index_old;lookuptype:${
      data.indexes__lookuptype || "icontains"
    }`;
  }

  if (data.author && data.author.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.author
    };fields:author_free,user_added;lookuptype:${
      data.author__lookuptype || "icontains"
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `stratigraphy/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `stratigraphy/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchAreas(data, dynamicSearch) {
  const fields =
    "name,name_en,area_type,area_type__name,area_type__name_en,maardla,eelis,egf,area_ha,deposit_area_ha,maakond,maakond__maakond,maakond__maakond_en,description,description_en,remarks,text1,polygon,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.name && data.name.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.name
    };fields:name,name_en;lookuptype:${data.name__lookuptype || "icontains"}`;
  }

  if (data.type && data.type.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.type
    };fields:area_type__name,area_type__name_en;lookuptype:${
      data.type__lookuptype || "icontains"
    }`;
  }

  if (data.area_ha && data.area_ha.trim().length > 0) {
    searchFields += `&area_ha__${data.area_ha__lookuptype || "icontains"}=${
      data.area_ha
    }`;
  }

  if (data.maakond && data.maakond.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.maakond
    };fields:maakond__maakond,maakond__maakond_en;lookuptype:${
      data.maakond__lookuptype || "icontains"
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `area/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `area/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchLocations(data, dynamicSearch) {
  let fields =
    "location,parent_location,parent_location__location,location_location,contents,agent,agent__agent,date_collected_free,stratigraphy_free,number_items,number_items_registered,remarks,database,database__acronym,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.location && data.location.trim().length > 0) {
    searchFields += `&location__${data.location__lookuptype || "icontains"}=${
      data.location
    }`;
  }
  if (data.location_location && data.location_location.trim().length > 0) {
    searchFields += `&location_location__${
      data.location_location__lookuptype || "icontains"
    }=${data.location_location}`;
  }
  if (data.stratigraphy_free && data.stratigraphy_free.trim().length > 0) {
    searchFields += `&stratigraphy_free__${
      data.stratigraphy_free__lookuptype || "icontains"
    }=${data.stratigraphy_free}`;
  }
  if (data.agent && data.agent.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.agent
    };fields:agent__id,agent__agent,agent__forename,agent__surename;lookuptype:${
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
    searchFields += `&contents__${data.contents__lookuptype || "icontains"}=${
      data.contents
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `location/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `location/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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
    `attachment/?attachment_link__storage__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&fields=${attachmentFields}&format=json`
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

export function fetchRocks(data, dynamicSearch) {
  let fields =
    "name,name_en,name_ru,rock_type,rock_type__name,rock_type__name_en,rock_rank,rock_rank__name,rock_rank__name_en,parent,parent__name,parent__name_en,synonym_of,synonym_of__name,synonym_of__name_en,sort,description,description_en,description_ru,description_in_estonia,description_in_estonia_en,description_in_estonia_ru,description_usage,description_usage_en,description_usage_ru,description_author,in_estonia,is_resource,stratigraphy,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,lithostratigraphy,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en,mindat_id,link_wikipedia,link_wikipedia_en,link_wikipedia_ru,ima_status,formula,formula_html,remarks,is_private,in_portal,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.name && data.name.trim().length > 0) {
    searchFields += `&name__${data.name__lookuptype || "icontains"}=${
      data.name
    }`;
  }
  if (data.name_en && data.name_en.trim().length > 0) {
    searchFields += `&name_en__${data.name_en__lookuptype || "icontains"}=${
      data.name_en
    }`;
  }
  if (data.formula && data.formula.trim().length > 0) {
    searchFields += `&formula__${data.formula__lookuptype || "icontains"}=${
      data.formula
    }`;
  }
  if (data.rock_type && data.rock_type.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.rock_type
    };fields:rock_type__name,rock_type__name_en;lookuptype:${
      data.rock_type__lookuptype || "icontains"
    }`;
  }
  if (data.rock_rank && data.rock_rank.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.rock_rank
    };fields:rock_rank__name,rock_rank__name_en;lookuptype:${
      data.rock_rank__lookuptype || "icontains"
    }`;
  }
  if (data.user_changed && data.user_changed.trim().length > 0) {
    searchFields += `&user_changed__${
      data.user_changed__lookuptype || "icontains"
    }=${data.user_changed}`;
  }
  if (data.id && data.id.trim().length > 0) {
    searchFields += `&id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }
  if (data.in_portal) {
    searchFields += `&in_portal=${data.in_portal}`;
  }
  if (data.in_estonia) {
    searchFields += `&in_estonia=${data.in_estonia}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `rock/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `rock/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchVisits(data, dynamicSearch) {
  let fields =
    "visitor,visitor__agent,visitor_free,visitor_institution,visitor_institution__agent,visitor_country,visitor_country__value,visitor_country__value_en,host,host__agent,date_arrived,date_left,purpose,collections_studied,items_studied,remarks,database,database__acronym,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.visitor && data.visitor.trim().length > 0) {
    searchFields += `&visitor__agent__${
      data.visitor__lookuptype || "icontains"
    }=${data.visitor}`;
  }

  if (data.date_arrived !== null) {
    let date = data.date_arrived;

    if (typeof date === "string") date = date.split("T")[0];
    else {
      date.setHours(0, -date.getTimezoneOffset(), 0, 0);
      date = date.toISOString().split("T")[0];
    }
    searchFields += `&date_arrived__gte=${date}`;
  }

  if (data.date_left !== null) {
    let date = data.date_left;

    if (typeof date === "string") date = date.split("T")[0];
    else {
      date.setHours(0, -date.getTimezoneOffset(), 0, 0);
      date = date.toISOString().split("T")[0];
    }
    searchFields += `&date_left__gte=${date}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `visit/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `visit/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchLoans(data, dynamicSearch) {
  let fields =
    "loan_number,date_start,date_end,type,type__value,type__value_en,project,borrower,borrower__agent,borrower_institution,borrower_institution__agent,loaner,loaner__agent,date_signed,delivery_method,delivery_method__value,delivery_method__value_en,deliverer,deliverer__agent,delivery_remarks,returned,date_returned,special,remarks,user_added,date_added,user_changed,date_changed,database,database__acronym,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.loan_number && data.loan_number.trim().length > 0) {
    searchFields += `&loan_number__${
      data.loan_number__lookuptype || "icontains"
    }=${data.loan_number}`;
  }

  if (data.project && data.project.trim().length > 0) {
    searchFields += `&project__${data.project__lookuptype || "icontains"}=${
      data.project
    }`;
  }

  if (data.borrower && data.borrower.trim().length > 0) {
    searchFields += `&borrower__agent__${
      data.borrower__lookuptype || "icontains"
    }=${data.borrower}`;
  }

  if (data.date_start !== null) {
    let date = data.date_start;

    if (typeof date === "string") date = date.split("T")[0];
    else {
      date.setHours(0, -date.getTimezoneOffset(), 0, 0);
      date = date.toISOString().split("T")[0];
    }
    searchFields += `&date_start__gte=${date}`;
  }

  if (data.date_end !== null) {
    let date = data.date_end;

    if (typeof date === "string") date = date.split("T")[0];
    else {
      date.setHours(0, -date.getTimezoneOffset(), 0, 0);
      date = date.toISOString().split("T")[0];
    }
    searchFields += `&date_end__gte=${date}`;
  }

  if (data.isActive) {
    searchFields += `&returned=${!data.isActive}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `loan/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `loan/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchAccessions(data, dynamicSearch) {
  let fields =
    "number,date_signed,date_confirmed,agent_andis,agent_andis__agent,agent_vottis,agent_vottis__agent,agent_kinnitas,agent_kinnitas__agent,number_items,description,remarks,user_added,date_added,user_changed,date_changed,database,database__acronym,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.number && data.number.trim().length > 0) {
    searchFields += `&number__${data.number__lookuptype || "icontains"}=${
      data.number
    }`;
  }
  if (data.description && data.description.trim().length > 0) {
    searchFields += `&description__${
      data.description__lookuptype || "icontains"
    }=${data.description}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `accession/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `accession/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchDeaccessions(data, dynamicSearch) {
  let fields =
    "number,date_signed,date_confirmed,agent_kandis__agent,agent_kandis,agent_kinnitas,agent_kinnitas__agent,number_items,description,remarks,user_added,date_added,user_changed,date_changed,database,database__acronym,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.number && data.number.trim().length > 0) {
    searchFields += `&number__${data.number__lookuptype || "icontains"}=${
      data.number
    }`;
  }
  if (data.description && data.description.trim().length > 0) {
    searchFields += `&description__${
      data.description__lookuptype || "icontains"
    }=${data.description}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `deaccession/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `deaccession/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchWebNews(data, dynamicSearch) {
  const fields =
    "title_et,title_en,text_en,text_et,is_private,user_added,date_added,user_changed,date_changed,date_expires,timestamp,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `&id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.title && data.title.trim().length > 0) {
    searchFields += `&title__${data.title__lookuptype || "icontains"}=${
      data.title
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `web_news/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `web_news/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchWebPages(data, dynamicSearch) {
  const fields =
    "title_et,menu_title_et,content_et,link_et,title_en,menu_title_en,content_en,link_en,public,menu,menu_bold,menu_color,menu_fold,sort,parent,site,is_private,user,date_inserted,date_expires,timestamp,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `&id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.title && data.title.trim().length > 0) {
    searchFields += `&title__${data.title__lookuptype || "icontains"}=${
      data.title
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `web_pages/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `web_pages/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchTaxonPages(data, dynamicSearch) {
  const fields =
    "taxon,taxon__taxon,language,on_frontpage,frontpage,frontpage_order,frontpage_title,title,content,author,author__agent,author_txt,date_txt,is_private,link_wikipedia,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.language && data.language.trim().length > 0) {
    searchFields += `&language__${data.language__lookuptype || "icontains"}=${
      data.language
    }`;
  }

  if (data.title && data.title.trim().length > 0) {
    searchFields += `&title__${data.title__lookuptype || "icontains"}=${
      data.title
    }`;
  }
  if (data.taxon && data.taxon.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.taxon
    };fields:taxon__id,taxon__taxon;lookuptype:${
      data.taxon__lookuptype || "icontains"
    }`;
  }

  if (data.on_frontpage) {
    searchFields += `&on_frontpage=${data.on_frontpage}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `taxon_page/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `taxon_page/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchSiteGroundwaters(data, dynamicSearch) {
  const fields =
    "site,aquifer_system,aquifer,well_depth,type_txt,filter_type,filter_top_z,filter_bottom_z,filter_midpoint_z,filter_top,filter_bottom,filter_midpoint,kataster_id,keskkonnaregister_id,url_veka,remarks,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.site && data.site.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.site
    };fields:site__name,site__name_en;lookuptype:${
      data.site__lookuptype || "icontains"
    }`;
  }
  if (data.type_txt && data.type_txt.trim().length > 0) {
    searchFields += `&type_txt__${data.type_txt__lookuptype || "icontains"}=${
      data.type_txt
    }`;
  }
  if (data.aquifer_system && data.aquifer_system.trim().length > 0) {
    searchFields += `&aquifer_system__${
      data.aquifer_system__lookuptype || "icontains"
    }=${data.aquifer_system}`;
  }
  if (data.aquifer && data.aquifer.trim().length > 0) {
    searchFields += `&aquifer__${data.aquifer__lookuptype || "icontains"}=${
      data.aquifer
    }`;
  }
  if (data.well_depth && data.well_depth.trim().length > 0) {
    searchFields += `&well_depth__${
      data.well_depth__lookuptype || "icontains"
    }=${data.well_depth}`;
  }
  if (data.filter_type && data.filter_type.trim().length > 0) {
    searchFields += `&filter_type__${
      data.filter_type__lookuptype || "icontains"
    }=${data.filter_type}`;
  }
  if (data.filter_top && data.filter_top.trim().length > 0) {
    searchFields += `&filter_top__${
      data.filter_top__lookuptype || "icontains"
    }=${data.filter_top}`;
  }
  if (data.filter_top_z && data.filter_top_z.trim().length > 0) {
    searchFields += `&filter_top_z__${
      data.filter_top_z__lookuptype || "icontains"
    }=${data.filter_top_z}`;
  }
  if (data.filter_bottom && data.filter_bottom.trim().length > 0) {
    searchFields += `&filter_bottom__${
      data.filter_bottom__lookuptype || "icontains"
    }=${data.filter_bottom}`;
  }
  if (data.filter_bottom_z && data.filter_bottom_z.trim().length > 0) {
    searchFields += `&filter_bottom_z__${
      data.filter_bottom_z__lookuptype || "icontains"
    }=${data.filter_bottom_z}`;
  }
  if (data.url_veka && data.url_veka.trim().length > 0) {
    searchFields += `&url_veka__${data.url_veka__lookuptype || "icontains"}=${
      data.url_veka
    }`;
  }
  if (data.remarks && data.remarks.trim().length > 0) {
    searchFields += `&remarks__${data.remarks__lookuptype || "icontains"}=${
      data.remarks
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `site_groundwater/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `site_groundwater/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

/******************************
 ***  SITE_GROUNDWATER END  ***
 ******************************/

/************************
 *** DATABASE GROUP START ***
 ************************/

export function fetchDatabaseGroups() {
  return get(`database-groups/`, api.accountsUrl);
}

export function fetchUserDatabaseGroups() {
  return get(`user/database-groups/`, api.accountsUrl);
}
export function changeDatabaseGroup(database) {
  return axios.patch(`${api.accountsUrl}/user/database-groups/`, {
    database: database.id,
  });
}
/************************
 *** DATABASE GROUP END***
 ************************/

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
    `sarv_session/?user_id=${currentUserId}&order_by=-id&paginate_by=1&session_end!=null&format=json`
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

export function fetchSampleSeries(data, dynamicSearch) {
  const fields =
    "name,sampling_purpose,sample_count,sample_numbers,number_prefix,number_start,locality,locality__locality,locality__locality_en,locality_free,zero_level,depth_top,depth_base,stratigraphy_base,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en,stratigraphy_top,stratigraphy_top__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_base_free,stratigraphy_top_free,agent_collected,agent_collected__agent,date_collected,date_collected_free,location,remarks,owner,owner__agent,public,is_private,user_added,date_added,user_changed,date_changed,database,database__acronym,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.name && data.name.trim().length > 0) {
    searchFields += `&name__${data.name__lookuptype || "icontains"}=${
      data.name
    }`;
  }
  if (data.locality && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.locality
    };fields:locality_free,locality__locality,locality__locality_en;lookuptype:${
      data.locality__lookuptype || "icontains"
    }`;
  }
  if (data.agent_collected && data.agent_collected.trim().length > 0) {
    searchFields += `&multi_search=value:${
      data.agent_collected
    };fields:agent_collected__agent,agent_collected__forename,agent_collected__surename;lookuptype:${
      data.agent_collected__lookuptype || "icontains"
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `sample_series/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `sample_series/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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
    `attachment/?attachment_link__sample_series=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json`
  );
}

/***************************
 ***  SAMPLE_SERIES END  ***
 **************************/

/***********************************
 ***  ANALYSIS_PARAMETERS START  ***
 **********************************/

export function fetchAnalysisParameters(data, dynamicSearch) {
  const fields =
    "parameter,parameter_name,parameter_name_en,parameter_html,synonyms,parent_parameter,parent_parameter__parameter,remarks,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `&id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.parameter_name && data.parameter_name.trim().length > 0) {
    searchFields += `&parameter_name__${
      data.parameter_name__lookuptype || "icontains"
    }=${data.parameter_name}`;
  }

  if (data.parameter_name_en && data.parameter_name_en.trim().length > 0) {
    searchFields += `&parameter_name_en__${
      data.parameter_name__lookuptype || "icontains"
    }=${data.parameter_name_en}`;
  }

  if (data.remarks && data.remarks.trim().length > 0) {
    searchFields += `&remarks__${data.remarks__lookuptype || "icontains"}=${
      data.remarks
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `analysis_parameter/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `analysis_parameter/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchAnalysisParameter(id) {
  return get(`analysis_parameter/?id=${id}&format=json`);
}

/*********************************
 ***  ANALYSIS_PARAMETERS END  ***
 ********************************/

/********************************
 ***  ANALYSIS_METHODS START  ***
 *******************************/

export function fetchAnalysisMethods(data, dynamicSearch) {
  const fields =
    "analysis_method,method_en,parent_method,parent_method__analysis_method,parent_method__method_en,remarks,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.id && data.id.trim().length > 0) {
    searchFields += `&id__${data.id__lookuptype || "icontains"}=${data.id}`;
  }

  if (data.analysis_method && data.analysis_method.trim().length > 0) {
    // searchFields += `&analysis_method__${data.analysis_method__lookuptype ||
    //   "icontains"}=${data.analysis_method}`;
    searchFields += `&multi_search=value:${
      data.analysis_method
    };fields:analysis_method,method_en;lookuptype:${
      data.analysis_method__lookuptype || "icontains"
    }`;
    // searchFields +=
    //     "&multi_search=value:" +
    //     data.analysis_method +
    //     ";fields:,uuid_filename;lookuptype:" +
    //     `${data.filename__lookuptype || "icontains"}`;
  }

  if (
    data.parent_method__analysis_method &&
    data.parent_method__analysis_method.trim().length > 0
  ) {
    searchFields += `&parent_method__analysis_method__${
      data.parent_method__analysis_method__lookuptype || "icontains"
    }=${data.parent_method__analysis_method}`;
  }

  if (data.remarks && data.remarks.trim().length > 0) {
    searchFields += `&remarks__${data.remarks__lookuptype || "icontains"}=${
      data.remarks
    }`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `analysis_method/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `analysis_method/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
}

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

export function fetchImagesets(data, author, dynamicSearch) {
  const fields =
    "imageset_number,imageset_series,author,author__agent,author_free,date_start,date_end,date_free,device,device__name,object,place,keywords,description,date_digitised,date_digitised_free,device_digitised,device_digitised__name,agent_digitised,agent_digitised__agent,is_private,remarks,database,database__acronym,user_added,date_added,user_changed,date_changed,id";
  let searchFields = "";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  if (data.number && data.number.trim().length > 0) {
    searchFields += `&imageset_number__${
      data.number__lookuptype || "icontains"
    }=${data.number}`;
  }

  if (data.description && data.description.trim().length > 0) {
    searchFields += `&description__${
      data.description__lookuptype || "icontains"
    }=${data.description}`;
  }

  searchFields += buildDynamicSearch(dynamicSearch);

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return get(
      `imageset/?${searchFields}&author=${author}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  } else {
    return get(
      `imageset/?page=${data.page}&author=${author}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
    );
  }
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

export function fetchUserDefaultPermissions() {
  return get(`user/default-permissions/`, api.accountsUrl);
}

export function changeUserDefaultPermissions(newPerms) {
  return put(`user/default-permissions/`, newPerms, api.accountsUrl);
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
