function MyDay() {
	this.recordList = new Array();
}

MyDay.prototype.addRecord = function(record) {
    //Array.prototype.push.apply(this.recordList, [record]);
    this.recordList.push(record);
};

    /*
    console.log('array[' + index + '] = ' + element);
    console.log('Urzeit: ' + element[0]);
    console.log('Schritte: ' + element[1]);
    console.log('Aktivitätstyp: ' + element[2]);
    console.log('Intensität: ' + element[3]);
    console.log('Präzise Intensität: ' + element[4]);
    */