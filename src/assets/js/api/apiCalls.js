import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

const apiUrl = 'https://rwapi.geocollections.info/'

function fetch(child) {
  return new Promise((resolve, reject) => {
    Vue.http.get(apiUrl + child, {}).then(response => {
      resolve(response.body);
      console.log(response)
    }, errResponse => {
      console.log('ERROR: ' + JSON.stringify(errResponse));
      reject(errResponse)
    });
  });
}

function post(child) {
  return new Promise((resolve, reject) => {
    Vue.http.post(apiUrl + child, {}, {emulateJSON:true}).then(response => {
      resolve(response.body);
      // console.log(response)
    }, errResponse => {
      console.log('ERROR: ' + JSON.stringify(errResponse));
      reject(errResponse)
    });
  });
}

export function postLogin(data) {
  return post(`login/?user=${data.user}&pwd=${data.pwd}`)
}
