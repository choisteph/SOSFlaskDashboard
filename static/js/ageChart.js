function makeAgeChart() {// set up dimensions of age horizontal bar graph

    ageDim = CF.dimension(d => d.Age);
    ageGrp = ageDim.group();
    dataAge = ageGrp.all();
    ageArray = [];

    marginAge = {top: 30, right: 75, bottom: 40, left: 45},
        widthAge = 450 - marginAge.left - marginAge.right,
        heightAge = 400 - marginAge.top - marginAge.bottom;

    // append age graph 'svg'
    svgAge = d3.select("#age")
        .attr("width", widthAge + marginAge.left + marginAge.right)
        .attr("height", heightAge + marginAge.top + marginAge.bottom)
      .append("g")
        .attr("transform", `translate(${marginAge.left},${marginAge.top})`)

    // set the x and y axis of the age graph
    xAge = d3.scaleLinear()
        .domain([0, d3.max(dataAge, d => d.value)])
        .range([widthAge, 0])
    yAge = d3.scaleBand()
        .padding(0.2)
        .domain(dataAge.map(d => d.key))
        .range([0, heightAge])
    let yAxisAge = d3.axisRight()
        .scale(yAge)

    // append bars to age graph
    barsAge = svgAge.selectAll(".graph")
      .data(dataAge)
      .enter().append("rect")
        .attr("class", "barAge")
        .attr("y", d => yAge(d.key))
        .attr("height", yAge.bandwidth())
        .attr("x", d => xAge(d.value))
        .attr("width", d => widthAge - xAge(d.value))
        .style("fill", '#FB9A99')
        .on('click', function(d) {
            // if clicked, filter table
            if (ageArray.includes(d.key)) {
                d3.select(this)
                    .style("fill", '#FB9A99')
                    .attr('stroke-width', 0)
                    .attr('stroke', '')
                ageArray.splice(ageArray.indexOf(d.key),1)
            } else {
                d3.select(this)
                    .style('fill', '#d4f2e0')
                    .attr('stroke-width', 4)
                    .attr('stroke', '#95dfb3');
                ageArray.push(d.key);
            }
            ageArray.length > 0 ? ageDim.filter(d => ageArray.includes(d)) : ageDim.filterAll()
            updateAll();
        });

    // adds text for bars on age
    barsAgeLabel = svgAge.selectAll("text")
      .data(dataAge)
      .enter().append("text")
        .attr("class", "chart")
        .style("font-size","16px")
        .attr("x", d => xAge(d.value) - 32)
        .attr("y", d => yAge(d.key) + yAge.bandwidth() - 18)
        .text(d => d.value);

    // adds text on y axis for age graph
    svgAge.append("g")
        .attr("class", "y")
        .call(yAxisAge)
        .attr("transform", `translate(${widthAge},0)`)
      .selectAll(".tick text")
        .attr("x", 10)

    // specifies size for y axis age graph
    svgAge.select(".y")
      .selectAll("text")
        .style("font-size","16px");

    // adds text for x axis age graph
    svgAge.append("g")
        .attr("class","x")
        .attr("transform", `translate(0,${heightAge})`)
        .call(d3.axisBottom(xAge).ticks(6))
      .selectAll(".tick text")
        .style("font-size","16px")
        .attr("y", 10);
};

function updateAge() {
    const xmax = d3.max([5, d3.max(dataAge, d => d.value)])
    const easeFunc = d3.easeQuad;
    const T = 750

    xAge.domain([0, xmax]);
    svgAge.select(".x")
      .transition().duration(T*0.5)
        .call(d3.axisBottom(xAge).ticks(6))
      .selectAll(".tick text")
        .style("font-size","16px")

    barsAge.transition().ease(easeFunc).duration(T)
        .attr("x", d => xAge(d.value))
        .attr("width", d => (widthAge - xAge(d.value)));

    const labelOffset = -18
    barsAgeLabel.transition().ease(easeFunc).duration(T)
        .attr("x", d => xAge(d.value) + labelOffset)
        .text(d => d.value);
  };

function resetAge() {
    ageArray = [];
    ageDim.filterAll();
    barsAge.style("fill", "#FB9A99")
        .attr('stroke', '')
        .attr('stroke-width', 0);
    updateAll();
};
