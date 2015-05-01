var UDO_DEBUG = true;

var udoman = {
	maxCount: 0,
	count: 0,
	table: null,
	makeString: function(i, name, type){
		var html = [
			"<tr id=\"udo_row_" + i + "\" ",
			"style=\"font-size: 14px; font-weight: normal;\">",
			"<td>",
			"<input id=\"udo_text_box_" + i + "\" type=\"text\" value=\"" + name + "\"",
			"class=\"text ui-widget-content ui-corner-all my-text-field\" />",
			"</td>    <td><select name=\"sources_dropdown\"",
			"class = \"ui-widget-content ui-corner-all\" id=\"udo_dropdown_" + i + "\"",
			"class=\"text ui-widget-content ui-corner-all\">",      
			"<option  value=\"INT\">INT</option>",
			"<option  value=\"FLOAT\">FLOAT</option>",
			"<option  value=\"BOOLEAN\">BOOLEAN</option>",
			"</select></td>    <td>       ",
			"<div type=\"button\"",
			"class=\"udo_button_close ui-button btn btn-danger btn-xs\"",
			"onclick = ",
			"\"udoman.removeField(" + i + " )\">",
			"<span class=\"glyphicon glyphicon-remove-circle\" aria-hidden=\"true\">",
			"</span> Delete      </div>    </td>  </tr>"
			].join("");
		return html;
	},
	setUDO: function(){
		if(this.table == null)
			this.table = $("#udo_dialogue_table");
	    var b = $("#udo_form");
	    b.show().position({
	        of: $("#add_udo"),
	        at: "left bottom",
	        my: "right top"
	    });
		/* clear regardless */
		this.table.empty();
		/* render each currently saved parameter by appending html */
		for(var i = 0; i < LIST_OF_PARAMETERS.length; i++){
			i = +i;
			var html = this.makeString(i, LIST_OF_PARAMETERS[i][0], LIST_OF_PARAMETERS[i][1]);
			this.table.append(html);
			this.table.find("#udo_dropdown_" + i).val(LIST_OF_PARAMETERS[i][1]);
		}
		
		this.maxCount = LIST_OF_PARAMETERS.length;
		if(this.maxCount < MAX_UDO_FIELDS)
		{
			$("#btnAdd").show();
		}
	},
	removeField: function(i){
		if (this.maxCount <= MAX_UDO_FIELDS) {
			// restore button
			$("#btnAdd").show();
		}
		
		this.maxCount--;
		if(this.table == null)
			this.table = $("#udo_dialogue_table");
		var dom = document.getElementById("udo_row_" + i);
		dom.parentElement.removeChild(dom);
	},
	addField: function(){
		
		if(this.table == null)
			this.table = $("#udo_dialogue_table");
		
		var html = this.makeString(this.count, "field" + this.count);
		
		this.table.append(html);
		this.maxCount++; 
		this.count++; //hopefully not infinite number
		if (this.maxCount >= MAX_UDO_FIELDS) {
			// reached maximum hide add button
			$("#btnAdd").hide();
		}
	},
	alertUser: function(){
		var splitter_present = false;
		var func_block_present = false;
		for(var i = 0; QueueApp.models && i < QueueApp.models.length; i++){
			var test = QueueApp.models[i];
			test._params = null;
			test.clearAndUpdateForm && test.clearAndUpdateForm();
			switch (test.view.type){
				case "splitfunc":
					splitter_present = true;
				break;
				case "func":
					func_block_present = true;
				break;
			}
		}
		var message = splitter_present? "splitter function changed " : "";
		var messagetwo = func_block_present? "function block changed" : ""; 
		if (splitter_present || func_block_present){
			var str1 = func_block_present? "a function Block" : "";
			var str2 = splitter_present? "a function Splitter" : "";
			//var done = false;
			bootbox.confirm("<strong><font size='3'>Toggling switch will result in resetting entities to default state. Do you wish to proceed? </font></strong>", 
				function(result){
					if(result){
						
					} else {
						udoman.setUseUDO(!USE_UDO);
					}
				}
			);
		}
	},
	nameIsGood: function(name, list){
		if(name == null || name == ""){
			return false;
		}
		if(name != name.replace(/\W/g, ''))
			return false;
        for (var i = 0; i < list.length; i++) {
        	if(list[i][0] === name) return false;
        }
		if ($.inArray(name, list) != -1)
			return false;
		return true;
	},
	getNameAndType: function(i, list){
        var value = document.getElementById("udo_text_box_" + i).value;
		var bad = [];
        if (!udoman.nameIsGood(value, list))
			return null;

        var type = document.getElementById("udo_dropdown_" + i);
        type = type.options[type.selectedIndex].value;
		return [value, type]; 
	},
	saveUDO: function(){
		LIST_OF_PARAMETERS = [];
		var bootBoxFlag = false;
		this.table.find("tr").each(function(i, v){
			/* why do I need the actual object..? */
			var id = v.innerHTML.split("\"")[1].split("_")[3];
			var arr = udoman.getNameAndType(id, LIST_OF_PARAMETERS);
			if(arr != null){
				id = +id;
				LIST_OF_PARAMETERS.push(arr);
			} else {
				bootBoxFlag = true;
			}
		});
		if(bootBoxFlag){
			
			bootbox.alert("Name cannot repeat and names must only contain alphanumeric characters", function(){});
		}
		for (var i = 0; i < QueueApp.models.length;i++){
			QueueApp.models[i] && QueueApp.models[i].clearAndUpdateForm && QueueApp.models[i].clearAndUpdateForm();
		}
		$("#udo_form").hide();
	},
	setUseUDO: function(useudo){
		/* NOTE trying to clear forms when udo is toggle */
		for(var i = 0; i < QueueApp.models.length; i++){
			QueueApp.models[i] && QueueApp.models[i].clearAndUpdateForm && QueueApp.models[i].clearAndUpdateForm();
		}
		USE_UDO = useudo
		SIM_HAS_RUN = false;
		if(USE_UDO){
		    $("#use_udo").children().last().addClass("active").text("Using UDO");
		    $("#use_udo").children().first().removeClass("glyphicon-remove-circle").addClass("glyphicon-ok-circle");
	        document.getElementById("use_udo_button_server").disabled = false;
	        document.getElementById("use_function_button_server").checked = true;
	        document.getElementById("use_function_button_server").disabled = false;
	        document.getElementById("use_udo_button_stack").disabled = false;
	        document.getElementById("use_function_button_stack").checked = true;
	        document.getElementById("use_function_button_stack").disabled = false;
	        hideSplitForm(); 
	        hideFuncForm();
		} else {
			$("#use_udo").children().last().removeClass("active").text("Not Using UDO");
		    $("#use_udo").children().first().removeClass("glyphicon-ok-circle").addClass("glyphicon-remove-circle");
			document.getElementById("use_udo_button_server").disabled = true;
			document.getElementById("use_function_button_server").checked = true;
			document.getElementById("use_function_button_server").disabled = false;
			document.getElementById("use_udo_button_stack").disabled = true;
			document.getElementById("use_function_button_stack").checked = true;
			document.getElementById("use_function_button_stack").disabled = false;
			hideSplitForm();
			hideFuncForm();
			$("#server_param1").show(); 
			$("#server_param2").show(); 
			$("#stack_param1").show();
			$("#stack_param2").show();
		}
	},
	toggleUseUDO: function(){
		this.setUseUDO(!USE_UDO)
		this.alertUser();	
	}
};
/*
function setUDO() {
	console.log("OLD");
}

var numUserAttributes = 0;

var set_for_udo_shown = new Set(); // keeps track of shown table rows in udo form

var stack_for_udo_hidden = []; // keeps track of hidden table rows in udo form

// since the fileds are hidden, adding to hidden stack

stack_for_udo_hidden.push(4);
stack_for_udo_hidden.push(3);
stack_for_udo_hidden.push(2);
stack_for_udo_hidden.push(1);
stack_for_udo_hidden.push(0);

// hiding 4 fields when udo form starts
    // $("#udo_row_1").hide();
    // $("#udo_row_2").hide();
    // $("#udo_row_3").hide();
    // $("#udo_row_4").hide();



function toggle(element) {
    element.checked = !element.checked
    element.disabled = !element.disabled
}

// function GetDynamicTextBox(){
//    numUserAttributes++;

//    var parentTable = document.getElementById("udo_dailogue_table");

//    var tableRow = document.createElement('tr');
//    tableRow.id = "tableRow_"+ numUserAttributes;

//    tableRow.innerHTML = 
//                        '<td> <input id="udo_text_box_'+ numUserAttributes+'" type="text" class="text ui-widget-content ui-corner-all"/>' +
//                            '</td>' +
//                        '<td> <select name="source_dropdown" class = " ui-widget-content ui-corner-all" id="udo_dropdown_'+ numUserAttributes + '">' +
//                                '<option  value="INT">INT</option>' +
//                                '<option  value="FLOAT">FLOAT</option>' +
//                                '<option  value="BOOLEAN">BOOLEAN</option>' +
//                                '</select>' +
//                            '</td>' +
//                        '<td> <button class="ui-button ui-widget ui-state-default ui-corner-all  " onclick = "RemoveTextBox('+ numUserAttributes+')" />' +
//                            '<span class="ui-button-text">Remove</span></button> ' + '</td>';

//    parentTable.appendChild(tableRow);
// }

function disableDis(value) {
    document.getElementById("use_"+value).disabled = true;
    document.getElementById("dis_"+value).disabled = false;
}

function disableUse(value) {
    document.getElementById("use_"+value).disabled = false;
    document.getElementById("dis_"+value).disabled = true;
}
function removeUdoTableRow(value) { // name conflict error
	console.log("OLD");
	return;
  stack_for_udo_hidden.push(value);
  set_for_udo_shown.delete(value);
  $("#udo_row_" + value).hide();
}

function addUdoTableRow(){
	console.log("OLD");
	return;
  if(stack_for_udo_hidden.length != 0){
    var temp = stack_for_udo_hidden.pop();
    set_for_udo_shown.add(temp);
    $("#udo_row_" + temp).show();

  }

}

// function RecreateDynamicTextboxes() {
//     var values = eval('<%=Values%>');

//     alert("in recreateDynamicTextboxes: " +values);

//     if (values != null) {
//         var html = "";
//         for (var i = 0; i < values.length; i++) {
//             html += "<div id=udo_div" +  i  + ">" + GetDynamicTextBox(values[i]) + "</div>";
//         }
//         document.getElementById("TextBoxContainer").innerHTML = html;
//     }
// }

// window.onload = RecreateDynamicTextboxes;

function saveUDOParams() {
	console.log("OLD");
	return;
    // Use LIST_OF_PARAMETERS, which is # of fields shown and stored in our set
    LIST_OF_PARAMETERS = [];
    var counter_for_list_of_param = 0; // counts indexes for the LIST_OFPARAMETERS because we can't use i anymore in the for loop
    //checkUseUdo();
    //var udoFormParent = document.getElementById("TextBoxContainer").children.length;



// NOW DON"T NEED THIS BECAUSE THE FIRST PARAMETER IN UDO IS NOT BY DEFAULT

    //var value0 = document.getElementById("udo_text_box_0").value;

    // if (value0 != null){
    //     var type0 = document.getElementById("udo_dropdown_0");
    //     type0 = type0.options[type0.selectedIndex].value;
    //     // save values
    //     LIST_OF_PARAMETERS[counter_for_list_of_param] = [value0, type0];
    //     counter_for_list_of_param++;
    // }
        
    for (var i of set_for_udo_shown) {
        var value = document.getElementById("udo_text_box_" + i).value;

        if (value == null)
            continue;

        var type = document.getElementById("udo_dropdown_" + i);
        type = type.options[type.selectedIndex].value;
        // save values
        LIST_OF_PARAMETERS[counter_for_list_of_param] = [value, type];
        counter_for_list_of_param++;
    }

    if (UDO_DEBUG) console.log("saveUDOParams");
    //This method is clearing dialogues and set them to defualt for entities when UDO's are removed   
    if(UPDATE_FORM != null || UPDATE_SPLIT_FORM != null || UPDATE_SERVER_FORM != null || UPDATE_FUNC_FORM != null){
        if (UDO_DEBUG) console.log(UPDATE_FORM + " " + UPDATE_SPLIT_FORM + " " + UPDATE_SERVER_FORM + " " + UPDATE_FUNC_FORM);
        var splitter_present = false;
        var func_block_present = false;
        if(QueueApp.models.length != 0){
            for(var i = 0; i < QueueApp.models.length; i++){
                var test = QueueApp.models[i];
                if (UDO_DEBUG) console.log("in save"  + test.view.name);
                QueueApp.models[i]._params = null;
                QueueApp.models[i].clearAndUpdateForm();
                switch (test.view.type){
                    case "splitfunc":
                        splitter_present = true;
                        break;
                    case "func":
                        func_block_present = true;
                        break;
                }
            }
        }
   }
   
    var message = splitter_present? "splitter function changed " : "";
    var messagetwo = func_block_present? "function block changed" : ""; 
    if (splitter_present || func_block_present){
    
      bootbox.alert(message + " " + messagetwo + " has reset", function() {
        return;
      });
    }
    $("#udo_form").hide();
}

// this fucntion chnages the global udo_use boolean when radio button in changed. 
function checkUseUdo() {
    if(USE_UDO){
        document.getElementById("use_udo_button").disabled = false;
        document.getElementById("use_function_button").checked = true;
        document.getElementById("use_function_button").disabled = false;
        hideSplitForm(); 
        hideFuncForm();
 
        //alert("in udo true");

     }else{
        document.getElementById("use_udo_button").disabled = true;
        document.getElementById("use_function_button").checked = true;
        document.getElementById("use_function_button").disabled = false;
        hideSplitForm();
        hideFuncForm();
        $("#server_param1").show(); 
        $("#server_param2").show(); 
        //alert("in udo false");
     }
}


function setUseUdo(usingUdo){
	console.log("OLD");
	return;
	USE_UDO = usingUdo
    if(USE_UDO){
        $("#use_udo").children().last().addClass("active").text("Using UDO");
        $("#use_udo").children().first().removeClass("glyphicon-remove-circle").addClass("glyphicon-ok-circle");
    } else {
		$("#use_udo").children().last().removeClass("active").text("Not Using UDO");
        $("#use_udo").children().first().removeClass("glyphicon-ok-circle").addClass("glyphicon-remove-circle");
    }
    checkUseUdo();
   // console.log("george");
    saveUDOParams();
}


function udoToggle(){
	console.log("OLD");
	return;
		setUseUdo(!USE_UDO)
        //console.log("george");
}
*/
