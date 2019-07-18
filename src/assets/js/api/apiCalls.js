import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

const api = {
  url: 'https://rwapi.geocollections.info/',
  checkDoiUrl: 'https://api.crossref.org/works/',
  solrUrl: 'https://api.geocollections.info/solr/',
  dataciteTestUrl: 'https://api18rw.geocollections.info/'
};

function fetch (child, url = 0) {
  let queryUrl = api.url
  if (url !== 0) queryUrl = url

  return new Promise((resolve, reject) => {
    Vue.http.get(queryUrl + child, {}).then(response => {
      // console.log(response)
      resolve(response);
    }, errResponse => {
      console.log('ERROR: ' + JSON.stringify(errResponse));
      reject(errResponse)
    });
  });
}

function fetchPost (child, postData, config) {
  return new Promise((resolve, reject) => {
    Vue.http.post(api.url + child, postData, config)
      .then(
        response => resolve(response),
        errResponse => reject(errResponse)
      );
  });
}



/*******************
 *** LOGIN START ***
 *******************/

export function fetchLogin(userData) {
  return fetchPost(`login/`, userData, {emulateJSON: true})
}

export function fetchLoginId() {
  return fetch(`loginid/`)
}

export function fetchLogout() {
  return fetch(`logout/`)
}

export function fetchIsLoggedIn() {
  return fetch('is_logged_in/login_state')
}

/*******************
 ***  LOGIN END  ***
 *******************/



/*************************
 *** ATTACHMENTS START ***
 *************************/

export function fetchAttachments(data, author) {
  const fields = 'id,uuid_filename,original_filename,author__agent,author_free,date_created,date_created_free,image_number,specimen,reference_id,reference__reference,specimen_image_attachment,is_private'
  let searchFields = ''

  if (data.image_number !== null && data.image_number.trim().length > 0) {
    searchFields += 'image_number__icontains=' + data.image_number
  }
  if (data.filename !== null && data.filename.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.filename + ';fields:original_filename,uuid_filename;lookuptype:icontains'
  }
  if (data.specimen !== null && data.specimen.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.specimen + ';fields:specimen__id,specimen__specimen_id;lookuptype:icontains'
  }
  if (data.imageInfo !== null && data.imageInfo.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.imageInfo + ';fields:description,description_en,image_place,image_object,image_people,image_description,image_description_en,tags;lookuptype:icontains'
  }
  if (data.locality !== null && data.locality.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.locality + ';fields:locality__locality,locality__locality_en;lookuptype:icontains'
  }
  if (data.specimen_image_attachment.length > 0 && data.specimen_image_attachment.length <= 3) {
    searchFields += '&specimen_image_attachment__in=' + data.specimen_image_attachment
  }
  // If all checkboxes are unchecked then there won't be any results, that's why zero is added.
  if (data.specimen_image_attachment.length === 0) {
    searchFields += '&specimen_image_attachment=0'
  }
  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)

  if (searchFields.length > 0) {
    return fetch(`attachment/?${searchFields}&or_search=author_id:${author.id};user_added:${author.user}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
    // return fetch(`attachment/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(`attachment/?or_search=author_id:${author.id};user_added:${author.user}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
    // return fetch(`attachment/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}

/*************************
 ***  ATTACHMENTS END  ***
 *************************/



/************************
 *** REFERENCES START ***
 ************************/

export function fetchReference(id) {
  return fetch(`reference/?id=${id}&format=json`)
}

export function fetchReferences(data) {
  // This (solr search) overrides regular search fields
  if (data.solrSearch && data.solrSearch !== null && data.solrSearch.trim().length > 0) {
    // TODO: Add order by
    let start = (data.page - 1) * data.paginateBy
    return fetch(`reference/?q=${data.solrSearch}&rows=${data.paginateBy}&start=${start}&format=json`, api.solrUrl)
  }

  const fields = 'id,reference,author,year,title,journal__journal_name,number,volume,pages,doi,attachment__filename,book,book_editor,publisher,publisher_place,url,is_private'
  let searchFields = ''

  if (data.author !== null && data.author.trim().length > 0) {
    searchFields += 'author__icontains=' + data.author
  }
  if (data.year !== null && data.year.trim().length > 0) {
    searchFields += '&year__icontains=' + data.year
  }
  if (data.title !== null && data.title.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.title + ';fields:title,title_original;lookuptype:icontains'
  }
  if (data.bookJournal !== null && data.bookJournal.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.bookJournal + ';fields:book,book_editor,journal__journal_name;lookuptype:icontains'
  }
  if (data.abstractRemarks && data.abstractRemarks.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.abstractRemarks + ';fields:abstract,remarks;lookuptype:icontains'
  }
  if (data.keywords !== null && data.keywords.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.keywords + ';fields:tags,libraryreference__keywords;lookuptype:icontains'
  }
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += '&id__icontains=' + data.id
  }
  if (data.libraryAuthorIdTitle && data.libraryAuthorIdTitle.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.libraryAuthorIdTitle + ';fields:libraryreference__library__author__id,libraryreference__library__author__agent,libraryreference__library__author_txt,libraryreference__library__id,libraryreference__library__title,libraryreference__library__title_en;lookuptype:icontains&distinct=true'
  }
  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)

  if (searchFields.length > 0) {
    // Not using 'fields' because of alternative table
    // return fetch(`reference/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
    return fetch(`reference/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&format=json`)
  } else {
    // Not using 'fields' because of alternative table
    // return fetch(`reference/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
    return fetch(`reference/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&format=json`)
  }
}

export function fetchListKeywords() {
  return fetch(`keyword/?format=json`)
}

export function fetchReferenceKeyword(id) {
  return fetch(`reference_keyword/?reference=${id}&format=json`)
}

export function fetchAttachmentLink(id) {
  return fetch(`attachment_link/?reference=${id}&format=json`)
}

export function fetchLocalityReferenceForReference(id, page = 1) {
  return fetch(`locality_reference/?reference=${id}&page=${page}&paginate_by=10&format=json`)
}

export function fetchListReferenceTypes() {
  return fetch(`list_reference_type/?format=json`)
}

export function fetchListLanguages() {
  return fetch(`list_language/?format=json`)
}

export function fetchAttachmentForReference(id) {
  return fetch(`attachment/?reference=${id}&format=json`)
}

export function fetchJournals(query) {
  return fetch(`journal/?multi_search=value:${query};fields:id,journal_name,journal_short;lookuptype:icontains&format=json`)
}

export function fetchLibrariesForReference(id) {
  return fetch(`library_reference/?reference=${id}&fields=library,library__title,library__title_en&format=json`)
}

export function fetchAddReferenceToLibrary(data) {
  return fetchPost(`add/library_reference/`, data)
}


/************************
 ***  REFERENCES END  ***
 ************************/


/******************
 *** LOGS START ***
 ******************/

export function fetchSpecificLogs(data) {
  return fetch(`log/?table_name=${data.table_name}&row_id=${data.row_id}&order_by=${data.order_by}&format=json`)
}

export function fetchLatestLogs(data) {
  return fetch(`log/?user=${data.user}&command=${data.command}&order_by=-id&paginate_by=10&fields=time,user,command,changes,table_name,row_id`)
}

/******************
 *** LOGS END ***
 ******************/


/************************
 *** LOCALITIES START ***
 ************************/

export function fetchLocalities(data) {
  const fields = 'id,country__value_en,country__value,locality_en,locality,user_added,number'
  let searchFields = ''
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`
  }

  if (data.locality !== null && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${data.locality};fields:locality_en,locality;lookuptype:icontains`
  }

  if (data.number !== null && data.number.trim().length > 0) {
    searchFields += `&number__icontains=${data.number}`
  }

  if (data.country !== null && data.country.trim().length > 0) {
    searchFields += `&multi_search=value:${data.country};fields:country__value_en,country__value;lookuptype:icontains`
  }

  if (data.agent !== null && data.agent.trim().length > 0) {
    searchFields += '&user_added__icontains='+data.agent
  }

  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)

  if (searchFields.length > 0) {
    return fetch(`locality/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(`locality/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}

export function fetchListLocalityTypes() {
  return fetch(`list_locality_type/?format=json`)
}
export function fetchListLocalityExtent() {
  return fetch(`list_locality_extent/?format=json`)
}
export function fetchListCoordinateMethod() {
  return fetch(`list_coordinate_method/?format=json`)
}
export function fetchListCoordinatePrecision() {
  return fetch(`list_coordinate_precision/?format=json`)
}
export function fetchListCountry() {
  return fetch(`list_country/?format=json`)
}
export function autocompleSearch(query) {
  return fetch(`${query}&format=json`)
}
export function fetchLocality(id) {
  return fetch(`locality/?id=${id}&format=json`)
}
export function fetchLocalityReference(id,page = 1) {
  return fetch(`locality_reference/?locality__id=${id}&page=${page}&paginate_by=10&format=json`)
}
export function fetchLocalitySynonym(id,page = 1) {
  return fetch(`locality_synonym/?locality_id=${id}&page=${page}&paginate_by=10&format=json`)
}
export function fetchLocalityAttachment(id,page = 1) {
  return fetch(`attachment/?attach_link__locality__id=${id}&page=${page}&paginate_by=10&fields=id,original_filename,attach_link__locality__id,remarks&format=json`)
}
export function fetchLocalityStratigraphy(id,page = 1) {
  return fetch(`locality_stratigraphy/?locality_id=${id}&page=${page}&paginate_by=10&format=json`)
}

/************************
 ***  LOCALITIES END  ***
 ************************/

/************************
 ***  SAMPLES START  ***
 ************************/
export function fetchSample(id) {
  return fetch(`sample/?id=${id}&format=json`)
}
export function fetchSamplePurpose() {
  return fetch(`list_sample_purpose/?order_by=value&format=json`)
}
export function fetchFossilGroup() {
  return fetch(`taxon/?fields=taxon,id&is_fossil_group=1&format=json`)
}

export function fetchSampleRelatedAnalysis(id) {
  return fetch(`analysis/?sample=${id}&fields=id&format=json`)
}
export function fetchSampleRelatedPreparation(id) {
  return fetch(`preparation/?sample=${id}&fields=id&format=json`)
}
export function fetchAnalysisMethod() {
  return fetch(`analysis_method/?order_by=analysis_method&format=json`)
}

export function fetchSamples(data, agent, databaseId) {
  const fields = 'id,locality__locality_en,locality__locality,agent_collected__agent,number,number_additional,' +
    'number_field,locality_free,depth,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,database__name,database__name_en,date_collected'
  let searchFields = ''
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`
  }

  if (data.number !== null && data.number.trim().length > 0) {
    //searchFields += `&number__icontains=${data.number}`
    searchFields += `&multi_search=value:${data.number};fields:number,number_additional,number_field;lookuptype:icontains`
  }
  //
  // if (data.number_additional !== null && data.number_additional.trim().length > 0) {
  //   searchFields += `&number_additional__icontains=${data.number_additional}`
  // }
  //
  // if (data.number_field !== null && data.number_field.trim().length > 0) {
  //   searchFields += `&number_field__icontains=${data.number_field}`
  // }

  if (data.locality !== null && data.locality.trim().length > 0) {
    searchFields += `&multi_search=value:${data.locality};fields:locality__locality_en,locality__locality,locality_free;lookuptype:icontains`
  }
  //
  // if (data.locality_free !== null && data.locality_free.trim().length > 0) {
  //   searchFields += `&locality_free__icontains=${data.locality_free}`
  // }
  if (data.depth !== null && data.depth.trim().length > 0) {
    //searchFields += '&depth__exact='+data.depth
    searchFields += `&multi_search=value:${data.depth};fields:depth,depth_interval;lookuptype:icontains`
  }
  if (data.stratigraphy !== null && data.stratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${data.stratigraphy};fields:stratigraphy__stratigraphy_en,stratigraphy__stratigraphy,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en;lookuptype:icontains`
  }
//  if (data.rock !== null && data.rock.trim().length > 0) {
//    console.log('rock' + data.rock);
//    searchFields += `&multi_search=value:${data.rock};fields:rock_en,rock,classification_rock__name,classification_rock__name_en;lookuptype:icontains`
//  }
  if (data.agent !== null && data.agent.trim().length > 0) {
    searchFields += `&agent_collected__agent__icontains=${data.agent}`
  }

  if (typeof agent !== 'undefined' && agent !== null) {
    searchFields += `&or_search=agent_collected__id:${agent.id};user_added:${agent.user};owner__id:${agent.id}`
  }

  if (typeof databaseId !== 'undefined' && databaseId !== null) {
    searchFields += `&database__id=${databaseId}`
  }

  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)
  if (searchFields.length > 0) {
    return fetch(`sample/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(`sample/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}
export function fetchSampleAnalysis(id,page = 1) {
  return fetch(`analysis/?sample__id=${id}&page=${page}&paginate_by=10&format=json`)
}
export function fetchSamplePreparation(id,page = 1,allData = false) {
  let paging = ''
  if(allData === false) {
    paging = '&page=${page}&paginate_by=10'
  }
  return fetch(`preparation/?sample__id=${id}${paging}&format=json`)
}
export function fetchTaxonList(id,page = 1) {
  return fetch(`taxon_list/?sample=${id}&page=${page}&paginate_by=10&format=json`)
}
export function fetchLSampleAttachment(id,page = 1) {
  return fetch(`attachment/?attach_link__sample__id=${id}&page=${page}&paginate_by=10&fields=id,original_filename&format=json`)
}
export function fetchSampleReference(id,page = 1) {
  return fetch(`sample_reference/?sample__id=${id}&page=${page}&paginate_by=10&format=json`)
}
export function fetchLastSiteSample(id) {
  return fetch(`sample/?site__id=${id}&order_by=-id&paginate_by=1&format=json`)
}
/************************
 ***  SAMPLES END  ***
 ************************/



/***********************
 *** LIBRARIES START ***
 ***********************/

export function fetchLibrary(id) {
  return fetch(`library/?id=${id}&format=json`)
}

export function fetchLibraries(data) {
  const fields = 'id,author_txt,year,title,title_en,is_private'
  let searchFields = ''
  if (data.author_txt !== null && data.author_txt.trim().length > 0) {
    searchFields += `author_txt__icontains=${data.author_txt}`
  }

  if (data.year !== null && data.year.trim().length > 0) {
    searchFields += `&year__icontains=${data.year}`
  }

  if (data.title !== null && data.title.trim().length > 0) {
    searchFields += `&multi_search=value:${data.title};fields:title,title_en;lookuptype:icontains`
  }

  if (data.reference !== null && data.reference.trim().length > 0) {
    searchFields += `&libraryreference__reference__reference__icontains=${data.reference}&distinct=true`
  }

  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)

  if (searchFields.length > 0) {
    return fetch(`library/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(`library/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}

export function fetchLibrariesFromLibraryAgent(data, agent) {
  const fields = 'id,library,library__author_txt,library__title,library__title_en,agent,agent__agent,agent__surename,agent__forename,library__is_private'
  let searchFields = ''

  // Using typeof check because for active libraries (reference view uses active libraries but search data will be related to referneces)
  if (typeof data.author_txt !== 'undefined' && data.author_txt !== null && data.author_txt.trim().length > 0) {
    searchFields += `&library__author_txt__icontains=${data.author_txt}`
  }

  if (typeof data.year !== 'undefined' && data.year !== null && data.year.trim().length > 0) {
    searchFields += `&library__year__icontains=${data.year}`
  }

  if (typeof data.title !== 'undefined' && data.title !== null && data.title.trim().length > 0) {
    searchFields += `&multi_search=value:${data.title};fields:library__title,library__title_en;lookuptype:icontains`
  }

  if (typeof data.reference !== 'undefined' && data.reference !== null && data.reference.trim().length > 0) {
    searchFields += `&library__libraryreference__reference__reference__icontains=${data.reference}&distinct=true`
  }

  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)

  if (searchFields.length > 0) {
    return fetch(`library_agent/?agent=${agent.id}&${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(`library_agent/?agent=${agent.id}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}

export function fetchLibraryReference(id, page, paginateBy = 25) {
  return fetch(`library_reference/?library=${id}&page=${page}&paginate_by=${paginateBy}&order_by=-sort,reference__author,-reference__year&format=json`)
}

export function fetchLibraryAgent(id) {
  return fetch(`library_agent/?library=${id}&format=json`)
}

export function fetchListLibraries(id) {
  return fetch(`library_agent/?agent=${id}&format=json`)
}

export function fetchChangeLibraryState(id, data) {
  return fetchPost(`change/library/${id}`, data)
}

/***********************
 ***  LIBRARIES END  ***
 ***********************/



/*****************
 *** DOI START ***
 *****************/

export function fetchDois(data) {
  const fields = 'id,identifier,creators,publication_year,title,resource_type__value,is_private';
  let searchFields = '';
  if (data.identifier !== null && data.identifier.trim().length > 0) {
    searchFields += `&identifier__icontains=${data.identifier}`
  }

  if (data.creators !== null && data.creators.trim().length > 0) {
    searchFields += `&creators__icontains=${data.creators}`
  }

  if (data.publication_year !== null && data.publication_year.trim().length > 0) {
    searchFields += `&publication_year__icontains=${data.publication_year}`
  }

  if (data.title !== null && data.title.trim().length > 0) {
    searchFields += `&title__icontains=${data.title}`
  }

  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)

  if (searchFields.length > 0) {
    return fetch(`doi/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(`doi/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}

export function fetchDoi(id) {
  return fetch(`doi/?id=${id}&format=json`)
}

export function fetchDoiResourceType() {
  return fetch(`doi_resource_type/?format=json`)
}

// export function fetchListTitleTranslatedLanguages() {
//   return fetch(`title_translated_language/?format=json`)
// }

export function fetchListLicences() {
  return fetch(`list_licence/?format=json`)
}

export function fetchDoiCheck(doi) {
  return fetch(doi, api.checkDoiUrl)
}

export function fetchDoiAttachment(id, page, paginateBy = 25) {
  return fetch(`attachment_link/?doi=${id}&page=${page}&paginate_by=${paginateBy}&fields=id,attachment,attachment__original_filename,attachment__description,attachment__description_en,attachment__uuid_filename,attachment__date_created,remarks&format=json`)
}

export function fetchDoiAgent(id, page, paginateBy = 25) {
  return fetch(`doi_agent/?doi=${id}&page=${page}&paginate_by=${paginateBy}&format=json`)
}

export function fetchDoiAgentType() {
  return fetch(`doi_agent_type/?format=json`)
}

export function fetchDoiRelatedIdentifier(id, page, paginateBy = 25) {
  return fetch(`doi_related_identifier/?doi=${id}&page=${page}&paginate_by=${paginateBy}&format=json`)
}

export function fetchDoiGeolocation(id, page, paginateBy = 25) {
  return fetch(`doi_geolocation/?doi=${id}&page=${page}&paginate_by=${paginateBy}&format=json`)
}

export function fetchDoiDate(id, page, paginateBy = 25) {
  return fetch(`doi_date/?doi=${id}&page=${page}&paginate_by=${paginateBy}&format=json`)
}

export function fetchDoiRelatedIdentifierType() {
  return fetch(`doi_related_identifier_type/?format=json`)
}

export function fetchDoiRelationType() {
  return fetch(`doi_relation_type/?format=json`)
}

export function fetchDoiDateType() {
  return fetch(`doi_date_type/?format=json`)
}

export function fetchAddDoi(data) {
  return fetchPost(`add/doi/`, data)
}

export function fetchAddDoiGeolocation(data) {
  return fetchPost(`add/doi_geolocation/`, data)
}

export function fetchAddDoiAgent(data) {
  return fetchPost(`add/doi_agent/`, data)
}

export function fetchCheckMetadataInDataCite(id) {
  return fetch(`datacite/check_metadata/${id}`)
}

export function fetchCheckDoiUrlInDataCite(id) {
  return fetch(`datacite/check_doi/${id}`)
}

export function fetchRegisterMetadataToDataCite(id) {
  return fetch(`datacite/register_metadata/${id}`)
}

export function fetchRegisterDoiUrlToDataCite(id) {
  return fetch(`datacite/register_doi/${id}`)
}

/*****************
 ***  DOI END  ***
 *****************/



/*****************************
 *** ATTACHMENT LINK START ***
 *****************************/

export function fetchAddAttachmentLink(data) {
  return fetchPost(`add/attachment_link/`, data)
}

/*****************************
 ***  ATTACHMENT LINK END  ***
 *****************************/



/**********************
 *** PROJECTS START ***
 **********************/

export function fetchProject(id) {
  return fetch(`project/?id=${id}&format=json`)
}
export function fetchProjectAgent(id,agent) {
  return fetch(`project/${id}?fields=id,projectagent__agent,projectagent__agent__agent&format=json`)
}
export function fetchProjectAttachment(id,page=1) {
  return fetch(`attachment/?attach_link__project__id=${id}&page=${page}&paginate_by=100&fields=id,author__agent,original_filename,description,description_en,uuid_filename&format=json`)
}
export function fetchLinkedSite(id,page=1) {
  return fetch(`site/?project=${id}&page=${page}&paginate_by=10&fields=id,name,name_en,date_start,date_end,latitude,longitude&format=json`)
}
export function fetchProjectType() {
  return fetch(`project_type/?order_by=name&format=json`)
}
export function fetchProjects(data,agent) {
  const fields = 'id,name, name_en,project_type,project_type__name,project_type__name_en,parent_project,date_start,date_end,' +
    'date_free,description,remarks,owner,owner__agent,is_private';
  let searchFields = ''
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`
  }

  // if (data.name !== null && data.name.trim().length > 0) {
  //   searchFields += `&multi_search=value:${data.name};fields:name,name_en;lookuptype:icontains`
  // }

  if (data.owner !== null && data.owner.trim().length > 0) {
    searchFields += `&multi_search=value:${data.owner};fields:owner__agent;fields:owner__agent_surname;fields:owner__agent_firstname;lookuptype:icontains`
  }

  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)
  if (searchFields.length > 0) {
    return fetch(`project/?projectagent__agent=${agent}&${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(`project/?projectagent__agent=${agent}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}
export function fetchActiveProjects(projectIds) {
  return fetch(`project/?id__in=${projectIds}&fields=id,name,name_en&format=json`)
}

/**********************
 ***  PROJECTS END  ***
 **********************/



/******************
 *** SITE START ***
 ******************/

export function fetchSites(data,agent) {
  console.log(data)
  let fields = 'id, project, project__name, locality, locality__locality, name, name_en, number,' +
    'latitude,longitude,location_accuracy,elevation,elevation_accuracy,' +
    'coord_det_method__value,coord_det_method__value_en, date_start,date_end,date_free,remarks_location,' +
    'description,remarks';
  let searchFields = ''

  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`
  }

  if (data.name !== null && data.name.trim().length > 0) {
    searchFields += `&multi_search=value:${data.name};fields:name,name_en;lookuptype:icontains`
  }

  if (data.number !== null && data.number.trim().length > 0) {
    searchFields += `&number__icontains=${data.number}`
  }

  if (data.project !== null && data.project.trim().length > 0) {
    searchFields += `&multi_search=value:${data.project};fields:project__name,project__name_en;lookuptype:icontains`
  }

  if (data.date_start !== null) {
    let dateStart = data.date_start

    if (typeof dateStart === 'string') dateStart = dateStart.split('T')[0]
    else  {
      dateStart.setHours(0, -dateStart.getTimezoneOffset(), 0, 0);
      dateStart = dateStart.toISOString().split('T')[0]
    }
    searchFields += `&date_start__gte=${dateStart}`
  }

  if (data.date_end !== null) {
    let dateEnd = data.date_end
    if (typeof dateEnd === 'string') dateEnd = dateEnd.split('T')[0]
    else {
      dateEnd.setHours(0, -dateEnd.getTimezoneOffset(), 0, 0);
      dateEnd = dateEnd.toISOString().split('T')[0]
    }

    searchFields += `&date_end__lte=${dateEnd}`
  }

  // if (data.date_start !== null && data.date_start.trim().length > 0) {
  //   searchFields += `&date_start__gt=${data.date_start}`
  // }

  if (data.coords_not_null === true) {
    searchFields += `&latitude__isnull=False&longitude__isnull=False`
  }

  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)

  if (searchFields.length > 0) {
    // return data.coords_not_null === true ? fetch(`site/?${searchFields}&order_by=${data.orderBy}&fields=id, latitude, longitude&format=json`):
    return  fetch(`site/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    // return data.coords_not_null === true ? fetch(`site/?order_by=${data.orderBy}&fields=id, latitude, longitude&format=json`):

    return  fetch(`site/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}

export function fetchSite(id) {
  return fetch(`site/?id=${id}&format=json`)
}
export function fetchSiteAttachment(id,page=1) {
  return fetch(`attachment/?attach_link__site__id=${id}&page=${page}&paginate_by=100&fields=id,author__agent,original_filename,description,description_en,uuid_filename,date_created&format=json`)
}
export function fetchLinkedSamples(id,page=1) {
  return fetch(`sample/?site__id=${id}&page=${page}&paginate_by=100&fields=id,number,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en,depth_interval,depth,rock,rock_en&format=json`)
}
export function fetchLinkedSamplesX(data,siteID) {

  let fields = 'id,number,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en,depth_interval,depth,rock,rock_en';
  let searchFields = ''
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`
  }

  if (data.number !== null && data.number.trim().length > 0) {
    //searchFields += `&number__icontains=${data.number}`
    searchFields += `&multi_search=value:${data.number};fields:number,number_additional,number_field;lookuptype:icontains`
  }
  if (data.depth !== null && data.depth.trim().length > 0) {
    //searchFields += '&depth__exact='+data.depth
    searchFields += `&multi_search=value:${data.depth};fields:depth;lookuptype:icontains`
  }
  if (data.depth_interval !== null && data.depth_interval.trim().length > 0) {
    //searchFields += '&depth__exact='+data.depth
    searchFields += `&multi_search=value:${data.depth_interval};fields:depth_interval;lookuptype:icontains`
  }
  if (data.stratigraphy !== null && data.stratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${data.stratigraphy};fields:stratigraphy__stratigraphy_en,stratigraphy__stratigraphy;lookuptype:icontains`
  }
  if (data.lithostratigraphy !== null && data.lithostratigraphy.trim().length > 0) {
    searchFields += `&multi_search=value:${data.lithostratigraphy};fields:lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en;lookuptype:icontains`
  }
  if (data.rock !== null && data.rock.trim().length > 0) {
     searchFields += `&multi_search=value:${data.rock};fields:rock_en,rock;lookuptype:icontains`
  }
  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)

  if (searchFields.length > 0) {
    // return data.coords_not_null === true ? fetch(`site/?${searchFields}&order_by=${data.orderBy}&fields=id, latitude, longitude&format=json`):
    return  fetch(`sample/?site__id=${siteID}&${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    // return data.coords_not_null === true ? fetch(`site/?order_by=${data.orderBy}&fields=id, latitude, longitude&format=json`):

    return  fetch(`sample/?site__id=${siteID}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}
export function fetchLastSiteName(projectId) {
  return fetch(`site/?project=${projectId}&fields=name&order_by=-id&paginate_by=1&format=json`)
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
  const fields = 'id,sample__id,sample__number,sample__locality__locality,sample__depth,analysis_method__analysis_method,' +
    'date,lab_txt,agent__agent,is_private';
  let searchFields = '';

  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += `id__icontains=${data.id}`
  }

  if (data.analysis_method !== null && data.analysis_method.trim().length > 0) {
    searchFields += `&multi_search=value:${data.analysis_method};fields:analysis_method__analysis_method,analysis_method__method_en;lookuptype:icontains`

  }

  if (data.agentAndLab !== null && data.agentAndLab.trim().length > 0) {
    searchFields += `&multi_search=value:${data.agentAndLab};fields:agent__agent,lab_txt;lookuptype:icontains`
  }

  if (typeof agent !== 'undefined' && agent !== null) {
    searchFields += `&or_search=agent__id:${agent.id};user_added:${agent.user};owner__id:${agent.id}`
  }

  if (typeof databaseId !== 'undefined' && databaseId !== null) {
    searchFields += `&database__id=${databaseId}`
  }

  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)
  if (searchFields.length > 0) {
    return fetch(`analysis/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(`analysis/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}

export function fetchAnalysisAttachment(id,page=1) {
  return fetch(`attachment/?attach_link__analysis__id=${id}&page=${page}&paginate_by=100&fields=id,author__agent,original_filename,description,description_en,uuid_filename,date_created&format=json`)
}

export function fetchAnalysisResults(id,page=1) {
  return fetch(`analysis_results/?analysis=${id}&page=${page}&paginate_by=100&format=json`)
}
/***************************
 ***  ANALYSIS LINK END  ***
 ***************************/



/*********************
 *** JOURNAL START ***
 *********************/

export function fetchAddJournal(data) {
  return fetchPost(`add/journal/`, data)
}

export function fetchJournal(name) {
  return fetch(`journal/?multi_search=value:${name};fields:journal_name,journal_short,journal_long,journal_original,journal_abbr;lookuptype:iexact`,)
}

/*********************
 ***  JOURNAL END  ***
 *********************/



/**********************
 *** IMAGESET START ***
 **********************/

export function fetchAddImageset(data) {
  return fetchPost(`add/imageset/`, data)
}

export function fetchIsImagesetNumberInImageset(imagesetNumber) {
  return fetch(`imageset/?imageset_number=${imagesetNumber}&format=json`)
}

/**********************
 ***  IMAGESET END  ***
 **********************/



/**********************
 *** SPECIMEN START ***
 **********************/

export function fetchSpecimens(data) {
  const fields = 'id,coll__number,specimen_id,specimen_nr,locality_id,locality__locality,locality__locality_en,locality_free,depth,depth_interval,stratigraphy_id,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,stratigraphy_free,agent_collected__agent,agent_collected__forename,agent_collected__surename,storage__location,is_private';
  let searchFields = '';



  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)

  if (searchFields.length > 0) {
    return fetch(`specimen/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(`specimen/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}

/**********************
 ***  SPECIMEN END  ***
 **********************/
