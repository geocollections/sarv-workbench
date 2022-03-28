import Vue from "vue";

const axios = require("axios");

const api = {
  url: "http://localhost:7000/api/",
  checkDoiUrl: "https://api.crossref.org/works/",
};

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

export function postRequest(url, data, customUrl = "", method = "post") {
  return post(url, data, customUrl, method);
}

export function fetchSpecificLogs(data) {
  return get(
    `log/?table_name=${data.table_name}&row_id=${data.row_id}&order_by=${data.order_by}&format=json`
  );
}

export function autocompleteSearch(query) {
  return get(`${query}&format=json`);
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

export function fetchDoiUsingEGF(id) {
  return get(`egf/${id}`);
}

export function fetchDoiCheck(doi) {
  return get(doi, api.checkDoiUrl);
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

export function fetchMultiChangeSpecimen(data) {
  return post(`change_multi/specimen/`, data);
}

export function fetchAgentUsingName(name) {
  return get(
    `agent/?multi_search=value:${name};fields:id,agent,forename,surename;lookuptype:icontains&page=1&paginate_by=1&fields=id,agent,institution__institution_name_en,orcid`
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

export function fetchActiveSelectionSeriesList(table, selectionSeriesId) {
  return get(
    `selection/?selection=${selectionSeriesId}&fields=id,${table}&${table}__isnull=false&format=json`
  );
}

export function fetchMultiRemoveRecordFromSelection(data) {
  return post(`delete_multi/selection/`, data);
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

export function fetchMultiChangeLocation(table, data) {
  return post(`change_multi/${table}/`, data);
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

export function fetchCurrentlyActiveUsers() {
  return get(
    `sarv_session/?session_end=null&active=1&paginate_by=100&order_by=-session_start&format=json`
  );
}

export function fetchChangeRecordState(table, id, stateData) {
  return post("change/" + table + "/" + id, stateData);
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
