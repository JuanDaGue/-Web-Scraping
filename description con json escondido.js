// description con json escondido

(function() {
    var out = {};
    var job = {};
    var selector = '[data-role="job-content"] [class*="contentText-"]';
    var remove_selectors = ['a', 'script', 'i', 'img', 'style', 'button', 'figure', 'noscript', 'svg', 'form', 'input', 'iframe', 'link'];
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
    for (const a of document.querySelectorAll("section.section")) {
        if (a.textContent.includes("Wir bieten") || a.textContent.includes("Nous offrons:")) {
            job.source_benefit = a.textContent.trim();
            //console.log(job.source_benefit)
        } else {
            job.source_benefit = '';
        }
    }
    if (document.querySelector('.job-experience')) {
        job.experience_required = document.querySelector('.job-experience').textContent.trim();
    }
    job.html = full_html.innerHTML.trim();
    //job.html = removeTextBefore(job.html, 'Summary of Job Duties', false);
    job.html = removeTextAfter(job.html, 'Du-Kultur', true);
 
    job.html = cleanHTML(job.html);
    var tmp = document.createElement('div');
    tmp.innerHTML = job.html;
    job.jobdesc = tmp.textContent.trim();
    job.jobdesc = cleanHTML(job.jobdesc);
    if (document.querySelector('script[type="application/ld+json"]')) {
        html = document.querySelector('script[type="application/ld+json"]').textContent.trim().replace(/\s+/g, ' ').replace(/\@/gi, "");
        var json = JSON.parse(html);
        if (json.validThrough) {
            const [y, m, d] = json.validThrough.split('T').shift().split('-');
            job.dateclosed_raw = `${m}/${d}/${y}`;

        }
        let Loc = [];
        if (json.jobLocation?.address?.addressRegion) {
            Loc.push(json.jobLocation.address.addressRegion);
        }
        if (json.jobLocation?.address?.addressLocality) {
            Loc.push(json.jobLocation.address.addressLocality);
        }
        if (json.jobLocation?.address?.addressCountry) {
            Loc.push(json.jobLocation.address.addressCountry);
        }
        job.source_location = Loc.join(', ');
        job.location = Loc.join(', ');
        job.source_jobtype = json.employmentType[0];
        if (json.datePosted) {
            const [y, m, d] = json.datePosted.split('T').shift().split('-');
            job.dateposted_raw = `${m}/${d}/${y}`;

        }
    }
    if (job.jobdesc.search(/Wir bieten/) > -1) {
        job.source_benefit = job.jobdesc;
        job.source_benefit = removeTextBefore(job.source_benefit, `Wir bieten`, true);
        job.source_benefit = removeTextAfter(job.source_benefit, 'About Cosentino', true);
    }

    out["job"] = job;
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