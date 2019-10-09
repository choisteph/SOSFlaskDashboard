let width = 400;
let height = width;

//Create SVG element and append map to the SVG
let michEms = d3.select("#michEms")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let michMe = d3.select('#michMe')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Load topojson data
async function makeMichMap(svgname, filename, ME=false) {
    // Read in County Data
    const DATA = await d3.csv(filename, type);
    let counties = new Map();
    DATA.map(d => counties.set(d.county, d.value));
    const TOTAL = DATA.reduce((total,d) => total + d.value, 0)

    if (svgname === michEms){
        d3.select('#totalEms').text(`${TOTAL}`)
    } else {
        d3.select('#totalMe').text(`${TOTAL}`)
    }    

    let tooltipDiv = d3.select('.mich')
        .append("div")
        .attr("class", "tooltips")
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "top")

    const MItopo = await d3.json('static/geojson/counties_v17a_pop.topojson')
    // convert to geojson
    const MIgeo = topojson.feature(MItopo, MItopo.objects.collection)

    // D3 Projection
    let projection = d3.geoMercator()
        .fitSize([width, height], MIgeo)

    // Define path generator
    let path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
        .projection(projection);

    // Bind the data to the SVG and create one path per GeoJSON feature
    svgname.selectAll("path")
      .data(MIgeo.features)
      .enter().append("path")
        .attr('class','county')
        .attr("d", path)
        .attr("id", "tooltips")
        .attr("data-toggle", "tooltip")
        .attr("title", d => {
            const name = d.properties.name
            const value = (!ME || MEcounties.includes(name)) ? ': ' + counties.get(name) : ''
            return name + value
        })
        .style('fill', d => !ME || MEcounties.includes(d.properties.name) ? null : "url(#stripes)")
        $(function() {
            $('[data-toggle="tooltip"]').tooltip()
        })
};

function type(d) {
  d.value = +d.value;
  return d
};
