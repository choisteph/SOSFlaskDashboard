function makeHtmlTable() {
  const headers = DATA.columns.slice(0, -3)
  // selects table to add
  table = d3.select("#sosTable")
  thead = table.append('thead').append('tr')
    .selectAll('th')
    .data(headers)
    .join('th')
      .text(d => d)
      .attr('class', (d,i) => headers[i] + " sortable")
  tbody = table.append('tbody');
  thead.html(d => d + ' <i class="fa fa-sort"></i>') // this function adds neutral sort-state arrows
      .on("click", function(d) {
          toggleToAsc(this); //take the clicked thing and run toggleToAsc on it
          sortColumn = d; //replace initial value in sortColumn with the val in "d"
          updateAll(updateCharts = false); // update table only
      })
  updateAll(updateCharts = false)
};

function updateHtmlTable(data) {
  row = tbody.selectAll('tr')
    .data(data)
    .join('tr')
  row.selectAll('td')
    .data(d => d3.values(d).slice(0,-3))
    .join('td')
      .text(d => formatHTMLthings(d))
  };

function formatHTMLthings(d) {
  return d instanceof Date ? d3.timeFormat("%b %d, %Y")(d) : d == 'NULL' ? '' : d;
};

function getSortedData(sortColumn){
  const column = d3.select(`.${sortColumn}`).select('i')
  if (sortColumn == "date") {
      return column.classed(descending) ? dateDim.top(Infinity)
                                        : dateDim.bottom(Infinity);
  } else if (sortColumn == "city"){
      return column.classed(descending) ? cityDim.top(Infinity)
                                        : cityDim.bottom(Infinity);
  } else if (sortColumn == "county"){
      return column.classed(descending) ? countyDim.top(Infinity)
                                        : countyDim.bottom(Infinity);
  } else if (sortColumn == "Age") {
      return column.classed(descending) ? ageDim.top(Infinity)
                                        : ageDim.bottom(Infinity);
  } else if (sortColumn == "Gender") {
      return column.classed(descending) ? genderDim.top(Infinity)
                                        : genderDim.bottom(Infinity);
  } else if (sortColumn == "Race") {
      return column.classed(descending) ? raceDim.top(Infinity)
                                        : raceDim.bottom(Infinity);
  }
};

function changeRows(N) {
  rows = N;
  updateAll(updateCharts=false)
  d3.selectAll(".change").classed("selected", false);
  const selection = N == 10 ? d3.select(".ten")
                  : N == 20 ? d3.selectAll(".twenty")
                  : d3.selectAll(".fifty")
  selection.classed("selected", true)
};

function reduceData(data) {
  if (data.length > rows) {
      const middle = new Array({"date": "...", "county": "...", "Age": "...", "Gender": "...", "Race": "...", "lng": "...", "lat": "..."});
      const topData = data.slice(0,rows/2);
      const bottomData = data.slice(-rows/2);
      var data = [...topData, ...middle, ...bottomData];
  }
  data.map(d => d.city = d.city == 'U' ? 'Unknown' : d.city)
  return data
};

function toggleToAsc(current){
  const column = d3.select(current).select('i')
  if (previous === current){
      toggleAscDesc(column);
  } else {
      const allColumns = d3.selectAll('.sortable').select('i')
      allColumns.classed(neutral, true).classed(ascending, false).classed(descending, false)
      column.classed(ascending, true).classed(neutral, false)
      previous = current;
  }
}

function toggleAscDesc(column) {
  column.classed(ascending) ? column.classed(descending, true).classed(ascending, false)
                            : column.classed(descending, false).classed(ascending, true)
}
