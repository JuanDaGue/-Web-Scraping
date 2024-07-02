// https://www.talent.com/private/tools/content/scraper/spiderCodeTool.php?scanid=188710
(function() {
    var out = {};
    var html_jobs = document.querySelectorAll(".shmResultView div.shmJobResult");
    var jobs = [];
    for (var x in html_jobs) {
        if (typeof html_jobs[x] == "function") continue;
        if (typeof html_jobs[x] == "number") continue;
        var job = {};
        var elem = html_jobs[x];
        job.title = elem.querySelector(".shmJobItemUpper a").textContent.trim();
        job.url = elem.querySelector(".shmJobItemUpper a").href.trim();
        if (elem.querySelector(".shmLocation")) {
            job.source_location = elem.querySelector(".shmLocation").textContent.trim();
            job.location = elem.querySelector(".shmLocation").textContent.trim();
        } else {
            job.source_location = ``;
            job.location = `Perth, WA, AU`;
        }
        let date = elem.querySelector(".shmJobDetailsPanel .shmJobDateCreated")?.textContent.trim().split('/');
        if (date.length > 2) {
            job.dateposted_raw = `${date[0]}/${date[1]}/${date[2]}`
        }
        job.reqid = job.url.split('-').pop();
        job.temp = 1;
        jobs.push(job);
    }

    out["jobs"] = jobs;
    return out;
})();

(function () {
    var out = {};
    var selector = '.paginationjs-pages li  >a ';  // selector donde esta la paginacion
    if (typeof pass_it == "undefined") pass_it = {};
    if (!pass_it["cont"]) {
        out["pass_it"] = {
            "cont": 1
        };
    } else {
        out["pass_it"] = pass_it;
    }
    out["has_next_page"] = false;
    out["pass_it"].cont += 1;
    var all_elems = document.querySelectorAll(selector);
    [].forEach.call(all_elems, function (elemento) {
        if (elemento.textContent.trim() == out["pass_it"].cont) {
            //msg("click!!!!!"+elemento.textContent.trim());
            elemento.click();
            out["has_next_page"] = true;
        }
    });
    out["wait"] = true;
    return out;
})();

(function() {
    var out = {};
    var job = {};
    var selector = ".dmRespColsWrapper .wrapper .text-inner";
    var remove_selectors = [];
    //var job = pass_it["job"];
    var full_html = document.querySelector(selector);
    // remove something from the jobdatata
    if (remove_selectors.length > 0) remove_selectors.forEach(remove_selector => {
        if (full_html.querySelector(remove_selector)) full_html.querySelector(remove_selector).remove();
    });
    if (typeof cleanHTML == "undefined") cleanHTML = function(x) {
        return x
    };
    if (typeof msg == "undefined") msg = console.log;

    job.html = full_html.innerHTML.trim();
    //job.html = removeTextBefore(job.html, 'Summary of Job Duties', false);
    //job.html = removeTextAfter(job.html, 'Application Instructions', true);
    job.html = cleanHTML(job.html);
    var tmp = document.createElement('div');
    tmp.innerHTML = job.html;
    job.jobdesc = tmp.textContent.trim();
    job.jobdesc = cleanHTML(job.jobdesc);
    out["job"] = job;
    for (let tag of full_html.querySelectorAll('p')) {
        let text = tag.textContent.trim();
        if (text.match(/benefit|perks|why work|we offer/i) && tag.nextElementSibling?.tagName == "UL") {
            job.source_benefit = tag.nextElementSibling.textContent.trim();
            msg(job.source_benefit);
            break;
        }
    }
    for (const a of full_html.querySelectorAll('li')) {
        if (a.textContent.search(/Experience  |expérience | An experience|Expérience|expériences|experience/g) > -1 && a.textContent.search(/[0-9]/g) > -1 && a.textContent.search(/year/img) > -1) {
            job.experience_required = a.textContent.split('year')[0].trim() + ' Yrs';
            //msg(job.experience_required)
        }
    }
    for (const a of document.querySelectorAll(".dmRespCol .dmRespColsWrapper .dmRespCol")) {
        if (a.textContent.search("Employment Type:") > -1 && a.nextElementSibling) {
            job.source_jobtype = a.nextElementSibling.textContent.trim();
        }
    }
    return out;

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