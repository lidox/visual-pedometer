
var input;
var prevDateAsString = '';
var myday = new MyDay();
var dayList = [];

$(document).ready(function() {
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
});


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
