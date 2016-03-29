var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var xValue = function (d) {
    var s = parseInt(d.sanders);
    var t = parseInt(d.trump);
    var x = (s - t) / (s + t);
    return x;
};

var xScale = d3.scale.linear().range([0, width]); // value -> display

var xMap = function (d) {
        return xScale(xValue(d));
    } // data -> display


var yValue = function (d) {
        if (d.trump == 0)
            return 0.1;
        return d.trump;
    }, // data -> value
    yScale = d3.scale.linear().range([height, 1]), // value -> display
    yMap = function (d) {
        return yScale(yValue(d));
    } // data -> display


var cValue = function (d) {
        if (d.trump < d.sanders)
            return 1;
        if (d.trump > d.sanders)
            return -1;
        return 0;
    },
    color = d3.scale.category10();




var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr('width', 400)
    .style("opacity", 0);


d3.csv("data.csv", function (error, data) {

    data.sort(function (b,a) {
        return (a.trump + a.sanders) - (b.trump + b.sanders);
    });
    var maxval = data.reduce(function(acc, d) {
        return Math.max(acc, d.trump, d.sanders);
    }, 0);

    xScale.domain([-1, 1]);
    yScale.domain([0, data.length * 20]);
    height = data.length * 20;

    var svg = d3.select("#list").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
        .append('line')
        .attr('class', 'guideline')
        .attr("x1", xScale(0))  //<<== change your code here
        .attr("y1", 0)
        .attr("x2", xScale(0))  //<<== and here
        .attr("y2", 30 + height )
        .style("stroke-width", 2)
        .style("stroke", "green")
        .style("fill", "none");

    svg
        .append('line')
        .attr('class', 'guideline')
        .attr("x1", xScale(-1))  //<<== change your code here
        .attr("y1", 20)
        .attr("x2", xScale(-1))  //<<== and here
        .attr("y2", 30 + height )
        .style("stroke-width", 2)
        .style("stroke", "red")
        .style("fill", "none");

    svg
        .append('line')
        .attr('class', 'guideline')
        .attr("x1", xScale(1))  //<<== change your code here
        .attr("y1", 20)
        .attr("x2", xScale(1))  //<<== and here
        .attr("y2", 30 + height )
        .style("stroke-width", 2)
        .style("stroke", "blue")
        .style("fill", "none");

    svg
        .append('text')
        .attr('class', 'explain')
        .attr('x', xScale(-1))
        .attr('y', 0)
        .text('More popular in /r/The_Donald')
        .style("text-anchor", "middle");

    svg
        .append('text')
        .attr('class', 'explain')
        .attr('x', xScale(1))
        .attr('y', 0)
        .text('More popular in /r/SandersForPresident')
        .style("text-anchor", "middle");

    var dots = svg.selectAll(".dot")
        .data(data);

    dots.enter().append("text")
        .attr('transform', 'translate(0, 60)')
        .attr("class", "label")
        .attr("x", xMap)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .text(function (d) {
            return d.subreddit;
        })
        .style("text-anchor", "middle")
        .on("mousedown", function (d) {
            console.log(d);
        })
        .on("mouseover", function (d) {
            var total = parseInt(d.sanders) + parseInt(d.trump);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Trump: " + d['trump'] + "<br/> Sanders: " + d['sanders'] + "<br/> Total: " + total)
                .style("left", (d3.event.pageX + 50) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        })

});



