import Vue from "vue";
import VueResource from "vue-resource";

Vue.use(VueResource);

const api = {
  url: "https://rwapi.geocollections.info/",
  checkDoiUrl: "https://api.crossref.org/works/",
  solrUrl: "https://api.geocollections.info/solr/"
};

async function get(child = "", customUrl) {
  let url = api.url + child;
  if (customUrl) url = customUrl + child;

  const response = await window.fetch(url, { method: "GET" });
  if (response.ok) return await response.json();
}

function fetch(child, url = 0, headers = {}) {
  let queryUrl = api.url;
  if (url !== 0) queryUrl = url;

  return new Promise((resolve, reject) => {
    Vue.http.get(queryUrl + child, headers).then(
      response => {
        // console.log(response)
        resolve(response);
      },
      errResponse => {
        console.log("ERROR: " + JSON.stringify(errResponse));
        reject(errResponse);
      }
    );
  });
}

function fetchPost(child, postData, config) {
  return new Promise((resolve, reject) => {
    Vue.http
      .post(api.url + child, postData, config)
      .then(response => resolve(response), errResponse => reject(errResponse));
  });
}

/*******************
 *** LOGIN START ***
 *******************/

export function fetchLogin(userData) {
  return fetchPost(`login/`, userData, { emulateJSON: true });
}

export function fetchLoginId() {
  return fetch(`loginid/`);
}

export function fetchLogout() {
  return fetch(`logout/`);
}

export function fetchIsLoggedIn() {
  return fetch("is_logged_in/login_state");
}

/*******************
 ***  LOGIN END  ***
 *******************/

/*************************
 *** ATTACHMENTS START ***
 *************************/

export function fetchAttachments(data, author) {
  const fields =
    "id,uuid_filename,original_filename,author__agent,author_free,date_created,date_created_free,image_number,specimen,reference_id,reference__reference,specimen_image_attachment,is_private";
  let searchFields = "";

  if (data.image_number !== null && data.image_number.trim().length > 0) {
    searchFields += "image_number__icontains=" + data.image_number;
  }
  if (data.filename !== null && data.filename.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.filename +
      ";fields:original_filename,uuid_filename;lookuptype:icontains";
  }
  if (data.specimen !== null && data.specimen.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.specimen +
      ";fields:specimen__id,specimen__specimen_id;lookuptype:icontains";
  }
  if (data.imageInfo !== null && data.imageInfo.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.imageInfo +
      ";fields:description,description_en,image_place,image_object,image_people,image_description,image_description_en,tags;lookuptype:icontains";
  }
  if (data.locality !== null && data.locality.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.locality +
      ";fields:locality__locality,locality__locality_en;lookuptype:icontains";
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
  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return fetch(
      `attachment/?${searchFields}&or_search=author_id:${author.id};user_added:${author.user}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
    // return fetch(`attachment/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(
      `attachment/?or_search=author_id:${author.id};user_added:${author.user}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
    // return fetch(`attachment/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}

export function fetchAttachment(id, author) {
  if (author)
    return fetch(
      `attachment/?id=${id}&or_search=author_id:${author.id};user_added:${author.user};user_changed:${author.user}&format=json`
    );
  else return fetch(`attachment/?id=${id}&format=json`);
}

export function fetchListImageType() {
  return fetch(`list_image_type/?format=json`);
}

export function fetchAttachmentKeyword(id) {
  return fetch(`attachment_keyword/?attachment=${id}&format=json`);
}

export function fetchListAttachmentType() {
  return fetch(`list_attachment_type/?format=json`);
}

export function fetchAttachmentLinkCollections(id) {
  return fetch(
    `attachment_link/?attachment=${id}&collection__isnull=false&fields=collection,collection__name,collection__name_en&format=json`
  );
}

export function fetchAttachmentLinkSpecimens(id) {
  return fetch(
    `attachment_link/?attachment=${id}&specimen__isnull=false&fields=specimen,specimen_id,specimen__coll__number&format=json`
  );
}

export function fetchAttachmentLinkSamples(id) {
  return fetch(
    `attachment_link/?attachment=${id}&sample__isnull=false&fields=sample,sample__number&format=json`
  );
}

export function fetchAttachmentLinkSampleSeries(id) {
  return fetch(
    `attachment_link/?attachment=${id}&sample_series__isnull=false&fields=sample_series,sample_series__name&format=json`
  );
}

export function fetchAttachmentLinkAnalyses(id) {
  return fetch(
    `attachment_link/?attachment=${id}&analysis__isnull=false&fields=analysis,analysis__sample__number&format=json`
  );
}

export function fetchAttachmentLinkDatasets(id) {
  return fetch(
    `attachment_link/?attachment=${id}&dataset__isnull=false&fields=dataset,dataset__name,dataset__name_en&format=json`
  );
}

export function fetchAttachmentLinkDois(id) {
  return fetch(
    `attachment_link/?attachment=${id}&doi__isnull=false&fields=doi,doi__identifier&format=json`
  );
}

export function fetchAttachmentLinkLocalities(id) {
  return fetch(
    `attachment_link/?attachment=${id}&locality__isnull=false&fields=locality,locality__locality,locality__locality_en&format=json`
  );
}

export function fetchAttachmentLinkDrillcores(id) {
  return fetch(
    `attachment_link/?attachment=${id}&drillcore__isnull=false&fields=drillcore,drillcore__drillcore,drillcore__drillcore_en&format=json`
  );
}

export function fetchAttachmentLinkDrillcoreBoxes(id) {
  return fetch(
    `attachment_link/?attachment=${id}&drillcore_box__isnull=false&fields=drillcore_box,drillcore_box__drillcore__drillcore,drillcore_box__drillcore__drillcore_en&format=json`
  );
}

export function fetchAttachmentLinkPreparations(id) {
  return fetch(
    `attachment_link/?attachment=${id}&preparation__isnull=false&fields=preparation,preparation__preparation_number&format=json`
  );
}

export function fetchAttachmentLinkReferences(id) {
  return fetch(
    `attachment_link/?attachment=${id}&reference__isnull=false&fields=reference,reference__reference&format=json`
  );
}

export function fetchAttachmentLinkStorages(id) {
  return fetch(
    `attachment_link/?attachment=${id}&storage__isnull=false&fields=storage,storage__location,storage__contents&format=json`
  );
}

export function fetchAttachmentLinkProjects(id) {
  return fetch(
    `attachment_link/?attachment=${id}&project__isnull=false&fields=project,project__name,project__name_en&format=json`
  );
}

export function fetchAttachmentLinkSites(id) {
  return fetch(
    `attachment_link/?attachment=${id}&site__isnull=false&fields=site,site__name,site__name_en&format=json`
  );
}

/*************************
 ***  ATTACHMENTS END  ***
 *************************/

/************************
 *** REFERENCES START ***
 ************************/

export function fetchReference(id) {
  return fetch(`reference/?id=${id}&format=json`);
}

export async function fetchReferences(data) {
  // This (solr search) overrides regular search fields
  if (data.solrSearch && data.solrSearch.trim().length > 0) {
    let start = (data.page - 1) * data.paginateBy;
    return fetch(
      `reference/?q=${data.solrSearch}&rows=${data.paginateBy}&start=${start}&format=json`,
      api.solrUrl
    );
  }
  if (data.keywords !== null && data.keywords.trim().length > 0) {
    // #247 changing keywords search so that reference_keyword table is used
    //searchFields += '&multi_search=value:' + data.keywords + ';fields:tags,libraryreference__keywords;lookuptype:icontains&distinct=true'

    let listOfReferenceIDs = await fetchReferenceIDsUsingReferenceKeyword(
      data
    ).then(response => {
      if (
        response &&
        response.body &&
        response.body.results &&
        response.body.results.length > 0
      ) {
        return response.body.results.map(reference_keyword => {
          return reference_keyword.reference;
        });
      } else return [314159265];
    });
    return fetch(
      `reference/?id__in=${listOfReferenceIDs}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&format=json`
    );
  }

  let searchFields = "";

  if (data.author !== null && data.author.trim().length > 0) {
    searchFields += "author__icontains=" + data.author;
  }
  if (data.year !== null && data.year.trim().length > 0) {
    searchFields += "&year__icontains=" + data.year;
  }
  if (data.title !== null && data.title.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.title +
      ";fields:title,title_original;lookuptype:icontains";
  }
  if (data.bookJournal !== null && data.bookJournal.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.bookJournal +
      ";fields:book,book_editor,journal__journal_name;lookuptype:icontains";
  }
  if (data.abstractRemarks && data.abstractRemarks.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.abstractRemarks +
      ";fields:abstract,remarks;lookuptype:icontains";
  }
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += "&id__icontains=" + data.id;
  }
  if (
    data.libraryAuthorIdTitle &&
    data.libraryAuthorIdTitle.trim().length > 0
  ) {
    searchFields +=
      "&multi_search=value:" +
      data.libraryAuthorIdTitle +
      ";fields:libraryreference__library__author__id,libraryreference__library__author__agent,libraryreference__library__author_txt,libraryreference__library__id,libraryreference__library__title,libraryreference__library__title_en;lookuptype:icontains&distinct=true";
  }
  if (data.userAdded && data.userAdded.trim().length > 0) {
    searchFields += `&user_added__icontains=${data.userAdded}`;
  }
  if (data.isEstonianReference) {
    searchFields += `&is_estonian_reference=${data.isEstonianReference}`;
  }
  if (data.isEstonianAuthor) {
    searchFields += `&is_estonian_author=${data.isEstonianAuthor}`;
  }
  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    // Not using 'fields' because of alternative table
    // return fetch(`reference/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
    return fetch(
      `reference/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&format=json`
    );
  } else {
    // Not using 'fields' because of alternative table
    // return fetch(`reference/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
    return fetch(
      `reference/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&format=json`
    );
  }
}

function fetchReferenceIDsUsingReferenceKeyword(data) {
  let searchFields = "";

  if (data.author !== null && data.author.trim().length > 0) {
    searchFields += "reference__author__icontains=" + data.author;
  }
  if (data.year !== null && data.year.trim().length > 0) {
    searchFields += "&reference__year__icontains=" + data.year;
  }
  if (data.title !== null && data.title.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.title +
      ";fields:reference__title,reference__title_original;lookuptype:icontains";
  }
  if (data.bookJournal !== null && data.bookJournal.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.bookJournal +
      ";fields:reference__book,reference__book_editor,reference__journal__journal_name;lookuptype:icontains";
  }
  if (data.abstractRemarks && data.abstractRemarks.trim().length > 0) {
    searchFields +=
      "&multi_search=value:" +
      data.abstractRemarks +
      ";fields:reference__abstract,reference__remarks;lookuptype:icontains";
  }
  if (data.keywords !== null && data.keywords.trim().length > 0) {
    searchFields += `&multi_search=value:${data.keywords};fields:keyword__keyword,keyword_txt;lookuptype:icontains`;
  }
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += "&reference__id__icontains=" + data.id;
  }
  if (
    data.libraryAuthorIdTitle &&
    data.libraryAuthorIdTitle.trim().length > 0
  ) {
    searchFields +=
      "&multi_search=value:" +
      data.libraryAuthorIdTitle +
      ";fields:reference__libraryreference__library__author__id,reference__libraryreference__library__author__agent,reference__libraryreference__library__author_txt,reference__libraryreference__library__id,reference__libraryreference__library__title,reference__libraryreference__library__title_en;lookuptype:icontains&distinct=true";
  }
  if (data.userAdded && data.userAdded.trim().length > 0) {
    searchFields += `&reference__user_added__icontains=${data.userAdded}`;
  }
  if (data.isEstonianReference) {
    searchFields += `&reference__is_estonian_reference=${data.isEstonianReference}`;
  }
  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  return fetch(
    `reference_keyword/?${searchFields}&fields=reference&format=json`
  );
}

export function fetchReferenceKeyword(id) {
  return fetch(`reference_keyword/?reference=${id}&format=json`);
}

export function fetchAttachmentLink(id) {
  return fetch(`attachment_link/?reference=${id}&format=json`);
}

export function fetchLocalityReferenceForReference(id, searchParameters) {
  return fetch(
    `locality_reference/?reference=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchListReferenceTypes() {
  return fetch(`list_reference_type/?format=json`);
}

export function fetchListLanguages() {
  return fetch(`list_language/?format=json`);
}

export function fetchAttachmentForReference(id) {
  return fetch(
    `attachment/?reference=${id}&fields=id,uuid_filename,original_filename&format=json`
  );
}

export function fetchLibrariesForReference(id) {
  return fetch(
    `library_reference/?reference=${id}&fields=library,library__title,library__title_en&format=json`
  );
}

export function fetchAddReferenceToLibrary(data) {
  return fetchPost(`add/library_reference/`, data);
}

export function fetchListLocalityReferenceType() {
  return fetch(`list_locality_reference_type/?format=json`);
}

/************************
 ***  REFERENCES END  ***
 ************************/

/******************
 *** LOGS START ***
 ******************/

export function fetchSpecificLogs(data) {
  return fetch(
    `log/?table_name=${data.table_name}&row_id=${data.row_id}&order_by=${data.order_by}&format=json`
  );
}

export function fetchLatestLogs(data) {
  return fetch(
    `log/?user=${data.user}&command=${data.command}&order_by=-id&paginate_by=10&fields=time,user,command,changes,table_name,row_id`
  );
}

/******************
 *** LOGS END ***
 ******************/

/************************
 *** LOCALITIES START ***
 ************************/

export function fetchLocalities(data) {
  const fields =
    "id,country__value_en,country__value,locality_en,locality,user_added,number";
  let searchFields = "";
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`;
  }

  if (data.locality !== null && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${data.locality};fields:locality_en,locality;lookuptype:icontains`;
  }

  if (data.number !== null && data.number.trim().length > 0) {
    searchFields += `&number__icontains=${data.number}`;
  }

  if (data.country !== null && data.country.trim().length > 0) {
    searchFields += `&multi_search=value:${data.country};fields:country__value_en,country__value;lookuptype:icontains`;
  }

  if (data.agent !== null && data.agent.trim().length > 0) {
    searchFields += "&user_added__icontains=" + data.agent;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return fetch(
      `locality/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  } else {
    return fetch(
      `locality/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchListLocalityTypes() {
  return fetch(`list_locality_type/?format=json`);
}

export function fetchListLocalityExtent() {
  return fetch(`list_locality_extent/?format=json`);
}

export function fetchListCoordinateMethod() {
  return fetch(`list_coordinate_method/?format=json`);
}

export function fetchListCoordinatePrecision() {
  return fetch(`list_coordinate_precision/?format=json`);
}

export function fetchListCountry() {
  return fetch(`list_country/?format=json`);
}

export function autocompleteSearch(query) {
  return fetch(`${query}&format=json`);
}

export function fetchLocality(id) {
  return fetch(`locality/?id=${id}&format=json`);
}

export function fetchLocalityReference(id, searchParameters) {
  return fetch(
    `locality_reference/?locality__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchLocalitySynonym(id, searchParameters) {
  return fetch(
    `locality_synonym/?locality_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchLocalityAttachment(id, searchParameters) {
  return fetch(
    `attachment/?attach_link__locality__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&fields=id,original_filename,attach_link__locality__id,remarks&format=json`
  );
}

export function fetchLocalityStratigraphy(id, searchParameters) {
  return fetch(
    `locality_stratigraphy/?locality_id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

/************************
 ***  LOCALITIES END  ***
 ************************/

/************************
 ***  SAMPLES START  ***
 ************************/
export function fetchSample(id) {
  return fetch(`sample/?id=${id}&format=json`);
}

export function fetchSamplePurpose() {
  return fetch(`list_sample_purpose/?order_by=value&format=json`);
}

export function fetchFossilGroup() {
  return fetch(`taxon/?fields=taxon,id&is_fossil_group=1&format=json`);
}

export function fetchSampleRelatedAnalysis(id) {
  return fetch(`analysis/?sample=${id}&fields=id&format=json`);
}

export function fetchSampleRelatedPreparation(id) {
  return fetch(`preparation/?sample=${id}&fields=id&format=json`);
}

export function fetchAnalysisMethod() {
  return fetch(`analysis_method/?order_by=analysis_method&format=json`);
}

export function fetchSamples(data, agent, databaseId) {
  const fields =
    "id,locality__locality_en,locality__locality,agent_collected__agent,number,number_additional," +
    "number_field,locality_free,depth,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,stratigraphy_free,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en,database__name,database__name_en,date_collected,date_collected_free,locality,depth,depth_interval";
  let searchFields = "";

  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`;
  }

  if (data.number !== null && data.number.trim().length > 0) {
    searchFields += `&multi_search=value:${data.number};fields:number,number_additional,number_field;lookuptype:icontains`;
  }

  if (data.locality !== null && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${data.locality};fields:locality__locality_en,locality__locality,locality_free;lookuptype:icontains`;
  }

  if (data.depth !== null && data.depth.trim().length > 0) {
    //searchFields += '&depth__exact='+data.depth
    searchFields += `&multi_search=value:${data.depth};fields:depth,depth_interval;lookuptype:icontains`;
  }
  if (data.stratigraphy !== null && data.stratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${data.stratigraphy};fields:stratigraphy__stratigraphy_en,stratigraphy__stratigraphy,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en;lookuptype:icontains`;
  }

  if (data.agent !== null && data.agent.trim().length > 0) {
    searchFields += `&agent_collected__agent__icontains=${data.agent}`;
  }

  if (typeof agent !== "undefined" && agent !== null) {
    searchFields += `&or_search=agent_collected__id:${agent.id};user_added:${agent.user};owner__id:${agent.id}`;
  }

  if (data.storage && data.storage.trim().length > 0) {
    searchFields += `&storage__location__icontains=${data.storage}`;
  }

  if (data.site !== null && data.site.trim().length > 0) {
    searchFields += `&multi_search=value:${data.site};fields:site__id,site__name,site__project__id,site__project__name;lookuptype:icontains`;
  }

  if (typeof databaseId !== "undefined" && databaseId !== null) {
    searchFields += `&database__id=${databaseId}`;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return fetch(
      `sample/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  } else {
    return fetch(
      `sample/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchSampleAnalysis(id, searchParameters) {
  return fetch(
    `analysis/?sample__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchSamplePreparation(id, searchParameters) {
  return fetch(
    `preparation/?sample__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchTaxonList(id, searchParameters) {
  return fetch(
    `taxon_list/?sample=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchLSampleAttachment(id, searchParameters) {
  return fetch(
    `attachment/?attach_link__sample__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&fields=id,original_filename&format=json`
  );
}

export function fetchSampleReference(id, searchParameters) {
  return fetch(
    `sample_reference/?sample__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchLatestSampleInSite(siteId) {
  return fetch(
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
  return fetch(`library/?id=${id}&format=json`);
}

export function fetchLibraries(data) {
  const fields = "id,author_txt,year,title,title_en,is_private";
  let searchFields = "";
  if (data.author_txt !== null && data.author_txt.trim().length > 0) {
    searchFields += `author_txt__icontains=${data.author_txt}`;
  }

  if (data.year !== null && data.year.trim().length > 0) {
    searchFields += `&year__icontains=${data.year}`;
  }

  if (data.title !== null && data.title.trim().length > 0) {
    searchFields += `&multi_search=value:${data.title};fields:title,title_en;lookuptype:icontains`;
  }

  if (data.reference !== null && data.reference.trim().length > 0) {
    searchFields += `&libraryreference__reference__reference__icontains=${data.reference}&distinct=true`;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return fetch(
      `library/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  } else {
    return fetch(
      `library/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchLibrariesFromLibraryAgent(data, agent) {
  const fields =
    "id,library,library__author_txt,library__title,library__title_en,agent,agent__agent,agent__surename,agent__forename,library__is_private";
  let searchFields = "";

  // Using typeof check because for active libraries (reference view uses active libraries but search data will be related to referneces)
  if (
    typeof data.author_txt !== "undefined" &&
    data.author_txt !== null &&
    data.author_txt.trim().length > 0
  ) {
    searchFields += `&library__author_txt__icontains=${data.author_txt}`;
  }

  if (
    typeof data.year !== "undefined" &&
    data.year !== null &&
    data.year.trim().length > 0
  ) {
    searchFields += `&library__year__icontains=${data.year}`;
  }

  if (
    typeof data.title !== "undefined" &&
    data.title !== null &&
    data.title.trim().length > 0
  ) {
    searchFields += `&multi_search=value:${data.title};fields:library__title,library__title_en;lookuptype:icontains`;
  }

  if (
    typeof data.reference !== "undefined" &&
    data.reference !== null &&
    data.reference.trim().length > 0
  ) {
    searchFields += `&library__libraryreference__reference__reference__icontains=${data.reference}&distinct=true`;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return fetch(
      `library_agent/?agent=${agent.id}&${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  } else {
    return fetch(
      `library_agent/?agent=${agent.id}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchLibraryReference(id, searchParameters) {
  return fetch(
    `library_reference/?library=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchLibraryAgent(id) {
  return fetch(`library_agent/?library=${id}&format=json`);
}

export function fetchListLibraries(id) {
  return fetch(`library_agent/?agent=${id}&format=json`);
}

export function fetchChangeLibraryState(id, data) {
  return fetchPost(`change/library/${id}`, data);
}

/***********************
 ***  LIBRARIES END  ***
 ***********************/

/*****************
 *** DOI START ***
 *****************/

export function fetchDois(data, databaseId) {
  const fields =
    "id,identifier,creators,publication_year,title,resource_type__value,is_private,datacite_created";
  let searchFields = "";
  if (data.identifier !== null && data.identifier.trim().length > 0) {
    searchFields += `&identifier__icontains=${data.identifier}`;
  }

  if (data.creators !== null && data.creators.trim().length > 0) {
    searchFields += `&creators__icontains=${data.creators}`;
  }

  if (
    data.publication_year !== null &&
    data.publication_year.trim().length > 0
  ) {
    searchFields += `&publication_year__icontains=${data.publication_year}`;
  }

  if (data.title !== null && data.title.trim().length > 0) {
    searchFields += `&title__icontains=${data.title}`;
  }

  if (typeof databaseId !== "undefined" && databaseId !== null) {
    searchFields += `&database__id=${databaseId}`;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return fetch(
      `doi/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  } else {
    return fetch(
      `doi/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchDoi(id) {
  return fetch(`doi/?id=${id}&format=json`);
}

export function fetchDoiUsingEGF(id) {
  return get(`egf/${id}`);
}

export function fetchDoiResourceType() {
  return fetch(`doi_resource_type/?format=json`);
}

// export function fetchListTitleTranslatedLanguages() {
//   return fetch(`title_translated_language/?format=json`)
// }

export function fetchListLicences() {
  return fetch(`list_licence/?format=json`);
}

export function fetchDoiCheck(doi) {
  return fetch(doi, api.checkDoiUrl);
}

export function fetchDoiAttachment(id, searchParameters) {
  return fetch(
    `attachment_link/?doi=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&fields=id,attachment,attachment__original_filename,attachment__description,attachment__description_en,attachment__uuid_filename,attachment__date_created,remarks&format=json`
  );
}

export function fetchDoiAgent(id, searchParameters) {
  return fetch(
    `doi_agent/?doi=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchDoiAgentType() {
  return fetch(`doi_agent_type/?format=json`);
}

export function fetchDoiRelatedIdentifier(id, searchParameters) {
  return fetch(
    `doi_related_identifier/?doi=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchDoiGeolocation(id, searchParameters) {
  return fetch(
    `doi_geolocation/?doi=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchDoiDate(id, searchParameters) {
  return fetch(
    `doi_date/?doi=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchDoiRelatedIdentifierType() {
  return fetch(`doi_related_identifier_type/?format=json`);
}

export function fetchDoiRelationType() {
  return fetch(`doi_relation_type/?format=json`);
}

export function fetchDoiDateType() {
  return fetch(`doi_date_type/?format=json`);
}

export function fetchAddDoi(data) {
  return fetchPost(`add/doi/`, data);
}

export function fetchAddDoiGeolocation(data) {
  return fetchPost(`add/doi_geolocation/`, data);
}

export function fetchAddDoiAgent(data) {
  return fetchPost(`add/doi_agent/`, data);
}

export function fetchCheckMetadataInDataCite(id) {
  return fetch(`datacite/check_metadata/${id}`);
}

export function fetchCheckDoiUrlInDataCite(id) {
  return fetch(`datacite/check_doi/${id}`);
}

export function fetchRegisterMetadataToDataCite(id) {
  return fetch(`datacite/register_metadata/${id}`);
}

export function fetchRegisterDoiUrlToDataCite(id) {
  return fetch(`datacite/register_doi/${id}`);
}

/*****************
 ***  DOI END  ***
 *****************/

/*****************************
 *** ATTACHMENT LINK START ***
 *****************************/

export function fetchAddAttachmentLink(data) {
  return fetchPost(`add/attachment_link/`, data);
}

/*****************************
 ***  ATTACHMENT LINK END  ***
 *****************************/

/**********************
 *** PROJECTS START ***
 **********************/

export function fetchProject(id) {
  return fetch(`project/?id=${id}&format=json`);
}

export function fetchProjectAgent(id) {
  return fetch(
    `project/${id}?fields=id,projectagent__agent,projectagent__agent__agent&format=json`
  );
}

export function fetchProjectAttachment(id, page = 1) {
  return fetch(
    `attachment/?attach_link__project__id=${id}&page=${page}&paginate_by=100&fields=id,author__agent,original_filename,description,description_en,uuid_filename&format=json`
  );
}

export function fetchLinkedSite(id, page = 1, paginateBy = 25) {
  return fetch(
    `site/?project=${id}&page=${page}&paginate_by=${paginateBy}&fields=id,name,name_en,date_start,date_end,latitude,longitude&format=json`
  );
}

export function fetchProjectType() {
  return fetch(`project_type/?order_by=name&format=json`);
}

export function fetchProjects(data, agent) {
  const fields =
    "id,name, name_en,project_type,project_type__name,project_type__name_en,parent_project,date_start,date_end," +
    "date_free,description,remarks,owner,owner__agent,is_private";
  let searchFields = "";
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`;
  }

  // if (data.name !== null && data.name.trim().length > 0) {
  //   searchFields += `&multi_search=value:${data.name};fields:name,name_en;lookuptype:icontains`
  // }

  if (data.owner !== null && data.owner.trim().length > 0) {
    searchFields += `&multi_search=value:${data.owner};fields:owner__agent;fields:owner__surename;fields:owner__forename;lookuptype:icontains`;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);
  if (searchFields.length > 0) {
    return fetch(
      `project/?projectagent__agent=${agent}&${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  } else {
    return fetch(
      `project/?projectagent__agent=${agent}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchActiveProjects(projectIds) {
  return fetch(
    `project/?id__in=${projectIds}&fields=id,name,name_en&format=json`
  );
}

/**********************
 ***  PROJECTS END  ***
 **********************/

/******************
 *** SITE START ***
 ******************/

export function fetchSites(data) {
  let fields =
    "id, project, project__name, locality, locality__locality, name, name_en, number," +
    "latitude,longitude,location_accuracy,elevation,elevation_accuracy," +
    "coord_det_method__value,coord_det_method__value_en, date_start,date_end,date_free,remarks_location," +
    "description,remarks";
  let searchFields = "";

  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`;
  }

  if (data.name !== null && data.name.trim().length > 0) {
    searchFields += `&multi_search=value:${data.name};fields:name,name_en;lookuptype:icontains`;
  }

  if (data.number !== null && data.number.trim().length > 0) {
    searchFields += `&number__icontains=${data.number}`;
  }

  if (data.project !== null && data.project.trim().length > 0) {
    searchFields += `&multi_search=value:${data.project};fields:project__name,project__name_en;lookuptype:icontains`;
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

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    // return data.coords_not_null === true ? fetch(`site/?${searchFields}&order_by=${data.orderBy}&fields=id, latitude, longitude&format=json`):
    return fetch(
      `site/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  } else {
    // return data.coords_not_null === true ? fetch(`site/?order_by=${data.orderBy}&fields=id, latitude, longitude&format=json`):

    return fetch(
      `site/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchSite(id) {
  return fetch(`site/?id=${id}&format=json`);
}

export function fetchSiteAttachment(id, page = 1) {
  return fetch(
    `attachment/?attach_link__site__id=${id}&page=${page}&paginate_by=100&fields=id,author__agent,original_filename,description,description_en,uuid_filename,date_created&format=json`
  );
}

// export function fetchLinkedSamples(id,page=1) {
//   return fetch(`sample/?site__id=${id}&page=${page}&paginate_by=100&fields=id,number,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en,depth_interval,depth,rock,rock_en&format=json`)
// }
export function fetchLinkedSamples(data, siteID) {
  let fields =
    "id,number,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en,depth_interval,depth,rock,rock_en";
  let searchFields = "";

  if (data.id && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`;
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
    return fetch(
      `sample/?site__id=${siteID}&${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  } else {
    return fetch(
      `sample/?site__id=${siteID}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchLastSiteName(projectId) {
  return fetch(
    `site/?project=${projectId}&fields=name&order_by=-id&paginate_by=1&format=json`
  );
}

export function fetchRecentSites(currentUserId) {
  return fetch(
    `site/?project__projectagent__agent=${currentUserId}&order_by=-id&paginate_by=30&fields=name,latitude,longitude,id`
  );
}

/******************
 ***  SITE END  ***
 ******************/

/***************************
 *** ANALYSIS LINK START ***
 ***************************/

export function fetchAnalysis(id) {
  return fetch(`analysis/?id=${id}&format=json`);
}

export function fetchLabs() {
  return fetch(`lab/?format=json`);
}

export function fetchInstruments() {
  return fetch(`lab_instrument/?format=json`);
}

export function fetchAnalyses(data, agent, databaseId) {
  const fields =
    "id,sample__id,sample__number,sample__locality__locality,sample__depth,analysis_method__analysis_method," +
    "date,lab_txt,agent__agent,is_private";
  let searchFields = "";

  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`;
  }

  if (data.analysis_method !== null && data.analysis_method.trim().length > 0) {
    searchFields += `&multi_search=value:${data.analysis_method};fields:analysis_method__analysis_method,analysis_method__method_en;lookuptype:icontains`;
  }

  if (data.agentAndLab !== null && data.agentAndLab.trim().length > 0) {
    searchFields += `&multi_search=value:${data.agentAndLab};fields:agent__agent,lab_txt;lookuptype:icontains`;
  }

  if (typeof agent !== "undefined" && agent !== null) {
    searchFields += `&or_search=agent__id:${agent.id};user_added:${agent.user};owner__id:${agent.id}`;
  }

  if (typeof databaseId !== "undefined" && databaseId !== null) {
    searchFields += `&database__id=${databaseId}`;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);
  if (searchFields.length > 0) {
    return fetch(
      `analysis/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  } else {
    return fetch(
      `analysis/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchAnalysisAttachment(id, searchParameters) {
  return fetch(
    `attachment/?attach_link__analysis__id=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&fields=id,author__agent,original_filename,description,description_en,uuid_filename,date_created&format=json`
  );
}

export function fetchAnalysisResults(id, searchParameters) {
  return fetch(
    `analysis_results/?analysis=${id}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

/***************************
 ***  ANALYSIS LINK END  ***
 ***************************/

/*********************
 *** JOURNAL START ***
 *********************/

export function fetchJournal(id) {
  return fetch(`journal/?id=${id}&format=json`);
}

export function fetchJournals(data) {
  let fields =
    "id,journal_name,journal_short, journal_original,publisher,remarks";
  let searchFields = "";

  if (data.journal !== null && data.journal.trim().length > 0) {
    searchFields += `multi_search=value:${data.journal};fields:journal_name,journal_short,journal_original;lookuptype:icontains`;
  }

  if (data.publisher !== null && data.publisher.trim().length > 0) {
    searchFields += `&multi_search=value:${data.publisher};fields:publisher,publisher_place;lookuptype:icontains`;
  }

  if (data.remarks !== null && data.remarks.trim().length > 0) {
    searchFields += `&remarks__icontains=${data.remarks}`;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return fetch(
      `journal/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  } else {
    return fetch(
      `journal/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchJournalForReference(name) {
  return fetch(
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
  return fetchPost(`add/imageset/`, data);
}

export function fetchIsImagesetNumberInImageset(imagesetNumber) {
  return fetch(`imageset/?imageset_number=${imagesetNumber}&format=json`);
}

/**********************
 ***  IMAGESET END  ***
 **********************/

/**********************
 *** SPECIMEN START ***
 **********************/

export function fetchSpecimen(id) {
  return fetch(`specimen/?id=${id}&format=json`);
}

export function fetchSpecimens(data, databaseId) {
  const fields =
    "id,coll__number,specimen_id,specimen_nr,locality_id,locality__locality,locality__locality_en,locality_free,depth,depth_interval,stratigraphy_id,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,stratigraphy_free,agent_collected__agent,agent_collected__forename,agent_collected__surename,storage__location,database__name,database__name_en,database__acronym,lithostratigraphy__stratigraphy_en,lithostratigraphy__stratigraphy,lithostratigraphy_id,date_collected,date_collected_free,depth,depth_interval,is_private";
  let searchFields = "";

  if (data.idSpecimen && data.idSpecimen.trim().length > 0) {
    searchFields += `multi_search=value:${data.idSpecimen};fields:id,specimen_id,specimen_nr;lookuptype:icontains`;
  }

  if (data.collNumber && data.collNumber.trim().length > 0) {
    searchFields += `&coll__number__icontains=${data.collNumber}`;
  }

  if (data.fossil && data.fossil.trim().length > 0) {
    searchFields += `&multi_search=value:${data.fossil};fields:specimenidentification__name,specimenidentification__taxon__taxon;lookuptype:icontains`;
  }

  if (data.mineralRock && data.mineralRock.trim().length > 0) {
    // Todo: Duplicate records issue, but distinct makes it slow
    if (data.fossil && data.fossil.trim().length > 0)
      searchFields += "&distinct=true";
    searchFields += `&multi_search=value:${data.mineralRock};fields:specimenidentificationgeologies__name,specimenidentificationgeologies__name_en,specimenidentificationgeologies__rock__name,specimenidentificationgeologies__rock__name_en;lookuptype:icontains`;
  }

  if (data.locality && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${data.locality};fields:locality__locality,locality__locality_en,locality_free;lookuptype:icontains`;
  }

  if (data.stratigraphy && data.stratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${data.stratigraphy};fields:stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,stratigraphy_free,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en;lookuptype:icontains`;
  }

  if (data.agent_collected && data.agent_collected.trim().length > 0) {
    searchFields += `&multi_search=value:${data.agent_collected};fields:agent_collected__agent,agent_collected__forename,agent_collected__surename,agent_collected_free;lookuptype:icontains`;
  }

  if (typeof databaseId !== "undefined" && databaseId !== null) {
    searchFields += `&database__id=${databaseId}`;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return fetch(
      `specimen/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&distinct=true&format=json`
    );
  } else {
    return fetch(
      `specimen/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchListSpecimenKind() {
  return fetch(`list_specimen_kind/?format=json`);
}

export function fetchListSpecimenOriginalStatus() {
  return fetch(`list_specimen_original_status/?format=json`);
}

export function fetchListSpecimenPresence() {
  return fetch(`list_specimen_presence/?format=json`);
}

export function fetchListSpecimenStatus() {
  return fetch(`list_specimen_status/?format=json`);
}

export function fetchListSpecimenType() {
  return fetch(`list_specimen_type/?format=json`);
}

export function fetchListHistoryType() {
  return fetch(`list_history_type/?format=json`);
}

export function fetchAccession() {
  return fetch(`accession/?format=json`);
}

export function fetchDeaccession() {
  return fetch(`deaccession/?format=json`);
}

export function fetchSpecimenIdentifications(searchParameters) {
  if (searchParameters) {
    return fetch(
      `specimen_identification/?page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
    );
  }
}

export function fetchSpecimenIdentificationsList(listOfIds) {
  let fields = "taxon__taxon,taxon_id,specimen_id";
  return fetch(
    `specimen_identification/?specimen_id__in=${listOfIds}&current=true&fields=${fields}&format=json`
  );
}

export function fetchSpecimenIdentificationGeologiesList(listOfIds) {
  let fields =
    "name,name_en,rock__name,rock__name_en,rock__formula_html,rock_id,specimen_id";
  return fetch(
    `specimen_identification_geology/?specimen_id__in=${listOfIds}&current=true&fields=${fields}&order_by=name&format=json`
  );
}

export function fetchSpecimenIdentificationGeologies(searchParameters) {
  if (searchParameters) {
    return fetch(
      `specimen_identification_geology/?page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
    );
  }
}

export function fetchSpecimenReferences(specimenId, searchParameters) {
  return fetch(
    `specimen_reference/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchSpecimenDescriptions(specimenId, searchParameters) {
  return fetch(
    `specimen_description/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchSpecimenAttachments(specimenId, searchParameters) {
  return fetch(
    `attachment/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchSpecimenLocations(specimenId, searchParameters) {
  return fetch(
    `specimen_location/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchSpecimenHistory(specimenId, searchParameters) {
  return fetch(
    `specimen_history/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchSpecimenAnalyses(specimenId, searchParameters) {
  return fetch(
    `analysis/?specimen_id=${specimenId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${searchParameters.orderBy}&format=json`
  );
}

export function fetchListIdentificationType() {
  return fetch(`list_identification_type/?format=json`);
}

export function fetchListUnit() {
  return fetch(`list_unit/?format=json`);
}

/**********************
 ***  SPECIMEN END  ***
 **********************/

/*********************
 *** KEYWORD START ***
 *********************/

export function fetchKeyword(id) {
  return fetch(`keyword/?id=${id}&format=json`);
}

export function fetchKeywords(data, listOfIDs) {
  let fields =
    "id,keyword,language,language__value,language__value_en,keyword_category,keyword_category__name,keyword_category__name_en,related_keyword,related_keyword__keyword,remarks,is_primary";
  let searchFields = "";

  if (listOfIDs && listOfIDs.length > 0) {
    searchFields += `id__in=${listOfIDs}`;
  }
  if (data.id && data.id.trim().length > 0) {
    searchFields += `&id__icontains=${data.id}`;
  }
  if (data.term && data.term.trim().length > 0) {
    searchFields += `&keyword__icontains=${data.term}`;
  }
  if (data.language && data.language.trim().length > 0) {
    searchFields += `&multi_search=value:${data.language};fields:language__value,language__value_en;lookuptype:icontains`;
  }
  if (data.keyword_category && data.keyword_category.trim().length > 0) {
    searchFields += `&multi_search=value:${data.keyword_category};fields:keyword_category__name,keyword_category__name_en;lookuptype:icontains`;
  }
  if (data.related_keyword && data.related_keyword.trim().length > 0) {
    searchFields += `&related_keyword__keyword__icontains=${data.related_keyword}`;
  }
  if (data.is_primary) {
    searchFields += `&is_primary=${data.is_primary}`;
  }

  if (searchFields.startsWith("&")) searchFields = searchFields.substring(1);

  if (searchFields.length > 0) {
    return fetch(
      `keyword/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  } else {
    return fetch(
      `keyword/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`
    );
  }
}

export function fetchReferenceKeywordIDs(referenceID) {
  return fetch(
    `reference_keyword/?reference=${referenceID}&fields=keyword&format=json`
  );
}

export function fetchListKeywords() {
  return fetch(`keyword/?format=json`);
}

/*********************
 ***  KEYWORD END  ***
 *********************/

/*******************
 *** AGENT START ***
 *******************/

export function fetchAgentUsingName(name) {
  return fetch(
    `agent/?multi_search=value:${name};fields:id,agent,forename,surename;lookuptype:icontains&page=1&paginate_by=1&fields=id,agent,institution__institution_name_en,orcid`
  );
}

/*******************
 ***  AGENT END  ***
 *******************/

/***********************
 *** UNIVERSAL START ***
 ***********************/

export function fetchChangePrivacyState(table, id, stateData) {
  return fetchPost("change/" + table + "/" + id, stateData);
}

/***********************
 ***  UNIVERSAL END  ***
 ***********************/
