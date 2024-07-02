(function() {
  var out = {};
  var html_jobs = document.querySelectorAll(".data-row");
  var jobs = [];for(var x in html_jobs){
    if(typeof html_jobs[x] =="function") continue;
    if(typeof html_jobs[x] =="number") continue;
    var job = {};
    var elem = html_jobs[x];
    job.title = elem.querySelector("a").textContent.trim();
    job.url = elem.querySelector("a").href.trim();
    job.reqid = job.url.match(/\d+/gi).pop()
    //msg(job.reqid)
    job.source_location = elem.querySelector(".jobLocation").textContent.trim();
    job.location = elem.querySelector(".jobLocation").textContent.trim() ;
    if(job.location.search(/home/gi) > -1){
      job.location = "Nashville, TN"
    }
    job.dateposted_raw = formatDate(elem.querySelector(".jobDate").textContent.trim()," ",0,1,2)
    //job.logo = elem.querySelector("").getAttribute("src").trim();
    //job.source_apply_email = elem.querySelector("").textContent.trim();
    //job.source_empname = elem.querySelector("").textContent.trim();
    //job.source_jobtype = elem.querySelector("").textContent.trim();
    //job.source_salary = elem.querySelector("").textContent.trim();
    job.temp = 11058;
    jobs.push(job);
  } 

  out["jobs"]= jobs;
  return out;
})();
function formatDate(get_date, sC, pMes, pDia, pAno) {  //Ingreso String con fecha;caracter separador;posicion Mes, Dia y Año   get_date = get_date.replace(/\,/g,"").trim();
    let monthJob = get_date.split(sC)[pMes].substring(0,3).trim().toLowerCase();
    let dia = parseInt(get_date.split(sC)[pDia],10); dia = dia<10?'0'+dia:dia;
    let dateEN = {"jan":"01","feb":"02","mar":"03","apr":"04","may":"05","jun":"06","jul":"07","aug":"08","sep":"09","oct":"10","nov":"11","dec":"12"}
    typeof dateEN[monthJob]!='undefined'?monthJob = dateEN[monthJob]:monthJob= parseInt(monthJob,10)<10?'0'+monthJob:monthJob;
   return monthJob+"/"+dia+"/"+get_date.split(sC)[pAno].trim();
 }
