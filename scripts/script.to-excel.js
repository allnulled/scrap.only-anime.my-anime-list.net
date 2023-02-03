const { Parser } = require("@json2csv/plainjs");
const sort_properties = function sortObjectByKeyNameList(object, sortWith, fill_empty = undefined) {
    let keys;
    let sortFn;
    if (typeof sortWith === 'function') {
        sortFn = sortWith;
    } else {
        keys = sortWith;
    }
    let objectKeys = Object.keys(object);
    return (keys || []).concat(objectKeys.sort(sortFn)).reduce(function (total, key) {
        if (objectKeys.indexOf(key) !== -1) {
            total[key] = object[key];
        } else if(typeof fill_empty !== "undefined") {
            total[key] = fill_empty;
        }
        return total;
    }, Object.create(null));
};
const datos_json = Object.values(require(__dirname + "/../datos/animes.details.json"));
const datos_json_expandidos = [];
Expandir_y_corregir_datos: {
    for(let index_dato = 0; index_dato < datos_json.length; index_dato++) {
        const dato_anime = datos_json[index_dato];
        Arreglando_Duration: {
            if(dato_anime.Duration) {
                if(dato_anime.Duration === "Unknown") {
                    dato_anime.Duration = "-";
                }
            }
            if (!dato_anime.Duration) {
                dato_anime.Duration = "-";
            }
        }
        Arreglando_Rating: {
            if (dato_anime.Rating) {
                if (dato_anime.Rating === "None") {
                    dato_anime.Rating = "-";
                }
            }
            if (!dato_anime.Rating) {
                dato_anime.Rating = "-";
            }
        }
        Arreglando_Score: {
            if (dato_anime.Score) {
                if (typeof dato_anime.Score === "string") {
                    if(dato_anime.Score.startsWith("N/A")) {
                        dato_anime.Score = dato_anime.Score.replace("N/A", "");
                        dato_anime.Score = dato_anime.Score.replace("N/A1", "");
                        dato_anime.Score = dato_anime.Score.replace("N/A2", "");
                    }
                }
                if (!dato_anime.Score) {
                    dato_anime.Score = "-";
                }
            }
        }
        Arreglando_score: {
            if (dato_anime.score) {
                if (typeof dato_anime.score === "string") {
                    if(dato_anime.score.startsWith("N/A")) {
                        dato_anime.score = dato_anime.score.replace("N/A", "");
                        dato_anime.score = dato_anime.score.replace("N/A1", "");
                        dato_anime.score = dato_anime.score.replace("N/A2", "");
                    }
                }
                if (!dato_anime.score) {
                    dato_anime.score = "-";
                }
            }
        }
        Arreglando_Ranked: {
            if (dato_anime.Ranked) {
                if (typeof dato_anime.Ranked === "string") {
                    if (dato_anime.Ranked.startsWith("N/A")) {
                        dato_anime.Ranked = dato_anime.Ranked.replace("N/A", "");
                        dato_anime.Ranked = dato_anime.Ranked.replace("N/A1", "");
                        dato_anime.Ranked = dato_anime.Ranked.replace("N/A2", "");
                    }
                }
                if (!dato_anime.Ranked) {
                    dato_anime.Ranked = "-";
                }
                if(dato_anime.Ranked.startsWith("#")) {
                    dato_anime.Ranked = dato_anime.Ranked.replace("#", "");
                }
            }
        }
        Arreglando_Popularity: {
            if (dato_anime.Popularity) {
                if (typeof dato_anime.Popularity === "string") {
                    if(dato_anime.Popularity.startsWith("#")) {
                        dato_anime.Popularity = dato_anime.Popularity.replace("#", "");
                    }
                }
            }
        }
        delete dato_anime.score;
        const dato_anime_final = sort_properties(dato_anime, [
            "Original_title",
            "Title_in_English",
            "Title_in_Japanese",
            "Title_in_German",
            "Title_in_Spanish",
            "Title_in_French",
            "Genres",
            "Themes",
            "Popularity",
            "Rating",
            "Score",
            // "score",
            "Score_point",
            "Score_audience",
            "Source",
            "Episodes",
            "Synonyms",
            // "English",
            "Type",
            "Status",
            "Aired",
            "Producers",
            "Licensors",
            "Studios",
            "Duration",
            "Ranked",
            "Members",
            "Favorites",
            "Premiered",
            "Broadcast",
            "Demographics",
            "link",
            "description",
        ], "");
        datos_json_expandidos.push(dato_anime_final);
    }
}
try {
    const parser = new Parser();
    const datos_csv = parser.parse(datos_json_expandidos);
    require("fs").writeFileSync(__dirname + "/../datos/animes.details.csv", datos_csv, "utf8");
    console.log("OK.");
} catch (err) {
    console.error(err);
}