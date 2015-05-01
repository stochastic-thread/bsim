var SERVER_DEBUG =  true; // set to false to disable logs
function ServerModel(a) {
    this.view = a;
    this.nservers = 1;
	this.maxqlen = -1;
	this.distribution = "constant";
    this._params = [[]];

    this.UDO_selected = false;
	this.params = [1, null];
	
    
    this.arthur = {}; 

    this.dest = this.entity = null;

    this.statTable = $("#server_stats").clone().attr("id", a.name);
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
		title:"Server"
    })
    var tv = this.view;
    this.view.image["0"].onmouseover = function() {
            console.log(tv.model.stat);
       if (tv !== undefined && tv.model.stat.arrived != undefined) {
            var table = $("#hover_table");
            for (key in tv.model.stat) {

                if (tv.model.stat.hasOwnProperty(key)) {
                    if(key == "queue") {
                        
                        table.append('<tr style="font-size: 12px;"><td>'+key+ ' size'+'</td><td>'+tv.model.stat[key]["pop"]["Count"]+'</td></tr>'); 
                    } else if (key == "system") {
                        table.append('<tr style="font-size: 12px;"><td>'+key+ ' size'+'</td><td>'+tv.model.stat[key]["pop"]["Count"]+'</td></tr>'); 
                    } else if (key === "use"){
						table.append('<tr style="font-size: 12px;"><td>'+key+'</td><td>'+tv.model.stat[key].toFixed(2) +'%</td></tr>'); 
					} else {
                        if (typeof tv.model.stat[key] != "number" ) {
                            table.append('<tr style="font-size: 12px;"><td>'+key+'</td><td>'+tv.model.stat[key]["dataSeries"]["Count"]+'</td></tr>'); 
                        } else {
                            console.log(tv.model.stat[key]);
                            table.append('<tr style="font-size: 12px;"><td>'+key+'</td><td>'+tv.model.stat[key]+'</td></tr>'); 
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

    console.log(this.view.image);
    if (SERVER_DEBUG) console.log("server: ServerModel");
};

ServerModel.prototype.jsonify = function() {
    return {
        nservers: this.nservers,
        maxqlen: this.maxqlen,
		distribution: this.distribution,
		params: this.params
    }
    if (SERVER_DEBUG) console.log("server: jsonify");

};
ServerModel.prototype.start = function() {
    this.entity = QueueApp.sim.addEntity(ServerEntity, this.distribution, this.params, this.nservers, this.maxqlen)
    if (SERVER_DEBUG) console.log("server: start");

};

ServerModel.prototype.connect = function() {
    this.entity.dest = this.dest ? this.dest.entity : null
    if (SERVER_DEBUG) console.log("server: connect");

};

ServerModel.prototype.showSettings = function() {
    // console.log("image123");
    // console.log(this.view.image);
    // console.log("view123");
    // console.log(this.view);
    //this.clearAndUpdateForm();
   // createServerForm();
	pushToForm(this);
    

    var dist_UDO;
	var isUDO = this._params[0][1];
    if (LIST_OF_PARAMETERS[0] == undefined && USE_UDO && isUDO){
        dist_UDO = "";
    } else if(this._params[0][1]){
	   dist_UDO = this._params[0][3];
    } else{
        dist_UDO = this._params[0][2];
    }
    var param1 = this._params[0][3];
    var param2 =  this._params[0][4];
    var queue_length = this._params[1][1];
    var num_servers = this._params[2][1];
    console.log(this._params) 
     
    var a = $("#server_form");
    QueueApp.form_view = this.view;
    //resetServer();
    //set parameters 
    if (this.UDO_selected){
        document.getElementById("use_udo_button_server").checked = true;
        a.find("#server_param_tr1").hide();
        a.find("#server_param_tr2").hide();
    } else {
        document.getElementById("use_function_button_server").checked = true;
        var paramNum = LIST_OF_DISTRIBUTIONS[dist_UDO];
        if (paramNum == 1){
            a.find("#server_param_tr1").val(param1).show();
            $("#server_param_tr2").hide(); 
        } else if (paramNum == 0) {
            $("#server_param_tr1").hide(); 
            $("#server_param_tr2").hide(); 
        } else {
            a.find("#server_param_tr1").val(param1).show();
            a.find("#server_param_tr2").val(param2).show();
        }
    }
    // get forms and insert the values into them

    a.find("#server_dropdown_1").val(dist_UDO);
    a.find("#server_queue_length").val(queue_length);
    a.find("#num_servers").val(num_servers);    
    a.find("#server_param1").val(param1);
    a.find("#server_param2").val(param2);

	a.show().position({
		of: $(this.view.image.node),
		at: "center center",
		my: "left top"
    });

    $("#hover_form").hide();
    console.log("At end of call with params at " + this._params + " " + queue_length);
    displayName(this, "server_name"); 
    if (SERVER_DEBUG) console.log("server: showSettings");
};


ServerModel.prototype.saveSettings = function() {
    
    var a = $("#server_form");
	
    this._params = [];

    var dist_UDO = null;
    var maxqlen = a.find("#server_queue_length").val();
    var num_servers = a.find("#num_servers").val();

     var d = document.getElementById("server_dropdown_1");
     dist_UDO = d.options[d.selectedIndex].value;
     console.log("about to save the value " + dist_UDO);
    var param1 = a.find("#server_param1").val();
    var param2 = a.find("#server_param2").val();
    
    if(document.getElementById("use_udo_button_server").checked){
        this.UDO_selected = true;
    } else {
        this.UDO_selected = false;
    }
    
    this._params[0] = ["UDO", this.UDO_selected, dist_UDO, param1, param2];
    this._params[1] = ["const", maxqlen];
    this._params[2] = ["const", num_servers];

    this.view.image.attr({
        title: "Service rate = " + this.mu
    })

    rename(this, "server_name");
    if (SERVER_DEBUG) console.log("server: saveSettings");
	pullFromForm(this);
};

//change drop down menu options for user dynamically. 
//will load from LIST_OF_PARAMETERS for UDO option

function resetServer(){
    if (SERVER_DEBUG) console.log("resetServer");
    var a = $("#server_form");

    if (this.UDO_selected){
        a.find("#server_dropdown_1").val("");
        a.find("#server_dropdown_1").val(LIST_OF_PARAMETERS[0][0]);
        a.find("#server_queue_length").val("-1");
        a.find("#num_servers").val("1");
        a.find("#server_param1").val("").hide();
        a.find("#server_param2").val("").hide();
    } else {
        a.find("#server_dropdown_1").val("gaussian");
        a.find("#server_queue_length").val("-1");
        a.find("#num_servers").val("1");
        a.find("#server_param1").val("").show();
        a.find("#server_param2").val("").show();
    }
}

function createServerForm(){

    if(UPDATE_SERVER_FORM == null){
        if (SERVER_DEBUG) console.log("createServerForm");
        populateServerForm();
        UPDATE_SERVER_FORM= "not null";
    }
}

function populateServerForm(){
    if (SERVER_DEBUG) console.log("populateServerForm");

    var parentForm = document.getElementById("server_dropdown_1");
    var a = $("#server_form");

    for (var i = 0; i < 5; i++){
        a.find("#server_udo_"+i).val("").hide();
    }     
    if (USE_UDO){

         if(document.getElementById("use_udo_button_server").checked){
           
            $("#server_op1").hide();
            $("#server_op2").hide();
            $("#server_op3").hide();
            $("#server_op4").hide();
            $("#server_op5").hide();
            $("#server_op6").hide();
            $("#server_op7").hide();
            $("#server_op8").hide();
            $("#server_param_tr1").hide(); 
            $("#server_param_tr2").hide();
            for (var i =0;i < LIST_OF_PARAMETERS.length;i++){
                a.find("#server_udo_"+i).text(LIST_OF_PARAMETERS[i][0]).show();
                a.find("#server_udo_"+i).val(LIST_OF_PARAMETERS[i][0])
            }
            if (LIST_OF_PARAMETERS[0] == undefined)
                a.find("#server_dropdown_1").val("")
            else 
                a.find("#server_dropdown_1").val(LIST_OF_PARAMETERS[0][0]);
        } else {
            
            a.find("#server_dropdown_1").val("gaussian")
            $("#server_op1").show();
            $("#server_op2").show();
            $("#server_op3").show();
            $("#server_op4").show();
            $("#server_op5").show();
            $("#server_op6").show();
            $("#server_op7").show();
            $("#server_op8").show();
            $("#server_param_tr1").show(); 
            $("#server_param_tr2").show();
            
        }
       
    } else {
        
        a.find("#server_dropdown_1").val("gaussian")
        $("#server_op1").show();
        $("#server_op2").show();
        $("#server_op3").show();
        $("#server_op4").show();
        $("#server_op5").show();
        $("#server_op6").show();
        $("#server_op7").show();
        $("#server_op8").show();
        $("#server_param_tr1").show(); 
        $("#server_param_tr2").show(); 
    }
}

function serverDropper(){
    
    if (document.getElementById("use_function_button_server").checked){
        var e = document.getElementById("server_dropdown_1");
        var dropOption = e.options[e.selectedIndex].value;

    if (dropOption == "exponential" || dropOption == "constant" || 
            dropOption == "pareto"){ // param1 shows but param2 hidden
        $("#server_param_tr1").show(); 
        $("#server_param_tr2").hide(); 

    } else if (dropOption == "random"){ // param1 and param2 both are hidden
        $("#server_param_tr1").hide();
        $("#server_param_tr2").hide();
      
    } else {
        //for gaussian, weibull and gamma
        $("#server_param_tr1").show();  // Both parameters shows up
        $("#server_param_tr2").show();
    }

    }
}

function checkRadioButtonServer(){

    populateServerForm();

}

ServerModel.prototype.clearAndUpdateForm = function(){
    //var a = document.getElementById("source_form_to_append");
    //a.innerHTML = "";
    if (SERVER_DEBUG) console.log("clear and update server");
    resetServer();
    populateServerForm(); 
}

ServerModel.prototype.initStats = function(){
	var fac = this.entity.facility,
        qDur = fac.queueStats().durationSeries,
        qSize = fac.queueStats().sizeSeries.dataSeries,
        sysDur = fac.systemStats().durationSeries,
        sysSize = fac.systemStats().sizeSeries.dataSeries,
        perc = fac.usage() / QueueApp.sim.time() * 100;
	
	this.stat["arrived"]=this.entity.arrived;
	this.stat['dropped']=this.entity.dropped;
	this.stat["use"]=perc;
	this.stat["queue"]={
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

ServerModel.prototype.showStats = function() {
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
    if (SERVER_DEBUG) console.log("server: showStats");
};

ServerModel.prototype.unlink = function() {
    this.statTable.remove();
    this.stat = this.view = this.statRef = null

    if (SERVER_DEBUG) console.log("server: unlink");

};

var ServerEntity = {
    start: function(distr, args, nserv, maxlength) {
		//Arguments: distribution, params, nservers, maxqlen
        this.facility = new Sim.Facility("queue", Sim.Facility.FCFS, nserv, maxlength);
        this.arrived = this.dropped = 0
		this.distribution = distr
		this.params = args
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
		timeval = (timeval < 0.1 ? Math.abs(timeval) + 0.1 : timeval)
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


