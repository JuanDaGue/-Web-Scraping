// extract 
(async () => {
  let out = {};
  if (typeof pass_it == "undefined") pass_it = {};
  if (!pass_it["cont"]) {
    out["pass_it"] = {
      "cont": 1, 
      "jobs": 0,
      "totalJobs": 0
    };
  } else {
    out["pass_it"] = pass_it;
  }
  try {
    let jobs = [];
    const resp = await fetch(url, {  
      "headers": {}
      });
    const data = await resp.json(); 
//    let div = document.createElement('div');
//    div.innerHTML = data;
    const json_jobs = data.searchResults.hits.hits;
    out["pass_it"]["jobs"] = data.searchResults.hits.total; // stop condition
    out["pass_it"]["totalJobs"] = out["pass_it"]["totalJobs"] + json_jobs.length; // all jobs
    for (i in json_jobs) {
      let job = {}; /*init*/
      let elem = json_jobs[i];
      job.title = elem.positionOfTitle;
      job.location = elem.positionOfLocation;
      job.url = elem.positionOfUrl;   
      job.reqid = elem.positionOfid; 
      //job.source_location = elem.positionOfsource_location;
      //job.street_location = elem.positionOfstreet_location;
      //job.dateposted_raw = elem.positionOfdateposted_raw;
      //job.dateclosed_raw = elem.positionOf.dateposted_raw;
      //job.logo = elem.positionOflogo;
      //job.source_apply_email = elem.positionOfemail;
      //job.source_empname = elem.positionOfempname;
      //job.source_jobtype = elem.positionOfJobtype;
      //job.source_salary = elem.positionOfsalary;
      job.temp = "1";
      jobs.push(job);
    }
    out["jobs"] = jobs;
    return out;
  } catch (err) {
      throw err;
    // handle errors with fetch petion here
    //console.log(err)
  }
})();

// description 
(async () => {
    let out = {};
    try {
      const resp = await fetch(url, {  
        "headers": {}
        });
      const data = await resp.text();
        let div = document.createElement('div');
      div.innerHTML = data;
      out["job"] = job;
      return out;
    } catch (err) {
        throw err;
  
    }
  })();

  function removeTextBefore(html, text, flag) {
    var newHtml = html;
    if (newHtml.indexOf(text) > -1) {
        newHtml = newHtml.split(text).pop();
        if (!flag) {
            newHtml = "<h3>" + text + "</h3>" + newHtml;
        }
    }
    return newHtml;
}

function removeTextAfter(html, text, flag) {
    var newHtml = html;
    if (newHtml.indexOf(text) > -1) {
        newHtml = newHtml.split(text).shift();
        if (!flag) {
            newHtml = newHtml + "<p>" + text + "</p>";
        }
    }
    return newHtml;
}