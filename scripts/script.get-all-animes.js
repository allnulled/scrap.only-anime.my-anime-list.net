const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const animes_file = path.resolve(__dirname, "..", "datos/animes.json");
const simply_wait = time => new Promise(ok => setTimeout(ok, time));
const export_data = exported_data => {
    const json_data = JSON.parse(fs.readFileSync(animes_file).toString());
    Object.assign(json_data, exported_data);
    fs.writeFileSync(animes_file, JSON.stringify(json_data, null, 2), "utf8");
};
const start = async function() {
    try {
        let counter = 0;
        while(counter < 24000) {
            console.log(counter + " out of " + 24000 + "[" + (Math.round((counter / 24000) * 100) ) + "%]");
            const response = await axios.get(`https://myanimelist.net/topanime.php?limit=${counter}`);
            const $ = cheerio.load(response.data);
            const tr_elements = $("tr.ranking-list");
            const page_data = {};
            tr_elements.each((index, value) => {
                const tr_element = $(value);
                const rank = tr_element.find(".rank").first().text().trim();
                const a_element = tr_element.find(".anime_ranking_h3 > a").first();
                const title = a_element.text();
                const link = a_element.attr("href");
                const score = tr_element.find("td.score .score-label").text();
                Object.assign(page_data, {
                    [title]: {
                        rank: rank,
                        title: title,
                        link: link,
                        score: score,
                    }
                });
            });
            export_data(page_data);
            counter += 50;
            await simply_wait(1000);
        }
    } catch(error) {
        console.log("Error:", error);
    }
};

start().then(() => console.log("OK."));