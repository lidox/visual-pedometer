function MyDay() {
	this.recordList = new Array();
    this.stepCount = 0;
}

MyDay.prototype.addRecord = function(record) {
    //Array.prototype.push.apply(this.recordList, [record]);
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