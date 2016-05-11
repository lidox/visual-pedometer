function MyDay() {
	this.recordList = new Array();
    this.criticalRecordList = new Array();
    this.stepCount = 0;
    this.criticalStepCount = 0;
    this.criticalIntensityValue = 200;
}

MyDay.prototype.addRecord = function(record) {
    this.recordList.push(record);
};

MyDay.prototype.getStepsCount = function() {
    if (this.stepCount !== 0) {
        this.stepCount = 0;
    }
    for(var i= 0, l = this.recordList.length; i< l; i++){
        var item = this.recordList[i];
        if(isNumber(item[1])){
            this.stepCount += parseInt(item[1]); 
        }
    }
    
    function isNumber(obj) { 
        return !isNaN(parseFloat(obj)); 
    }
    
    return this.stepCount;
};

MyDay.prototype.getStepsCountWithoutCritical = function() {
    var getStepsCount = parseInt(this.getStepsCount() );
    var getCriticalStepCount = parseInt(this.getCriticalStepCount() );
    var stepsCountWithoutCritical = getStepsCount - getCriticalStepCount;
    return stepsCountWithoutCritical;
};

MyDay.prototype.getCriticalStepCount = function() {
    if (this.criticalStepCount !== 0) {
        this.criticalStepCount = 0;
    }
    this.getCriticalRecordList();
    for(var i= 0, l = this.criticalRecordList.length; i< l; i++){
        var item = this.criticalRecordList[i];
        if(isNumber(item[1])){
            this.criticalStepCount += parseInt(item[1]); 
        }
    }
    
    function isNumber(obj) { 
        return !isNaN(parseFloat(obj)); 
    }
    
    return this.criticalStepCount;
    
};

MyDay.prototype.getCriticalRecordList = function() {
    this.criticalRecordList = new Array();
    for(var i= 0, l = this.recordList.length; i< l; i++){
        var item = this.recordList[i];
        var preciseIntensity = item[4];
        if(isNumber(preciseIntensity)){
            preciseIntensity = parseInt(preciseIntensity);
            if(preciseIntensity >= this.criticalIntensityValue ) {
                this.criticalRecordList.push(item);
            }
        }
    }
    
    function isNumber(obj) { 
        return !isNaN(parseFloat(obj)); 
    }
    
    return this.criticalRecordList;
};

MyDay.prototype.getDate = function() {
    var firstRecord = this.recordList[0];
    return firstRecord[0].substring(0, 9);
};


    /*
    console.log('array[' + index + '] = ' + element);
    console.log('Urzeit: ' + element[0]);
    console.log('Schritte: ' + element[1]);
    console.log('Aktivitätstyp: ' + element[2]);
    console.log('Intensität: ' + element[3]);
    console.log('Präzise Intensität: ' + element[4]);
    */