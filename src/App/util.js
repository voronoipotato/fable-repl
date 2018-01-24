// @ts-check

const KEY = 'fable-repl';

function parseQuery() {
    var query = window.location.hash.replace(/^\#\?/, '');

    if (!query) {
      return null;
    }

    return query.split('&').map(function(param) {
      var splitPoint = param.indexOf('=');

      return {
        key : param.substring(0, splitPoint),
        value : param.substring(splitPoint + 1)
      };
    }).reduce(function(params, param){
      if (param.key && param.value) {
        params[param.key] = decodeURIComponent(param.value);
      }
      return params;
    }, {});
}
function extractDocumentsFromGist(){
    var files = JSON.parse(this.response).files;
    var filterFileList = function(extension){
      let fileNames =  Object.keys(files)
      let firstFileName = fileNames.filter(function(x){return x.includes(extension)})[0]
      let file = files[firstFileName]
      if(typeof(file) == "undefined"){
        return ""
      }else{
        return file.content.trim()
      }
    }
    //grab the first fsharp file
    var code = filterFileList('.fs')
    //grab the first html file
    var html = filterFileList('.htm')
    saveState(code, html)
}
function getGist(id){
    var apiUrl = `https://api.github.com/gists/${id}`
    var r = new XMLHttpRequest();
    r.onload = extractDocumentsFromGist
    r.open("GET", apiUrl, true);
    r.send();
}

function updateQuery(object) {
    var query = Object.keys(object).map(function(key){
      return key + '=' + encodeURIComponent(object[key]);
    }).join('&');

    window.location.hash = '?' + query;
}

export function loadState() {
    var state = JSON.parse(window.localStorage.getItem(KEY)) || {};
    Object.assign(state, parseQuery());
    return [state.code || 'printfn "Hello World"', state.html || '<html><body></body></html>'];
}

export function saveState(code, html) {
    var state = { code, html };
    updateQuery(state);
    window.localStorage.setItem(KEY, JSON.stringify(state));
}