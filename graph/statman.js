var statman = {
	throwTimeStat: function(val, dest){
		/* nothing goes here until we figure out a way to output statistical data without massive overhead. */
	},
	initParamSeries: function(){
		var data = {}
		for(var i = LIST_OF_PARAMETERS.length -1;i >= 0; i--){
			data[LIST_OF_PARAMETERS[i][0]]=new Sim.TimeSeries("Time Series")
		}
		return data
	},
	recordMessage: function(series, message, time){
		var too_big = 0;
		// increment the message counter for the series
		series['message_counter'] = series['message_counter'] + 1;
		// if the message counter is greater than or equal to the interval
		if (series['message_counter'] >= series['sampling_interval']) {
			// push the message
			for(prop in message.fields){
				if(isNaN(message.timer) || isNaN(message.fields[prop]))
					continue;
				series[prop].t.push(time);		
				series[prop].f.push(message.fields[prop]);
				
				if(series[prop].length > MAX_MESSAGES){
					too_big = 1;
				}
			}
			// reset the message counter to zero
			series['message_counter'] = 0;
		}

		// if series has too many messages (more than MAX_MESSAGES)
		if (too_big){
			// remove every other message
			for (var i = 2; i <= series[prop].length; i += 1){
    			series[prop].splice(i, 1);
			}
			// set new interval (double the old one)
			series['sampling_interval'] = series['sampling_interval'] * 2;
			// reset the message counter for the series
			series['message_counter'] = 0;
			too_big = 0;
		}
		
		return series;
	},
	initGraphSeries: function(){
		var series = {};
		for(var i = LIST_OF_PARAMETERS.length - 1; i >= 0; i--){
			series[LIST_OF_PARAMETERS[i][0]] = {t:[],f:[]};
		}
		series['sampling_interval'] = 1;
		series['message_counter'] = 0;
		return series
	},
	expandStats: function(series, currdepth){
		/*Not to be confused with the deprecated version.
			Returns formatted string value.
		*/
		var res = {
			count:series.count(),
			min:series.min(),
			max:series.max(),
			sum:series.sum(),
			average:series.average(),
			deviation:series.deviation(),
			variance:series.variance()
		}
		
		
		/* Jesus Christ this is hacky */
		return this.parseStats(res, currdepth)
	},
	parseStats: function(stats, depth){
		/*
			possibly nested == Must be nested objects (not arrays, etc.)
			
			optional argument depth of traversal
		*/
		var tabLength = ""
		
		var currdepth = (depth !== undefined && depth !== null)? depth : 1
		var str = ""
		
		
		
		for(var i = 0; i < currdepth; i++){
			/* actually two spaces */
			tabLength += "  "
		}
		
		for(var prop in stats){
			if(stats.hasOwnProperty(prop)){
				/* if is nested object */
				if(stats[prop] !== undefined && stats[prop] !== null){
					str = str + tabLength + prop + ": "
					if(typeof stats[prop] === "object"){
						/* does the end of prop designate it as a series?
						*/
						if(stats[prop].hasOwnProperty("Count")){
							str = str + "\n" + this.expandStats(stats[prop], currdepth + 1)
						}else{
							str = str + "\n" + this.parseStats(stats[prop], currdepth + 1)
						}
					}else if(prop === "use"){
						str = str + stats[prop] + "%\n"
					}else{
						str = str + stats[prop] + "\n"
					}
				}else{
					str = str + "ERROR\n"
				}
			}
		}
		return str;
	}
};
