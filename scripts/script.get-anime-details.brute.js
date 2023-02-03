const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const animes_data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "datos/animes.json")).toString());
const get_current_details_file_path = counter => path.resolve(__dirname, "..", `datos/pages/animes.details.${counter}.json`);
const simply_wait = time => new Promise(ok => setTimeout(ok, time));
const export_data = (exported_data, counter) => {
    const animes_details_file = get_current_details_file_path(counter);
    const json_data = {};
    Object.assign(json_data, exported_data);
    fs.writeFileSync(animes_details_file, JSON.stringify(json_data, null, 2), "utf8");
};
const start = async function () {
    try {
        const animes_data_keys = Object.keys(animes_data);
        const max_counter = animes_data_keys.length;
        for (let counter = 0; counter < max_counter; counter++) {
            const anime_id = animes_data_keys[counter];
            const anime_data = animes_data[anime_id];
            console.log(`${counter} out of ${max_counter} [${(Math.round((counter / max_counter) * 100))}%] - ${anime_data.title}`);
            const response = await axios.get(anime_data.link);
            const $ = cheerio.load(response.data);
            const left_side = (() => {
                try {
                    return $(".leftside").html();
                } catch(error) {
                    return null;
                }
            })();
            const h1_edit_info = (() => {
                try {
                    return $(".h1.edit-info").html();
                } catch(error) {
                    return null;
                }
            })();
            const stats_block = (() => {
                try {
                    return $(".stats-block").html();
                } catch(error) {
                    return null;
                }
            })();
            const description = (() => {
                try {
                    return $("[itemprop='description']").html();
                } catch(error) {
                    return null;
                }
            })();
            const page_data = {};
            Object.assign(page_data, {
                [anime_id]: {
                    link: anime_data.link,
                    left_side,
                    h1_edit_info,
                    stats_block,
                    description
                }
            });
            export_data(page_data, counter);
            await simply_wait(100);
        }
    } catch (error) {
        console.log("Error:", error);
    }
};

start().then(() => console.log("OK."));