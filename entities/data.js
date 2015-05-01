function Data(copy){
	this.timer = 0;
	if(copy){
		this.timer = copy.timer
		this.fields = JSON.parse(JSON.stringify(copy.fields))
	}else{
		this.fields = {};
		for(i = 0; i < LIST_OF_PARAMETERS.length; i++){
			this.fields[LIST_OF_PARAMETERS[i][0]] = 0;
		}
	}
}