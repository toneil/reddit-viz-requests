function translate (key) {
    var translations = {
        'ART': 'Art Museums',
        'BOT': 'Arboretums, Botanical Gardens, & Nature Centers',
        'CMU': "Children's Museums",
        'GMU': 'Uncategorized',
        'HSC': 'Historical Societies, Historic Preservation',
        'HST': 'History Museums',
        'NAT': 'Natural History & Natural Science Museums',
        'SCI': 'Science & Technology Museums & Planetariums',
        'ZAW': 'Zoos, Aquariums, & Wildlife Conservation'
    };
    return translations[key];
}

function makeFilter (dimension) {
    var filters = [];
    return function (key) {
        console.log('filtering',key);
        var index = filters.indexOf(key);
        if (index == -1)
            filters.push(key);
        else
            filters.splice(index, 1);
        dimension.filter(function (d) {
            return filters.indexOf(d) == -1;
        });
        console.log(filters);
        return dimension;
    }
}


function museums () {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 5000 - margin.left - margin.right,
        height = 3000 - margin.top - margin.bottom;

    var xValue = function(d) { return d.LONGITUDE;}, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));} // data -> display


    var yValue = function(d) { return d.LATITUDE;}, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));} // data -> display


    var cValue = function(d) { return d.DISCIPL;},
        color = d3.scale.category10();

    xScale.domain([-126, -60]);
    yScale.domain([20,50]);

    var rScale =d3.scale.linear()
        .domain([0,9])
        .range([1,20]);

    var rMap = function(d) {
        if (!!d.INCOME) {
            return rScale(d.INCOMECD);
        }
        else
            return 1;
    };

    // add the graph canvas to the body of the webpage
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .attr('width', 1000)
        .style("opacity", 0);

    var filterWrapper;

    function toggleFilter (key) {
        render(filterWrapper(key));
    }

    d3.csv("museums.csv", function(error, data) {
        var cfData = crossfilter(data);
        var museumsByKind = cfData.dimension(function (d) {return d.DISCIPL});

        filterWrapper = makeFilter(museumsByKind);
        console.log(filterWrapper("Dummy").top(5));
        render(filterWrapper("Dummy"));
    });

    function render (dimension) {
        data = dimension.top(Infinity);
        console.log('Rendering');
        console.log(data.length);
        console.log(color.domain());

        var dots = svg.selectAll(".dot")
            .data(data);

        dots.enter().append("circle")
            .filter(function (d) {return d.LONGITUDE > -126 && d.ADSTATE !== 'HI' && d.LATITUDE != 0})
            .attr("class", "dot")
            .attr("r", rMap)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .on("mousedown", function (d) {
                console.log(d);
            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d["COMMONNAME"] + "<br/> 2015 Income: $" + d['INCOME'])
                    .style("left", (d3.event.pageX + 50) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .style("fill", function(d) { return color(cValue(d));});

        dots.exit()
            .remove();

        // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + (1700 + i * 100) + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width- 1000)
            .attr("width", 60)
            .attr("height", 60)
            .style("fill", color)
            .on('mousedown', toggleFilter);

        // draw legend text
        legend.append("text")
            .attr('class', 'legend-text')
            .attr("x", width - 900 )
            .attr("y", 30)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(translate)
    }
}



