/* function called in all the enitities.  Value are as follows
	- QUEUE (server entitity) = server_utilization
	- SINK = stay duration
	- SOURCE, SPLITTER, SPLIT3 = 100 (generic value)
*/

function stat_animation_manager(){

    // check if animation can run
    if (invalidAnimation()) {
        // tell user simulation can be run
        bootbox.alert("<strong><font size='3'>A source needs to be connected to another entity</font></strong>", function() {
        }); 
        SIM_IS_RUNNING = false;
        return;
    }
	
    //taking thermometer out and treating it like a reverser in paths scenario
    var queueTotal = 0;
    var sourceTotal  =0;
    var sinkTotal = 0;
    var stackTotal = 0;

    for(var i = 0; i < QueueApp.models.length; i++){
        var currEnt = QueueApp.models[i];
            currEnt.view.color = undefined;

        switch(currEnt.view.type){

            case "queue":
                queueTotal += currEnt.stat.arrived;
                //console.log(currEnt.stat.arrived);
                break;

            case "source":
                sourceTotal += currEnt.stat.spawn;
                break;

            case "sink":
                sinkTotal += currEnt.stat.pop.count();
                break;

            case "stack":
                stackTotal += currEnt.stat.arrived;
                break;
            case "splitfunc":
                currEnt.view.colorUp = undefined;
                currEnt.view.colorDown = undefined;
                break;
        }
    }
   

    for(var j = 0; j < QueueApp.models.length; j++){
       var currEnt = QueueApp.models[j];

            var percent;

         switch(currEnt.view.type){

            case "queue":
                percent = currEnt.stat.arrived / queueTotal;
                break;
            case "source":
                percent = currEnt.stat.spawn / sourceTotal;
                break;
            case "sink":
                percent = currEnt.stat.pop.count() / sinkTotal; 
                break;
            case "stack":
                percent = currEnt.stat.arrived / stackTotal; 
                break;
        }
        if (isNaN(percent) || percent == 0){
            percent = 0;
            currEnt.view.color = "gray"
        }
         if (currEnt.view.type == "thermometer" || currEnt.view.type == "reverser" || 
                 currEnt.view.type == "splitfunc" || currEnt.view.type == "func" || currEnt.view.type =="cloner"){
            if (currEnt.view.type == "splitfunc"){

            var splitTotal = currEnt.stat.trafficup  + currEnt.stat.trafficdown;
            var splitBottom = currEnt.stat.trafficdown / splitTotal;
            var splitTop = currEnt.stat.trafficup / splitTotal;

            currEnt.view.colorUp = calculateColor(splitTop);
            currEnt.view.colorDown = calculateColor(splitBottom);
            } else {
                currEnt.view.color = undefined;
            }
        } else {
            setColorandSwapImage(currEnt, percent);
        }   
    }

    
}

function calculateColor(field){
    if(field < .20){
        return "green";
    }else if(field >= .20 && field < .40){
        return "blue";
    }else if(field >= .40 && field < .60){
        return "yellow";
    }else if(field >= .60 && field < .80){
       return "orange";
    }else if(field >= .80){
       return "red";
    }
}

function setColorandSwapImage(model, percent){

    var string;
    if(percent < .20){
        model.view.color = "green";
        string = "images/"+ model.view.type +"_green.png";

    }else if(percent >= .20 && percent < .40){
        model.view.color = "blue";
        string = "images/"+ model.view.type+".png";

    }else if(percent >= .40 && percent < .60){
        model.view.color = "yellow";
        string = "images/"+ model.view.type +"_yellow.png";

    }else if(percent >= .60 && percent < .80){
        model.view.color = "orange";
        string = "images/"+ model.view.type +"_orange.png";

    }else if(percent >= .80){
        model.view.color = "red";
        string = "images/"+ model.view.type +"_red.png";
    }
    
    animateEntity(model, string)
}

function animateEntity(model, string){

    var test = d3.select("#" + model.view.id);
    test.transition().duration(500).style("opacity", 0);
    
    model.view.image.animate({
            scale: "1.7 1.7"
        }, 250, function() {
            this.animate({
                scale: "1 1"
            }, 250)
        });
     animateTwo();


    function animateTwo(){    
        test.transition().delay(500).attr("href", string);
        test.transition().delay(600).duration(800).style("opacity", 1).each("end", function() {
            if (model === QueueApp.models[QueueApp.models.length-1]) {
                console.log("icons animation ended");
                
            }
        });
    }
    runPathFlowAnimation();
}

function invalidAnimation() {
    var invalidSimulation = false;
    for (var i = 0; i < QueueApp.models.length; i++) {
        currMod = QueueApp.models[i];
        
        switch(currMod.view.type) {
            case "source":
                if (currMod.dest == null)
                    invalidSimulation = true;
                break;
            case "queue":
                break;
            case "func":
                break;
            case "sink":
                break;
            case "splitfunc":
                break;
            case "thermometer":
                break;
            case "reverser":
                break;
            case "cloner":
                break;
            case "stack":
                break;  
        }
    }

    return invalidSimulation;
}