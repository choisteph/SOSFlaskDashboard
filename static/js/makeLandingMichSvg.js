let width = 400;
let height = width;

//Create SVG element and append map to the SVG
let michEms = d3.select("#michEms").append("svg")
    .attr("width", width)
    .attr("height", height);

let michMe = d3.select('#michMe').append('svg')
    .attr('width', width)
    .attr('height', height);

// Load topojson data
async function makeMichMap(svgname, filename, ME=false) {
  // Read in County Data
  const DATA = await d3.csv(filename, type);
  const TOTAL = DATA.reduce((total,d) => total + d.value, 0)
  // Read in population data
  const population = await d3.json("/static/data/county_pop.json")
  
  let countyProp = {};
  let rateArray = [];
  DATA.map(d => {
    let prop = {}
    prop['ct'] = d.value
    prop['pop'] = population[d.county]
    prop['rate'] = prop['ct'] / prop['pop']
    rateArray.push(prop['rate'])
    countyProp[d.county] = prop    
  })

  let colorScheme
  const k = 5
  if (svgname === michEms){
      d3.select('#totalEms').text(`${TOTAL}`)
      colorScheme = d3.schemePurples[k]
  } else {
      d3.select('#totalMe').text(`${TOTAL}`)
      colorScheme = d3.schemeBlues[k]
  }

  const MItopo = await d3.json('static/geojson/counties_v17a.topojson')
  // convert to geojson
  const MIgeo = topojson.feature(MItopo, MItopo.objects.collection)

  // set up choropleth
  const rateFmt = d3.format('.3f')
  let quantile = d3.scaleQuantile()
    .domain(rateArray)
    .range(colorScheme)

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
      .attr("data-html", true)
      .attr("title", d => {
          const name = d.properties.name
          const ct = (!ME || MEcounties.includes(name)) ? '<br>count: '+ countyProp[name]['ct'] : ''
          const rate = (!ME || MEcounties.includes(name)) ? '<br>rate per 1K: ' + rateFmt(countyProp[name]['rate']) : ''
          return `<p>${name}${ct}${rate}</p>`
      })
      .style('fill', d => {
          const name = d.properties.name
          return !ME || MEcounties.includes(name) ? quantile(countyProp[name]['rate']) : "url(#stripes)"
      })
      $(function() {
        $('[data-toggle="tooltip"]').tooltip()
      })
};

function type(d) {
  d.value = +d.value;
  return d
};

