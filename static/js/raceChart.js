function makeRaceChart() {
    // set up race
    raceDim = CF.dimension(d => d.Race);
    raceGrp = raceDim.group();
    dataRace = raceGrp.all();
    raceArray = [];

    const white = dataRace[7];
    const black = dataRace[2]
    const hispanic = dataRace[3]
    const asian = dataRace[1]
    const american = dataRace[0]
    const native = dataRace[4]
    const other = dataRace[5]
    const unknown = dataRace[6];

    dataRace = [white, black, hispanic, asian, american, native, other, unknown];

    // set up dimensions for race chart
    marginRace = {top: 15, right: 40, bottom: 40, left: 170},
    widthRace = 500 - marginRace.left - marginRace.right,
    heightRace = 400 - marginRace.top - marginRace.bottom;

    // append race 'svg'
    svgRace = d3.select("#race")
        .attr("width", widthRace + marginRace.left + marginRace.right)
        .attr("height", heightRace + marginRace.top + marginRace.bottom)
      .append("g")
        .attr("transform", `translate(${marginRace.left},${marginRace.top})`)

    // sets the x and y axis of the race graph
    xRace = d3.scaleLinear()
        .domain([0, d3.max(dataRace, d => d.value)])
        .range([0, widthRace])
    yRace = d3.scaleBand()
        .padding(0.2)
        .domain(dataRace.map(d => d.key))
        .range([0, heightRace])
    let yAxisRace = d3.axisLeft()
        .scale(yRace);

    // adds bars for race graph
    barsRace = svgRace.selectAll(".graph")
      .data(dataRace)
      .enter().append("rect")
        .attr("class", "bar1")
        .attr("y", d=>yRace(d.key))
        .attr("height", yRace.bandwidth())
        .attr("x", 0)
        .attr("width", d=>xRace(d.value))
        .style("fill",'#CAB2D6')
        .on('click', function(d) {
            if (raceArray.includes(d.key)) {
                d3.select(this)
                    .style("fill", '#CAB2D6')
                    .attr('stroke-width', 0)
                    .attr('stroke', '')
                raceArray.splice(raceArray.indexOf(d.key),1);
            } else {
                d3.select(this)
                    .style('fill', '#d4f2e0')
                    .attr('stroke-width', 4)
                    .attr('stroke', '#95dfb3')
                raceArray.push(d.key);
            }
            raceArray.length > 0 ? raceDim.filter(d => raceArray.includes(d)) : raceDim.filterAll()
            updateAll();
        });

    // adds text for bars on race
    barsRaceLabel = svgRace.selectAll("text")
      .data(dataRace)
      .enter().append("text")
        .attr("class", "chart")
        .style("font-size","16px")
        .attr("x", d => xRace(d.value) + 12)
        .attr("y", d => yRace(d.key) + yRace.bandwidth() - 14)
        .text(d => d.value);

    // add y axis labels and size
    svgRace.append("g")
        .attr("class", "y")
        .call(yAxisRace)
      .selectAll(".tick text")
        .call(wrap, yRace.bandwidth() + 70)
        .attr("x", -12);

    svgRace.select(".y")
      .selectAll("text")
        .style("font-size","16px");

    // sets up x-axis with ticks and size
    svgRace.append("g")
        .attr("class", "x")
        .attr("transform", `translate(0,${heightRace})`)
        .call(d3.axisBottom(xRace).ticks(6))
      .selectAll(".tick text")
        .style("font-size","16px")
        .attr("y", 15);
};

function updateRace() {
    const xmax = d3.max([5, d3.max(dataRace, d => d.value)])
    const easeFunc = d3.easeQuad;
    const T = 750

    xRace.domain([0, xmax]);
    svgRace.select(".x")
      .transition().duration(T*0.5)
        .call(d3.axisBottom(xRace).ticks(6))
      .selectAll(".tick text")
        .style("font-size","16px")

    barsRace.transition().ease(easeFunc).duration(T)
        .attr("width", d => xRace(d.value));

    const labelOffset = 14
    barsRaceLabel.transition().ease(easeFunc).duration(T)
        .attr("x", d => xRace(d.value) + labelOffset)
        .text(d => d.value);
};

function resetRace() {
    raceArray = [];
    raceDim.filterAll();
    barsRace.style("fill", "#CAB2D6")
        .attr('stroke', '')
        .attr('stroke-width', 0);
    updateAll();
};

// wraps axis text to two lines
function wrap(text, width) {
  text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word;

      if (words.length != 1 && words.length != 3) {
          var line = [],
          lineNumber = 0,
          lineHeight = 0.7, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", -15).attr("y", y - 14).attr("dy", dy + "em");

          while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
                  line.pop();
                  tspan.text(line.join(" "));
                  line = [word];
                  tspan = text.append("tspan").attr("x", -15).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
              }
          }
      }
  });
};