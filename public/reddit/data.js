var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var xValue = function (d) {
    var s = d.sanders;
    var t = d.trump;
    var x = (s - t) / (s + t);
    return x;
};

var xScale = d3.scale.linear().range([0, width]); // value -> display

var xMap = function (d) {
        return xScale(xValue(d));
    };


var yScale = d3.scale.linear().range([height, 1]);

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr('width', 400)
    .style("opacity", 0);


d3.csv("data.csv", function (error, data) {


    data = data.map(function (d) {
        return {subreddit: d.subreddit, trump: parseInt(d.trump), sanders: parseInt(d.sanders)};
    }).filter(function (d) {
        return d.trump + d.sanders >= 10;
    });


    data.sort(function (b,a) {
        return (a.trump + a.sanders) - (b.trump + b.sanders);
    });

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
            var total = d.sanders + d.trump;
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



