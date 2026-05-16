/**
 * coordenadasHerria.js
 * Coordenadas por barrio/auzoa y por ciudad para el dataset jaiak.
 * Clave normalizada: nombre en minúsculas sin acentos.
 */

export const PROVINCIA_CENTROIDES = {
    Araba:    { latitude: 42.8460, longitude: -2.6720 },
    Bizkaia:  { latitude: 43.2200, longitude: -2.7500 },
    Gipuzkoa: { latitude: 43.1500, longitude: -2.1500 },
    Nafarroa: { latitude: 42.7000, longitude: -1.6500 },
};

function norm(s) {
    return (s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// ── BARRIOS / AUZOAK ────────────────────────────────────────────────────────
// Claves en minúsculas normalizadas (sin acentos)
const BARRIOS = {
    // Bilbao
    'otxarkoaga':       { latitude: 43.2756, longitude: -2.9461 },
    'atxuri':           { latitude: 43.2569, longitude: -2.9150 },
    'irala':            { latitude: 43.2556, longitude: -2.9333 },
    'basurtu':          { latitude: 43.2433, longitude: -2.9289 },
    'zurbaran':         { latitude: 43.2606, longitude: -2.9264 },
    'abusu':            { latitude: 43.2900, longitude: -2.9178 },
    'erribera':         { latitude: 43.2561, longitude: -2.9272 },
    'santutxu':         { latitude: 43.2717, longitude: -2.9217 },
    'bilbao la vieja':  { latitude: 43.2578, longitude: -2.9244 },
    'san ignacio':      { latitude: 43.2617, longitude: -2.9494 },

    // Iruña / Pamplona
    'arrosadia / milagrosa':   { latitude: 42.8072, longitude: -1.6325 },
    'arrosadia':               { latitude: 42.8072, longitude: -1.6325 },
    'errotxapea / rochapea':   { latitude: 42.8267, longitude: -1.6433 },
    'errotxapea':              { latitude: 42.8267, longitude: -1.6433 },
    'lezkairu':                { latitude: 42.8033, longitude: -1.6194 },
    'azpilagaña':         { latitude: 42.7972, longitude: -1.6675 },
    'azpilagana':              { latitude: 42.7972, longitude: -1.6675 },
    'donibane / san juan':     { latitude: 42.8150, longitude: -1.6606 },

    // Donostia / San Sebastián
    'larratxoko auzoa':  { latitude: 43.3086, longitude: -1.9639 },
    'larratxo':          { latitude: 43.3086, longitude: -1.9639 },
    'herrera':           { latitude: 43.2950, longitude: -1.9700 },
    'portua':            { latitude: 43.3244, longitude: -1.9792 },

    // Vitoria-Gasteiz
    'txagorritxuko auzoa': { latitude: 42.8528, longitude: -2.6553 },
    'txagorritxu':         { latitude: 42.8528, longitude: -2.6553 },
    'salburua':            { latitude: 42.8272, longitude: -2.6358 },
    'aranbizkarra':        { latitude: 42.8517, longitude: -2.6878 },
    'gasteiz':             { latitude: 42.8467, longitude: -2.6726 },

    // Getxo
    'neguri':     { latitude: 43.3681, longitude: -3.0300 },
    'aixerrota':  { latitude: 43.3558, longitude: -3.0197 },

    // Getaria
    'balenziaga kalea': { latitude: 43.3006, longitude: -2.2022 },

    // Portugalete
    'la guia':   { latitude: 43.3261, longitude: -3.0197 },
    'replega':   { latitude: 43.3158, longitude: -3.0236 },

    // Ayala / Aiara
    'aginaga':  { latitude: 43.1058, longitude: -3.0708 },
    'quejana':  { latitude: 43.0733, longitude: -3.0425 },
    'lujo':     { latitude: 43.0922, longitude: -3.0261 },
    'sojo':     { latitude: 43.0783, longitude: -2.9972 },

    // Zierbena
    'kardeo':  { latitude: 43.3528, longitude: -3.0819 },
    'alanto':  { latitude: 43.3408, longitude: -3.0736 },

    // Pasaia
    'pasaia antxo': { latitude: 43.3350, longitude: -1.9344 },
    'trintxerpe':   { latitude: 43.3361, longitude: -1.9397 },

    // Amorebieta-Etxano
    'etxano': { latitude: 43.2028, longitude: -2.7208 },

    // Ezkio-Itsaso
    'itsaso-alegia':    { latitude: 43.0511, longitude: -2.3119 },
    'itsaso hirigunea': { latitude: 43.0542, longitude: -2.3025 },

    // Bidania-Goiatz
    'bidania': { latitude: 43.1608, longitude: -2.2083 },
    'goiatz':  { latitude: 43.1783, longitude: -2.1733 },

    // Tutera / Tudela
    'lourdes auzoa': { latitude: 42.0558, longitude: -1.6072 },

    // Durango
    'intxaurre kultur elkartea': { latitude: 43.1700, longitude: -2.6344 },

    // Basauri
    'basozelai': { latitude: 43.2417, longitude: -2.9006 },

    // Sestao barrios (all fall back to Sestao but separated a bit)
    'la punta': { latitude: 43.3033, longitude: -3.0033 },

    // Juslapeña
    'garciriain': { latitude: 42.8567, longitude: -1.7086 },
    'juslapena':  { latitude: 42.8500, longitude: -1.7333 },

    // Longuida
    'meoz':     { latitude: 42.7258, longitude: -1.3289 },
    'erdozain': { latitude: 42.7167, longitude: -1.3500 },
    'murillo':  { latitude: 42.7283, longitude: -1.3433 },
    'larrangoz':{ latitude: 42.7317, longitude: -1.3606 },

    // Arakil
    'urritzola': { latitude: 42.9417, longitude: -1.8633 },
    'izurdiaga': { latitude: 42.9283, longitude: -1.8561 },

    // Ezcabarte
    'oricain': { latitude: 42.8900, longitude: -1.6483 },
    'azoz':    { latitude: 42.8833, longitude: -1.6561 },

    // Ultzama
    'zenotz':           { latitude: 42.9950, longitude: -1.7800 },
    'gerendiain':       { latitude: 42.9917, longitude: -1.7700 },
    'gorrontz olano':   { latitude: 42.9867, longitude: -1.7617 },
    'urritzola-galain': { latitude: 42.9883, longitude: -1.7533 },
    'eltso':            { latitude: 42.9767, longitude: -1.7750 },

    // Guesálaz / Guesalaz
    'vidaurre': { latitude: 42.7033, longitude: -1.9083 },
    'irurre':   { latitude: 42.7117, longitude: -1.9167 },

    // Allín
    'galdeano': { latitude: 42.6483, longitude: -2.0361 },
    'arbeiza':  { latitude: 42.6533, longitude: -2.0206 },
    'echavarri':{ latitude: 42.6450, longitude: -2.0567 },
    'larrion':  { latitude: 42.6444, longitude: -2.0711 },

    // Anue
    'etsain':  { latitude: 43.0250, longitude: -1.6817 },
    'leazkue': { latitude: 43.0100, longitude: -1.6900 },

    // Larraun
    'errazkin': { latitude: 43.0083, longitude: -1.9283 },
    'oderitz':  { latitude: 42.9967, longitude: -1.9283 },
    'gorriti':  { latitude: 43.0133, longitude: -1.9417 },
    'iribas':   { latitude: 43.0000, longitude: -1.9583 },

    // Basaburua
    'orokieta':   { latitude: 43.0400, longitude: -1.8233 },
    'jauntsarats':{ latitude: 43.0267, longitude: -1.8317 },

    // Olóriz / Oloriz
    'oloriz':   { latitude: 42.7067, longitude: -1.5167 },
    'solchaga': { latitude: 42.6933, longitude: -1.5283 },

    // Olza
    'olza':    { latitude: 42.7333, longitude: -1.6833 },
    'arazuri': { latitude: 42.7250, longitude: -1.7050 },
};

// ── CIUDADES ────────────────────────────────────────────────────────────────
const CIUDADES = {
    // Araba
    'vitoria-gasteiz':              { latitude: 42.8467, longitude: -2.6726 },
    'kanpezu':                      { latitude: 42.6558, longitude: -2.3689 },
    'amurrio':                      { latitude: 43.0519, longitude: -3.0033 },
    'laguardia':                    { latitude: 42.5469, longitude: -2.5697 },
    'agurain / salvatierra':        { latitude: 42.8483, longitude: -2.3903 },
    'aramaio':                      { latitude: 43.0636, longitude: -2.5825 },
    'elciego':                      { latitude: 42.5311, longitude: -2.6264 },
    'anana':                        { latitude: 42.7836, longitude: -2.9919 },
    'barrundia':                    { latitude: 42.9167, longitude: -2.4333 },
    'arraya-maestu':                { latitude: 42.6503, longitude: -2.5317 },
    'ayala / aiara':                { latitude: 43.0833, longitude: -3.0833 },
    'zambrana':                     { latitude: 42.8000, longitude: -2.9500 },
    'zigoitia':                     { latitude: 42.9667, longitude: -2.7167 },
    'zuia':                         { latitude: 42.9833, longitude: -2.7500 },
    'laudio / llodio':              { latitude: 43.1503, longitude: -2.9631 },
    'iruna oka / iruna de oca':     { latitude: 42.7383, longitude: -2.7558 },
    'leza':                         { latitude: 42.5667, longitude: -2.5333 },
    'yecora':                       { latitude: 42.5500, longitude: -2.4500 },
    'lagran':                       { latitude: 42.5647, longitude: -2.5247 },
    'lapuebla de labarca':          { latitude: 42.4975, longitude: -2.5906 },
    'okondo':                       { latitude: 43.1000, longitude: -3.1167 },
    'legutio':                      { latitude: 42.9833, longitude: -2.5833 },
    'bernedo':                      { latitude: 42.6500, longitude: -2.4167 },
    'ribera baja':                  { latitude: 42.7833, longitude: -3.0333 },
    // Bizkaia
    'bilbao':                       { latitude: 43.2630, longitude: -2.9350 },
    'balmaseda':                    { latitude: 43.1936, longitude: -3.2175 },
    'leioa':                        { latitude: 43.3261, longitude: -2.9894 },
    'durango':                      { latitude: 43.1700, longitude: -2.6344 },
    'basauri':                      { latitude: 43.2394, longitude: -2.8892 },
    'ea':                           { latitude: 43.3675, longitude: -2.5703 },
    'muskiz':                       { latitude: 43.3331, longitude: -3.1156 },
    'sestao':                       { latitude: 43.3089, longitude: -3.0086 },
    'portugalete':                  { latitude: 43.3219, longitude: -3.0225 },
    'amorebieta-etxano':            { latitude: 43.2197, longitude: -2.7336 },
    'ermua':                        { latitude: 43.1894, longitude: -2.5025 },
    'sopela':                       { latitude: 43.3892, longitude: -2.9931 },
    'bakio':                        { latitude: 43.4225, longitude: -2.8158 },
    'markina-xemein':               { latitude: 43.2644, longitude: -2.4936 },
    'mungia':                       { latitude: 43.3556, longitude: -2.8464 },
    'getxo':                        { latitude: 43.3557, longitude: -3.0106 },
    'plentzia':                     { latitude: 43.4011, longitude: -2.9456 },
    'galdakao':                     { latitude: 43.2269, longitude: -2.8444 },
    'bermeo':                       { latitude: 43.4208, longitude: -2.7219 },
    'ondarroa':                     { latitude: 43.3267, longitude: -2.4156 },
    'gernika-lumo':                 { latitude: 43.3160, longitude: -2.6822 },
    'santurtzi':                    { latitude: 43.3328, longitude: -3.0311 },
    'barakaldo':                    { latitude: 43.2967, longitude: -2.9944 },
    'zaldibar':                     { latitude: 43.1978, longitude: -2.5536 },
    'berriz':                       { latitude: 43.2164, longitude: -2.6028 },
    'busturia':                     { latitude: 43.3675, longitude: -2.6997 },
    'forua':                        { latitude: 43.3303, longitude: -2.6969 },
    'igorre':                       { latitude: 43.1394, longitude: -2.7958 },
    'manaria':                      { latitude: 43.1667, longitude: -2.6667 },
    'mundaka':                      { latitude: 43.4025, longitude: -2.6942 },
    'erandio':                      { latitude: 43.3056, longitude: -2.9714 },
    'larrabetzu':                   { latitude: 43.2622, longitude: -2.7831 },
    'ibarrangelu':                  { latitude: 43.3756, longitude: -2.5622 },
    'zeanuri':                      { latitude: 43.0742, longitude: -2.7514 },
    'muxika':                       { latitude: 43.2956, longitude: -2.7231 },
    'mallabia':                     { latitude: 43.2017, longitude: -2.5317 },
    'mendexa':                      { latitude: 43.3397, longitude: -2.5006 },
    'gatika':                       { latitude: 43.3578, longitude: -2.8717 },
    'zaratamo':                     { latitude: 43.1875, longitude: -2.9153 },
    'otxandio':                     { latitude: 43.0450, longitude: -2.6772 },
    'urduliz':                      { latitude: 43.3783, longitude: -2.9408 },
    'ortuella':                     { latitude: 43.3136, longitude: -3.0536 },
    'derio':                        { latitude: 43.2908, longitude: -2.8894 },
    'berango':                      { latitude: 43.3722, longitude: -2.9819 },
    'sopuerta':                     { latitude: 43.2167, longitude: -3.1500 },
    'fruiz':                        { latitude: 43.3311, longitude: -2.8092 },
    'valle de trapaga-trapagaran':  { latitude: 43.3103, longitude: -3.0411 },
    'guenes':                       { latitude: 43.2219, longitude: -3.0844 },
    'maruri-jatabe':                { latitude: 43.3528, longitude: -2.8561 },
    'arrankudiaga-zollo':           { latitude: 43.1514, longitude: -2.9481 },
    'laukiz':                       { latitude: 43.3525, longitude: -2.9014 },
    'gorliz':                       { latitude: 43.4056, longitude: -2.9358 },
    'ispaster':                     { latitude: 43.3392, longitude: -2.5389 },
    'morga':                        { latitude: 43.3058, longitude: -2.7503 },
    'zamudio':                      { latitude: 43.2856, longitude: -2.8736 },
    'lanestosa':                    { latitude: 43.1933, longitude: -3.4383 },
    'garai':                        { latitude: 43.1578, longitude: -2.6178 },
    'menaka':                       { latitude: 43.3317, longitude: -2.8350 },
    'turtzioz / trucios':           { latitude: 43.2500, longitude: -3.3167 },
    'galdames':                     { latitude: 43.2167, longitude: -3.1167 },
    'alonsotegi':                   { latitude: 43.2597, longitude: -2.9917 },
    'ugao-miraballes':              { latitude: 43.1831, longitude: -2.8733 },
    'areatza':                      { latitude: 43.0900, longitude: -2.8267 },
    'arriaga':                      { latitude: 43.2333, longitude: -2.7667 },
    'amoroto':                      { latitude: 43.3356, longitude: -2.5017 },
    'zierbena':                     { latitude: 43.3467, longitude: -3.0781 },
    'errigoiti':                    { latitude: 43.3167, longitude: -2.7333 },
    'gordexola':                    { latitude: 43.1808, longitude: -3.0967 },
    'etxebarri':                    { latitude: 43.2583, longitude: -2.9017 },
    'lemoiz':                       { latitude: 43.4028, longitude: -2.9525 },
    'arakaldo':                     { latitude: 43.1489, longitude: -2.8800 },
    // Gipuzkoa
    'donostia / san sebastian':     { latitude: 43.3183, longitude: -1.9812 },
    'irun':                         { latitude: 43.3384, longitude: -1.7888 },
    'getaria':                      { latitude: 43.3006, longitude: -2.2022 },
    'arrasate / mondragon':         { latitude: 43.0640, longitude: -2.4919 },
    'zarautz':                      { latitude: 43.2847, longitude: -2.1727 },
    'lasarte-oria':                 { latitude: 43.2742, longitude: -2.0022 },
    'zumarraga':                    { latitude: 43.0833, longitude: -2.3181 },
    'usurbil':                      { latitude: 43.2711, longitude: -2.0369 },
    'elgeta':                       { latitude: 43.1325, longitude: -2.5064 },
    'pasaia':                       { latitude: 43.3369, longitude: -1.9281 },
    'alegia':                       { latitude: 43.1214, longitude: -2.1300 },
    'antzuola':                     { latitude: 43.1019, longitude: -2.4125 },
    'errenteria':                   { latitude: 43.3100, longitude: -1.8983 },
    'ezkio-itsaso':                 { latitude: 43.0542, longitude: -2.3025 },
    'mutriku':                      { latitude: 43.3047, longitude: -2.3781 },
    'astigarraga':                  { latitude: 43.2900, longitude: -1.9533 },
    'soraluze / placencia de las armas': { latitude: 43.1847, longitude: -2.4364 },
    'hondarribia':                  { latitude: 43.3678, longitude: -1.7958 },
    'mendaro':                      { latitude: 43.2469, longitude: -2.3994 },
    'ordizia':                      { latitude: 43.0572, longitude: -2.1831 },
    'oiartzun':                     { latitude: 43.2972, longitude: -1.8708 },
    'larraul':                      { latitude: 43.2167, longitude: -2.0167 },
    'aia':                          { latitude: 43.2158, longitude: -2.1853 },
    'berastegi':                    { latitude: 43.1719, longitude: -1.9972 },
    'ikaztegieta':                  { latitude: 43.1317, longitude: -2.1011 },
    'aduna':                        { latitude: 43.2472, longitude: -2.0194 },
    'aretxabaleta':                 { latitude: 43.0478, longitude: -2.4781 },
    'baliarrain':                   { latitude: 43.0911, longitude: -2.1456 },
    'bidania-goiatz':               { latitude: 43.1694, longitude: -2.1897 },
    'gaztelu':                      { latitude: 43.2000, longitude: -1.9500 },
    'hernialde':                    { latitude: 43.2158, longitude: -2.0397 },
    'zerain':                       { latitude: 43.0383, longitude: -2.3047 },
    'albiztur':                     { latitude: 43.2025, longitude: -2.1347 },
    'deba':                         { latitude: 43.2939, longitude: -2.3517 },
    'gabiria':                      { latitude: 43.0758, longitude: -2.2581 },
    'elgoibar':                     { latitude: 43.2106, longitude: -2.4134 },
    'amezketa':                     { latitude: 43.0669, longitude: -2.1219 },
    'ibarra':                       { latitude: 43.1453, longitude: -2.0744 },
    'berrobi':                      { latitude: 43.1631, longitude: -1.9975 },
    // Nafarroa
    'artazu':                       { latitude: 42.6847, longitude: -1.8175 },
    'iruna / pamplona':             { latitude: 42.8125, longitude: -1.6458 },
    'tutera / tudela':              { latitude: 42.0614, longitude: -1.6089 },
    'altsasu / alsasua':            { latitude: 42.9000, longitude: -2.0167 },
    'juslapena':                    { latitude: 42.8500, longitude: -1.7333 },
    'burutain':                     { latitude: 42.9000, longitude: -1.7167 },
    'lerate':                       { latitude: 42.9000, longitude: -1.7000 },
    'orbaiz':                       { latitude: 42.6833, longitude: -1.3167 },
    'zuniga':                       { latitude: 42.7000, longitude: -2.2000 },
    'longuida':                     { latitude: 42.7167, longitude: -1.3500 },
    'arakil':                       { latitude: 42.9333, longitude: -1.8500 },
    'urraul alto':                  { latitude: 42.7500, longitude: -1.2833 },
    'azkarate':                     { latitude: 43.0167, longitude: -1.7667 },
    'berrioplano':                  { latitude: 42.8594, longitude: -1.6894 },
    'lesaka':                       { latitude: 43.2564, longitude: -1.7458 },
    'urdiain':                      { latitude: 42.9167, longitude: -2.0500 },
    'aguilar de codes':             { latitude: 42.6333, longitude: -2.1667 },
    'arruitz':                      { latitude: 42.9750, longitude: -1.9833 },
    'navascues':                    { latitude: 42.7000, longitude: -1.1500 },
    'berasain':                     { latitude: 42.9167, longitude: -1.8000 },
    'iturmendi':                    { latitude: 42.9500, longitude: -2.0333 },
    'lana':                         { latitude: 42.7167, longitude: -2.2000 },
    'larraona':                     { latitude: 42.7333, longitude: -2.1667 },
    'ablitas':                      { latitude: 41.9667, longitude: -1.6333 },
    'allo':                         { latitude: 42.5500, longitude: -2.0667 },
    'pueyo':                        { latitude: 42.5167, longitude: -1.6333 },
    'viana':                        { latitude: 42.5156, longitude: -2.3703 },
    'liedena':                      { latitude: 42.6167, longitude: -1.2667 },
    'luzaide / valcarlos':          { latitude: 43.0833, longitude: -1.3333 },
    'barindano':                    { latitude: 42.8000, longitude: -1.7833 },
    'astitz':                       { latitude: 43.0500, longitude: -1.8500 },
    'melida':                       { latitude: 42.3500, longitude: -1.6000 },
    'olazti / olazagutia':          { latitude: 42.8833, longitude: -2.0333 },
    'olejua':                       { latitude: 42.6667, longitude: -2.1667 },
    'ezcabarte':                    { latitude: 42.8833, longitude: -1.6500 },
    'puente la reina / gares':      { latitude: 42.6722, longitude: -1.8136 },
    'ultzama':                      { latitude: 42.9833, longitude: -1.7667 },
    'guesalaz':                     { latitude: 42.7000, longitude: -1.9167 },
    'oskotz':                       { latitude: 42.9833, longitude: -1.7000 },
    'allin':                        { latitude: 42.6500, longitude: -2.0500 },
    'lodosa':                       { latitude: 42.4219, longitude: -2.0811 },
    'anue':                         { latitude: 43.0167, longitude: -1.6833 },
    'azpirotz':                     { latitude: 42.9833, longitude: -1.9167 },
    'echarri':                      { latitude: 42.9167, longitude: -1.9833 },
    'labaien':                      { latitude: 43.1000, longitude: -1.8667 },
    'murieta':                      { latitude: 42.5833, longitude: -1.9667 },
    'marcilla':                     { latitude: 42.3167, longitude: -1.6500 },
    'barillas':                     { latitude: 41.8667, longitude: -1.6500 },
    'larraun':                      { latitude: 43.0000, longitude: -1.9167 },
    'fustinana':                    { latitude: 42.0500, longitude: -1.5167 },
    'urrozvilla':                   { latitude: 42.8833, longitude: -1.7500 },
    'carcastillo':                  { latitude: 42.3667, longitude: -1.4333 },
    'sartaguda':                    { latitude: 42.4000, longitude: -2.1000 },
    'artaza':                       { latitude: 42.7000, longitude: -2.0500 },
    'usetxi':                       { latitude: 42.9167, longitude: -1.8167 },
    'basaburua':                    { latitude: 43.0333, longitude: -1.8333 },
    'arrieta':                      { latitude: 42.8333, longitude: -1.5833 },
    'etayo':                        { latitude: 42.6000, longitude: -2.1667 },
    'arano':                        { latitude: 43.1500, longitude: -1.8000 },
    'arraitz-orkin':                { latitude: 43.0167, longitude: -1.8833 },
    'belascain':                    { latitude: 42.7000, longitude: -1.7500 },
    'cabanillas':                   { latitude: 42.1333, longitude: -1.6167 },
    'torrano / dorrao':             { latitude: 42.9500, longitude: -1.7833 },
    'elorz':                        { latitude: 42.7667, longitude: -1.6000 },
    'gartzaron':                    { latitude: 43.0000, longitude: -1.8000 },
    'ibero':                        { latitude: 42.7000, longitude: -1.6833 },
    'lapoblacion':                  { latitude: 42.6000, longitude: -2.2667 },
    'maranon':                      { latitude: 42.6333, longitude: -2.3000 },
    'murchante':                    { latitude: 41.9333, longitude: -1.7000 },
    'orbara':                       { latitude: 42.8000, longitude: -1.2000 },
    'uztegi':                       { latitude: 42.9500, longitude: -2.0167 },
    'arostegui':                    { latitude: 42.8667, longitude: -1.5167 },
    'artajo':                       { latitude: 42.7000, longitude: -1.4167 },
    'donamaria':                    { latitude: 43.1167, longitude: -1.7833 },
    'gollano':                      { latitude: 42.7333, longitude: -2.0667 },
    'urra':                         { latitude: 42.8000, longitude: -1.5000 },
    'azqueta':                      { latitude: 42.6167, longitude: -2.1333 },
    'egues':                        { latitude: 42.8000, longitude: -1.5667 },
    'galar':                        { latitude: 42.7667, longitude: -1.7000 },
    'murillo berroya':              { latitude: 42.7833, longitude: -1.5167 },
    'zabalceta':                    { latitude: 42.8167, longitude: -1.5333 },
    'zabalza':                      { latitude: 42.7833, longitude: -1.5500 },
    'tulebras':                     { latitude: 41.9167, longitude: -1.5667 },
    'barasoain':                    { latitude: 42.6000, longitude: -1.7000 },
    'narbarte':                     { latitude: 43.1833, longitude: -1.7167 },
    'oloriz':                       { latitude: 42.7000, longitude: -1.5167 },
    'olza':                         { latitude: 42.7333, longitude: -1.6833 },
    'ribaforada':                   { latitude: 42.0167, longitude: -1.5500 },
    'rocaborte':                    { latitude: 42.7000, longitude: -1.4833 },
    'beasoain':                     { latitude: 42.6500, longitude: -1.8500 },
    'egillor':                      { latitude: 42.7833, longitude: -1.7833 },
    'imotz':                        { latitude: 42.9667, longitude: -1.7667 },
    'olaverri':                     { latitude: 42.7333, longitude: -1.9833 },
    'sesma':                        { latitude: 42.4833, longitude: -2.1000 },
    'ustarroz':                     { latitude: 42.9333, longitude: -1.3167 },
    'aurizberri / espinal':         { latitude: 42.9333, longitude: -1.3833 },
    'olite':                        { latitude: 42.4806, longitude: -1.6494 },
    'ayegui':                       { latitude: 42.6667, longitude: -2.0333 },
    'legasa':                       { latitude: 43.1833, longitude: -1.6833 },
    'aranarache':                   { latitude: 42.7333, longitude: -2.1667 },
    'atallu':                       { latitude: 43.0000, longitude: -2.0000 },
    'iraneta':                      { latitude: 42.9000, longitude: -1.8667 },
    'obanos':                       { latitude: 42.6619, longitude: -1.7708 },
    'arce':                         { latitude: 42.7333, longitude: -1.3500 },
    'traibuenas':                   { latitude: 42.3667, longitude: -1.5833 },
};

/**
 * Devuelve coordenadas para un jaiak. Busca en este orden:
 * 1. Barrio/auzoa exacto
 * 2. Ciudad/municipio
 * 3. Centroide de provincia
 */
export function getCoordenadas(area, city, province) {
    const a = norm(area);
    const c = norm(city);
    return BARRIOS[a] || CIUDADES[a] || CIUDADES[c]
        || PROVINCIA_CENTROIDES[province]
        || { latitude: 43.0, longitude: -2.0 };
}
