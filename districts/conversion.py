import json

""""
converts text data into JSON
"""
all_districts = [
    "Delmenhorst",
    "Landkreis_Oldenburg",
    "Landkreis_Coburg",
    "Märkischer_Kreis",
    "St__Wendel",
    "Herne",
    "Landkreis_Rosenheim",
    "Ennepe-Ruhr-Kreis",
    "Garmisch-Partenkirchen",
    "Heidekreis",
    "Region_Hannover",
    "Nürnberger_Land",
    "Lichtenfels",
    "Ravensburg",
    "Ostalbkreis",
    "Esslingen",
    "Neckar-Odenwald-Kreis",
    "Böblingen",
    "Landkreis_Bayreuth",
    "Kaufbeuren",
    "Flensburg",
    "Eichstätt",
    "Weimarer_Land",
    "Hameln-Pyrmont",
    "Aurich",
    "Nürnberg",
    "Günzburg",
    "Landkreis_Regensburg",
    "Straubing-Bogen",
    "Amberg-Sulzbach",
    "Marburg-Biedenkopf",
    "Leipzig",
    "Landkreis_Leipzig",
    "Vogtlandkreis",
    "Main-Taunus-Kreis",
    "Rhein-Pfalz-Kreis",
    "Birkenfeld",
    "München",
    "Neuburg-Schrobenhausen",
    "Freising",
    "Altötting",
    "Kitzingen",
    "Landsberg_am_Lech",
    "Mainz-Bingen",
    "Rhein-Hunsrück-Kreis",
    "Landkreis_Kaiserslautern",
    "Zollernalbkreis",
    "Rhein-Erft-Kreis",
    "Oder-Spree",
    "Vogelsbergkreis",
    "Koblenz",
    "Freudenstadt",
    "Calw",
    "Helmstedt",
    "Wolfsburg",
    "Breisgau-Hochschwarzwald",
    "Friesland",
    "Vulkaneifel",
    "Euskirchen",
    "Oberspreewald-Lausitz",
    "Bautzen",
    "Anhalt-Bitterfeld",
    "Wittenberg",
    "Lippe",
    "Herford",
    "Paderborn",
    "Nienburg",
    "Olpe",
    "Soest",
    "Siegen-Wittgenstein",
    "Oberbergischer_Kreis",
    "Oberhausen",
    "Viersen",
    "Borken",
    "Heinsberg",
    "Altenkirchen",
    "Wesel",
    "Mannheim",
    "Aichach-Friedberg",
    "Stade",
    "Südliche_Weinstraße",
    "Hildesheim",
    "Cloppenburg",
    "Passau",
    "Landkreis_Passau",
    "Karlsruhe",
    "Pforzheim",
    "Enzkreis",
    "Landkreis_Karlsruhe",
    "Oldenburg",
    "Ammerland",
    "Bottrop",
    "Rhein-Sieg-Kreis",
    "Warendorf",
    "Grafschaft_Bentheim",
    "Landkreis_Ansbach",
    "Schwäbisch_Hall",
    "Ludwigslust-Parchim",
    "Herzogtum_Lauenburg",
    "Haßberge",
    "Suhl",
    "Hochtaunuskreis",
    "Prignitz",
    "Kassel",
    "Mittelsachsen",
    "Regen",
    "Diepholz",
    "Lüneburg",
    "Harburg",
    "Spree-Neiße",
    "Freyung-Grafenau",
    "Cottbus",
    "Uckermark",
    "Rottal-Inn",
    "Limburg-Weilburg",
    "Lüchow-Dannenberg",
    "Altmarkkreis_Salzwedel",
    "Ludwigshafen_am_Rhein",
    "Dillingen",
    "Darmstadt-Dieburg",
    "Düsseldorf",
    "Tuttlingen",
    "Eichsfeld",
    "Stormarn",
    "Teltow-Fläming",
    "Lübeck",
    "Märkisch-Oderland",
    "Ostprignitz-Ruppin",
    "Bremen",
    "Bremerhaven",
    "Emden",
    "Burgenlandkreis",
    "Salzgitter",
    "Hof",
    "Berlin",
    "Bonn",
    "Pirmasens",
    "Leverkusen",
    "Eifelkreis_Bitburg-Prüm",
    "Landkreis_Augsburg",
    "Frankenthal",
    "Dresden",
    "Werra-Meißner-Kreis",
    "Potsdam",
    "Wunsiedel",
    "Tirschenreuth",
    "Emsland",
    "Gifhorn",
    "Nordfriesland",
    "Oberhavel",
    "Höxter",
    "Stuttgart",
    "Traunstein",
    "Miltenberg",
    "Braunschweig",
    "Halle__Saale_",
    "Neustadt_an_der_Waldnaab",
    "Vorpommern-Greifswald",
    "Plön",
    "Rheinisch-Bergischer_Kreis",
    "Saale-Orla-Kreis",
    "Odenwaldkreis",
    "Dahme-Spreewald",
    "Roth",
    "Neunkirchen",
    "Dithmarschen",
    "Elbe-Elster",
    "Mayen-Koblenz",
    "Dachau",
    "Heilbronn",
    "Cochem-Zell",
    "Rosenheim",
    "Bad_Dürkheim",
    "Saale-Holzland-Kreis",
    "Neustadt_an_der_Weinstraße",
    "Greiz",
    "Hersfeld-Rotenburg",
    "Ulm",
    "Reutlingen",
    "Ostallgäu",
    "Main-Spessart",
    "Lindau",
    "Groß-Gerau",
    "Mühldorf",
    "Osterholz",
    "Weimar",
    "Verden",
    "Weiden_in_der_Oberpfalz",
    "Wesermarsch",
    "Ilm-Kreis",
    "Ansbach",
    "Zweibrücken",
    "Speyer",
    "Münster",
    "Salzlandkreis",
    "Gütersloh",
    "Rhein-Kreis_Neuss",
    "Wittmund",
    "Gera",
    "Cham",
    "Sömmerda",
    "Fürth",
    "Erlangen-Höchstadt",
    "Landkreis_Fürth",
    "Fulda",
    "Wartburgkreis",
    "Eisenach",
    "Hildburghausen",
    "Sonneberg",
    "Forchheim",
    "Solingen",
    "Krefeld",
    "Gotha",
    "Baden-Baden",
    "Aschaffenburg",
    "Amberg",
    "Bernkastel-Wittlich",
    "Wuppertal",
    "Schwabach",
    "Offenbach",
    "Mülheim_an_der_Ruhr",
    "Freiburg_im_Breisgau",
    "Fürstenfeldbruck",
    "Landkreis_Bamberg",
    "Coburg",
    "Mönchengladbach",
    "Bamberg",
    "Landkreis_Würzburg",
    "Ortenaukreis",
    "Wiesbaden",
    "Osnabrück",
    "Hochsauerlandkreis",
    "Biberach",
    "Nordwestmecklenburg",
    "Ludwigsburg",
    "Remscheid",
    "Deggendorf",
    "Duisburg",
    "Hamm",
    "Frankfurt_am_Main",
    "Weißenburg-Gunzenhausen",
    "Mettmann",
    "Schmalkalden-Meiningen",
    "Darmstadt",
    "Munich",
    "Frankfurt_an_der_Oder",
    "Dingolfing-Landau",
    "Erding",
    "Gelsenkirchen",
    "Rottweil",
    "Landau_in_der_Pfalz",
    "Holzminden",
    "Offenbach_am_Main",
    "Wetteraukreis",
    "Alzey-Worms",
    "Essen",
    "Memmingen",
    "Rems-Murr-Kreis",
    "Gießen",
    "Schwerin",
    "Mainz",
    "Rastatt",
    "Dessau-Roßlau",
    "Kelheim",
    "Straubing",
    "Emmendingen",
    "Göttingen",
    "PfaffenHof",
    "Neumarkt",
    "Neu-Ulm",
    "Ebersberg",
    "Bielefeld",
    "Kulmbach",
    "Magdeburg",
    "Segeberg",
    "Mansfeld-Südharz",
    "Peine",
    "Kempten",
    "Donnersbergkreis",
    "Bad_Kreuznach",
    "Görlitz",
    "Rendsburg-Eckernförde",
    "Nordhausen",
    "Ostholstein",
    "Kiel",
    "Altenburger_Land",
    "Zwickau",
    "Bad_Tölz-Wolfratshausen",
    "Hagen",
    "Unna",
    "Landkreis_Heilbronn",
    "Starnberg",
    "Main-Tauber-Kreis",
    "Brandenburg_an_der_Havel",
    "Göppingen",
    "Neumünster",
    "Erzgebirgskreis",
    "Pinneberg",
    "Harz",
    "Westerwaldkreis",
    "Bad_Kissingen",
    "Neuwied",
    "Kleve",
    "Schaumburg",
    "Südwestpfalz",
    "Steinfurt",
    "Bayreuth",
    "Saalekreis",
    "Alb-Donau-Kreis",
    "Unstrut-Hainich-Kreis",
    "Bodenseekreis",
    "Worms",
    "Vorpommern-Rügen",
    "Trier-Saarburg",
    "Celle",
    "Trier",
    "Rhön-Grabfeld",
    "Steinburg",
    "Uelzen",
    "Weilheim-Schongau",
    "Coesfeld",
    "Bergstraße",
    "Goslar",
    "Wolfenbüttel",
    "Rhein-Neckar-Kreis",
    "Landkreis_Kassel",
    "Vechta",
    "Erfurt",
    "Saarpfalz-Kreis",
    "Köln",
    "Regionalverband_Saarbrücken",
    "Kyffhäuserkreis",
    "Unterallgäu",
    "Würzburg",
    "Saarlouis",
    "Recklinghausen",
    "Dortmund",
    "Kaiserslautern",
    "Chemnitz",
    "Regensburg",
    "Düren",
    "Waldeck-Frankenberg",
    "Nordsachsen",
    "Aachen",
    "Barnim",
    "Schwalm-Eder-Kreis",
    "Landkreis_Hof",
    "Rostock",
    "Sigmaringen",
    "Lahn-Dill-Kreis",
    "Mecklenburgische_Seenplatte",
    "Leer",
    "Northeim",
    "Minden-Lübbecke",
    "Berchtesgadener_Land",
    "Meißen",
    "Heidelberg",
    "Kusel",
    "Börde",
    "Schweinfurt",
    "Hohenlohekreis",
    "Schwarzwald-Baar-Kreis",
    "Waldshut",
    "Lörrach",
    "Germersheim",
    "Landkreis_Schweinfurt",
    "Jena",
    "Ahrweiler",
    "Kronach",
    "Landkreis_Aschaffenburg",
    "Merzig-Wadern",
    "Rhein-Lahn-Kreis",
    "Rheingau-Taunus-Kreis",
    "Heidenheim",
    "Stendal",
    "Havelland",
    "Rotenburg",
    "Oberallgäu",
    "Schwandorf",
    "Landshut",
    "Landkreis_Landshut",
    "Jerichower_Land",
    "Bochum",
    "Augsburg",
    "Potsdam-Mittelmark",
    "Konstanz",
    "Hamburg",
    "Landkreis_Osnabrück",
    "Cuxhaven",
    "Landkreis_Rostock",
    "Wilhelmshaven",
    "Neustadt_an_der_Aisch_Bad_Windsheim",
    "Donau-Ries",
    "Erlangen",
    "Saalfeld-Rudolstadt",
    "Tübingen",
    "Main-Kinzig-Kreis",
    "Ingolstadt",
    "Schleswig-Flensburg",
    "Sächsische_Schweiz-Osterzgebirge",
    "Miesbach"
]

corresponding_BL = [
    "NI", "NI", "BY", "NW", "SL", "NW", "BY", "NW", "BY", "NI", "NI", "BY", "BY", "BW", "BW", "BW", "BW", "BW", "BY",
    "BY", "SH", "BY", "TH",
    "NI", "NI", "BY", "BY", "BY", "BY", "BY", "HE", "SN", "SN", "SN", "HE", "RP", "RP", "BY", "BY", "BY", "BY", "BY",
    "BY", "RP", "RP", "RP",
    "BW", "NW", "BB", "HE", "RP", "BW", "BW", "NI", "NI", "BW", "NI", "RP", "NW", "BB", "SN", "ST", "ST", "NW", "NW",
    "NW", "NI", "NW", "NW",
    "NW", "NW", "NW", "NW", "NW", "NW", "RP", "NW", "BW", "BY", "NI", "RP", "NI", "NI", "BY", "BY", "BW", "BW", "BW",
    "BW", "NI", "BY", "NW",
    "NW", "NW", "NI", "BY", "BW", "MV", "SH", "BY", "TH", "HE", "BB", "HE", "SN", "BY", "NI", "NI", "NI", "BB", "BY",
    "BB", "BB", "BY", "HE",
    "NI", "ST", "RP", "BY", "HE", "NW", "BW", "TH", "SH", "BB", "SH", "BB", "BB", "BR", "BR", "NI", "ST", "NI", "BY",
    "BE", "NW", "RP", "NW",
    "RP", "BY", "RP", "SN", "HE", "BB", "BY", "BY", "NI", "NI", "SH", "BB", "NW", "BW", "BY", "BY", "NI", "SH", "BY",
    "MV", "SH", "NW", "TH",
    "HE", "BB", "BY", "SL", "SH", "BB", "RP", "BY", "BW", "NW", "BY", "RP", "TH", "RP", "TH", "HE", "BW", "BW", "BY",
    "BY", "BY", "HE", "BY",
    "NI", "TH", "NI", "BY", "NI", "TH", "BY", "RP", "RP", "NW", "SH", "NW", "NW", "NI", "TH", "BY", "TH", "BY", "BY",
    "BY", "HE", "TH", "TH",
    "TH", "TH", "BY", "NW", "NW", "TH", "BW", "BY", "BY", "RP", "RP", "BY", "HE", "NW", "BW", "BY", "BY", "BY", "NW",
    "BY", "BY", "BW", "HE",
    "NI", "NW", "BW", "MV", "BW", "NW", "BW", "NW", "NW", "HE", "BY", "NW", "TH", "HE", "BY", "BB", "BY", "BY", "NW",
    "BW", "RP", "NI", "HE",
    "HE", "RP", "NW", "BY", "BW", "HE", "MV", "RP", "BW", "ST", "BY", "BY", "BW", "NI", "BY", "BY", "BY", "BY", "NW",
    "BY", "ST", "SH", "ST",
    "NI", "BY", "RP", "RP", "SN", "SH", "TH", "SH", "SH", "TH", "SN", "BY", "NW", "NW", "BW", "BY", "BW", "BB", "BW",
    "SH", "SN", "SH", "ST",
    "RP", "BY", "RP", "NW", "NI", "RP", "NW", "BY", "ST", "BW", "TH", "BW", "RP", "MV", "RP", "NI", "RP", "BY", "SH",
    "NI", "BY", "NW", "HE",
    "NI", "NI", "BW", "HE", "NI", "TH", "SL", "NW", "SL", "TH", "BY", "BY", "SL", "NW", "NW", "RP", "SN", "BY", "NW",
    "HE", "SN", "NW", "BB",
    "HE", "BY", "MV", "BW", "HE", "MV", "NI", "NI", "NW", "BY", "SN", "BW", "RP", "ST", "BY", "BW", "BW", "BW", "BW",
    "RP", "BY", "TH", "RP",
    "BY", "BY", "SL", "RP", "HE", "BW", "ST", "BB", "NI", "BY", "BY", "BY", "BY", "ST", "NW", "BY", "BB", "BW", "HA",
    "NI", "NI", "MV", "NI",
    "BY", "BY", "BY", "TH", "BW", "HE", "BY", "SH", "SN", "BY"
]

BL = {
    "BW": "Baden-Württemberg",
    "BY": "Bayern",
    "RP": "Rheinland-Pfalz",
    "NW": "Nordrhein-Westfalen",
    "SL": "Saarland",
    "HE": "Hessen",
    "NI": "Niedersachsen",
    "SH": "Schleswig-Holstein",
    "MV": "Mecklenburg-Vorpommern",
    "BE": "Berlin",
    "HA": "Hamburg",
    "BR": "Bremen",
    "ST": "Sachsen-Anhalt",
    "SN": "Sachsen",
    "BB": "Brandenburg",
    "TH": "Thüringen"
}


def toJSON(district_list, corresponding_states, filename):
    districts = {}
    data = []

    for i, _district in enumerate(district_list):
        district = _district.replace("_", " ")
        state = BL[corresponding_states[i]]
        data.append({
            "district": district,
            "state": state,
            "status": "unexplored"
        })
    districts["districts"] = sorted(data, key=lambda x: x["district"])

    filename += ".json"
    with open(filename, 'w', encoding='utf-8') as outfile:
        json.dump(districts, outfile, ensure_ascii=False)


toJSON(all_districts, corresponding_BL, 'districts')
print(len(all_districts), len(corresponding_BL))
