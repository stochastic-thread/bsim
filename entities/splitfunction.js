var SPLITFUNCTION_DEBUG = false; // set to false to disable logs

function SplitFuncModel(a) {
    this.view = a;
    this.dest = [null, null];
    this._params = [[]];
    this.funct = null;
    this.prob = 0.5;
    this._params[0][0] = "func";
	this.stat={}
	
	this.useUdo = false
	this.fieldToCheck = "";
	this.op = "==";
	this.constant = "0";
	
	var b;
	if(this.useUdo)
		b = ["Function:",this.fieldToCheck,this.op,this.constant].join(" ")
	else{
		b = ["Splitting", this.prob * 100, "% / ", 100 - this.prob * 100, "%"].join(" ");
	}
	
    a.image.attr({
        title: b
    })
};

SplitFuncModel.prototype.createFuncString = function(){
	var re = new RegExp(this.fieldToCheck, "g");
    this.funct = [this.fieldToCheck, this.op, this.constant].join("");
	this.funct = this.funct.replace(re, "@" + this.fieldToCheck);
};

SplitFuncModel.prototype.saneFields = function(){
	if(USE_UDO && LIST_OF_PARAMETERS.length > 0 && (this.fieldToCheck == null || this.fieldToCheck == "")){
		this.fieldToCheck = LIST_OF_PARAMETERS[0][0];
		if (SPLITFUNCTION_DEBUG) console.log(this.fieldToCheck);
	}
};

SplitFuncModel.prototype.jsonify = function() {
	this.createFuncString();
    return {
		fieldToCheck: this.fieldToCheck,
    	prob: this.prob,
		op: this.op,
		constant: this.constant
    }
};

SplitFuncModel.prototype.start = function() {
	this.createFuncString();
    this.entity = QueueApp.sim.addEntity(SplitFuncEntity, this.funct, this.fieldToCheck, this.prob, this.useUdo);
};

SplitFuncModel.prototype.connect = function() {
    this.entity.dest1 = this.dest[0] ? this.dest[0].entity : null;
    this.entity.dest2 = this.dest[1] ? this.dest[1].entity : null;
};

SplitFuncModel.prototype.updateForm = function(){
	/* Returns JQuery object based on this.useUdo*/
	   
	if(USE_UDO && LIST_OF_PARAMETERS.length > 0){
        createSplitForm();
        
        var splitfuncform = $("#splitfunc_form");
        QueueApp.form_view = this.view;

        if (this.useUdo){
             document.getElementById("splitswitch").checked = true;
        } else{
            document.getElementById("splitswitch").checked = false;
        }
        checkSplitSwitch();
        //resetSplit();
        
        var num = this._params[0][3];
        var operation = this._params[0][2];
        var fieldName = this._params[0][1]; 
       
		splitfuncform.find("#splitfunc_dropdown_0").val(fieldName);
        splitfuncform.find("#splitfunc_dropdown_1").val(operation);
        splitfuncform.find("#splitfunc_form_param1").val(num);

        splitfuncform.find("#splitfunc_prob").val(this._params[0][4]);


		return splitfuncform

    } else{
        var splitterform = $("#splitter_form");
        QueueApp.form_view = this.view;
        splitterform.find("#splitter_form_perc").val(this._params[0][4]);
		return splitterform
	}
};

SplitFuncModel.prototype.showSettings = function() {

	this.saneFields();
	pushToForm(this);
    
	var a = this.updateForm()
    a.show().position({
            of: $(this.view.image.node),
            at: "center center",
            my: "left top"
    })

    $("#hover_form").hide();
};

function hideSplitForm(){

    $("#splitfunc_form").hide();
    $("#splitter_form").hide(); 
    //$("#splitfunc_form").hide();      
};

function resetSplit(){

    var b = $("#splitfunc_form");
    if(LIST_OF_PARAMETERS[0]){
    	b.find("#splitfunc_dropdown_0").val(LIST_OF_PARAMETERS[0][0]);
	}
    else {
    	b.find("#splitfunc_dropdown_0").val("");
    }
    	
    b.find("#splitfunc_dropdown_1").val("==");
    b.find("#splitfunc_form_param1").val("0");
};

function createSplitForm(){

    if(UPDATE_SPLIT_FORM == null){
        if (SPLITFUNCTION_DEBUG) console.log("createSplitForm");
        populateSplitForm();
        UPDATE_SPLIT_FORM = "something";
    }
}

function populateSplitForm(){
    $("#splitfunc_dropdown_0").empty();
    var parentForm = document.getElementById("splitfunc_dropdown_0");
    if (SPLITFUNCTION_DEBUG) console.log("create option for splitfunc");
    for (var i =0; i < LIST_OF_PARAMETERS.length;i++){
        var option = document.createElement("option");
        option.text = LIST_OF_PARAMETERS[i][0];
        parentForm.add(option);
    }
    var b = $("#splitfunc_form");
    b.find("#splitfunc_form_param1").val("");

}

SplitFuncModel.prototype.clearAndUpdateForm = function(){
    var a = document.getElementById("splitfunc_dropdown_0");
    a.innerHTML = "";

    // var b = $("#splitfunc_form");
    // b.find("#splitfunc_form_param1").val("");
    // $("#splitter_form").find("#splitter_form_perc").val("");
    this._params= null;
    populateSplitForm();
}


SplitFuncModel.prototype.saveSettings = function() {
    if(USE_UDO && LIST_OF_PARAMETERS.length > 0){
        this.useUdo =  document.getElementById("splitswitch").checked; 
		var nume = this.constant
		var fieldName = this.fieldToCheck
		var operation = this.op
		
        if (this.useUdo){
			var udofieldchoice = document.getElementById("splitfunc_dropdown_0");
			fieldName = udofieldchoice.options[udofieldchoice.selectedIndex].value;
	
			var opchoice = document.getElementById("splitfunc_dropdown_1");
			operation = opchoice.options[opchoice.selectedIndex].value;    
	
			nume = $("#splitfunc_form_param1").val();
        }
        this.prob = +$("#splitfunc_prob").val();
		
        
        this._params = [[]];
        this._params[0][0] = "func";   

        this._params[0][1] = fieldName;
        this._params[0][2] = operation;
        this._params[0][3] = nume;
        this._params[0][4] = this.prob;
    } else {
        this._params = [[]];
        this._params[0].push("func");
		this.prob = +$("#splitter_form_perc").val();
		this._params[0].push(this.fieldToCheck)
		this._params[0].push(this.op)
		this._params[0].push(this.constant)
        this._params[0].push(this.prob)
		
		
		/* 
		this.fieldToCheck = "";
		this.op = "";
		this.constant = "";
		*/
		
    }

    
///////////// BACKEN/.///D: if UDO is not being used, this._param[0][3] constains user input for traffic flow
    
	pullFromForm(this);
	
    var tooltipstr = "";
    if(this.useUdo) {
		tooltipstr = ["Function:",this.fieldToCheck,this.op,this.constant].join(" ")
    } else {
		if(SPLITFUNCTION_DEBUG) console.log("Probability Changed to: " + this.prob)
    	tooltipstr = ["Splitting", this.prob * 100, "% / ", 100 - this.prob * 100, "%"].join(" ");
    }
};

SplitFuncModel.prototype.unlink = function() {
    this.view = null
};

function checkSplitSwitch(){
    var checked = document.getElementById("splitswitch").checked;

    if (checked){
        $("#splitfunc_NO_UDO").hide();
        $("#splitfunc_USE_UDO").show();
        $("#splitfunc_UDO_field").show();
    } else{
        $("#splitfunc_NO_UDO").show();
        $("#splitfunc_USE_UDO").hide();
        $("#splitfunc_UDO_field").hide();
    }
}

SplitFuncModel.prototype.initStats = function(){
	this.stat["function"] = this.fieldToCheck + this.op + this.constant
	this.stat["trafficup"] = this.entity.to1
	this.stat["trafficdown"] = this.entity.to2
	this.stat["arrived"] = this.entity.arrived
	for(var property in this.entity.dataCollector){
		if(this.entity.dataCollector.hasOwnProperty(property)){
			dC = this.entity.dataCollector[property]
			this.stat[property] = dC.dataSeries
		}
	}
}

SplitFuncModel.prototype.showStats = function() {
	/* make sure this.stat is initalized prior to making calls to it.*/
	
	
    //call animation manager funtion
    //var value = a.toFixed(1);
};

var SplitFuncEntity = {
        start: function(funct, fieldToCheck, prob, useUdo) {
            this.to2 = this.to1 = this.arrived = 0;
			this.fieldToCheck = fieldToCheck;
			this.prob = prob
			if (SPLITFUNCTION_DEBUG) console.log("ASD: " + funct);
			this.useUdo = useUdo
			if(this.useUdo){
				var re = new RegExp("@" + this.fieldToCheck, "g");
				var str = "message.fields[\"" + this.fieldToCheck + "\"]"
				this.funcString = funct.replace(re, str);
			}
			else
				this.funcString = 'QueueApp.random.uniform(0,1) < this.prob';
			//{property name:time series
			this.dataCollector=statman.initParamSeries()
        },
        onMessage: function(sender, message) {
            this.arrived++;
			//We assume true route to to1 and false to route to to2
			//We also assume that this.funct will always return true/false
			if(eval(this.funcString)){
				(this.to1++, this.dest1 && this.send(message, 1, this.dest1)) /*this.dest1.onMessage(this, message))*/
			} else {
				(this.to2++, this.dest2 && this.send(message, 1, this.dest2)) /*this.dest2.onMessage(this, message))*/
			}
			for(var property in message.fields){
				if(message.fields.hasOwnProperty(property)){
					this.dataCollector[property].record(message.fields[property],this.time());
				}
			}	
        }
    },
    SplitFuncView = function(a, b, c, d, e) {
        this.canvas = a;
        this.type = b;
        this.name = c;
        this.username = c;
        this.hidden = [a.rect(d, e, 10, 10), a.rect(d, e, 10, 10)];
        this.width = 28.7;
        this.height = 48 * 0.7;
        this.image = a.image("images/splitfunc_gray.png", d, e, this.width, this.height);
        this.x = d;
        this.y = e;
        this.color;
        this.colorUp;
        this.colorDown;

        this.hidden[0].attr({
            "stroke-width": "0"
        });
        this.hidden[1].attr({
            "stroke-width": "0"
        });
        this.image.attr({
            cursor: "move"
        });
        this.image.view = this;
        this.image.animate({
            scale: "1.2 1.2"
        }, 200, function() {
            this.animate({
                scale: "1 1"
            }, 200)
        });
        this.arrows = [null, null];
        this.counters = a.text(d, e, "");
        for (b = 0; b < 2; b++) c = a.image("images/blue-arrow.png", d, e, 15, 15), c.view = this, c.id = b, c.drag(function(a, b) {
            this.attr({
                x: this.ox + a,
                y: this.oy + b
            });
            this.paper.connection(this.conn)
        }, function() {
            this.conn = this.paper.connection(this.view.hidden[this.id], this, PATH_SHADOW_COLOR);
            this.conn.line[0].setAttribute("stroke-width","2"); //make  path shadow thicker
            this.ox = this.attr("x");
            this.oy = this.attr("y")
        }, function() {
            this.conn.line.remove();
            this.conn = null;
            var a = QueueApp.views,
                b = a.length,
                c = this.attr("x"),
                d = this.attr("y");
            for (b -= 1; b >= 0; b--) {
                var e = a[b];
                if (e.acceptDrop(c, d, this.view.name)) {
                    this.hide();
                    this.view.connect(e, this.id);
                    return
                }
            }
            a = this.view;
            this.id === 0 ? this.attr({
                x: a.x + a.width + 2,
                y: a.y + 5
            }) : this.attr({
                x: a.x + a.width + 2,
                y: a.y + a.height - 15
            })
        }), this.arrows[b] = c;
        this.moveto(d, e);
        this.image.drag(function(a, b) {
                var c = this.view;
                c.moveto(c.ox + a, c.oy + b)
            }, function() {
                var a = this.view;
                a.ox = a.x;
                a.oy = a.y
            },
            function() {});
        this.image.dblclick(function() {
            this.view.model.showSettings()
        })
    };

SplitFuncView.prototype.moveto = function(a, b) {
    var c;
    if (!(a > CANVAS_W - this.width || b > CANVAS_H - this.height || a < 0 || b < 0)) {
        this.x = a;
        this.y = b;
        this.image.attr({
            x: a,
            y: b
        });
        this.hidden[0].attr({
            x: this.x + this.width - 10,
            y: this.y + 5
        });
        this.hidden[1].attr({
            x: this.x + this.width - 10,
            y: this.y + this.height - 15
        });
        this.arrows[0].attr({
            x: this.x + this.width + 2,
            y: this.y + 5
        });
        this.arrows[1].attr({
            x: this.x + this.width + 2,
            y: this.y + this.height - 15
        });
        this.counters.attr({
            x: this.x + this.width / 2,
            y: this.y + this.height + 5
        });
        for (c = QueueApp.views.length - 1; c >= 0; c--) QueueApp.views[c].moveConnection(this);
        this.arrows[0].conn && this.canvas.connection(this.arrows[0].conn, 0, 0, 0, 0, this.arrows[0].conn.toView.type == "reverser");
        this.arrows[1].conn && this.canvas.connection(this.arrows[1].conn, 0, 0, 0, 0, this.arrows[1].conn.toView.type == "reverser");
    }
};

SplitFuncView.prototype.connect = function(a, b) {
    var c = this.canvas.connection(this.hidden[b], a.dropObject(), "#000", 0, 0, a.type == "reverser");


     c.line.node.setAttribute("data-from",this.image.node.id);  //adds where the path is coming from
     c.line.node.setAttribute("data-to",a.image.node.id);       //adds where the path is going to

    c.line.attr({
        "stroke-width": 3,
        stroke: "rgba(52,152,219, 0.86)"
    });
//    c.line.node.id = getID();     //here  SplitFunc
    c.fromView = this;
    c.toView = a;
    this.arrows[b].conn = c;
    this.arrows[b].hide();
    this.model.dest[b] = a.model
};

SplitFuncView.prototype.unlink = function() {
    var a, b;
    a = QueueApp.models.length;
    for (a -= 1; a >= 0; a--)
        if (QueueApp.models[a] === this.model) {
            b = a;
            break;
        }
    b && QueueApp.models.splice(b, 1);
    this.model && this.model.unlink();
    this.disconnect();
    a = QueueApp.views.length;
    for (a -= 1; a >= 0; a--) QueueApp.views[a].disconnect(this), QueueApp.views[a] === this && (b = a);
    QueueApp.views.splice(b, 1);
    this.image.remove();
    this.arrows[0].remove();
    this.arrows[1].remove();
    this.hidden[0].remove();
    this.hidden[0].remove();
    this.counters.remove()
};

SplitFuncView.prototype.disconnect = function(a) {
    for (var b = 0; b < 2; b++) {
        var c = this.arrows[b];
        if (c && c.conn && (!a || c.conn.toView === a)) c.conn.line.remove(), c.conn = null, b === 0 ? c.attr({
            x: this.x + this.width + 2,
            y: this.y + 5
        }) : c.attr({
            x: this.x + this.width + 2,
            y: this.y + this.height - 15
        }), c.show()
    }
};

SplitFuncView.prototype.dropObject = function() {
    return this.image
};

SplitFuncView.prototype.acceptDrop = function(a, b, c) {
    if (this.name == c) return 0
    return a > this.x - 10 && a < this.x + this.width + 10 && b > this.y - 10 && b < this.y + this.height + 10
};

SplitFuncView.prototype.moveConnection = function(a) {
    for (var b = 0; b < 2; b++) {
        var c = this.arrows[b];
        c && c.conn && c.conn.toView === a && this.canvas.connection(c.conn, 0, 0, 0, 0, a.type == "reverser")
    }
};

SplitFuncView.prototype.jsonify = function() {
    for (var a = {
            x: this.x,
            y: this.y,
            type: this.type,
            name: this.name,
            out: [null, null]
        }, b = 0; b < 2; b++) {
        var c = this.arrows[b];
        if (c.conn) a.out[b] = c.conn.toView.name
    }
    if (this.model) a.model = this.model.jsonify();
    return a
};
