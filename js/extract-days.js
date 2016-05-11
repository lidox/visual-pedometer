
var input;
var prevDateAsString = '';
var myday = new MyDay();
var dayList = [];

$(document).ready(function() {
    /*
    $.ajax({
        url: "data/file3.csv",
        async: false,
        success: function (csvd) {
            var find = ';';
            var re = new RegExp(find, 'g');
            csvd = csvd.replace(re, ',');
            input = $.csv.toArrays(csvd);
        },
        dataType: "text",
        complete: function () {
            displayTable();
            input.forEach(forEachRecord); 
            console.log("finished to extract days! :)");
            dayList;
        }
    });
    */

      if(isAPIAvailable()) {
        $('#fileInput').bind('change', handleFileSelect);
      }
});

// displays a warning if the browser doesn't support the HTML5 File API
function isAPIAvailable() {
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    return true;
  } else {
    alert("The browser you're using does not currently support\nthe HTML5 File API. As a result the file loading demo\nwon't work properly.");
    return false;
  }
}

// handles csv files
function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // todo: reset dataset
  dayList = [];
    
  for(var i=0, len=files.length; i<len; i++) {
    flotFileData(files[i], i);
  }
}

function flotFileData(file, i) {
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(event){
    var csv = event.target.result;
    var find = ';';
    var re = new RegExp(find, 'g');
    csv = csv.replace(re, ',');
    input = $.csv.toArrays(csv);
      
    displayTable();
    input.forEach(forEachRecord); 
    console.log("finished to extract days! :)");
    dayList;
    displayChart();  
  };
  reader.onerror = function(){ 
      console.log('Unable to read ' + file.fileName);
      alert('Unable to read ' + file.fileName); 
  };
}

function displayChart() {
    //Morris charts snippet - js
    $(document).ready(function() {
        var labelsDay = [];
        var stepCounts = [];
        var stepsCountWithoutCritical = [];

        for(var i= 0, l = dayList.length; i< l; i++){
            var item = dayList[i];
            var date = item.getDate();
            labelsDay.push(date);
            stepCounts.push(dayList[i].getStepsCount());
            stepsCountWithoutCritical.push(dayList[i].getStepsCountWithoutCritical());
        }

        var data = {
            labels: labelsDay,
            datasets: [
                {
                    label: "normal step count",
                    backgroundColor: "rgb(250, 216, 22)",
                    borderColor: "rgb(255, 67, 46)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgb(250, 216, 22)",
                    hoverBorderColor: "rgb(255, 67, 46)",
                    data: stepCounts,
                },
                {
                    label: "step count without critical",
                    backgroundColor: "rgb(6, 209, 6)",
                    borderColor: "rgb(255, 67, 46)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgb(6, 209, 6)",
                    hoverBorderColor: "rgb(255, 67, 46)",
                    data: stepsCountWithoutCritical,
                }
            ],
        };

        var ctx = document.getElementById("myChart");
        var myBarChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                scales: {
                        xAxes: [{
                                stacked: false
                        }],
                        yAxes: [{
                                stacked: false
                        }]
                    }
                }
            });

    });
}

function displayTable() {
  //var input = $('#input2').val();
  //var data = $.csv.toArrays(input);
  var html = generateTable(input);
  $('#result').empty();
  $('#result').html(html);
}

function forEachRecord(element, index, array) {
    if(index > 0) {
        if(index == 1) {
            prevDateAsString = element[0];
            // create object
            myday.addRecord(element);
        }
        else if(index == array.length-1 ) {
            myday.addRecord(element);
            dayList.push(myday);
        }
        else {
            var currentDateAsString = element[0];
            if(prevDateAsString.substring(0, 10) === currentDateAsString.substring(0, 10) ){
                //console.log('same day =' + currentDateAsString );
                // add to myday
                myday.addRecord(element);
            }
            else {
                prevDateAsString = element[0];
                // create new myday objet and add to mydayobjectlist
                dayList.push(myday);
                myday = new MyDay();
                myday.addRecord(element);

            }        
        }
     }  
}

/*
function example1() {
  var input = $('#input1').val();
  var data = $.csv.toArray(input);
  var html = generateTable(data);
  $('#result1').empty();
  $('#result1').html(html);
}

function example3() {
  var input = $('#input3').val();
  var data = $.csv.toObjects(input);
  var html = generateTable(data);
  $('#result3').empty();
  $('#result3').html(html);
}
*/

// build HTML table data from an array (one or two dimensional)
function generateTable(data) {
  var html = '';

  if(typeof(data[0]) === 'undefined') {
    return null;
  }

  if(data[0].constructor === String) {
    html += '<tr>\r\n';
    for(var item in data) {
      html += '<td>' + data[item] + '</td>\r\n';
    }
    html += '</tr>\r\n';
  }

  if(data[0].constructor === Array) {
    for(var row in data) {
      html += '<tr>\r\n';
      for(var item in data[row]) {
        html += '<td>' + data[row][item] + '</td>\r\n';
      }
      html += '</tr>\r\n';
    }
  }

  if(data[0].constructor === Object) {
    for(var row in data) {
      html += '<tr>\r\n';
      for(var item in data[row]) {
        html += '<td>' + item + ':' + data[row][item] + '</td>\r\n';
      }
      html += '</tr>\r\n';
    }
  }

  return html;
}
