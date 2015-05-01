	NUM_PLOTS = 0;

function getLineData(name, field){
	var series;
	for(var i = 0; i < QueueApp.models.length; i++){
		if(QueueApp.models[i].view.name == name){
			series = QueueApp.models[i].entity.series;
		}
	}
	lineData = [];
	fieldSeries = series[field];
	var len = fieldSeries.t.length;
	for(var i = 0; i < len/50; i++){
		lineData.push({
			x: fieldSeries.t[i],
			y: fieldSeries.f[i]
		});
	}

	return lineData;
}

 function makeScatterGraph(name, field){
	var lineData = getLineData(name, field);
	var xdata = [];
	var ydata = [];
	var len = lineData.length;
	for(var i = 0; i < len; i++){
		xdata.push(lineData[i].x);
		ydata.push(lineData[i].y);
	}
	// data that you want to plot, I've used separate arrays for x and y values
	bootbox.dialog({
		size: 'large',
		title: "scatter plot for " + name + " " + field,
		message: '<svg id="visualize" width="868" height="500"></svg>'
	});
	$("#visualize").show();
	var vis = d3.select('#visualize'),
		WIDTH = 868,
		HEIGHT = 500,
		MARGINS = {
		  top: 20,
		  right: 20,
		  bottom: 20,
		  left: 50
		};

		var xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function(d) {
		  return d.x;
		}), d3.max(lineData, function(d) {
		  return d.x;
		})]);
		
		var yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function(d) {
		  return d.y;
		}), d3.max(lineData, function(d) {
		  return d.y;
		})]);
		
		var xAxis = d3.svg.axis()
		  .scale(xRange)
		  .tickSize(5)
		  .tickSubdivide(true);
		  
		var yAxis = d3.svg.axis()
		  .scale(yRange)
		  .tickSize(5)
		  .orient('left')
		  .tickSubdivide(true);

		var xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function(d) {
		  return d.x;
		}), d3.max(lineData, function(d) {
		  return d.x;
		})]);
		
		var yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function(d) {
		  return d.y;
		}), d3.max(lineData, function(d) {
		  return d.y;
		})]);
		
		var xAxis = d3.svg.axis()
		  .scale(xRange)
		  .tickSize(5)
		  .tickSubdivide(true);
		  
		var yAxis = d3.svg.axis()
		  .scale(yRange)
		  .tickSize(5)
		  .orient('left')
		  .tickSubdivide(true);

	vis.append('svg:g')
	  .attr('class', 'x axis')
	  .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
	  .call(xAxis);

	vis.append('svg:g')
	  .attr('class', 'y axis')
	  .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
	  .call(yAxis);
	// draw the graph object
	var g = vis.append("svg:g"); 

	g.selectAll("scatter-dots")
	  .data(ydata)  // using the values in the ydata array
	  .enter().append("svg:circle")  // create a new circle for each value
	      .attr("cy", function (d) { return yRange(d); } ) // translate y value to a pixel
	      .attr("cx", function (d,i) { return xRange(xdata[i]); } ) // translate x value
	      .attr("r", 3) // radius of circle
	      .style("opacity", 1) // opacity of circle
	      .style("fill", "blue");

	      var circle = g.selectAll("circle");
/* 

||||||||||||||||||||||  SAMPLE ANIMATIONS |||||||||||||||||||||||||

		// plots on screen at location with fade if opacity is defined at 0 above
	  var circle = g.selectAll("circle");

	 	// circle.transition()
		 // 	.each(function(d, i){
		 // 		d3.select(this)
		 // 		.transition()
		 // 		.delay(i * 10)
		 // 		.duration(i * 10)
		 // 		.style("opacity", 1);
		 // 	});
*/
		//  transitions each node from 0 to its y coordinate
	 	circle.transition()
			.each(function(d, i){
				var oldY = d3.select(this).attr("cy");
				d3.select(this).attr("cy", HEIGHT-20);
				d3.select(this)
					.transition()
					.delay(i * 10)
					.duration(i * 10)
					.attr("cy", oldY)
					.style("opacity", 1);
			});	 	
	  	//
	  	// .style("opacity", .5);
		
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

}



function makeGraph(name, field){
	bootbox.dialog({
		size: 'large',
		title: "scatter plot for " + name + " " + field,
		message: '<svg id="visualize" width="868" height="500"></svg>'
	});
	$("#visualize").show();

	var lineData = getLineData(name, field);
	var vis = d3.select('#visualize'),
		WIDTH = 868,
		HEIGHT = 500,
		MARGINS = {
		  top: 20,
		  right: 20,
		  bottom: 20,
		  left: 20
		},
		xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function(d) {
		  return d.x;
		}), d3.max(lineData, function(d) {
		  return d.x;
		})]),
		yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function(d) {
		  return d.y;
		}), d3.max(lineData, function(d) {
		  return d.y;
		})]),
		xAxis = d3.svg.axis()
		  .scale(xRange)
		  .tickSize(5)
		  .tickSubdivide(true),
		yAxis = d3.svg.axis()
		  .scale(yRange)
		  .tickSize(5)
		  .orient('left')
		  .tickSubdivide(true);

	vis.append('svg:g')
	  .attr('class', 'x axis')
	  .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
	  .call(xAxis);

	vis.append('svg:g')
	  .attr('class', 'y axis')
	  .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
	  .call(yAxis);

	var lineFunc = d3.svg.line()
		.x(function(d) {
			return xRange(d.x);
		})
		.y(function(d) {
			return yRange(d.y);
		})
		.interpolate('basis');

	var test = 	vis.append('svg:path')
		.attr('d', lineFunc(lineData))
		.attr('stroke', 'blue')
		.attr('stroke-width', 1)
		.attr('fill', 'none')
		.transition()

	var curtain = vis.append('rect')
	    .attr('x', -1 * (WIDTH + MARGINS.left))
	    .attr('y', -1 * (HEIGHT - MARGINS.bottom))
	    .attr('height', HEIGHT)
	    .attr('width', WIDTH)
	    .attr('class', 'curtain')
	    .attr('transform', 'rotate(180)')
	    .style('fill', 'white')
 
 var t = vis.transition()
    .delay(750)
    .duration(6000)
    .ease('linear')
    .each('end', function() {
      d3.select('line.guide')
        .transition()
        .style('opacity', 0)
        .remove()
    });

    t.select('rect.curtain')
	    .attr('width', 0);
	  t.select('line.guide')
	    .attr('transform', 'translate(' + WIDTH + ', 0)')

	NUM_PLOTS++;
};
