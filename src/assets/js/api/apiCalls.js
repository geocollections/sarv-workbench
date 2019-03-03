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
    searchFields += '&multi_search=value:' + data.filename + ';searchFields:original_filename,uuid_filename;lookuptype:icontains'
  }
  if (data.specimen !== null && data.specimen.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.specimen + ';searchFields:specimen__id,specimen__specimen_id;lookuptype:icontains'
  }
  if (data.imageInfo !== null && data.imageInfo.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.imageInfo + ';searchFields:description,description_en,image_place,image_object,image_people,image_description,image_description_en,tags;lookuptype:icontains'
  }
  if (data.locality !== null && data.locality.trim().length > 0) {
    searchFields += '&multi_search=value:' + data.locality + ';searchFields:locality__locality,locality__locality_en;lookuptype:icontains'
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
  const fields = 'id,author,year,title,journal__journal_name,volume,pages,doi,attachment__filename,book,publisher,publisher_place,url'
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
    searchFields += '&multi_search=value:' + data.bookJournal + ';fields:book,journal__journal_name;lookuptype:icontains'
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
