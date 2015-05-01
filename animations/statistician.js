// var runner = function() {
// var Statistician = {
// 		similar: function(obj) {
// 			var max = 0;
// 			for (key in obj) {
// 				if (obj.hasOwnProperty(key)){ 
// 					if (obj[key] > max) {
// 						max = obj[key];
// 					}
// 				}
// 			}
// 			var list = [];
// 			for (var i=0; i<max;i+=1) {
// 				list.push(null);
// 			}

// 			for (key in obj) {
// 				if (obj.hasOwnProperty(key)){ 
// 					if (list[obj[key]] == null) {
// 						list[obj[key]] = [];
// 						list[obj[key]].push(key); 
// 					}
// 					else {
// 						list[obj[key]].push(key); 	
// 					}
// 				};
// 			};
// 			var qq = [];
// 			for (var i = 0; i < list.length; i+= 1) {
// 				if (list[i] != null) {
// 					// if (DEBUG_HOVER) console.log(i + " " + list[i]);
// 					qq.push([i, [list[i]]])
// 				}
// 			}
// 			return qq;
// 		}, 
// 		compute: function() {
// 			for (var i = 0; i < QueueApp.models.length; i++) {
// 				mdl = QueueApp.models[i]
// 				tp = mdl.view.type;
// 				switch(tp) {
// 					case "stack":

// 					case "thermometer";

// 					case "queue":
// 						// if (DEBUG_HOVER) console.log(mdl.stat);
// 						var obj = {};
// 						obj.arrived = mdl.stat.arrived;
// 						obj.dropped = mdl.stat.dropped;
// 						var qpop = mdl.stat.queue.pop;
// 						var qtime = mdl.stat.queue.time;
// 						var syspop = mdl.stat.system.pop;
// 						var systime = mdl.stat.system.time;
// 						// table.append('<tr style="font-size: 12px;"><td>Arrived</td><td>'+obj.arrived+'</td></tr>');
// 						// table.append('<tr style="font-size: 12px;"><td>Arrived</td><td>'+obj.dropped+'</td></tr>');
// 						for (var key in qpop) {
// 						    if (qpop.hasOwnProperty(key)) {
// 						    	var thing = qpop[key];
// 						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity) {
// 						    		obj['queue population series ' + key.toLowerCase()] = thing;
// 										// table.append('<tr style="font-size: 12px;"><td>Queue Population Series '+key+'</td><td>'+thing+'</td></tr>');
// 						    	}
// 						    }
// 						}
// 						for (var key in qtime) {
// 						    if (qtime.hasOwnProperty(key)) {
// 						    	var thing = qtime[key];
// 						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity) {
// 						    		obj['queue time series ' + key.toLowerCase()] = thing;
// 										// table.append('<tr style="font-size: 12px;"><td>Queue Time Series '+key+'</td><td>'+thing+'</td></tr>');
// 						    	}
// 						    }
// 						}
// 						for (var key in syspop) {
// 						    if (syspop.hasOwnProperty(key)) {
// 						    	var thing = syspop[key];
// 						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity) {
// 						    		obj['system population series ' + key.toLowerCase()] = thing;
// 										// table.append('<tr style="font-size: 12px;"><td>System Population Series '+key+'</td><td>'+thing+'</td></tr>');
// 						    	}
// 						    }
// 						}
// 						for (var key in systime) {
// 						    if (systime.hasOwnProperty(key)) {
// 						    	var thing = systime[key];
// 						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity) {
// 						    		obj['system time series ' + key.toLowerCase()] = thing;
// 										// table.append('<tr style="font-size: 12px;"><td>System Time Series '+key+'</td><td>'+thing+'</td></tr>');
// 						    	}
// 						    }
// 						}
// 						var lists = this.similar(obj);
// 						var vals = [];
// 						var strs = [];
// 						for (var i = 0; i < lists.length; i += 1) {
// 							vals.push(lists[i][0]);
// 							strs.push(lists[i][1]);
// 						}

// 						for (var j = 0; j < strs.length; j += 1) {
// 							var str = "";
// 							for (var k = 0; k < strs[j][0].length; k += 1) {
// 								if (j == strs[j][0].length - 1) {
// 									str += ('<span>'+strs[j][0][k]+'</span></br>')
// 								}
// 								else {
// 									str += ('<span>'+strs[j][0][k]+'</span></br>');
// 								}
// 							}
// 							// console.log(str);
// 							// if (DEBUG_HOVER) console.log(str);
// 							strs[j] = str;
// 							if (mdl.arthur === undefined) {
// 								mdl.arthur = [];
// 							}
// 							else {
// 								mdl.arthur.append([str, vals[j]])
// 							}
// 							console.log(mdl.arthur)
// 							// table.append('<tr style="font-size: 12px;"><td>'+str+'</td><td>'+vals[j]+'</td></tr>');
// 							// console.log(strs[j] + " " + vals[j]);
// 						}
// 						break;

// 					case "sink";
// 						// if (DEBUG_HOVER) console.log("SINK TEST");
// 						var obj = {};
// 						var pop = mdl.stat.pop;
// 						var time = mdl.stat.time;

// 						for (var key in mdl.stat.pop) {
// 						    if (mdl.stat.pop.hasOwnProperty(key)) {
// 						    	var thing = mdl.stat.pop[key];
// 						    	if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity) {
// 						    		obj['population series ' + key.toLowerCase()] = thing;
// 						    	}
// 						    }
// 						}
// 						for (var key in mdl.stat.time) {
// 							if (mdl.stat.time.hasOwnProperty(key)) {
// 								var thing = mdl.stat.time[key];
// 								if (thing != undefined && thing != 0 && !isNaN(thing) && thing != Infinity && thing != -Infinity) {
// 									if (key === "W") {
// 										obj['time series weight '] = thing;
// 									}
// 									else {
// 										// if (DEBUG_HOVER) console.log(key);
// 										obj['time series ' + key.toLowerCase()] = thing;
// 									}
// 								}
// 							}
// 						}
// 						var lists = this.similar(obj);
// 						var vals = [];
// 						var strs = [];
// 						for (var i = 0; i < lists.length; i += 1) {
// 							vals.push(lists[i][0]);
// 							strs.push(lists[i][1]);
// 						}

// 						for (var j = 0; j < strs.length; j += 1) {
// 							var str = "";
// 							for (var k = 0; k < strs[j][0].length; k += 1) {
// 								if (j == strs[j][0].length - 1) {
// 									str += ('<span>'+strs[j][0][k]+'</span></br>');
// 								}
// 								else {
// 									str += ('<span>'+strs[j][0][k]+'</span></br>');
// 								}
// 							}
// 							// console.log(str);
// 							// if (DEBUG_HOVER) console.log(str);
// 							strs[j] = str;
// 							if (mdl.arthur === undefined) {
// 								mdl.arthur = [];
// 							}
// 							else {
// 								mdl.arthur.append([str, vals[j]])
// 							}
// 							console.log(mdl.arthur)
// 							// table.append('<tr style="font-size: 12px;"><td>'+str+'</td><td>'+vals[j]+'</td></tr>');
// 						}
// 						break;
// 					case "source":
// 						break;
// 				}
// 			}
// 		};
// 	}

// 	Statistician.compute();
// }

