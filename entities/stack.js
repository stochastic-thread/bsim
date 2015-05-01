var STACK_DEBUG =  true; // set to false to disable logs

function StackModel(a) {
    this.arthur = {};

    this.view = a;
    this.nstacks = 1;
	this.distribution = "constant";
    this._params = null;
    this.UDO_selected = false;
	this.params = [1, null];
    this.maxqlen = -1;

    this.dest = this.entity = null;
	
    this.statTable = $("#stack_stats").clone().attr("id", a.name);
    this.statTable.find("h2").text(a.name);
    $("#results").append(this.statTable);
	
    this.statRef = [
        this.statTable.find("#arrival"), 
        this.statTable.find("#drop"), 
        this.statTable.find("#sutil"), 
        this.statTable.find("#qtime"), 
        this.statTable.find("#stime"), 
        this.statTable.find("#qsize"), 
        this.statTable.find("#ssize"), 
        this.statTable.find("#qtimed"), 
        this.statTable.find("#stimed"),
        this.statTable.find("#qsized"), 
        this.statTable.find("#ssized")
    ];
	
	this.stat = {}
    this.view.image.attr({
        title:"Stack"
    })
    var tv = this.view;
    this.view.image["0"].onmouseover = function() {
       if (tv !== undefined && tv.model.stat.arrived != undefined) {
            var table = $("#hover_table");
            for (key in tv.model.stat) {
                if (tv.model.stat.hasOwnProperty(key)) {
                    if(key == "stack") {
                        table.append('<tr style="font-size: 12px;"><td>'+key+ ' size'+'</td><td>'+tv.model.stat[key]["pop"]["Count"]+'</td></tr>'); 
                    } else if (key == "system") {
                        table.append('<tr style="font-size: 12px;"><td>'+key+ ' size'+'</td><td>'+tv.model.stat[key]["pop"]["Count"]+'</td></tr>'); 
                    } else if (key === "use"){
						table.append('<tr style="font-size: 12px;"><td>'+key+'</td><td>'+tv.model.stat[key].toFixed(2)+'%</td></tr>');
					}else {
                        if (typeof tv.model.stat[key] == "number" ) {
                            // console.log(tv.model.stat[key]["dataSeries"]);
                            table.append('<tr style="font-size: 12px;"><td>'+key+'</td><td>'+tv.model.stat[key]+'</td></tr>'); 
                        } else {
                            if (typeof tv.model.stat[key] != "string") {
                                console.log(typeof tv.model.stat[key]);
                                table.append('<tr style="font-size: 12px;"><td>'+key+'</td><td>'+tv.model.stat[key]["dataSeries"]["Count"]+'</td></tr>'); 
                            }
                        }
                    }
                }
            }
             $('#hover_form').show().position({
                 of: this,
                 at: "right+80 top-25%",
                 my: "left top"
             });
        }
        return;
    };

    this.view.image["0"].onmouseout = function() {
        $("#hover_table").empty();
        $("#hover_form").hide();
    };



    if (STACK_DEBUG) console.log("stack: StackModel");
}

StackModel.prototype.jsonify = function() {
    return {
        nstacks: this.nstacks,
        maxqlen: this.maxqlen,
		distribution: this.distribution,
		params: this.params
    }
    if (STACK_DEBUG) console.log("stack: jsonify");

};

StackModel.prototype.start = function() {
    this.entity = QueueApp.sim.addEntity(StackEntity, this.distribution, this.params, this.nstacks, this.maxqlen)
    if (STACK_DEBUG) console.log("stack: start");

};

StackModel.prototype.connect = function() {
    this.entity.dest = this.dest ? this.dest.entity : null
    if (STACK_DEBUG) console.log("stack: connect");

};

StackModel.prototype.showSettings = function() {
	this.clearAndUpdateForm();
    createStackForm();
    pushToForm(this);
    var dist_UDO;
	var isUDO = this._params[0][1];
    if (LIST_OF_PARAMETERS[0] == undefined && USE_UDO && isUDO){
        dist_UDO = "";
    } else if (this._params[0][1] == true){
	   dist_UDO = this._params[0][3];
    } else {
       dist_UDO = this._params[0][2];
    }
    var param1 = this._params[0][3];
    var param2 =  this._params[0][4];
    var queue_length = this._params[1][1];
    var num_stacks = this._params[2][1];
    console.log(queue_length);

    
    var a = $("#stack_form");
    QueueApp.form_view = this.view;
    //resetStack();
    //set parameters 
    if (this.UDO_selected){
        document.getElementById("use_udo_button_stack").checked = true;
        a.find("#stack_param_tr1").hide();
        a.find("#stack_param_tr2").hide();
    } else {
        document.getElementById("use_function_button_stack").checked = true;
		var paramNum = LIST_OF_DISTRIBUTIONS[dist_UDO];
        if (paramNum == 1){
            a.find("#stack_param_tr1").val(param1).show();
            $("#stack_param_tr2").hide(); 
        } else if (paramNum == 0) {
            $("#stack_param_tr1").hide(); 
            $("#stack_param_tr2").hide(); 
        } else {
            a.find("#stack_param_tr1").val(param1).show();
            a.find("#stack_param_tr2").val(param2).show();
        }
    }
    // get forms and insert the values into them
    a.find("#stack_dropdown_1").val(dist_UDO);
    a.find("#stack_stack_length").val(queue_length);
    a.find("#num_stacks").val(num_stacks);    
    a.find("#stack_param1").val(param1);
    a.find("#stack_param2").val(param2);


	a.show().position({
		of: $(this.view.image.node),
		at: "center center",
		my: "left top"
    });

    $("#hover_form").hide();

    displayName(this, "stack_name");
    if (STACK_DEBUG) console.log("stack: showSettings");
};

StackModel.prototype.saveSettings = function() {
    
    var a = $("#stack_form");
	
    this._params = [];

    var dist_UDO = null;
    var qlen = a.find("#stack_stack_length").val();
    console.log(qlen);
    var num_stacks = a.find("#num_stacks").val();

     var d = document.getElementById("stack_dropdown_1");
     dist_UDO = d.options[d.selectedIndex].value;

    var param1 = a.find("#stack_param1").val();
    var param2 = a.find("#stack_param2").val();
    
    if(document.getElementById("use_udo_button_stack").checked){
        this.UDO_selected = true;
    } else {
        this.UDO_selected = false;
    }
    
    this._params[0] = ["UDO", this.UDO_selected, dist_UDO, param1, param2];
    this._params[1] = ["const", qlen];
    this._params[2] = ["const", num_stacks];

    this.view.image.attr({
        title: "Service rate = " + this.mu
    })

    rename(this, "stack_name");
    if (STACK_DEBUG) console.log("stack: saveSettings");
	pullFromForm(this);
};

//change drop down menu options for user dynamically. 
//will load from LIST_OF_PARAMETERS for UDO option
function resetStack(){
    if (STACK_DEBUG) console.log("resetStack");
    var a = $("#stack_form");

    if (this.UDO_selected){
        a.find("#stack_dropdown_1").val("");
        a.find("#stack_dropdown_1").val(LIST_OF_PARAMETERS[0][0]);
        a.find("#stack_queue_length").val("-1");
        a.find("#num_stacks").val("1");
        a.find("#stack_param1").val("").hide();
        a.find("#stack_param2").val("").hide();
    } else {
        a.find("#stack_dropdown_1");
        a.find("#stack_queue_length").val("-1");
        a.find("#num_stacks").val("1");
        a.find("#stack_param1").val("").show();
        a.find("#stack_param2").val("").show();
    }
}

function createStackForm(){

    if(UPDATE_SERVER_FORM == null){
        if (STACK_DEBUG) console.log("createStackForm");
        populateStackForm();
        UPDATE_STACK_FORM= "not null";
    }
}

function populateStackForm(){
    if (STACK_DEBUG) console.log("populateStackForm");

    var parentForm = document.getElementById("stack_dropdown_1");
    var a = $("#stack_form");

    for (var i = 0; i < 5; i++){
        a.find("#stack_udo_"+i).val("").hide();
    }     
    if (USE_UDO){

         if(document.getElementById("use_udo_button_stack").checked){
           
            $("#stack_op1").hide();
            $("#stack_op2").hide();
            $("#stack_op3").hide();
            $("#stack_op4").hide();
            $("#stack_op5").hide();
            $("#stack_op6").hide();
            $("#stack_op7").hide();
            $("#stack_op8").hide();
            $("#stack_param_tr1").hide(); 
            $("#stack_param_tr2").hide();
            for (var i =0;i < LIST_OF_PARAMETERS.length;i++){
                a.find("#stack_udo_"+i).text(LIST_OF_PARAMETERS[i][0]).show();
                a.find("#stack_udo_"+i).val(LIST_OF_PARAMETERS[i][0])
            }
            if (LIST_OF_PARAMETERS[0] == undefined){
                a.find("#stack_dropdown_1").val("");
            } else{
                a.find("#stack_dropdown_1").val(LIST_OF_PARAMETERS[0][0]);
            }
        } else {
            
            a.find("#stack_dropdown_1").val("gaussian")
            $("#stack_op1").show();
            $("#stack_op2").show();
            $("#stack_op3").show();
            $("#stack_op4").show();
            $("#stack_op5").show();
            $("#stack_op6").show();
            $("#stack_op7").show();
            $("#stack_op8").show();
            $("#stack_param_tr1").show(); 
            $("#stack_param_tr2").show();
            
        }
       
    } else {
        
        a.find("#stack_dropdown_1").val("gaussian")
        $("#stack_op1").show();
        $("#stack_op2").show();
        $("#stack_op3").show();
        $("#stack_op4").show();
        $("#stack_op5").show();
        $("#stack_op6").show();
        $("#stack_op7").show();
        $("#stack_op8").show();
        $("#stack_param_tr1").show(); 
        $("#stack_param_tr2").show(); 
    }
}

function stackDropper(){
    
    if (document.getElementById("use_function_button_stack").checked){
        var e = document.getElementById("stack_dropdown_1");
        var dropOption = e.options[e.selectedIndex].value;

    if (dropOption == "exponential" || dropOption == "constant" || 
            dropOption == "pareto"){ // param1 shows but param2 hidden
        $("#stack_param_tr1").show(); 
        $("#stack_param_tr2").hide(); 

    } else if (dropOption == "random"){ // param1 and param2 both are hidden
        $("#stack_param_tr1").hide();
        $("#stack_param_tr2").hide();
      
    } else {
        //for gaussian, weibull and gamma
        $("#stack_param_tr1").show();  // Both parameters shows up
        $("#stack_param_tr2").show();
    }

    }
}


function checkRadioButtonStack(){

    populateStackForm();

}

StackModel.prototype.clearAndUpdateForm = function(){
    //var a = document.getElementById("source_form_to_append");
    //a.innerHTML = "";
    if (STACK_DEBUG) console.log("clear and update stack");
    resetStack();
    populateStackForm(); 
}

StackModel.prototype.initStats = function(){
	var fac = this.entity.facility,
        qDur = fac.queueStats().durationSeries,
        qSize = fac.queueStats().sizeSeries.dataSeries,
        sysDur = fac.systemStats().durationSeries,
        sysSize = fac.systemStats().sizeSeries.dataSeries,
        perc = fac.usage() / QueueApp.sim.time() * 100;
	
	this.stat["arrived"]=this.entity.arrived;
	this.stat['dropped']=this.entity.dropped;
	this.stat["use"]=perc + "%";
	this.stat["stack"]={
		time:qDur,
		pop:qSize
	}
	this.stat["system"]={
		time:sysDur,
		pop:sysSize
	}
	
	for(var property in this.entity.dataCollector){
		if(this.entity.dataCollector.hasOwnProperty(property)){
			dC = this.entity.dataCollector[property]
			this.stat[property]=dC
		}
	}
}

StackModel.prototype.showStats = function() {
	if(Object.keys(this.stat) > 0){
		this.statRef[0].text(this.stat.arrival);	
		this.statRef[1].text(this.stat.dropped);
		this.statRef[2].text(this.stat.use.toFixed(1) + "%");
		this.statRef[3].text(this.stat.queue.time.average().toFixed(3));
		this.statRef[4].text(this.stat.system.time.average().toFixed(3));
		this.statRef[5].text(this.stat.queue.pop.average().toFixed(3));
		this.statRef[6].text(this.stat.system.pop.average().toFixed(3));
		this.statRef[7].text(this.stat.queue.time.deviation().toFixed(3));
		this.statRef[8].text(this.stat.system.time.deviation().toFixed(3));
		this.statRef[9].text(this.stat.queue.pop.deviation().toFixed(3));
		this.statRef[10].text(this.stat.system.pop.deviation().toFixed(3));
		this.view.showCounters(this.stat.queue.count(), this.stat.system.count())
		
		//call animation manager funtion
		var val = this.stat.use.toFixed(1);
	}
    if (STACK_DEBUG) console.log("stack: showStats");
};

StackModel.prototype.unlink = function() {
    this.statTable.remove();
    this.stat = this.view = this.statRef = null

    if (STACK_DEBUG) console.log("stack: unlink");

};

var StackEntity = {
    start: function(a, b, c, d) {
		//Arguments: distribution, params, nstacks, maxqlen
        this.facility = new Sim.Facility("queue", Sim.Facility.LCFS, c, d);
        this.arrived = this.dropped = 0
		this.distribution = a
		this.params = b
		//{property name:time series}
		this.dataCollector=statman.initParamSeries()
		//debug
		this.remainder = 0;
		this.udoval = [];
		this.series = statman.initGraphSeries();
		/* 
			init empty arrays in structure 
			series[0] is time
			series[1] is val
		*/
    },
    onMessage: function(sender, message) {
		statman.recordMessage(this.series, message, this.time());
        this.arrived++
		this.remainder++
		var timeval = 0
		if(this.distribution === "custom"){
			timeval = message.fields[this.params[0]]
		}else{
			timeval = randDist(this.distribution, this.params, QueueApp.random)
		}
		/* useFacility cannot handle timeval 0.  Make sure that timeval is >= 0.1*/
		timeval = (timeval < 0.1 ? 0.1 : timeval)
		this.udoval.push(timeval)
		
		for(var property in message.fields){
				if(message.fields.hasOwnProperty(property)){
					this.dataCollector[property].record(message.fields[property],this.time());
				}
			}	
        this.useFacility(this.facility, timeval).done(this.completed, this, message)
    },
    completed: function(message) {
		this.remainder -= 1
        this.callbackMessage === -1 ? this.dropped++ : this.dest && /*this.dest.onMessage(this, message)*/this.send(message, 0, this.dest)
    }
};


