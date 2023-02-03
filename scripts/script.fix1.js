const fs = require("fs");
const path = require("path");
const animes_file = path.resolve(__dirname, "..", "datos/animes.json");

const all_animes = JSON.parse(fs.readFileSync(animes_file).toString())
Object.keys(all_animes).forEach(id => {
    all_animes[id].rank = all_animes[id].rank.trim();
});
fs.writeFileSync(animes_file, JSON.stringify(all_animes, null, 2), "utf8");