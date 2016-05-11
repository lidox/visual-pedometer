
    $(function() {
      $("#tabs").tabs();
    });

    $(document).ready(function() {
      if(isAPIAvailable()) {
        $('#fileInput').bind('change', handleFileSelect);
      }

      flotTextData();

      $('#run').bind('click', flotTextData);
    });

    // Used to generate the data for the sine wave demo
    // source: http://coding.smashingmagazine.com/2011/10/04/quick-look-math-animations-javascript/
    function drawSine() {
      var counter = 0;
      // 100 iterations
      var increase = Math.PI * 2 / 100;
      for ( i = 0; i <= 1; i += 0.01 ) {
        x = i;
        y = Math.sin( counter ) / 2 + 0.5;
        counter += increase;
        console.log(x + ',' + y);
      }
    }

    // plots the data input into the textarea
    function flotTextData() {
      var options = {
        series: {
          lines: { show: true },
          points: { show: true }
        }
      }

      var data1 = [];
      data1[0] = $.csv.toArrays($('#textInput').val(), {
        onParseValue: $.csv.hooks.castToScalar
      });
      flot1 = $.plot($('#flot1'), data1, options);

      var data2 = [];
      flot2 = $.plot($('#flot2'), data2, options);
    }

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

      // reset the flot dataset
      flot2.setData([]);
      for(var i=0, len=files.length; i<len; i++) {
        flotFileData(files[i], i);
      }
    }

    function flotFileData(file, i) {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event){
        var csv = event.target.result;
        var data = flot2.getData();
        var newData = $.csv.toArrays(csv, {
          onParseValue:$.csv.hooks.castToScalar
        });
        // append to the existing dataset
        data[i] = newData;
        flot2.setData(data);
        flot2.setupGrid();
        flot2.draw();
      };
      reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
    }
  