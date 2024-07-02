(function() {
	var out = {};
     var html_jobs = document.querySelectorAll(".job_listings>.job_listing");
  	var jobs = [];for(var x in html_jobs){
    	if(typeof html_jobs[x] =="function") continue;
      	if(typeof html_jobs[x] =="number") continue;
    	var job = {};
    	var elem = html_jobs[x];
    	job.title = elem.querySelector("a .position").textContent.trim();
    	job.url = elem.querySelector("a").href.trim();
    	job.source_location = elem.querySelector("a .location").textContent.trim();
    	job.location = elem.querySelector("a .location").textContent.trim();
        job.dateposted_raw = elem.querySelector(".date time").getAttribute('datetime').trim();
        job.logo = elem.querySelector(".company_logo").getAttribute("src").trim();
		//job.source_apply_email = elem.querySelector("").textContent.trim();
		//job.source_empname = elem.querySelector("").textContent.trim();
		job.source_jobtype = elem.querySelector(".job-type")?.textContent.trim();
        job.reqid=elem.getAttribute('class').split(` `)[0].split(`-`).pop()
		//job.source_salary = elem.querySelector("").textContent.trim();
       	job.temp = 1;
    	jobs.push(job);
  	} 
  
	out["jobs"]= jobs;
  	return out;
})();