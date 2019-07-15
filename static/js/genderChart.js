function makeGenderChart() {

    // set up dimension and groups
    gender = CF.dimension(d => d.Gender);
    gendergrp = gender.group();
    dataGender = gendergrp.all();
    var genderArray = [];

    // set up dimensions for gender donut chart
    var marginGender = {top: -30, right: 0, bottom: 0, left: 0},
      widthGender = 480 - marginGender.left - marginGender.right,
      heightGender = 360 - marginGender.top - marginGender.bottom,
      radius = Math.min(widthGender, heightGender) / 2;

    // append gender graph 'svg'
    var svgGender = d3.select("#gender")
        .attr("width", widthGender)
        .attr("height", heightGender)
        .append("g")
        .attr('viewBox','0 0 '+Math.min(width,height) +' '+Math.min(width,height) )
        .attr("transform", `translate(${widthGender/2},${heightGender/2})`);

    // sets up arc and dimensions of dount table
    pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    arc = d3.arc()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.5)

    // sets color of donut chart
    color = d3.schemePaired.slice(6);
    slices = svgGender.datum(dataGender).selectAll("path")
        .data(pie)
        .join("path")
        .attr("fill", (d,i) => color[i] )
        .attr("d", arc)
        .each(function(d) {// store the initial angles
            this._current = d
        })

        // onclick
        .on('click', function(d,i) { // set up crossfilter

            if (genderArray.includes(d.data.key)) { // remove filter
                genderArray.splice(genderArray.indexOf(d.data.key),1)
                d3.select(this).attr('fill', color[i])
            }
            else { // add filter
                genderArray.push(d.data.key)
                d3.select(this).attr('fill', 'red')
            }

            // filters dimension
            genderArray.length === 0 ? gender.filterAll() : gender.filter(d => genderArray.includes(d));

            // filters other graphs
            updateAll(gender.bottom(Infinity));

        });

    // puts label on donut chart
    label = svgGender.datum(dataGender).selectAll('text')
        .data(pie)
        .join('text')
        .attr('transform', d => 'translate(' + arc.centroid(d) + ')')
        .attr('dy','0.35em')
        .style('opacity', d => d.data.value==0 ? 0 : 1)
        .each(function(d) { // store the initial angles
    const angles = { startAngle: d.startAngle, endAngle: d.endAngle };
    this._current = angles;
    });

    // label top line
    label.append("tspan")
        .attr('class', 'count age-group')
        .attr("x", 0)
        .attr("y", "-0.2em")
        .text(d => d.data.key);

    // label bottom line
    labelCount = label.append("tspan")
        .attr('class', 'count')
        .attr("x", 0)
        .attr("y", "1.5em")
        .text(d => d.data.value);
}

// update donut table
function updateGender() {
    let easement = d3.easeSin;
    let T = 750;

    // changes arc angle of donut table
    function arcTween(a) {
        let i = d3.interpolate(this._current, a);
        this._current = i(0);
        return t => arc(i(t));
    };

    slices.data(pie)
        .transition().ease(easement).duration(T)
        .attrTween("d", arcTween); // redraw the arcs
    label.data(pie)
        .transition().ease(easement).duration(T) // animate text movement
        .attr('dy','0.35em')
        .style('opacity', d => d.data.value == 0 ? 0 : 1)
        .attrTween("transform", function(d) {
            const angles = { startAngle: d.startAngle, endAngle: d.endAngle };
            const interpolate = d3.interpolate(this._current, d);
            this._current = angles;
            return function(t) {
            return `translate(${arc.centroid(interpolate(t))})`;
            };
        });

    labelCount.text(d => d.data.value)
}
