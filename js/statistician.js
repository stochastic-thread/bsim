var runCompute = function() {
	var Statistician = {
		similar: function(obj) {
			var max = 0;
			for (key in obj) {
				if (obj.hasOwnProperty(key)){ 
					if (obj[key] > max) {
						max = obj[key];
					}
				}
			}
			var list = [];
			for (var i=0; i<max;i+=1) {
				list.push(null);
			}

			for (key in obj) {
				if (obj.hasOwnProperty(key)){ 
					if (list[obj[key]] == null) {
						list[obj[key]] = [];
						list[obj[key]].push(key); 
					}
					else {
						list[obj[key]].push(key); 	
					}
				};
			};
			var qq = [];
			for (var i = 0; i < list.length; i+= 1) {
				if (list[i] != null) {
					// if (DEBUG_HOVER) console.log(i + " " + list[i]);
					qq.push([i, [list[i]]])
				}
			}
			// console.log('qq is: ' + qq);
			return qq;
		}, 
		compute: function() {
			for (var i = 0; i < QueueApp.models.length; i += 1) {
				//console.log(QueueApp.models);
				mdl = QueueApp.models[i];
				//console.log("MDL");
				//console.log(mdl);
				tp = mdl.view.type;
				// console.log("ETSTING THIS PRINT");
				// console.log(tp);
				switch(tp) {

					case "stack":
						var obj = {};
						obj.arrived = mdl.stat.arrived;
						obj.dropped = mdl.stat.dropped;
						var qpop = mdl.stat.stack.pop;
						var qtime = mdl.stat.stack.time;
						var syspop = mdl.stat.system.pop;
						var systime = mdl.stat.system.time;

						for (var key in qpop) {
						    if (qpop.hasOwnProperty(key)) {
						    	var thing = qpop[key];
						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity)
						    		obj['stack population series ' + key.toLowerCase()] = thing;
						    }
						}
						for (var key in qtime) {
						    if (qtime.hasOwnProperty(key)) {
						    	var thing = qtime[key];
						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity)
						    		obj['stack time series ' + key.toLowerCase()] = thing;
						    }
						}
						for (var key in syspop) {
						    if (syspop.hasOwnProperty(key)) {
						    	var thing = syspop[key];
						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity)
						    		obj['system population series ' + key.toLowerCase()] = thing;
						    }
						}
						for (var key in systime) {
						    if (systime.hasOwnProperty(key)) {
						    	var thing = systime[key];
						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity)
						    		obj['system time series ' + key.toLowerCase()] = thing;
						    }
						}
						
						var lists = this.similar(obj);
						var vals = [];
						var strs = [];
						for (var i = 0; i < lists.length; i += 1) {
							vals.push(lists[i][0]);
							strs.push(lists[i][1]);
						}

						for (var j = 0; j < strs.length; j += 1) {
							var str = "";
							for (var k = 0; k < strs[j][0].length; k += 1)
								str += ('<span>'+strs[j][0][k]+'</span></br>');
							// console.log(str);
							// if (DEBUG_HOVER) console.log(str);
							strs[j] = str;
							mdl.arthur[vals[j]] = str;
							//console.log(mdl.arthur)
						}
						break;
					case "thermometer":

					case "queue":
						// if (DEBUG_HOVER) console.log(mdl.stat);
						var obj = {};
						obj.arrived = mdl.stat.arrived;
						obj.dropped = mdl.stat.dropped;
						var qpop = mdl.stat.queue.pop;
						var qtime = mdl.stat.queue.time;
						var syspop = mdl.stat.system.pop;
						var systime = mdl.stat.system.time;

						for (var key in qpop) {
						    if (qpop.hasOwnProperty(key)) {
						    	var thing = qpop[key];
						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity)
						    		obj['queue population series ' + key.toLowerCase()] = thing;
						    }
						}
						for (var key in qtime) {
						    if (qtime.hasOwnProperty(key)) {
						    	var thing = qtime[key];
						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity)
						    		obj['queue time series ' + key.toLowerCase()] = thing;
						    }
						}
						for (var key in syspop) {
						    if (syspop.hasOwnProperty(key)) {
						    	var thing = syspop[key];
						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity)
						    		obj['system population series ' + key.toLowerCase()] = thing;
						    }
						}
						for (var key in systime) {
						    if (systime.hasOwnProperty(key)) {
						    	var thing = systime[key];
						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity)
						    		obj['system time series ' + key.toLowerCase()] = thing;
						    }
						}
						
						var lists = this.similar(obj);
						var vals = [];
						var strs = [];
						for (var i = 0; i < lists.length; i += 1) {
							vals.push(lists[i][0]);
							strs.push(lists[i][1]);
						}

						for (var j = 0; j < strs.length; j += 1) {
							var str = "";
							for (var k = 0; k < strs[j][0].length; k += 1)
								str += ('<span>'+strs[j][0][k]+'</span></br>');
							
							strs[j] = str;
							mdl.arthur[vals[j]] = str;
							
						}
						break;
					case "source":
						mdl.arthur[mdl.stat.spawn] = "<span>spawn</span>"
						break;
				}
			}
		}
	};
	Statistician.compute();	
};