// var Hover = {
// 		start: function() {
// 			oo = this;
// 			for (var i = 0; i < images.length; i++) {
// 				var img = images[i];
// 				img.onmouseover = function() {
// 					oo.renderForm(this);
// 					$('#hover_form').show().position({
// 						of: this,
// 						at: "right+80 top-25%",
// 						my: "left top"
// 					});
// 				}
// 				img.onmouseout = function() {
// 					$('#hover_form_to_append table').empty();
// 					$('#hover_form').hide();
// 				}
// 			}
// 		},
// 		renderForm: function(obj) {
// 			// this.kill_form();
// 			// console.log("Test");
// 			for (var i = 0; i < QueueApp.models.length; i++) {
// 				mdl = QueueApp.models[i];
// 				mdl.stat.pop;
// 				mdl.stat.time;
// 				table =	$("#hover_form_to_append table");

// 				if (mdl.view.id == obj.id) {
// 					mystats = mdl.arthur;
// 					for (var z = 0; z < mystats.length; z += 1) {
// 						spann = mystats[z][0]
// 						numro = mystats[z][1]
// 						table.append('<tr style="font-size: 12px;"><td>'+spann+'</td><td>'+num+'</td></tr>');
// 					}
// 				}
// 			}
// 		}
// 	};

// 	Hover.start();