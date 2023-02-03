# scrap.my-anime-list.net

Scrap del site my-anime-list.net, sólo para animes (no mangas). Más de 23.000 obras de anime recopiladas. 

## Explicación

El scrap ha sido realizado con:
 - Script de servidor:
   - El módulo de NPM: [axios](https://www.npmjs.com/package/axios).
   - El módulo de NPM: [cheerio](https://www.npmjs.com/package/cheerio).
   - El módulo de NPM: [@json2csv/plainjs](https://www.npmjs.com/package/@json2csv/plainjs).
 - Script de cliente:
   - El script de [`./scripts/script.get-all-animes.js`](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/blob/main/scripts/script.get-all-animes.js). Para recoger la lista inicial de animes.
   - El script de [`./scripts/script.get-anime-details.brute.js`](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/blob/main/scripts/script.get-anime-details.brute.js). Para obtener las partes del HTML interesantes de cada anime.
   - El script de [`./scripts/script.get-anime-details.fine.js`](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/blob/main/scripts/script.get-anime-details.fine.js). Para afinar la información recogida del script anterior.
   - El script de [`./scripts/script.to-excel.js`](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/blob/main/scripts/script.to-excel.js). Para adaptar los datos a tipo Excel.

### Pasos

A continuación se detallan los pasos seguidos para efectuar este scrap. Los pasos se identifican con *scripts*, aplicados progresivamente, con previas pruebas para asegurar la efectividad de cada uno. Estos son:

 - [`./scripts/script.get-all-animes.js`](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/blob/main/scripts/script.get-all-animes.js). Con este script, integrado en [Greasemonkey](#), cogemos todos los títulos y links.
 - [`./scripts/script.get-anime-details.brute.js`](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/blob/main/scripts/script.get-anime-details.brute.js). Con este script, y en un segundo momento, visitamos todos los títulos, y sólo extraemos las partes del documento HTML que sabemos que contienen, de forma ofuscada, la información que nos interesa. Las descargamos en ficheros separados, en la carpeta [./datos/pages/](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/tree/main/datos) para aislar la información interesante posteriormente. Los ficheros aquí descargados se han omitido para no ensuciar el repositorio.
 - [`./scripts/script.get-anime-details.fine.js`](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/blob/main/scripts/script.get-anime-details.fine.js). Con este script, y en un tercer momento, repasamos todos los ficheros descargados, y comprobamos que, efectivamente, podemos localizar y aislar la información interesante, exclusivamente. También unificamos esta información en un nuevo fichero, [datos/animes.details.json](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/blob/main/datos/animes.details.json).
 - [`./scripts/script.to-excel.js`](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/blob/main/scripts/script.to-excel.js). Finalmente, con este script generamos un fichero *.csv con la información interesante, ordenada.

## Notas

Para la realización de este scrap hemos usado scripts que usan [axios](https://www.npmjs.com/package/axios) y [cheerio](https://www.npmjs.com/package/cheerio), principalmente. Posteriormente, hemos usado la librería [@json2csv/plainjs](https://www.npmjs.com/package/@json2csv/plainjs) para pasar los datos de JSON a CSV.

Notas finales:

 - Las imágenes se han obviado para no molestar demasiado a los servidores de [my-anime-list.net](https://myanimelist.net).
 - Los ficheros JSON del proceso del scrap han sido ignorados para no sobrecargar el repositorio.
 - Igualmente, los datos recopilados están en formato JSON en:
   - [./datos/animes.details.json](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/blob/main/datos/animes.details.json) en formato JSON.
   - [./datos/animes.details.csv](https://github.com/allnulled/scrap.only-anime.my-anime-list.net/blob/main/datos/animes.details.csv) en formato CSV.