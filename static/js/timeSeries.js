function makeTimeSeries() {
    // set up dimensions
    dateDim = CF.dimension(d => d.date)
    dateGrp = dateDim.group();
    dataDate = dateGrp.all();
    movingAvgData = movingAverage(dataDate, 7);

    // set the dimensions and margins of the graph
    margin = {top: 20, right: 30, bottom: 100, left: 50},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
    margin2 = {top: 300-70, right: 30, bottom: 30, left: 50},
    height2 = 300 - margin2.top - margin2.bottom;

    // append timetable svg
    svg = d3.select(".timetable").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // set the ranges
    x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    x2 = d3.scaleTime().range([0, width]),
    y2 = d3.scaleLinear().range([height2, 0]);

    // sets ticks for timetable graph
    xAxis = d3.axisBottom(x)
    yAxis = d3.axisRight(y).ticks(3)
    xAxis2 = d3.axisBottom(x2);

    // Add brush in x-dimension
    brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush", brushed)
        .on("end", brushended) // add brush snapping

    // define the focus moving avg
    movingAvg1 = d3.line()
        .x(d => x(d.key))
        .y(d => y(d.avg))

    // define the context moving avg
    movingAvg2 = d3.line()
        .x(d => x2(d.key))
        .y(d => y2(d.avg))

    // focus is the micro level view
    focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", `translate(${margin.left},${margin.top})`)

    // context is the macro level view
    context = svg.append("g")
        .attr("class", "context")
        .attr("transform", `translate(${margin2.left},${margin2.top})`);

    // clipping rectangle
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height)

    // scale the range of the data
    endDate = d3.timeDay.offset(d3.max(dataDate, d => d.key),1)
    x2.domain([d3.min(dataDate, d => d.key), endDate]);
    y2.domain([0, d3.max([3, d3.max(dataDate, d => d.value)])]);
    x.domain(x2.domain());
    y.domain(y2.domain());

    // add the focus bar chart
    bars = focus.selectAll(".bar")
      .data(dataDate)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d3.timeHour.offset(d.key,1)))
        .attr("y", d => y(d.value))
        .attr("width", getBarWidth())
        .attr("height", d => height - y(d.value))

    // add the focus moving avg line path
    avgLine1 = focus.append('path')
        .datum(movingAvgData)
        .attr('class', 'avgLine')
        .attr('d', movingAvg1)

    // add the focus x-axis
    focus.append("g")
        .attr("class", "axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    // add the focus y-axis
    focus.append("g")
        .attr("class", "axis--y")
        .attr("class", "axis")
        .attr('transform', `translate(${width},0)`)
        .call(yAxis);

    // add the context bar chart
    bars2 = context.selectAll(".bar")
      .data(dataDate)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x2(d3.timeHour.offset(d.key,1)))
        .attr("y", d => y2(d.value))
        .attr("width", getBarWidth())
        .attr("height", d => height2 - y2(d.value))

    // add the context moving avg line path
    avgLine2 = context.append('path')
        .datum(movingAvgData)
        .attr('class', 'avgLine')
        .attr('d', movingAvg2)

    // add the context x-axis
    context.append("g")
        .attr("class", "axis--x")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height2})`)
        .call(xAxis2);

    // add the context brush
    beginDate = d3.timeDay.offset(endDate, -7)

    selection = context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, [x(beginDate), x(endDate)]) // initialize brush selection

    dateDim.filter([beginDate, endDate]);
};

// updates timetable graph
function updateTimeSeries() {
    const easeFunc = d3.easeQuad;
    const T = 750;

    // bar transition
    bars.transition().ease(easeFunc).duration(T)
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value))
    bars2.transition().ease(easeFunc).duration(T)
        .attr("y", d => y2(d.value))
        .attr("height", d => height2 - y2(d.value))

    // line transition
    movingAvgData = movingAverage(dataDate, 7)
    avgLine1.datum(movingAvgData)
      .transition().ease(easeFunc).duration(T)
        .attr('d', movingAvg1)
    avgLine2.datum(movingAvgData)
      .transition().ease(easeFunc).duration(T)
        .attr('d', movingAvg2)
};

// brush function
function brushed() {
    const selection = d3.event.selection || x2.range(); // default brush selection
    x.domain(selection.map(x2.invert, x2)); // new focus x-domain
    const days = numDays();
    focus.selectAll(".bar")
        .attr("x", d => x(d3.timeHour.offset(d.key,1)))
        .attr("width", getBarWidth())
    focus.selectAll(".avgLine")
        .attr("d", movingAvg1);
    focus.select(".axis--x")
        .call(xAxis)
    summaryStats()
};

function numDays() {
    return (x.domain()[1] - x.domain()[0]) / 86400000
}

function getBarWidth() {
    return width / numDays() * 22/24
}

// brush snapping function
function brushended() {
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) brushed(); // Empty selection returns default brush
    const dateRange = d3.event.selection.map(x2.invert);
    let dayRange = dateRange.map(d3.timeDay.round);
    // If empty when rounded, use floor & ceil instead.
    if (dayRange[0] >= dayRange[1]) {
        dayRange[0] = d3.timeDay.floor(dateRange[0]);
        dayRange[1] = d3.timeDay.offset(dayRange[0]);
    }
    d3.select(this)
      .transition()
        .call(d3.event.target.move, dayRange.map(x2));

    updateAll();
};
// calculates simple moving average over N days
// assumes no missing dates (best dataset format)
function movingAverage(data, N) {
    const data2 = resampleDates(data)
    return data2.map((row, idx, total) => {
      const startIdx = Math.max(0, idx-N+1)
      const endIdx = idx
      const movingWindow = total.slice(startIdx, endIdx+1)
      const sum = movingWindow.reduce((a,b) => a + b.value, 0)
      return {
        key: d3.timeHour.offset(row.key, 12), // offset point by 12 hrs (noon)
        avg: sum / movingWindow.length,
      };
    });
};

// resamples dates to make sure there are no missing dates
function resampleDates(data) {
    const startDate = d3.min(data, d => d.key)
    const endDate = d3.max(data, d => d.key)
    const dateRange = d3.timeDay.range(startDate, d3.timeDay.offset(endDate,1), 1)
    return dateRange.map(day => {
      return data.find(d => d.key >= day && d.key < d3.timeHour.offset(day,1)) || {'key':day, 'value':0}
    })
};

function changeDate(T) {
    endDate = d3.timeDay.offset(d3.max(dataDate, d => d.key),1)
    x.domain([d3.min(dataDate, d => d.key), endDate]);

    beginDate = T == '1W' ? d3.timeDay.offset(endDate, -7) :
                T == '2W' ? d3.timeDay.offset(endDate, -14) :
                T == "1M" ? d3.timeMonth.offset(endDate, -1) :
                T == "3M" ? d3.timeMonth.offset(endDate, -3) :
                T == "YTD" ? d3.timeYear(new Date) : null

    selection.attr("class", "brush")
        .call(brush)
        .call(brush.move, [x(beginDate), x(endDate)]) // initialize brush selection

    dateDim.filter([beginDate, endDate]);
    updateAll();
};
