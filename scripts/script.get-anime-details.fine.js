const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const carpeta_ficheros_separados = path.resolve(__dirname + "/../datos/pages");

Unificar_ficheros_separados_en_1_carpeta: {
    let ultima_carpeta = 0;
    let ultimo_fichero = 0;
    try {
        const otras_carpetas = [
            /*
            path.resolve(__dirname + "/../datos/pages.ok"),
            path.resolve(__dirname + "/../datos/pages.ok.2"),
            path.resolve(__dirname + "/../datos/pages.ok.3"),
            //*/
        ];
        for(let index_carpetas = 0; index_carpetas < otras_carpetas.length; index_carpetas++) {
            const otra_carpeta = otras_carpetas[index_carpetas];
            ultima_carpeta = otra_carpeta;
            const otros_ficheros = fs.readdirSync(otra_carpeta);
            for(let index_ficheros = 0; index_ficheros < otros_ficheros.length; index_ficheros++) {
                const otro_fichero = otros_ficheros[index_ficheros];
                ultimo_fichero = otro_fichero;
                const ruta_fichero_origen = path.resolve(otra_carpeta, otro_fichero);
                const ruta_fichero_destino = path.resolve(carpeta_ficheros_separados, otro_fichero);
                fs.moveSync(ruta_fichero_origen, ruta_fichero_destino);
            }
        }
    } catch (error) {
        console.log("Error al unificar ficheros separados (no es necesariamente grave):");
        console.log(`  [*] Carpeta: ${ultima_carpeta}`);
        console.log(`  [*] Fichero: ${ultimo_fichero}`);
        console.log(error);
    }
}

const ficheros_separados = fs.readdirSync(carpeta_ficheros_separados);
const all_anime_data = {};

Afinar_datos_de_ficheros: {
    for (let index = 0; index < ficheros_separados.length; index++) {
        if(index === 3000) break Afinar_datos_de_ficheros;
        console.log(`Processing file ${index} out of ${ficheros_separados.length}`);
        const ruta_fichero_separado = path.resolve(carpeta_ficheros_separados, ficheros_separados[index]);
        const anime_data = JSON.parse(fs.readFileSync(ruta_fichero_separado).toString());
        const anime_title = Object.keys(anime_data)[0];
        const anime_detalles = anime_data[anime_title];
        const { link, h1_edit_info, left_side, stats_block, description } = anime_detalles;
        const data_1 = (() => {
            const $ = cheerio.load(h1_edit_info);
            const title_original = $(".title-name").first().text();
            const title = $(".title-english").first().text();
            return { title_original, title };
        })();
        const data_2 = (() => {
            const $ = cheerio.load(left_side);
            const all_data_2 = {};
            $(".spaceit_pad").each(function () {
                try {
                    let [key, value] = $(this).text().trim().replace(/[\n\r]+/g, "\n").replace(/[\n\r\t ]+/g, " ").split(":").map(t => t.trim());
                    if(key === "Theme") {
                        key = "Themes";
                    } else if (key === "Genre") {
                        key = "Genres";
                    } else if (key === "Demographic") {
                        key = "Demographics";
                    }
                    if (key === "Ranked") {
                        value = value.replace(" 2 based on the top anime page. Please note that 'Not yet aired' and 'R18+' titles are excluded.", "");
                    } else if (key === "Members") {
                        value = value.replace(",", "");
                    } else if (key === "Score") {
                        // // Anterior:
                        // value = value.replace(" 1 indicates a weighted score.", "");
                        // // Actual:
                        try {
                            const ratingCount = $(this).find("[itemprop='ratingCount']").text();
                            const ratingValue = $(this).find("[itemprop='ratingValue']").text();
                            value = `${ratingValue} (scored by ${ratingCount} users)`;
                            all_data_2["Score_point"] = ratingValue;
                            all_data_2["Score_audience"] = ratingCount;
                        } catch (error) {
                            value = "-";
                        }
                    } else if (key === "Themes") {
                        value = [];
                        $(this).find("[itemprop='genre']").each(function() {
                            value.push($(this).text().trim().replace(/[\n\r]+/g, "\n").replace(/[\n\r\t ]+/g, " "));
                        });
                        value = value.join(" | ");
                    } else if (key === "Genres") {
                        value = [];
                        $(this).find("[itemprop='genre']").each(function () {
                            value.push($(this).text().trim().replace(/[\n\r]+/g, "\n").replace(/[\n\r\t ]+/g, " "));
                        });
                        value = value.join(" | ");
                    } else if (key === "Demographics") {
                        value = [];
                        $(this).find("[itemprop='genre']").each(function () {
                            value.push($(this).text().trim().replace(/[\n\r]+/g, "\n").replace(/[\n\r\t ]+/g, " "));
                        });
                        value = value.join(" | ");
                    } else if(key === "Duration") {
                        // value = value.replace("min. per ep.", "").replace("min.", "").trim();
                    }
                    all_data_2[key] = value.trim();
                } catch (error) { }
            });
            return all_data_2;
        })();
        const data_3 = (() => {
            const $ = cheerio.load(stats_block);
            const all_data_3 = {};
            try {
                all_data_3.score = $(".score-label").text().trim();
            } catch (error) { }
            try {
                all_data_3.score_users = $(".score").attr("data-users").replace(/ user(s)?/g, "");
            } catch (error) { }
            return all_data_3;
        })();
        const data_4 = (() => {
            return { description: cheerio.load(description).text().replace(/[\n\r]+/g, "\n").replace(/[\n\r\t ]+/g, " ").trim() };
        })();
        const final_data = Object.assign({}, data_1, data_2, data_3, data_4, { link });
        Ultimas_modificaciones: {
            // break Ultimas_modificaciones;
            final_data.Title_in_English = final_data.title || "";
            final_data.Title_in_Japanese = final_data.Japanese || "";
            final_data.Title_in_German = final_data.German || "";
            final_data.Title_in_Spanish = final_data.Spanish || "";
            final_data.Title_in_French = final_data.French || "";
            final_data.Original_title = final_data.title_original || "";
            delete final_data.title;
            delete final_data.English;
            delete final_data.Japanese;
            delete final_data.German;
            delete final_data.Spanish;
            delete final_data.French;
            delete final_data.title_original;
        }
        all_anime_data[anime_title] = final_data;
    }
}

const fichero_all_anime = path.resolve(__dirname + "/../datos/animes.details.json");
fs.writeFileSync(fichero_all_anime, JSON.stringify(all_anime_data, null, 2), "utf8");
console.log("OK.");