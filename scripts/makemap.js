d3.csv(
    "https://greenminds.thedata.place/data/network_entries.csv",
    function (err, rows) {

        var classArray = unpack(rows, "class");
        var classes = [...new Set(classArray)];

        function unpack(rows, key) {
            return rows.map(function (row) {
                return row[key];
            });
        }

        var data = classes.map(function (classes) {
            var rowsFiltered = rows.filter(function (row) {
                return (row.class === classes);
            });

            return {
                type: "scattermapbox",
                text: unpack(rowsFiltered, "Project name"),
                lon: unpack(rowsFiltered, "Longitude"),
                lat: unpack(rowsFiltered, "Latitude"),
                url: unpack(rowsFiltered, "URL"),
                marker: { color: "fuchsia", size: 10 },
                hovertemplate:
                    "<i>id</i>: %{text}</br>" +
                    "<i>lat</i>: %{lat}<br>" +
                    "<i>lon</i>: %{lon}<br>" +
                    "<i>URL</i>: %{url}<br>" +
                    "<extra></extra>"
            };
        });

        var layout = {
            font: {
                color: "black"
            },
            dragmode: "zoom",
            mapbox: {
                center: {
                    lat: 50.376258,
                    lon: -4.171036
                },
                domain: {
                    x: [0, 1],
                    y: [0, 1]
                },
                style: "open-street-map",
                zoom: 12
            },
            margin: {
                r: 20,
                t: 40,
                b: 20,
                l: 20,
                pad: 0
            },
            paper_bgcolor: "#ffffff",
            plot_bgcolor: "#ffffff",
            showlegend: false,
            annotations: [{
                x: 0,
                y: 0,
                xref: "paper",
                yref: "paper",
                text: "Source: The Data Place. Map tiles: Open Street Map.",
                showarrow: false
            }]
        };

        console.log(data);
        Plotly.newPlot("mapDiv", data, layout);
    })
// put a placeholder value in the hoverInfo DIV
var elHover = document.getElementById('hoverInfo');
elHover.innerHTML = 'Starting view; all counters.\n  Hover over a point on the map to see data for an individual location.';

// get the ID from the hover event
var myMap = document.getElementById('mapDiv');
console.log(myMap);
var hoverInfo = document.getElementById('hoverInfo');
myMap.on('plotly_hover', function (eventdata) {
    var infotext = eventdata.points[0]['text'];
    //console.log(infotext)
    hoverInfo.innerHTML = infotext;
});
