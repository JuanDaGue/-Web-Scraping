CONFIG
/*
    Spider Config
        waitForPageText : YES  ⟢ ⊱⊱ ⟢ Este sera usado a modo de espera a que cargue la cantidad de jobs que posee el jobsite y para las descripciones
        waitForPageResources ⟢ ⊱⊱ ⟢ A criterio de cada indexador ( Comportamiento de la pagina)
        waitForPageResources ⟢ ⊱⊱ ⟢ A criterio de cada indexador ( Comportamiento de la pagina)
        noImage  ⟢ ⊱⊱ ⟢ Recomendado en YES
        skipResourceTypes  ⟢ ⊱⊱ ⟢ A criterio de cada indexador ( Comportamiento de la pagina)
    
        Jobsite 
            https://sigotora.jp/index.cfm?fuseaction=job.joblist&sort_data=recom&pstrw=1
        
        Spider
            https://www.talent.com/private/tools/content/scraper/spiderCodeTool.php?scanid=212783

        NOTA: Para este caso la paginacion no se presenta como un numero de pagina sino que un rango de jobs
                lo que quiere decir que cuando diga 1 quiere decir que estara trayendo los jobs del 1 hasta el 10
                cuando diga 11 traera los otros 10 jobs siguientes y asi sucesivamente, por eso es necesario
                saber cuantos jobs hay en total ya que esta sera nuestra condicion de parada
*/

EXTRACT

(async () => {
    let out = {}
    let jobs = [];

    out.pass_it = pass_it.page ? pass_it : {
        page: 1,//Pagina inicial
        iterance: 10, // Numero de paginas ⟢ ⊱⊱ ⟢ Para este caso es 10 lo que quiere decir que procesaremos 10 paginas al mismo tiempo en el promise.all ; no sobre cargar la cantidad de paginas ya que no se estaria optimizando la ejecucion
        limit: parseInt(document.querySelector("#main-wrap > div.main > nav:nth-child(1) > ul > li.hit > strong").textContent), // Extraemos la cantidad de jobs que muestra la pagina, ya que este sera nuestro condicion de parada
        continuar: true,
        jobsPerPAge : 10 // job por pagina , este sera utilizado para la paginacion
    }

    const stringToHTML = (str) => new DOMParser().parseFromString(str, 'text/html').body;

    const pageLink = []

    let i = 1;

    while (i <= out.pass_it.iterance) {//Se toma el valor iterance y se construyen las url
        pageLink.push(`https://sigotora.jp/index.cfm?fuseaction=job.joblist&pstrw=${out.pass_it.page}`)
        out.pass_it.page += out.pass_it.jobsPerPAge
        i++
    }

    if (out.pass_it.page >= out.pass_it.limit) { // Cuando superamos el valor de limit cambiamos el estado de continuar a false; de esta forma detenemos la paginacion
        out.pass_it.continuar = false
        jobs.push({
            title: "GHOST"
        })//El job fantasma es usado para que la herramienta no haga intentos innecesarios a paginas que no tienen jobs
    }


    await Promise.all(pageLink.map(async (url) => { // Recorremos cada uno de los links construidos para aplicar peticion fetch dentro del promiseAll
        try {
            //FETCh comun y corriente 
            const resp = await fetch(url, {
                "headers": {}
            });
            const data = await resp.text();

            let doc = document.createElement('div')
            doc.innerHTML = data


            let html_jobs = doc.querySelectorAll('#main-wrap > div.main > div')

            // msg('\033[42m peticion realizada')
            // msg(url)
            // msg(html_jobs)

            for (var x in html_jobs) {
                if (typeof html_jobs[x] == "function") continue;
                if (typeof html_jobs[x] == "number") continue;
                var job = {};
                var elem = html_jobs[x];
                job.title = elem.querySelector("p.h2.main-title").textContent.trim();
                if (elem.querySelector("div > a.detail")) //{
                    job.url = elem.querySelector("div > a.detail").href.trim();
                if (elem.querySelector("tbody > tr:nth-child(3) > td")) {
                    job.source_location = elem.querySelector("tbody > tr:nth-child(3) > td").textContent.trim();
                    job.location = job.source_location
                } else {
                    job.source_location = ""
                    job.location = "日本";
                }

                if (job.location.indexOf('北海道') > -1) {
                    job.location = "北海道 北海道";
                } //Hokkaido
                if (job.location.indexOf('関東') > -1) {
                    job.location = "関東";
                } //Kanto
                if (job.location.indexOf('中部') > -1) {
                    job.location = "中部";
                } //Chubu
                if (job.location.indexOf('近畿') > -1) {
                    job.location = "近畿";
                } //Kinki
                if (job.location.indexOf('中国') > -1) {
                    job.location = "中国";
                } //Chugoku
                if (job.location.indexOf('四国') > -1) {
                    job.location = "四国";
                } //Shigoku
                if (job.location.indexOf('九州・沖縄') > -1) {
                    job.location = "九州・沖縄";
                } //Kyushu y Okinawa
                if (job.location.indexOf('青森') > -1) {
                    job.location = "青森 東北地方";
                } //Aomori
                if (job.location.indexOf('岩手') > -1) {
                    job.location = "岩手 東北地方";
                } //Iwate
                if (job.location.indexOf('宮城') > -1) {
                    job.location = "宮城 東北地方";
                } //Miyagi
                if (job.location.indexOf('秋田') > -1) {
                    job.location = "秋田 東北地方";
                } //Akita
                if (job.location.indexOf('山形') > -1) {
                    job.location = "山形 東北地方";
                } //Yamagata
                if (job.location.indexOf('福島') > -1) {
                    job.location = "福島 東北地方";
                } //Fukushima
                if (job.location.indexOf('茨城') > -1) {
                    job.location = "茨城 関東";
                } //Ibaraki
                if (job.location.indexOf('栃木') > -1) {
                    job.location = "栃木 関東";
                } //Tochigu
                if (job.location.indexOf('群馬') > -1) {
                    job.location = "群馬 関東";
                } //Gunma
                if (job.location.indexOf('埼玉') > -1) {
                    job.location = "埼玉 関東";
                } //Saitama
                if (job.location.indexOf('千葉') > -1) {
                    job.location = "千葉 関東";
                } //Chiba
                if (job.location.indexOf('東京') > -1) {
                    job.location = "東京 関東";
                } //Tokio
                if (job.location.indexOf('神奈川') > -1) {
                    job.location = "神奈川 関東";
                } //Kanagawa
                if (job.location.indexOf('新潟') > -1) {
                    job.location = "新潟 中部";
                } //Niigata
                if (job.location.indexOf('富山') > -1) {
                    job.location = "富山 中部";
                } //Toyama
                if (job.location.indexOf('石川') > -1) {
                    job.location = "石川 中部";
                } //Ishikawa
                if (job.location.indexOf('福井') > -1) {
                    job.location = "福井 中部";
                } //Fukui
                if (job.location.indexOf('沖縄') > -1) {
                    job.location = "沖縄 中部";
                } //Yamanashi
                if (job.location.indexOf('長野') > -1) {
                    job.location = "長野 中部";
                } //Nagano
                if (job.location.indexOf('岐阜') > -1) {
                    job.location = "岐阜 中部";
                } //Gifu
                if (job.location.indexOf('静岡') > -1) {
                    job.location = "静岡 中部";
                } //Shizuika
                if (job.location.indexOf('愛知') > -1) {
                    job.location = "愛知 中部";
                } //Aichi
                if (job.location.indexOf('三重') > -1) {
                    job.location = "三重 近畿";
                } //Mie
                if (job.location.indexOf('滋賀') > -1) {
                    job.location = "滋賀 近畿";
                } //Shiga
                if (job.location.indexOf('京都') > -1) {
                    job.location = "京都 近畿";
                } //Kyoto
                if (job.location.indexOf('大阪') > -1) {
                    job.location = "大阪 近畿";
                } //Osaka
                if (job.location.indexOf('兵庫') > -1) {
                    job.location = "兵庫 近畿";
                } //Hyogo
                if (job.location.indexOf('奈良') > -1) {
                    job.location = "奈良 近畿";
                } //Nara
                if (job.location.indexOf('和歌山県') > -1) {
                    job.location = "和歌山県 近畿";
                } //Wakayama
                if (job.location.indexOf('鳥取') > -1) {
                    job.location = "鳥取 中国";
                } //Tottori
                if (job.location.indexOf('島根') > -1) {
                    job.location = "島根 中国";
                } //Shimane
                if (job.location.indexOf('岡山') > -1) {
                    job.location = "岡山 中国";
                } //Okayama
                if (job.location.indexOf('広島') > -1) {
                    job.location = "広島 中国";
                } //Hiroshima
                if (job.location.indexOf('山口') > -1) {
                    job.location = "山口 中国";
                } //Yamaguchi
                if (job.location.indexOf('徳島') > -1) {
                    job.location = "徳島 四国";
                } //Tokushima
                if (job.location.indexOf('香川') > -1) {
                    job.location = "香川 四国";
                } //Kagawa
                if (job.location.indexOf('愛媛') > -1) {
                    job.location = "愛媛 四国";
                } //Ehime
                if (job.location.indexOf('高知') > -1) {
                    job.location = "高知 四国";
                } //Kochi
                if (job.location.indexOf('福岡') > -1) {
                    job.location = "福岡 九州・沖縄";
                } //Fukuoka
                if (job.location.indexOf('佐賀') > -1) {
                    job.location = "佐賀 九州・沖縄";
                } //Saga
                if (job.location.indexOf('長崎') > -1) {
                    job.location = "長崎 九州・沖縄";
                } //Nagasaki
                if (job.location.indexOf('熊本') > -1) {
                    job.location = "熊本 九州・沖縄";
                } //Kumamoto
                if (job.location.indexOf('大分') > -1) {
                    job.location = "大分 九州・沖縄";
                } //Oita
                if (job.location.indexOf('宮崎') > -1) {
                    job.location = "宮崎 九州・沖縄";
                } //Miyazaki
                if (job.location.indexOf('鹿児島') > -1) {
                    job.location = "鹿児島 九州・沖縄";
                } //Kagoshima
                job.location = job.location.replace(/無料シャトルバス/gi, "").trim();
                job.location = job.location.replace(/店舗所在/gi, "").trim();
                job.location = job.location.replace(/の営業所/gi, "").trim();
                job.location = job.location.replace(/から徒歩/gi, "").trim();
                job.location = job.location.replace(/より徒歩/gi, "").trim();
                job.location = job.location.replace(/地下鉄/gi, "").trim();
                job.location = job.location.replace(/アクセス/gi, "").trim();
                job.location = job.location.replace(/ください/gi, "").trim();
                job.location = job.location.replace(/本社お/gi, "").trim();
                job.location = job.location.replace(/を参照/gi, "").trim();
                job.location = job.location.replace(/が最寄/gi, "").trim();
                job.location = job.location.replace(/オフィス/gi, "").trim();
                job.location = job.location.replace(/住所 /gi, "").trim();
                job.location = job.location.replace(/その他/gi, "").trim();
                job.location = job.location.replace(/メトロ/gi, "").trim();
                job.location = job.location.replace(/時間/gi, "").trim();
                job.location = job.location.replace(/本社/gi, "").trim();
                job.location = job.location.replace(/直結/gi, "").trim();
                job.location = job.location.replace(/以内/gi, "").trim();
                job.location = job.location.replace(/程度/gi, "").trim();
                job.location = job.location.replace(/による/gi, "").trim();
                job.location = job.location.replace(/無料/gi, "").trim();
                job.location = job.location.replace(/勤務/gi, "").trim();
                job.location = job.location.replace(/で約/gi, "").trim();
                job.location = job.location.replace(/バス/gi, "").trim();
                job.location = job.location.replace(/など/gi, "").trim();
                job.location = job.location.replace(/ビル/gi, "").trim();
                job.location = job.location.replace(/より/gi, "").trim();
                job.location = job.location.replace(/中国/gi, "").trim();
                job.location = job.location.replace(/各/gi, "").trim();
                job.location = job.location.replace(/■/gi, "").trim();
                job.location = job.location.replace(/★/gi, "").trim();
                job.location = job.location.replace(/☆/gi, "").trim();
                job.location = job.location.replace(/：/gi, "").trim();
                job.location = job.location.replace(/！/gi, "").trim();
                job.location = job.location.replace(/▼/gi, "").trim();
                job.location = job.location.replace(/◆/gi, "").trim();
                job.location = job.location.replace(/◇/gi, "").trim();
                job.location = job.location.replace(/♪/gi, "").trim();
                job.location = job.location.replace(/＜/gi, "").trim();
                job.location = job.location.replace(/＞/gi, "").trim();
                job.location = job.location.replace(/／/gi, "").trim();
                job.location = job.location.replace(/－/gi, "").trim();
                job.location = job.location.replace(/━/gi, "").trim();
                job.location = job.location.replace(/-/gi, "").trim();
                job.location = job.location.replace(/ＪＲ/gi, "").trim();
                job.location = job.location.replace(/欄/gi, "").trim();
                job.location = job.location.replace(/朝/gi, "").trim();
                job.location = job.location.replace(/JR/gi, "").trim();
                job.location = job.location.replace(/線/gi, "").trim();
                job.location = job.location.replace(/駅/gi, "").trim();
                job.location = job.location.replace(/分/gi, "").trim();
                job.location = job.location.replace(/地/gi, "").trim();
                job.location = job.location.replace(/〒/gi, "").trim();
                job.location = job.location.replace(/0/gi, "").trim();
                job.location = job.location.replace(/1/gi, "").trim();
                job.location = job.location.replace(/2/gi, "").trim();
                job.location = job.location.replace(/3/gi, "").trim();
                job.location = job.location.replace(/4/gi, "").trim();
                job.location = job.location.replace(/5/gi, "").trim();
                job.location = job.location.replace(/6/gi, "").trim();
                job.location = job.location.replace(/7/gi, "").trim();
                job.location = job.location.replace(/8/gi, "").trim();
                job.location = job.location.replace(/9/gi, "").trim();
                job.location = job.location.split("※");
                job.location = job.location[0];
                job.location = job.location.split("、");
                job.location = job.location[0];
                job.location = job.location.split("・");
                job.location = job.location[0];
                job.location = job.location.split(",");
                job.location = job.location[0];

                if (job.location.length < 1) {
                    job,
                    source_location = ""
                    job.location = "日本";
                }
                else {
                    job.location = job.location + " 日本";
                }
                //job.dateposted_raw = elem.querySelector("").textContent.trim();
                //job.logo = elem.querySelector("").getAttribute("src").trim();
                //job.source_apply_email = elem.querySelector("").textContent.trim();
                //job.source_empname = elem.querySelector("").textContent.trim();
                //job.source_jobtype = elem.querySelector("").textContent.trim();
                if (elem.querySelector("tbody > tr:nth-child(5) > td")) {
                    job.source_salary = elem.querySelector("tbody > tr:nth-child(5) > td").textContent.trim();
                }

                job.reqid = elem.querySelector('p[class="number"]').textContent.trim();
                job.temp = 1012167;
                jobs.push(job);
            }

        } catch (e) {
            throw e
        }

    }))
    out.jobs = jobs
    return out
})()

/**
 * 
 * @param {object} out  Objeto tipo JSON a imprimir por pantalla
 */
function printJob(out) {
    let claves = Object.keys(out);
    msg(`\n \x1b[31m INICIO JOB.....\x1b[39m`)
    for (let i = 0; i < claves.length; i++) {
        let clave = claves[i];
        msg(`${"\x1b[32m" + claves[i]}:`)
        msg(out[clave])
    }
    msg(`\x1b[31m FIN JOB.....\n \x1b[39m`)
}


PAGINATION

(()=>{return{has_next_page:pass_it.continuar}})()

DESCRIPTION

// Descripcion convencional o fetch segun cada caso : Lo que requiera el caso trabajado