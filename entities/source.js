var SOURCE_DEBUG = false; // set to false to disable logs

function SourceModel(a) {
   // this.updateForm = null;
    this.view = a;
    this.params = [1, null];
    this.distribution = 'constant';   
    this._params = [[]];
    this.arthur = {};
    this.dest = null;
    this.udoFields = {}
    this.stat={}
    this.view.image.attr({
        title: "Source"
    })

    var tv = this.view;
    this.view.image["0"].onmouseover = function() {
        console.log(tv.model.stat);
       if (tv !== undefined && tv.model.stat.spawn != undefined) {
            var table = $("#hover_table");
            for (key in tv.model.stat) {
                if (tv.model.stat.hasOwnProperty(key)) {
                    console.log(typeof tv.model.stat[key])
                    if (typeof tv.model.stat[key] != "number" ) {
                        table.append('<tr style="font-size: 12px;"><td>'+key+'</td><td>'+tv.model.stat[key]["Count"]+'</td></tr>'); 
                    } else {
                        table.append('<tr style="font-size: 12px;"><td>'+key+'</td><td>'+tv.model.stat[key]+'</td></tr>'); 
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

    if (SOURCE_DEBUG) console.log("source: SourceModel");
}

SourceModel.prototype.loadUDOFields = function(struct){
    for(prop in struct){
        this.udoFields[prop] = struct[prop];
    }
    if (SOURCE_DEBUG) console.log("source: loadUDOFields");
};

SourceModel.prototype.jsonify = function() {
    this.update();
    return {
        params: this.params,
        distribution: this.distribution,
        udoFields: this.udoFields
    }
    if (SOURCE_DEBUG) console.log("source: jsonify");
};

SourceModel.prototype.start = function() {
    /* ensure that the source is up-to-date on UDO params */
    this.update()
    this.entity = QueueApp.sim.addEntity(SourceEntity, this.distribution, this.params, this.udoFields)
	this.connect();
    if (SOURCE_DEBUG) console.log("source: start");
};

SourceModel.prototype.connect = function() {
	if (SOURCE_DEBUG) console.log("Destination Entity: " + this.dest.entity)
    this.entity.dest = this.dest ? this.dest.entity : null;
};

SourceModel.prototype.update = function() {
    for(var i = 0; i < LIST_OF_PARAMETERS.length; i++){
        var name = LIST_OF_PARAMETERS[i][0];
        var type = LIST_OF_PARAMETERS[i][1];
        /* check existence of field */
        if(this.udoFields[name]){
            /* check for update of field type */
            if(!this.udoFields[name]['type']){
                /* update */
                this.udoFields[name] = {
                    type: type,
                    distribution: 'random',
                    params: [null,null],
                    boolBase: this.udoFields[name]['boolBase'],
                }
            }
        }
        /* create new entry in udo dictionary */
        else{
            this.udoFields[name] = {
                type: type,
                distribution: 'random',
                params: [null,null],
                boolBase: 0
            }
        }
        /* update divs here */
    }
    if (SOURCE_DEBUG) console.log("source: update");
}

/* TODO with frontend */
SourceModel.prototype.showSettings = function() {
    this.clearAndUpdateForm();
    pushToForm(this);
    
    var a = $("#source_form");
    QueueApp.form_view = this.view;

    if (USE_UDO){
        for (var i = 0; i < this._params.length; i++){
           
            var dist = this._params[i][0];
            var param1 = this._params[i][1];
            var param2 = this._params[i][2];
            var dropdown = a.find("#dropdown_" + i).val(dist);
            b = $("#source_table_"+i);

            var paramNum = LIST_OF_DISTRIBUTIONS[dist];
            if (paramNum == 1){
                $("#source_table_" + i + "_param1").show();
                b.find("#source_form_param1").val(param1);
                $("#source_table_" + i + "_param2").hide(); 
            } else if (paramNum == 0) {
                $("#source_table_" + i + "_param1").hide(); 
                $("#source_table_" + i + "_param2").hide(); 
            } else {
                $("#source_table_"+ i + "_param1").show();
                $("#source_table_"+ i + "_param2").show(); 
                b.find("#source_form_param1").val(param1);
                b.find("#source_form_param2").val(param2);
            }
        }
    } else {
  
        var dist = this._params[0][0];
        var param1 = this._params[0][1];
        var param2 = this._params[0][2];
        var dropdown = a.find("#dropdown_0").val(dist);
        b = $("#source_table_0");

        var paramNum = LIST_OF_DISTRIBUTIONS[dist];
        if (paramNum == 1){
            b.find("#source_form_param1").val(param1);
            $("#source_table_0_param1").show();
            $("#source_table_0_param2").hide(); 
        } else if (paramNum == 0) {
            $("#source_table_0_param1").hide(); 
            $("#source_table_0_param2").hide(); 
        } else {
            $("#source_table_0_param1").show(); 
            $("#source_table_0_param2").show();
            b.find("#source_form_param1").val(param1);
            b.find("#source_form_param2").val(param2);
        } 
    }

    a.show().position({
        of: $(this.view.image.node),
        at: "center center",
        my: "left top"
    })

    $("#hover_form").hide();
    
    displayName(this, "source_name");
    if (SOURCE_DEBUG) console.log("source: showSettings");
};

SourceModel.prototype.saveSettings = function() {

    this._params = [];

    if (USE_UDO === true){   
        for (var i = 0;i <LIST_OF_PARAMETERS.length+1; i++){
            
            this._params[i] = [];
           
            var d = document.getElementById("dropdown_"+i);
            this._params[i][0] = d.options[d.selectedIndex].value;    
            
            b = $("#source_table_"+i)
            this._params[i][1] = (b.find("#source_form_param1").val());
            this._params[i][2] = (b.find("#source_form_param2").val());
        }
    } else {

        this._params = [];
        this._params[0] = [];

        var d = document.getElementById("dropdown_0");
        this._params[0][0] = d.options[d.selectedIndex].value;    

        b = $("#source_table_0")
        this._params[0][1] = (b.find("#source_form_param1").val());
        this._params[0][2] = (b.find("#source_form_param2").val());
    }

 
    rename(this, "source_name");
    if (SOURCE_DEBUG) console.log("source: saveSettings");

    this.update();
    pullFromForm(this);
};

SourceModel.prototype.unlink = function() {
    if (SOURCE_DEBUG) console.log("link");
    this.view = null
    if (SOURCE_DEBUG) console.log("source: unlink");
};

SourceModel.prototype.initStats = function(){
    this.stat["spawn"]=this.entity.spawn;
    for(var property in this.entity.dataCollector){
        if(this.entity.dataCollector.hasOwnProperty(property)){
            dC = this.entity.dataCollector[property]
            this.stat[property]=dC.dataSeries
        }
    }
}

SourceModel.prototype.showStats = function() {
    //this.view.showCounters(NaN, this.entity.generated)
    
    if (SOURCE_DEBUG) console.log("source: showStats");
};

var SourceEntity = {
    start: function(a, b, c) {
        //Arguments: this.distribution, this.params, udofields
        this.distribution = a
        this.params = b;
        this.message = null;
        this.spawn = 0
        this.udoFields = c;
        this.dataCollector=statman.initParamSeries()
        this.setTimer(0).done(this.traffic);
    },
    /* actual data generation */
    traffic: function() {
        if(!this.dest){
			if (SOURCE_DEBUG) console.log("dest is null")
            return;
        }
        this.message = new Data();
        this.message.timer = this.time();
        for(var property in this.message.fields){
            if(this.message.fields.hasOwnProperty(property)){
                this.message.fields[property] = randDist(
                    this.udoFields[property].distribution,
                    this.udoFields[property].params,
                    QueueApp.random
                );
                /*
                type checking
                    BOOLEAN (compares value to boolBase)
                    INT (Round)
                    FLOAT (does nothing)
                */
                switch(this.udoFields[property]['type']){
                    case "BOOLEAN":
                        this.message.fields[property] = 
                        (this.message.fields[property] > this.udoFields[property][boolBase]);
                        break;
                    case "INT":
                    //this basically strips the number to an int same way other programs do it.
                        this.message.fields[property] =
                            this.message.fields[property] << 0;
                        break;
					case "FLOAT":
						this.message.fields[property] = +this.message.fields[property]
                }
                this.dataCollector[property].record(this.message.fields[property],this.message.timer);
            }
        }
		
        this.dest && /*this.dest.onMessage(this, this.message)*/this.send(this.message,0,this.dest);
        this.spawn++;
        var timeDelay = randDist(this.distribution, this.params, QueueApp.random);
		if(timeDelay < 0.5) timeDelay = 0.5
		if(SOURCE_DEBUG) console.log("timeDelay: " + timeDelay)
		if(SOURCE_DEBUG) console.log("this time: " + this.time())
        this.setTimer(timeDelay).done(this.traffic);
    }
};

function createForm(){
    if(UPDATE_FORM == null){
        if (SOURCE_DEBUG) console.log("updating source form");    
        populateForm();
        UPDATE_FORM = "something";
    }
}

//fills form with functionand parameters based on UDO if 
function populateForm(){
    var parentForm = document.getElementById("source_form_to_append");
    if (SOURCE_DEBUG) console.log("populateForm");
    
    if (USE_UDO){

        if (SOURCE_DEBUG) console.log("creating source form for UDO");

        for (var i = 0; i<LIST_OF_PARAMETERS.length+1;i++){

            var newDiv = document.createElement('div');
            newDiv.id = "source_table_" + i;

            var user_message = i == 0? "Choose your distribution function for spawning UDOs" : "Choose distribution function for "+ LIST_OF_PARAMETERS[i-1][0];
            newDiv.innerHTML =
                    '<div class="form-group"><label for="source_form_distribution" style="font-size: 14px;font-weight: normal;">' + user_message + '</label>' + '<br/>' +
                    '<select name="source_dropdown_'+ i + '" id="dropdown_' + i + '" onChange="dropper('+ i +')" class="form-control text ui-widget-content ui-corner-all">' + 
                            '<option value="constant">Constant</option>' +
                            '<option value="gaussian">Gaussian</option>' + 
                            '<option value="exponential">Exponential</option>' +
                            '<option value="pareto">Pareto</option>' +
                            '<option value="random">Random</option>' +
                            '<option value="gamma">Gamma</option>' +
                            '<option value="weibull">Weibull</option>' +
                            '<option value="uniform">Uniform</option>' +
                        '</select></div>' + 
                '<div id="source_table_'+ i + '_param1">' +
                    '<label for="source_form_param1" style="font-size: 14px;font-weight: normal;">Parameter 1</label>' + '<br/>' +
                    '<input type="number" name="source_form_param1" id="source_form_param1" value="" class="form-control"></div>' + //text ui-widget-content ui-corner-all my-text-field
                '<div id="source_table_'+ i + '_param2" style="display: none">' +
                    '<label for="source_form_param2" style="font-size: 14px;font-weight: normal;">Parameter 2</label>' + '<br/>' +
                    '<input type="number" name="source_form_param2" id="source_form_param2" value="" class="form-control"></div>'; // text ui-wandomidget-content ui-corner-all my-text-field
            
            parentForm.appendChild(newDiv);
        }
    } else {
        if (SOURCE_DEBUG) console.log("create form for Ping");    
        var i = 0;

        var newDiv = document.createElement('div');
            newDiv.id = "source_table_0";

        newDiv.innerHTML = '<label for="source_form_distribution" style="font-size: 14px;font-weight: normal;">Choose your distribution function</label>' + '<br/>' +
                '<select name="source_dropdown_'+ i + '" id="dropdown_' + i + '" onChange="dropper('+ i +')" class="form-control text ui-widget-content ui-corner-all">' + 
                        '<option value="constant">Constant</option>' +
                        '<option value="gaussian">Gaussian</option>' + 
                        '<option value="exponential">Exponential</option>' +
                        '<option value="pareto">Pareto</option>' +
                        '<option value="random">Random</option>' +
                        '<option value="gamma">Gamma</option>' +
                        '<option value="weibull">Weibull</option>' +
                        '<option value="uniform">Uniform</option>' +
                    '</select>' + 
            '<div id="source_table_'+ i + '_param1">' +
                '<label for="source_form_param1" style="font-size: 14px;font-weight: normal;">Parameter 1</label>' + '<br/>' + 
                '<input type="number" name="source_form_param1" id="source_form_param1" value="" class="form-control"><div>' +
            '<div id="source_table_'+ i + '_param2" style="display: none">' +
                '<label for="source_form_param2" style="font-size: 14px;font-weight: normal;">Parameter 2</label>' + '<br/>' +
                '<input type="number" name="source_form_param2" id="source_form_param2" value="" class="form-control""></div>';
        
        parentForm.appendChild(newDiv);
    }
}

function dropper(index){

    var e = document.getElementById("dropdown_" + index);
    var dropOption = e.options[e.selectedIndex].value;

    if (dropOption == "exponential" || dropOption == "constant" || 
            dropOption == "pareto"){ // param1 shows but param2 hidden
        $("#source_table_" + index + "_param1").show(); 
        $("#source_table_" + index + "_param2").hide(); 

    } else if (dropOption == "random"){ // param1 and param2 both are hidden
        $("#source_table_" + index + "_param2").hide();
        $("#source_table_" + index + "_param1").hide();
      
    } else {
        //for gaussian, weibull and gamma
        $("#source_table_" + index + "_param1").show();  // Both parameters shows up
        $("#source_table_" + index + "_param2").show();
    }
}

//clearing the form to be updated again form new UDO information.
// this function is very primitive at the moment
SourceModel.prototype.clearAndUpdateForm = function(){
    var a = document.getElementById("source_form_to_append");
    a.innerHTML = "";

    populateForm();
    if (SOURCE_DEBUG) console.log("source: clearAndUpdateForm");
}


