
var entitiesToGraph = [];
var UDOFieldsToGraph = [];
var graphEntity = [];
var graphChosen = "line";
var bucket_width = 1;


function setSimulationResults(){
	graphman.clear();

	if(!SIM_HAS_RUN || !USE_UDO){
		bootbox.alert({size: 'small', 
                    message: "<strong><font size='3'>You cannot graph until you have run a simulation with an UDO</font></strong>", 
                    function(){}});
		return;
	}
	//$("#bar_graph_options").hide();
	document.getElementById("graph_dropdown").value = graphChosen; //set default value to appear as line instead of cached value
	document.getElementById("user_bucket_width").value = bucket_width; //set default value to appear as 1 instead of cached value for bucket_width
	entitiesToGraph = [];
	UDOFieldsToGraph = [];
	graphEntity = [];	
	if (USE_UDO && (LIST_OF_PARAMETERS != null)){
		getEntitiesToGraph();
		clearForm();
		createUDOResultForm();
	} 
	else bootbox.alert({size: 'small', 
                    message: "<strong><font size='3'>You cannot graph without simulating with an UDO</font></strong>", 
                    function(){}});
}

function getEntitiesToGraph(){
	for (var i = 0; i < QueueApp.models.length;i++){
		checkEntityToAdd(QueueApp.models[i]);
	}
}

function checkEntityToAdd(model){

	if (model.view.type == "queue" || model.view.type == "sink" || model.view.type == "thermometer"){
		entitiesToGraph.push(model);
	}
}

function createEntityForm(){

	var resultsDiv = document.getElementById("graph_form_to_append");
		var newCheck = document.createElement("div");
		var spacer= "";
		newCheck.innerHTML = 
			'<table>' +
		 	'<tr><td><font size="3">Entities</font><td><td></table>&nbsp;';

	resultsDiv.appendChild(newCheck);

	for (var i = 0;i < entitiesToGraph.length;i++){
				
		var newCheck = document.createElement("div");
		
		 newCheck.innerHTML =
		 	'<table>' +
		 	'<tr><td><div class="onoffswitch">' +
			    '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch_'+i+'" onclick="checkOnOffSwitchNoUDO('+i+')">' +
			    '<label class="onoffswitch-label" for="myonoffswitch_'+i+'">' +
			        '<span class="onoffswitch-inner"></span>' +
			        '<span class="onoffswitch-switch"></span>' +
			    '</label></div></td><td><font size="3">' + entitiesToGraph[i].view.username + '</font></td></tr>' + spacer;	
        
		resultsDiv.appendChild(newCheck);
	}
}

function clearForm(){

	var resultsDiv = document.getElementById("graph_form_to_append");
	resultsDiv.innerHTML = "";

}


function createUDOResultForm(){
	
	var resultsDiv = document.getElementById("graph_form_to_append");

	var a = $("#graph_form");
	if (entitiesToGraph.length != 0){

		var resultsDiv = document.getElementById("graph_form_to_append");
		var newCheck = document.createElement("div");
		var spacer= "";
		newCheck.innerHTML = 
			'<table>' +
		 	'<tr><td><font size="3">Choose UDO fields to Graph</font><td><td></table>&nbsp;';
		resultsDiv.appendChild(newCheck);

		for (var i = 0; i < LIST_OF_PARAMETERS.length;i++){

			var newCheck = document.createElement("div");
			
			if ((entitiesToGraph.length - 1) == i){
				spacer = "&nbsp;";
			}
			 newCheck.innerHTML =
			 	'<table>' +
			 	'<tr><td><div class="onoffswitch">' +
				    '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch2_'+i+'" onclick="checkOnOffSwitchUDOField('+i+')">' +
				    '<label class="onoffswitch-label" for="myonoffswitch2_'+i+'">' +
				        '<span class="onoffswitch-inner"></span>' +
				        '<span class="onoffswitch-switch"></span>' +
				    '</label></div></td><td><font size="3">' + LIST_OF_PARAMETERS[i][0] + '</font></td></tr></table>' + spacer;	
	        
			resultsDiv.appendChild(newCheck);
		}
		createEntityForm();

		a.show().position({
	    	of : $("#config_sim"),
	        at: "center center",
	        my: "left top"
	    });
	}

}



// function checkOnOffSwitchUDOField(i){
// 	var checked = document.getElementById("myonoffswitch2_"+i).checked;
// 	var UDOField = LIST_OF_PARAMETERS[i][0];
	
// 	if (checked){
// 		if (($.inArray(UDOField, UDOFieldsToGraph)) == -1){
// 		 	UDOFieldsToGraph.push(UDOField);
// 		}
// 	} else {
// 		UDOFieldsToGraph.splice($.inArray(UDOField, UDOFieldsToGraph), 1 );
// 	}
// 	checkEntitySwitched();

// }

// function checkEntitySwitched(){

// 	for (var i = 0; i <entitiesToGraph.length;i++){
// 		var checked = document.getElementById("myonoffswitch_"+i).checked
// 		if (checked){
// 			graphEntity(entitiesToGraph[i]);
// 		}
// 	}
// }


// function graphEntity(model){
	
// 	if (simUsedUDO){			//graphing when the simulation ran with UDO 
		
// 		for (var i = 0; i < UDOFieldsToGraph.length;i++){
// 			//makeScatterGraph(model.view.name, UDOFieldsToGraph[i]);
// 			//getLineData(model.view.name, UDOFieldsToGraph[i]);
// 			console.log("graphing " + model.view.name + " with " + UDOFieldsToGraph);
// 		}

// 	} else {
// 		console.log("just Graphing " + model.view.name);
// 	}
// }

function renderGraphs(){
	
	graphEntity = [];
	UDOFieldsToGraph = [];

	//get all checked entities
	for (var i = 0; i < entitiesToGraph.length;i++){
		var checked = document.getElementById("myonoffswitch_"+i).checked
		if (checked){
			graphEntity.push(entitiesToGraph[i]);
		}
	}

	for (var i = 0; i < LIST_OF_PARAMETERS.length;i++){
		var checked = document.getElementById("myonoffswitch2_"+i).checked
		if (checked){
			UDOFieldsToGraph.push(LIST_OF_PARAMETERS[i][0]);
		}
	}

	if(UDOFieldsToGraph.length <= 0){ //checks that aleast one UDO is checked on
		bootbox.alert({size: 'small', 
                    message: "<strong><font size='3'>You must select at least one UDO field to graph</font></strong>", 
                    function(){}});
		return;
	}

	if(graphEntity.length <= 0){ //checks that aleast one Entity is checked on
		bootbox.alert({size: 'small', 
                    message: "<strong><font size='3'>You must select at least one Entity field to graph</font></strong>", 
                    function(){}});
		return;
	}

	graphman.clear();

	if (graphChosen != "histogram"){
		for (var i = 0; i < graphEntity.length; i++){
			for (var j = 0; j < UDOFieldsToGraph.length;j++){
				graphman.addPlot(graphEntity[i].view.username, UDOFieldsToGraph[j], null);
				
			}
		}

		graphman.makeGraph(graphChosen, null);
	} else {
		graphman.addPlot(graphEntity[0].view.username, UDOFieldsToGraph[0], null);
		graphman.makeGraph("histogram", [$("#user_bucket_width").val(),0]);
	}
}

function graphDropper(){

	
	 var e = document.getElementById("graph_dropdown");
     var dropOption = e.options[e.selectedIndex].value;
     	$("#bucket_width").hide();
     if (dropOption == "histogram"){
     	//$("#bar_graph_options").show();
     	graphChosen = dropOption;
     	turn_entity_toggles_off();
     	$("#bucket_width").show();
     } else if (dropOption == "scatter"){
     	graphChosen = dropOption;
     } else {
     	graphChosen = "line";
     }
}

function turn_entity_toggles_off(){         
	
	for (var i = 0;i < entitiesToGraph.length;i++){ //toggle all entities off                           
			document.getElementById("myonoffswitch_"+i).checked = false;
	} 

	for(var i = 0; i < LIST_OF_PARAMETERS.length;i++){ //toggle all udos off
				document.getElementById("myonoffswitch2_"+i).checked = false;
	}		
		
}

function check_histogram_restrictions(type, pos){

	if(type == "entities"){ //makes sure only one entity at a time is ticked
		for (var i = 0;i < entitiesToGraph.length;i++){   

			if(i != pos){
					document.getElementById("myonoffswitch_"+i).checked = false;
			}	
		} 
	}else{
		for(var i = 0; i < LIST_OF_PARAMETERS.length;i++){//makes sure only one udo at a time is ticked
			if(i != pos){
				document.getElementById("myonoffswitch2_"+i).checked = false;
			}		
		}
	}
}

function checkOnOffSwitchUDOField(i){
	if(graphChosen == "histogram"){
		check_histogram_restrictions("udo",i);
	}
}

function checkOnOffSwitchNoUDO(i){
	if(graphChosen == "histogram"){
		check_histogram_restrictions("entities",i);
	}
}


function width_chooser(){

	bucket_width =  document.getElementById("user_bucket_width").value;
}
