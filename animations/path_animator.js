
var DEBUG_HOVER = false;
var entityPath = [];
function runPathFlowAnimation() {
	
	d3.select("#red").attr("x",500);
	d3.select("#orange").attr("x",500);
	d3.select("#yellow").attr("x",500);
	d3.select("#blue").attr("x",500);
	d3.select("#green").attr("x",500);

	console.log("ANIMATION: started");

	document.getElementById("color_key").style.visibility = "visible";
	d3.select("#accordion")
		.transition().duration(1000)
		.style("opacity", 0).each("end", function() {	
   			d3.select("#color_key").transition().duration(1000).style("opacity", 1);
   			d3.select("#red").transition().duration(800).delay(400).attr("x",70);
 			d3.select("#orange").transition().duration(800).delay(600).attr("x",70);
 			d3.select("#yellow").transition().duration(800).delay(800).attr("x",70);
 			d3.select("#blue").transition().duration(800).delay(1000).attr("x",70);
 			d3.select("#green").transition().duration(800).delay(1200).attr("x",70);
   			document.getElementById("color_key").style.visibility = "visibility";
   			document.getElementById("accordion").style.visibility = "hidden";
		});
	

	var colorSpeed = {					// can shoose speeds for the simulation colors
		red:1,
		orange:2,
		yellow:3,
		blue:4,
		green:5
	}

	// preferences
	var STROKE_DASH 	= "3,9 3,9";
	var STROKE_COLOR 	= "#2980b9";  		// we can also randomize colors
	var STROKE_WIDTH 	= "6";
	var STROKE_OPACITY 	= "1";		// or do something with opacity
	var STROKE_LINECAP 	= "round";
	var DIRECTION 		= -1;			// (<-- 1) (--> -1) 		

	var paths = [];
	var images = [];
	var staticImages = [];

	var svg = document.getElementById("canvas").children[0];
	svg.id = "svg"; 					// assign id to svg
	
	var pathIds = 0; 					// assign ids to paths		
	

	for (var i = 0; i < svg.children.length; i++) {
		var currElmt = svg.children[i];
		
		if (currElmt.nodeName.toLowerCase() === "path" 
			&& currElmt.hasAttribute("stroke-width")) {					// filtering elements in svg - we only want paths

			var strokeVal = currElmt.getAttribute("stroke-width");		// this is the only way to identify paths
			if (strokeVal === "3") {

				currElmt.id = "path" + pathIds++;

				var dataFrom = currElmt.getAttribute("data-from");
				var dataTo = currElmt.getAttribute("data-to");

				var fromEnt;
				var toEnt;

				for (var k = 0;k<QueueApp.models.length;k++){
					if (QueueApp.models[k].view.id == dataFrom){
						fromEnt = QueueApp.models[k];
					} else if (QueueApp.models[k].view.id == dataTo) {
						toEnt = QueueApp.models[k];
					}
				}
				var temp = [fromEnt, toEnt];
				entityPath.push(temp);
				
				if (/^cloner/.test(fromEnt.view.id)){
					fromEnt.view.color = "yellow";
					currElmt.name = 3;
					toEnt.view.color = "yellow";
				}

				if (/^splitfunc/.test(fromEnt.view.id)){
					
					// if toEnt is dist1 assign path colorUp
					if (toEnt.view.id == fromEnt.dest[0].view.id){
                        
                        if ((/^thermometer/.test(dataTo)) || (/^reverser/.test(dataTo)) || (/^func/.test(dataTo))  ){
                            if (toEnt.view.color != undefined){
                                toEnt.view.color = colorSpeed[fromEnt.view.colorUp] > colorSpeed[toEnt.view.color] ? fromEnt.view.colorUp : toEnt.view.color;
                            } else {
                                toEnt.view.color = fromEnt.view.colorUp;
                            }
                        }

                        currElmt.name = colorSpeed[fromEnt.view.colorUp];
                        
                    } else {

                        if ((/^thermometer/.test(dataTo)) || (/^reverser/.test(dataTo)) || (/^func/.test(dataTo))  ){
                            if (toEnt.view.color != undefined){
                                toEnt.view.color = colorSpeed[fromEnt.view.colorDown] > colorSpeed[toEnt.view.color] ? fromEnt.view.colorDown : toEnt.view.color;
                            } else {
                                toEnt.view.color = fromEnt.view.colorDown;
                            }
                        }
                        currElmt.name = colorSpeed[fromEnt.view.colorDown];
                    }
                } 
                //case where we are using anything else
                else {
                    if (fromEnt.view.color != undefined){
                        // currElmt.style['stroke'] = fromEnt.view.color;
                    }
                    currElmt.name = colorSpeed[fromEnt.view.color];

                    if ((/^thermometer/.test(dataTo)) || (/^reverser/.test(dataTo)) || (/^func/.test(dataTo))  ){
                        
                        if (toEnt.view.color != undefined){
                            toEnt.view.color = colorSpeed[fromEnt.view.color] > colorSpeed[toEnt.view.color] ? fromEnt.view.color : toEnt.view.color;
                        } else {
                            toEnt.view.color = fromEnt.view.color;
                        }
                        currElmt.name = colorSpeed[fromEnt.view.color];
                    }
                }

				paths.push(currElmt);
			} 
		} else if (currElmt.nodeName.toLowerCase() === "a") {
			 if (currElmt.children[0] != null) {
				if (currElmt.children[0]["id"].endsWith("img")) {
					images.push(currElmt.children[0]);
				} else {
					staticImages.push(currElmt.children[0].parentNode);
				}
 			 }
		}
	}
	function runAnimations(path, speed) {
		var p = d3.select("#" + path.id);
		// fade out
	    p.transition().duration(800)
	    	.style("opacity", 0)
	    	.each("end", function() { 
	    		path.style['stroke-dasharray']	= STROKE_DASH;
				path.style['stroke-opacity'] 	= STROKE_OPACITY;
				path.style["stroke-linecap"] 	= STROKE_LINECAP;
				path.style['stroke-width'] 		= STROKE_WIDTH;
	    		animatePathFlow(path, speed, 0);
	    	} );
	}


	function animatePathFlow(path, speed, count) {

		if (count > 2){
			nIterations = 200 * iScale;
			msec = 50;
			path.style["stroke"] = "#2980b9"; /* pastel blue */
			return;
		} 
		var iScale = 1; 		// increase for longer time
		var nIterations = 0;
		var msec = 0.5;			// time interval
		switch(speed) {
			case 5: nIterations = 400 * iScale;
				msec = 25;
				path.style["stroke"] = "#27ae60"; /* green */
				break;
			case 4:
				nIterations = 200 * iScale;
				msec = 50;
				path.style["stroke"] = "#2980b9"; /* pastel blue */
				break;
			case 3:
				nIterations = 100 * iScale;
				msec = 100;
				path.style["stroke"] = "#f1c40f"; /* sunflower yellow */
				break;
			case 2:
				nIterations = 50 * iScale;
				msec = 200;
				path.style["stroke"] = "#e67e22"; /* carrot orange */
				break;
			case 1:
				nIterations = 25 * iScale;
				msec = 400;
				path.style["stroke"] = "#c0392b"; /* red */
				break;
			default:

				var dataFrom = path.getAttribute("data-from");

				var entSpeed = 4;

				for (var i = 0;i < entityPath.length;i++){
					if (entityPath[i][1].view != null) {
					if (entityPath[i][1].view.id == dataFrom){
						if (entityPath[i][1].view.color != undefined){
								 
							entSpeed = colorSpeed[entityPath[i][1].view.color];
						} else {

							entSpeed = colorSpeed[entityPath[i][0].view.color];
								 if (entSpeed == undefined) entSpeed = 4;
						}
					}
				}
				}
				animatePathFlow(path, entSpeed, count + 1);
				return;
				break;
		}

		// fade in
		var p = d3.select("#" + path.id);
		p.transition().duration(1000).style("opacity", 0.5)
	    			.each("end", function(){
	    				// path flow animation
	    				// animatePathFlow(path, speed);
	    });

		var c = 1;

		function loop(c) {
			setTimeout(function () { 

				$("#color_key").show();
				path.style['stroke-dashoffset'] = c * DIRECTION;
				if (c < 0) {
					loop(c+1)
				} else {
					if (path["id"] === "path"+(paths.length-1)) {
						console.log("ANIMATION: ended");
						restorePaths();
						SIM_IS_RUNNING = false;
						document.getElementById("accordion").style.visibility = "visible";

						d3.select("#color_key").transition().duration(1000)
							.style("opacity", 0).each("end", function() {
								d3.select("#accordion").transition().duration(1000).style("opacity", 1);
								$("#color_key").hide();
								//document.getElementById("color_key").style.display = "none";
							})
					}
				}
			}, msec)
		}

		loop(-nIterations); // fixes problem with Firefox
	}

	function restorePaths() {
		for (var i = 0; i < paths.length; i++) {
			paths[i].style['stroke-dasharray'] = "";	
			paths[i].style['stroke-opacity'] 	= "1";	
			paths[i].style['stroke-width'] 		= "3";	
			paths[i].style['stroke'] 			= "#3498db";
		}
	}

	for (var i = 0; i < paths.length; i++) {
		runAnimations(paths[i], paths[i].name); 
	}
	//runCompute();
}






