// renames entities
function rename(entity, labelID) {
    var label = document.getElementById(labelID).value;  
   if (label !== "") {

      for (var i = 0; i < QueueApp.models.length;i++){
        if (QueueApp.models[i] != entity &&  QueueApp.models[i].view.username == label){

            bootbox.alert({size: 'small', 
                    message: "<strong><font size='3'>Name already in use. Please enter a unique name</font></strong>", 
                    function(){}});
            return;
        }
      }

      entity.view["username"] = label; 
      // entity.view.image.node.parentNode.nextSibling.children[0].innerHTML = label;
	  
      entity.view.text.attr({ text: label});
      entity.view.text.node.children[0].setAttribute("style", "font-size: 14px; font-weight: normal; fill: #c2c2c2");
    }
}

function displayName(entity, labelID) {
    // retrieve and display durrent name in popup
   document.getElementById(labelID).value = entity.view["username"];

}
