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

// function applyMode(mode, separator = '=', prefix = '', queryJoiner = '&') {
//   let returnVal = "";
//   // if(mode === 'in_baltoscandia') returnVal = `${queryJoiner}in_baltoscandia${separator}1`;
//   if (mode === 'in_estonia') returnVal = `${queryJoiner}${prefix}in_estonia${separator}1`;
//   return returnVal
// }



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



// export function fetchRock (id,mode) {
//   return fetch(`rock/?id=${id}&format=json`)
// }
// export function fetchPage (page) {
//   return fetch(`page/?id=${page}&format=json`)
// }
//
// export function fetchRockImages (id,mode) {
//   return fetch(`rock_image/?rock_id=${id}&format=json`)
// }
// export function fetchRockProperties (id,mode) {
//   return fetch(`rock_property/?rock_id=${id}&format=json`)
// }
// export function fetchRockSynonyms (id,mode) {
//   return fetch(`rock_synonym/?rock_id=${id}&format=json`)
// }
// export function fetchRockReferences (id,mode) {
//   return fetch(`rock_reference/?rock_id=${id}&format=json`)
// }
// export function fetchRockLocalities (id,mode) {
//   return fetch(`rock_locality/?rock_id=${id}&format=json`)
// }
// export function fetchRockTreeByRockId (id,mode) {
//   return fetch(`rock_tree/?rock_id=${id}&format=json`)
// }
// export function fetchHierarchy (id,hierarchyString,clsId) {
//   return fetch(`rock_tree/?rock_id!=${id}&rock_id__in=${hierarchyString}&rock_classification_id=${clsId}&format=json`)
// }
// export function fetchRockTree (clsId,parentId,mode) {
//   return fetch(`rock_tree/?rock_classification_id=${clsId}&parent_id=${parentId}&rock__name__isnull=False&rock__name_en__isnull=False&format=json`)
// }
// export function fetchRockSiblings (clsId,id,mode) {
//   return fetch(`rock_tree/?rock_classification_id=${clsId}&parent_id=${id}&rock__name__isnull=False&rock__name_en__isnull=False&format=json`)
// }
// export function cntSpecimenCollection(id) {
//   return fetch(`solr/specimen/?fq=hierarchy_string_rock:${id}&rows=1&format=json`)
// }
// export function fetchSpecimenCollection (id,mode,searchParameters) {
//   let start = searchParameters.specimens.paginateBy*(searchParameters.specimens.page-1);
//   let orderBy = searchParameters.specimens.order === 'ASCENDING' ? searchParameters.specimens.sortBy + ' asc': searchParameters.specimens.sortBy + ' desc';
//   let isFq = searchParameters.specimens.onlyImgs === true || searchParameters.specimens.git === true || searchParameters.specimens.tug === true || searchParameters.specimens.elm === true
//   let fq = '';
//   if (isFq === true) {
//     fq += '&fq=';
//     fq += searchParameters.specimens.onlyImgs === true ? 'image_preview_url:[%27%27 TO *]':'';
//     if(searchParameters.specimens.git === true || searchParameters.specimens.tug === true || searchParameters.specimens.elm === true) {
//       if (searchParameters.specimens.onlyImgs === true) fq += '%20AND%20';
//       fq += 'acronym:';
//       fq += searchParameters.specimens.git === true ? 'GIT%20or':'';
//       fq += searchParameters.specimens.tug === true ? 'TUG%20or':'';
//       fq += searchParameters.specimens.elm === true ? 'ELM%20or':'';
//     }
//   }
//   return fetch(`solr/specimen/?fq=hierarchy_string_rock:${id}${fq}&rows=${searchParameters.specimens.paginateBy}&start=${start}&sort=${orderBy}&format=json`)
// }
// export function fetchSearch (name,mode) {
//   //return fetch(`rock/?multi_search=value:${name};fields:name,name_en;lookuptype:icontains&fields=id,name,name_en${applyMode(mode)}&format=json`)
//   return fetch(`rock/?sql=simple_rock_search&keyword=${name}${applyMode(mode)}&format=json`)
// }
// export function fetchLastChangedRocks (mode) {
//   //return fetch(`rock/?multi_search=value:${name};fields:name,name_en;lookuptype:icontains&fields=id,name,name_en${applyMode(mode)}&format=json`)
//   return fetch(`rock/?fields=id,name,name_en,name_ru,date_changed&paginate_by=5&page=1&order_by=-date_changed&format=json`)
// }
// export function fetchPhotoGallery (parentString,mode) {
//   return fetch(`rock/?sql=rock_photo_gallery&keyword=${parentString}&page=1&paginate_by=25&format=json`)
// }
// export function fetchMinerals (id,mode) {
//   return fetch(`rock_mineral/?rock_id=${id}&format=json`)
// }
// export function fetchMineralsByRock (id,mode) {
//   return fetch(`rock_mineral/?mineral__id=${id}&format=json`)
// }
// export function fetchRockPropertyType () {
//   return fetch(`rock_property_type/?order_by=-sort&format=json`)
// }
// export function fetchSearchByMineral (q,numberOfParams, mode) {
//   // return fetch(`rock_mineral/?mineral__id__in=${ids}${applyMode(mode,'=','rock__')}&fields=rock_id,rock__name,rock__name_en&format=json`)
//   return fetch(`rock/?sql=rock_mineral_search&keyword=${q}&paginate_by=${numberOfParams}${applyMode(mode)}&format=json`)
// }
// export function fetchSearchByChemicalElement (q, mode) {
//   // return fetch(`rock_mineral/?mineral__formula__icontains=${el}${applyMode(mode,'=','rock__')}&fields=rock_id,rock__name,rock__name_en&distinct=true&format=json`)
//   // return fetch(`rock_mineral/?${q}${applyMode(mode,'=','rock__')}&fields=rock_id,rock__name,rock__name_en&distinct=true&format=json`)
//   return fetch(`rock/?${q}${applyMode(mode,'=','')}&fields=id,name,name_en,name_ru&format=json`)
// }
// export function fetchMineralList () {
//   return fetch(`rock_mineral/?fields=mineral__id,mineral__name,mineral__name_en,mineral__name_ru&distinct=true&format=json`)
// }
// export function fetchChemicalElementList () {
//   return fetch(`rock_element/?fields=element,element__element,element__name,element__name_en,element__name_ru&distinct=true&format=json`)
// }
// export function fetchSearchByPropertyType (properties, numberOfParams) {
//   // properties = `(rp.property_type_id=9 AND rp.value_txt like '%kuld%') OR (rp.property_type_id=1 AND rp.value_min >= 2) OR (rp.property_type_id=2 AND rp.value_min >= 2)`;
//   // return fetch(`rock_property/?${properties}${applyMode(mode,'=','rock__')}&fields=rock_id,rock__name,rock__name_en,value_min,value_max,value_txt&format=json`)
//   return fetch(`rock/?sql=rock_property_search&keyword=${properties}&paginate_by=${numberOfParams}&format=json`)
// }
// export function fetchRockElement (id) {
//   return fetch(`rock_element/?rock=${id}&fields=element__element,content&order_by=-content&format=json`)
// }
