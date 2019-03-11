import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

const api = {
  url: 'https://rwapi.geocollections.info/'
};

function fetch (child) {
  return new Promise((resolve, reject) => {
    Vue.http.get(api.url + child, {}).then(response => {
      console.log(response)
      resolve(response);
    }, errResponse => {
      console.log('ERROR: ' + JSON.stringify(errResponse));
      reject(errResponse)
    });
  });
}

function fetchPost (child, postData, config) {
  return new Promise((resolve, reject) => {
    Vue.http.post(api.url + child, postData, config).then(response => {
      console.log(response)
      resolve(response);
    }, errResponse => {
      console.log('ERROR: ' + JSON.stringify(errResponse));
      reject(errResponse)
    });
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

/*******************
 ***  LOGIN END  ***
 *******************/



/***************************
 *** AUTOCOMPLETES START ***
 ***************************/

export function fetchListReferenceTypes(data) {
  return fetch(`list_reference_type/?value__isnull=${data.value__isnull}&value_en__isnull=${data.value_en__isnull}&format=json`)
}

export function fetchListLanguages(data) {
  return fetch(`list_language/?value__isnull=${data.value__isnull}&value_en__isnull=${data.value_en__isnull}&format=json`)
}

export function fetchJournals(query) {
  return fetch(`journal/?multi_search=value:${query};fields:id,journal_name,journal_short;lookuptype:icontains&format=json`)
}

/***************************
 *** AUTOCOMPLETES START ***
 ***************************/



/*************************
 *** ATTACHMENTS START ***
 *************************/

export function fetchAttachments(data, author) {
  const fields = 'id,uuid_filename,author__agent,author_free,date_created,date_created_free,image_number,specimen,reference_id,reference__reference,specimen_image_attachment'
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
    return fetch(`attachment/?${searchFields}&or_search=author_id:${author.agent_id};user_added:${author.user}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(`attachment/?or_search=author_id:${author.agent_id};user_added:${author.user}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}

/*************************
 ***  ATTACHMENTS END  ***
 *************************/



/************************
 *** REFERENCES START ***
 ************************/

export function fetchReferences(data) {
  const fields = 'id,author,year,title,journal__journal_name,number,volume,pages,doi,attachment__filename,book,book_editor,publisher,publisher_place,url'
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
  if (data.abstractKeywordsRemarks !== null && data.abstractKeywordsRemarks.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.abstractKeywordsRemarks + ';fields:abstract,tags,remarks;lookuptype:icontains'
  }
  if (data.id !== null && data.id.trim().length > 0) {
    searchFields += '&id__icontains=' + data.id
  }
  if (searchFields.startsWith('&')) searchFields = searchFields.substring(1)

  if (searchFields.length > 0) {
    return fetch(`reference/?${searchFields}&page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  } else {
    return fetch(`reference/?page=${data.page}&paginate_by=${data.paginateBy}&order_by=${data.orderBy}&fields=${fields}&format=json`)
  }
}

export function fetchReferenceKeywords() {
  return fetch(`keyword/`)
}

export function fetchAttachmentLink(data) {
  return fetch(`attachment_link/?reference=${data.reference}&format=json`)
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
  return fetch(`locality_reference/?locality__id=${id}&page=${page}&paginate_by=10&format=json`)
}
export function fetchLocalityAttachment(id,page = 1) {
  return fetch(`attachment/?attach_link__locality__id=${id}&page=${page}&paginate_by=10&fields=original_filename,attach_link__locality__id,remarks&format=json`)
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
/************************
 ***  SAMPLES END  ***
 ************************/
