var graphman = {
	delayConst: 5000,
	plots: {},
	width:	800, 
	height: 500,
	colorScale: {
		scale: d3.scale.category10(),
		index: 0
	},
	margins: {
		top: 20,
		right: 20,
		bottom: 20,
		left: 40
	},
	graphTag: "visualize",
	render: function(t){
		bootbox.dialog({
			size: 'large',
			title: "A " + t + " graph",
			message: '<div style="overflow: scroll; width: 100%; height: 500px;"><svg id="' + this.graphTag + '" width="0" height="0"></svg></div><ul id="visualize_legend" class="list-group" style="position: absolute; left: 100%; top: 10%"><li class="list-group-item"><strong>LEGEND</strong></ul>'
		});
	},
	/* retrieve data from QueueApp.models */
	getData: function(name, field){
		var series;
		data = null;
		for(var i = 0; i < QueueApp.models.length; i++){
			if(QueueApp.models[i].view.username == name 
				&& QueueApp.models[i].entity.series
				&& QueueApp.models[i].entity.series[field]){
				series = QueueApp.models[i].entity.series;
				data = {
					x: [],
					y: []
				};
			}
		}
		fieldSeries = series[field];
		var len = fieldSeries.t.length;
		for(var i = 0; i < len; i++){
			data.x.push(fieldSeries.t[i]);
			data.y.push(fieldSeries.f[i]);
		}
		return data;
	},
	addPlot: function(name, field, c){
		d = this.getData(name, field);
		if(d == null)
			return;
		if(c == null) 
			c = this.colorScale.scale(this.colorScale.index); this.colorScale.index++;
		
		this.plots[name + "_" + field] = { 
			data: d, 
			color: c, 
			xMin: d3.min(d.x),
			xMax: d3.max(d.x),

			yMin: d3.min(d.y),
			yMax: d3.max(d.y)
		};
	},
	/* remove param */
	removePlot: function(name, field){
		if (this.plots[name + "_" + field])
			delete this.plots[name + "_" + field];
	},
	clear: function(){
		this.plots = {};
	},
	/* bins are uniformly spaced over the width */
	makeHistogram: function(interval, index){
		var series = null;
		var name = null;
		var i = 0; 
		index = (index == null)? 0 : index;
		for(prop in this.plots){
			if(i == index){
				series = this.plots[prop];
				name = prop;
			}
			else
				i++;
		}
		if(series == null)
			return;
		var values = series.data.y;
		// A formatter for counts.
		var formatCount = d3.format(",.0f");

		interval = (interval == null)? 10 : interval;
		var bins = Math.ceil((series.yMax - series.yMin )/ interval);
		/* for bins great than 30 I want more space */
		var margin = this.margins;
		var width = this.width;
		/* expand width */
		width = (bins > 30)? width + 20*(bins-30) : width;
		var height = this.height + Math.floor(d3.max(values)/10);

		innerHeight = height - margin.top - margin.bottom;
		// Generate a histogram using twenty uniformly-spaced bins.
		
		var x = d3.scale.linear()
			.domain([Math.ceil(series.data.xMin) || 0, bins + (Math.ceil(series.data.xMin) || 0)])
			.range([0, width - 20]);


		var data = d3.layout.histogram()
			.bins(x.ticks(bins))
			(values);

		var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d) { return d.y; })])
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		this.render("histogram");
		d3.select("#" + this.graphTag).empty(); //remove all previous graphs
		var svg = d3.select("#" + this.graphTag)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var bar = svg.selectAll(".bar")
			.data(data)
			.enter().append("g")
			.attr("class", "bar")
			//.style("opacity", 1) // settinf opacity to 0 at the begining.
			.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

		var dC = (5000 / bins) 
		try{
			bar.append("rect")
				.attr("y",  innerHeight)
				.attr("height", 0)
				.attr("width", (x(data[0].dx) - 1) || 1)
				.attr("fill", series.color)
				.transition()
					.delay(function (d, i) { return i*dC; })
					.ease("exponential")
					.attr("height", function(d) { return (height - y(d.y)) || 0; })
					.attr("y", y);
	
			bar.append("text")
				.attr("dy", ".75em")
				.attr("y", 12)
				.attr("x", (x(data[0].dx) / 2) || 1)
				.attr("text-anchor", "middle")
				.text(function(d) { return formatCount(d.y); });
		} catch(e){
			/* maybe put error message */
		}

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		var n = [name];
		var legend = d3.select("#visualize_legend");
		var li = legend.append("li")
			.data(n)
			.attr("class", "list-group-item")
			.text(function(d, i){return "" + d;})
			.attr("style", "padding-right: 1em")
			.attr("style", "width: 20em");

		li.append("svg")
			.attr("width", 20)
			.attr("height", 11)
			.attr("style", "float: right")
			.append("rect")
				.attr("width", 10)
				.attr("height", 10)
				.attr("x", 10)
				.attr("y", 0)
				.attr("fill", series.color);





				//THIS IS GOOD ONE
				// var bar = svg.selectAll(".bar");

				// bar.transition()
				// 	.each(function(d, i){
				// 		d3.select(this)
				// 			.transition()
				// 			.delay(i * 1000)
				// 			.style("opacity", 1);
				// 	})





		// var chartHeight = this.height;
		// 			d3.select(svg)
		// 				.selectAll("rect")
		// 				.transition()
		// 				.delay(function (d, i) { return i*100; })
		// 				.attr("y", function (d, i) { return chartHeight-y(d); })
  //       				.attr("height", function (d) { return y(d); });
				// var my = d3.selectAll("bar");
				// 	my.transition()
				// 	  .opacity(0);

	},
	makeGraph: function(type, param){
		if(Object.keys(this.plots).length == 0)
			return;
		/* let's just move away if we are doing histogram */
		if(type == "histogram"){
			this.makeHistogram(param[0], param[1]);
			return;
		}
		/* param is just auxiliary */
		var xMins = [];
		var xMaxs = [];
		var yMins = [];
		var yMaxs = [];
		var totalDots = 0;
		for(p in this.plots){
			if(this.plots[p]){
				xMins.push(this.plots[p].xMin);
				xMaxs.push(this.plots[p].xMax);
				yMins.push(this.plots[p].yMin);
				yMaxs.push(this.plots[p].yMax);
				totalDots += this.plots[p].data.x.length;
			}
		}
		var xRange = d3.scale.linear()
			.range([this.margins.left, this.width - this.margins.right])
			.domain([
				d3.min(xMins), d3.max(xMaxs)
			]);
		var yRange = d3.scale.linear()
			.range([this.height - this.margins.top, this.margins.bottom])
			.domain([
				d3.min(yMins), d3.max(yMaxs)
			]);
		this.render((type == "scatter")? "scatter" : "line");
		var visualize = d3.select("#" + this.graphTag)
			.attr("height", this.height + this.margins.top + this.margins.bottom)
			.attr("width", this.width + this.margins.left + this.margins.right)
		var legend = d3.select("#visualize_legend");
		var xAxis = d3.svg.axis()
			.scale(xRange)
			.tickSize(5)
			.tickSubdivide(true);
		var yAxis = d3.svg.axis()
			.scale(yRange)
			.tickSize(5)
			.orient('left')
			.tickSubdivide(true);

		visualize.empty(); //remove all previous graphs
		visualize.append('svg:g')
	  		.attr('class', 'x axis')
	  		.attr('transform', 'translate(0,' + (this.height - this.margins.bottom) + ')')
	  		.call(xAxis);

		visualize.append('svg:g')
	  		.attr('class', 'y axis')
	  		.attr('transform', 'translate(' + (this.margins.left) + ',0)')
	 		.call(yAxis);
		//return;
	 	var g = visualize.append("svg:g");
		var _lineAnimate = 0;
		for(p in this.plots){
			var n = [p];
			var tmp = this.plots;
			var li = legend.append("li")
				.data(n)
				.attr("class", "list-group-item")
				.text(function(d, i){return "" + d;})
				.attr("style", "padding-right: 1em")
				.attr("style", "width: 20em");
			li.append("svg")
				.attr("width", 20)
				.attr("height", 11)
				.attr("style", "float: right")
				.append("rect")
					.attr("width", 10)
					.attr("height", 10)
					.attr("x", 10)
					.attr("y", 0)
					.attr("fill", tmp[p].color);
			
			switch(type){
				case "scatter":
				g.selectAll("scatter-dots")
					.data(this.plots[p].data.y)  // using the values in the ydata array
					.enter().append("svg:circle")  // create a new circle for each value
					.attr("cy", function (d) { 
						return yRange(d);
					}) // translate y value to a pixel
					.attr("cx", function (d,i) { 
						return xRange(tmp[p].data.x[i]); 
					}) // translate x value
					.attr("r", 3) // radius of circle
					.attr("fill", function(d,i){
						return tmp[p].color;
					})
					.style("opacity", 0); // opacity of circle
				var circle = g.selectAll("circle");
				/* 
					max time = 5s
					with N dots that means each has a total of 5000/N ms to work with
				*/
				var dC = this.delayConst / totalDots;
				circle.transition()
					.each(function(d, i){
						d3.select(this)
							.transition()
							.delay(i * dC)
							.duration(i * dC)
							.style("opacity", 1);
					})
			break;
			case "line":

				var lineFunc = d3.svg.line()
					.x(function(d) {
						return xRange(d.x);
					})
					.y(function(d) {
						return yRange(d.y);
					})
					.interpolate('basis');

				var len = this.plots[p].data.x.length;
				var data = [];
				for(var i = 0; i < len; i++){
					data.push({
						x: this.plots[p].data.x[i],
						y: this.plots[p].data.y[i]
					});
					//console.log(data);
				}
				visualize.append("svg:path")
					.attr('d', lineFunc(data))
					.attr('stroke', tmp[p].color)
					.attr('stroke-width', 1)
					.attr('fill', 'none')
					.transition();

				if(_lineAnimate == Object.keys(this.plots).length - 1){
					var curtain = visualize.append('rect')
					    .attr('x', -1 * (this.width + this.margins.left))
						.attr('y', -1 * (this.height - this.margins.bottom))
						.attr('height', this.height)
						.attr('width', this.width)
						.attr('class', 'curtain')
						.style("opacity", 1)
						.attr('transform', 'rotate(180)')
						.style('fill', 'white')

					var t = visualize.transition()
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
						.attr('transform', 'translate(' + this.width + ', 0)')
				}
			}
			_lineAnimate++;
		}
	}
	
};
