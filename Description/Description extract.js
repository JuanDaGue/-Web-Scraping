let div = document.createElement('div');
div.innerHTML = getDescription(job.url);
//let loc = div.querySelector("iframe#workbuster_iframe")
//funcion
function getDescription(url) {
  var xhrrequest = new XMLHttpRequest();
  xhrrequest.open("GET", url, false); //URL del ajax que trae la información del job
  var response = "";
  xhrrequest.onreadystatechange = function() {
      if(xhrrequest.readyState == 4 && xhrrequest.status == 200) {
          response = xhrrequest.responseText;
      }
  };
  xhrrequest.send();
  return response;
}

