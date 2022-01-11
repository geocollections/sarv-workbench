import Vue from "vue";

const axios = require("axios");

const api = {
  url: "http://localhost:7000/api/",
  checkDoiUrl: "https://api.crossref.org/works/",
  solrUrl: "https://api.geocollections.info/solr/",
  publicApi: "https://api.geocollections.info/",
};

const attachmentFields =
  "id,uuid_filename,description,description_en,original_filename,date_created,attachment_format__value,author__agent,image_number";

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

export function postRequest(url, data, customUrl = "", method = "post") {
  return post(url, data, customUrl, method);
}

export function fetchAttachmentKeyword(id) {
  return get(`attachment_keyword/?attachment=${id}&format=json`);
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

export function fetchListLanguages() {
  return get(`list_language/?format=json`);
}

export function fetchAttachmentForReference(id) {
  return get(
    `attachment/?reference=${id}&fields=${attachmentFields}&format=json`
  );
}

export function fetchAddReferenceToLibrary(data) {
  return post(`add/library_reference/`, data);
}

export function fetchSpecificLogs(data) {
  return get(
    `log/?table_name=${data.table_name}&row_id=${data.row_id}&order_by=${data.order_by}&format=json`
  );
}

export function autocompleteSearch(query) {
  return get(`${query}&format=json`);
}

export function fetchAnalysisMethod() {
  return get(`analysis_method/?order_by=analysis_method&format=json`);
}

export function fetchLatestSampleInSite(siteId) {
  return get(
    `sample/?site__id=${siteId}&order_by=-id&paginate_by=1&format=json`
  );
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

export function fetchDoiUsingEGF(id) {
  return get(`egf/${id}`);
}

export function fetchDoiCheck(doi) {
  return get(doi, api.checkDoiUrl);
}

export function fetchDoiAgentType() {
  return get(`doi_agent_type/?format=json`);
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

export function fetchLinkedSite(data, projectId) {
  let fields =
    "id,name,name_en,number,project,project__name,project__name_en,date_start,date_end,latitude,longitude";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  return get(
    `site/?project=${projectId}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
  );
}

export function fetchLastSiteName(projectId) {
  return get(
    `site/?project=${projectId}&fields=name&order_by=-id&paginate_by=1&format=json`
  );
}

export function fetchJournalForReference(name) {
  return get(
    `journal/?multi_search=value:${name};fields:journal_name,journal_short,journal_long,journal_original,journal_abbr;lookuptype:iexact`
  );
}

export function fetchIsImagesetNumberInImageset(imagesetNumber) {
  return get(`imageset/?imageset_number=${imagesetNumber}&format=json`);
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

export function fetchListSpecimenType() {
  return get(`list_specimen_type/?format=json`);
}

export function fetchListHistoryType() {
  return get(`list_history_type/?format=json`);
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

export function fetchListIdentificationType() {
  return get(`list_identification_type/?format=json`);
}

export function fetchListUnit() {
  return get(`list_unit/?format=json`);
}

export function fetchMultiChangeSpecimen(data) {
  return post(`change_multi/specimen/`, data);
}

export function fetchTaxonTypeType() {
  return get(`taxon_type_type/?format=json`);
}

export function fetchTaxonOpinionType() {
  return get(`taxon_opinion_type/?format=json`);
}

export function fetchKeywordRelationType() {
  return get(`keyword_relation_type/?format=json`);
}

export function fetchAgentUsingName(name) {
  return get(
    `agent/?multi_search=value:${name};fields:id,agent,forename,surename;lookuptype:icontains&page=1&paginate_by=1&fields=id,agent,institution__institution_name_en,orcid`
  );
}

export function fetchAddItemToSelection(data) {
  return post(`add/selection/`, data);
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

export function fetchRelatedDrillcoreBoxImages(drillcoreId, searchParameters) {
  let orderBy = buildOrderBy(
    searchParameters.sortBy,
    searchParameters.sortDesc
  );
  return get(
    `attachment_link/?drillcore_box__drillcore=${drillcoreId}&page=${searchParameters.page}&paginate_by=${searchParameters.paginateBy}&order_by=${orderBy}&format=json&fields=attachment__uuid_filename,drillcore_box__drillcore__drillcore,drillcore_box__drillcore__drillcore_en,drillcore_box,drillcore_box__depth_start,drillcore_box__depth_end,drillcore_box__number`
  );
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

export function fetchListStratotypeType() {
  return get(`list_stratotype_type/?format=json`);
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

export function fetchLinkedAreaSites(data, areaId) {
  let fields =
    "id,name,name_en,number,project,project__name,project__name_en,date_start,date_end,latitude,longitude";
  let orderBy = buildOrderBy(data.sortBy, data.sortDesc);

  return get(
    `site/?area=${areaId}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${orderBy}&fields=${fields}&format=json`
  );
}

export function fetchMultiChangeLocation(table, data) {
  return post(`change_multi/${table}/`, data);
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

export function fetchLoan(id) {
  return get(`loan/?id=${id}&format=json`);
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

export function fetchCurrentlyActiveUsers() {
  return get(
    `sarv_session/?session_end=null&active=1&paginate_by=100&order_by=-session_start&format=json`
  );
}

export function fetchChangeRecordState(table, id, stateData) {
  return post("change/" + table + "/" + id, stateData);
}

export function fetchDeleteRecord(table, id) {
  return post_delete(`${table}/${id}`);
}

export function fetchGroups() {
  return get(`group/?format=json`);
}

export function fetchUsers() {
  return get(`user/?format=json`);
}

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
