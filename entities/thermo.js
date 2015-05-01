var THERMO_DEBUG = false; // set to false to disable logs

function ThermoModel(a) {
    this.view = a;
    this.entity = null;
    this.udoStats = []; //udoStats.name, total, min, max
    this.statTable = $("#therm_stats").clone().attr("id", a.name);
    this.statTable.find("h2").text(a.name);
    $("#results").append(this.statTable);
    this.statRef = [
				this.statTable.find("#depart"), 
				this.statTable.find("#pop"), 
				this.statTable.find("#popd"), 
				this.statTable.find("#stay"), 
				this.statTable.find("#stayd")
				]

		a.image.attr({
        title: "Thermometer"
    })
    this.stat = {};

    //     var tv = this.view;
    // this.view.image["0"].onmouseover = function() {
    //    if (tv !== undefined) {
    //         var table = $("#hover_table");
    //         for (key in tv.model.arthur) {
    //             if (tv.model.arthur.hasOwnProperty(key)) {
    //                 table.append('<tr style="font-size: 12px;"><td>'+tv.model.arthur[key]+'</td><td>'+key+'</td></tr>'); 
    //             }
    //         }
    //          $('#hover_form').show().position({
    //              of: this,
    //              at: "right+80 top-25%",
    //              my: "left top"
    //          });
    //     }
    //     return;
    // };

    // this.view.image["0"].onmouseout = function() {
    //     $("#hover_table").empty();
    //     $("#hover_form").hide();
    // };



}



ThermoModel.prototype.jsonify = function() {
    return null;
};
ThermoModel.prototype.clearAndUpdateForm = function() {
};

ThermoModel.prototype.start = function() {
    this.entity = QueueApp.sim.addEntity(ThermoEntity ,this.udoStats);
    //initialize UDO field statistics
    for(i = 0; i < LIST_OF_PARAMETERS.length; i++){
		this.udoStats.push({
			name:LIST_OF_PARAMETERS[i][0],
			total:0,
			max:null,
			min:null
		})
		/*
    	this.udoStats[i].name = LIST_OF_PARAMETERS[i][0];
    	this.udoStats[i].total = 0;
    	this.udoStats[i].max = null;
    	this.udoStats[i].min = null;
		*/
    }
};

ThermoModel.prototype.connect = function() {
	this.entity.dest = this.dest ? this.dest.entity : null;
};

ThermoModel.prototype.showSettings = function() {
    var a = $("#thermo_form");                        //TODO: make a thermo_form
    QueueApp.form_view = this.view;
    a.show().position({
        of: $(this.view.image.node),
        at: "center center",
        my: "left top"
    })
    $("#hover_form").hide();
    displayName(this, "thermo_name");
};

ThermoModel.prototype.saveSettings = function() {
    rename(this, "thermo_name");
};

ThermoModel.prototype.initStats = function(){
	var pop = this.entity.population,
	popDur = pop.durationSeries,
	popSize = pop.sizeSeries
	this.stat["time"]=popDur
	this.stat["pop"]=popSize
	
	for(var property in this.entity.dataCollector){
		if(this.entity.dataCollector.hasOwnProperty(property)){
			dC = this.entity.dataCollector[property]
			this.stat[property] = dC.dataSeries
		}
	}
}

ThermoModel.prototype.showStats = function() {
	if(Object.keys(this.stat) > 0){
		this.statRef[0].text(this.stat.size.count());
		this.statRef[1].text(this.stat.size.average().toFixed(3));
		this.statRef[2].text(this.stat.size.deviation().toFixed(3));
		this.statRef[3].text(this.stat.time.average().toFixed(3));
		this.statRef[4].text(this.stat.time.deviation().toFixed(3));
	
		this.view.showCounters(this.stat.pop.count(), NaN)
		
		
		//call animation manager function
		var val =  this.stat.time.average().toFixed(3)
	}
    
    
    if (USE_UDO){
        //dynamically create information from 
        //have to do for each UDO? change conditions LIST_OF_PARAMETERS.length or udostats.length
        //need to check if we have created a table for this yet and update if so
        
       if (this.statTable.find("#udo_stat_table").val() == undefined){

    //call animation manager function
        
        

	        for (var i = 0;i < 3;i++){

	            var newDiv = document.createElement('div');
	            newDiv.id = "udo_stat_table";
	
			    newDiv.innerHTML = ('<table id="test" class="stats_table" border="1">' + 
			    '<tbody>' + 
			    '<tr><td>Name</td><td id="name">0</td><td>-</td></tr>' + 
			    '<tr><td>Population</td><td id="total">0.000</td><td id="popd">NaN</td></tr>' + 
			    '<tr><td>stay duration</td><td id="min">0.000</td><td id="stayd">NaN</td></tr>' + 
			    '<tr><td>stay duration</td><td id="max">0.000</td><td id="stayd">NaN</td></tr>' + 
			'</tbody></table>'); 

				this.statTable.append(newDiv);
			}


		}
    } else {
        //destroy all the things that we may added
        this.statTable.find("#udo_stat_table");
    }

    
};

ThermoModel.prototype.unlink = function() {
    this.statTable.remove();
    this.statRef = this.view = this.stat = null
};

var ThermoEntity = {
    start: function() {
        this.population = new Sim.Population("Population Series")
		//{property name:time series
		this.dataCollector=statman.initParamSeries()
		//debug
		/* {{x:[], y:[]}}*/
		this.series = statman.initGraphSeries();
		this.statTrack = []
    },
    onMessage: function(sender, message) {
		//message must be a time value
		statman.recordMessage(this.series, message, this.time());

        message || (message.timer = 0);
        this.population.enter(message.timer);
        this.population.leave(message.timer, this.time());
        
        //update udofield stats
        for(var property in message.fields){
			if(message.fields.hasOwnProperty(property)){
				this.dataCollector[property].record(message.fields[property],this.time());
			}
		}
		//debug
		for(var property in message.fields){
			var instProp = []
			if(message.fields.hasOwnProperty(property)){
				instProp.push(message.fields[property])
            }
			this.statTrack.push(instProp)
		}
		this.dest && /*this.dest.onMessage(this, message)*/this.send(message, 0, this.dest);
    }
};


