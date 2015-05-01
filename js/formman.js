/*
	NOTE - thermo example
		create thermo
		formman.createForm(QueueApp.models[0]);
	TODO add button listeners
	TODO model.view.name is CONSTANT
	TODO model.view.usernam is DYNAMIC
	TODO both are unique
	TODO graph is broken now if we must rely on username
	TODO all functions may need an actual reference, we should give it when needed
	TODO fix form position
*/	
var formman = {
//	stub: null,
//	createHeader: function(name, x, y){
//		var head = [
//			"<div id=\"" + name + "_form\" draggable=\"true\" title=\"" + name + "_properties\" class=\"settings_form\" style=\"width: 25em; height: auto;\">",
//            "<div id=\"" + name + "_form_close\" type\"button\" class=\"settings_form_close\">",
//			"<span class=\"glyphicon glyphicon-remove-circle\" style=\"float: right; positon: absolute; left: 30px; top: 15px\"",
//			"aria-hidden=\"true\"></span>",
//			"</div><div class=\"form-group\">",
//			"<label for=\"" + name + "_name\" style=\"font-size: 14px;font-weight: normal;\">" + name + "</label><br/>",
//			"<input type=\"text\" class=\"form-control\" id=\"" + name + "_name\" placeholder=\"enter name\">",
//            "</div>",
//            "<br/>"
//		].join("");
//		return head;
//	},
//	createFooter: function(name, disconnect){
//		var discButton = [
//			"<div id=\"" + name + "_form_disconnect\" type=\"button\" class=\"settings_form_disconnect btn btn-default btn-xs\">",
//            "<span class=\"glyphicon glyphicon-ban-circle\" aria-hidden=\"true\"></span> Detach",
//            "</div>"
//		].join("");
//		discButton = (disconnect)? discButton : "";
//
//		var footer = [
//			discButton, 
//			"<div id=\"" + name +"_form_save\" type=\"button\" class=\"settings_form_save btn btn-success btn-xs\">",
//			"<span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> Apply",
//            "</div><div id=\"" + name + "_form_delete\" type=\"button\" class=\"settings_form_delete btn btn-danger btn-xs\">",
//            "<span class=\"glyphicon glyphicon-remove-circle\" aria-hidden=\"true\"></span> Delete",
//            "</div></div>"
//		].join("");
//		return footer;
//	},
//	createEasyForm: function(model){
//		return "";
//	},
//	toggleFormUDO: function(name){
//
//	},
//	createFacForm: function(model){
//		var name = model.view.name;
//        var html = [
//			"<table><tr><td>",
//			"<input id=\"" + name + "_use_udo_button\" type=\"radio\" class=\"medium\" name=\"" + name + "\" value=\"" + name + "\"",
//			"onClick=\'formman.toggleFormUDO(\"" + name + "\")\' disabled><font size=\"3\">UDO</font>",
//            "<input id=\"" + name + "_use_function_button\" type=\"radio\" class=\"medium\"",
//			"name=\"" + name + "\" value=\"disable\" checked onClick=\'formman.toggleFormFunc(\"" + name + "\")\'",
//			"><font size=\"3\">Function</font></td>",
//            "<td><select name=\"" + name + "_dropdown\" id=\"" + name + "_stack_dropdown\"",
//			"class=\"form-control text ui-widget-content ui-corner-all\" onChange=\'formman.dropUpdate(\"" + name + "\");\'>",
//				'<option value="gaussian">Gaussian</option>',
//                '<option value="exponential">Exponential</option>',
//                '<option value="pareto">Pareto</option>',
//                '<option value="random">Random</option>',
//                '<option value="gamma">Gamma</option>',
//                '<option value="weibull">Weibull</option>',
//                '<option value="constant">Constant</option>',
//                '<option value="uniform">Uniform</option>'
//			].join("");
//		for(var i = 0; i < LIST_OF_PARAMETERS.length; i++){
//			html += '<option value="' + LIST_OF_PARAMETERS[i][0] + '">' + LIST_OF_PARAMETERS[i][0] + '</option>'
//		}
//        html += [
//			'</select></td></tr>',
//			'<tr id="' + name + '_param">',
//            '<td><label for="' + name + '_length" style="font-size: 14px;font-weight: normal;">Parameter 1</label></td>
//                <td><input type="number" name="stack_param1" id="stack_param1" class="form-control"></td>
//              </tr>
//              <tr id="stack_param_tr2">
//                <td><label for="stack_length" style="font-size: 14px;font-weight: normal;">Parameter 2</label></td>
//                <td><input type="number" name="stack_param2" id="stack_param2" class="form-control"></td>
//              </tr>
//              <tr>
//                <td><label for="stack_length" style="font-size: 14px;font-weight: normal;">Max Queue Length<br>(-1 for infinite stack)</label></td>
//                <td><input type="number" name="stack_length" value="-1" id="stack_stack_length" class="form-control"></td>
//              </tr>
//              <tr>
//                <td><label for="num_stacks" style="font-size: 14px;font-weight: normal;">Number of Servers<br></label></td>
//                <td><input type="number" name="num_stacks" value="1" id="num_stacks" class="form-control"></td>
//              </tr>
//            </table>
//            <br/>
//            <div id="stack_form_disconnect" type="button" class="settings_form_disconnect btn btn-default btn-xs">
//              <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span> Detach
//            </div>
//            <div id="stack_form_save" type="button" class="settings_form_save btn btn-success btn-xs">
//              <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Apply
//            </div>
//            <div id="stack_form_delete" type="button" class="settings_form_delete btn btn-danger btn-xs">
//              <span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span> Delete
//            </div>
//          </div>
// */
//	},
//	createFuForm: function(model){
//
//	},
//	/* source onchange event */
//	dropUpdate: function(id){
//		/* update dropdown */
//		console.log(id);
//		var dp = $("#" + id + "_dropdown");
//		var dist = dp.val();
//		var p1 = $("#" + id + "_param1");
//		var p2 = $("#" + id + "_param2");
//		switch(LIST_OF_DISTRIBUTIONS[dist]){
//			case 2:
//				p1.show();
//				p2.show();
//				break
//			case 1:
//				p1.show();
//				p2.hide();
//				break
//			case 0:
//				p1.hide();
//				p2.hide();
//				break
//				
//		}
//	},
//	sourceLine: function(message, name, i){
//		var id = name + "_" + i;
//		var html = [
//			'<div class="form-group"><label for="' + id + '_distribution" style="font-size:',
//			'14px;font-weight: normal;">' + message + '</label><br/>',
//			'<select name="' + id + '_dropdown" id="' + id + '_dropdown" onChange=\'formman.sourceUpdate(\"' + id + '"\);\'',
//				'class="form-control text ui-widget-content ui-corner-all">',
//				'<option value="constant">Constant</option>',
//				'<option value="gaussian">Gaussian</option>',
//				'<option value="exponential">Exponential</option>',
//				'<option value="pareto">Pareto</option>',
//				'<option value="random">Random</option>',
//			    '<option value="gamma">Gamma</option>',
//				'<option value="weibull">Weibull</option>',
//				'<option value="uniform">Uniform</option>',
//            '</select>',
//            '<div id="' + id + '_param1">',
//				'<label for="' + id + '_param1" style="font-size: 14px;font-weight: normal;">Parameter 1</label>',
//				'<input type="text" name="' + id + '_form_param1" id="' + id + '_form_param1" value="" class="form-control"><div>',
//			'<div id="' + id + '_param2" style="display: none">',
//				'<label for="' + id + '_param2" style="font-size: 14px;font-weight: normal;">Parameter 2</label>',
//				'<input type="text" name="' + id + '_form_param2" id="source_form_param2" value="" class="form-control"></div>',
//			'</div>'
//		].join("");
//		return html;
//	},
//	createSourceForm: function(model){
//		/* distribution */
//		var name = model.view.name;
//		var html = this.sourceLine("UDO Spawn Distribution", name, 0);
//		if(USE_UDO){
//			for(var i = 0; i < LIST_OF_PARAMETERS.length; i++)
//				html += this.sourceLine("Parameter for " + LIST_OF_PARAMETERS[i][0], name, i+1);
//		}
//		return html;
//	},
//	createForm: function(model){
//		var name = model.view.name;
//		if(this.stub == null)
//			this.stub = $("#formman_goodness");
//		var html = null;
//		switch(model.view.type){
//			case "thermometer":
//			case "reverser":
//			case "cloner":
//			case "sink":
//				html = this.createHeader(
//					name, model.view.x, 
//					model.view.y) + 
//					this.createEasyForm(model) + 
//					this.createFooter(name, model.view.type != "sink");
//				break;
//			case "queue":
//			case "stack":
//				this.createFacForm(model);
//				break;
//			case "func":
//			case "funcsplitter":
//				/* Arthur */
//				this.createFuForm(model);
//				break;
//			case "source":
//				html = this.createHeader(
//					name, model.view.x, model.view.y) +
//					this.createSourceForm(model) + 
//					this.createFooter(name, true);
//				break
//		}
//		var id = "#" + name + "_form";
//		this.stub.append(html);
//		console.log(id);
//		$(id).draggable();
//	},
//	saveForm: function(model){
//		var html = null;
//		switch(model.view.type){
//			case "thermometer":
//			case "reverser":
//			case "cloner":
//			case "sink":
//				/* Nicolas */
//				html = $("#" + model.view.name + "_form");
//				model.view.name = html.find("#" + model.view.name + "_name").val();
//				break;
//			case "queue":
//			case "stack":
//				/* Nicolas */
//				break;
//			case "funcsplitter":
//			case "func":
//				break
//			case "source":
//				/* Mehran */
//				break
//		}
//	}
};
