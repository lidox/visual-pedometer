var extractDays = function () {

    var input;
    var prevDateAsString = '';
    var myday = new MyDay();
    var dayList = [];
    var myBarChart;

    $(document).ready(function () {
        if (isAPIAvailable()) {
            $('#fileInput').bind('change', readCVSandDisplayContent);
        }
        makeTableResponsive();
    });

    function flotFileData(file, i) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            var csv = event.target.result;
            var find = ';';
            var re = new RegExp(find, 'g');
            csv = csv.replace(re, ',');
            input = $.csv.toArrays(csv);

            //displayTable();
            input.forEach(forEachRecord);
            console.log("finished to extract days! :)");
            displayChart();
            displayResonsiveTable(dayList);
        };
        reader.onerror = function () {
            console.log('Unable to read ' + file.fileName);
            alert('Unable to read ' + file.fileName);
        };
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
    function readCVSandDisplayContent(evt) {
        var files = evt.target.files;

        // todo: reset dataset
        dayList = [];
        //for (i in myBarChart.datasets[0].points)
        //    myBarChart.removeData();
        
        for (var i = 0, len = files.length; i < len; i++) {
            flotFileData(files[i], i);
        }
    }

    function displayChart() {
        //Morris charts snippet - js

            var labelsDay = [];
            var stepCounts = [];
            var stepsCountWithoutCritical = [];

            for (var i = 0, l = dayList.length; i < l; i++) {
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
        
            if(myBarChart != null) {
                myBarChart.destroy();
            } // i initialize myBarChart var with null
   
            //myBarChart = new Chart(ctxmini).Bar(data, options);

            var ctx = document.getElementById("myChart");
            myBarChart = new Chart(ctx, {
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


    }

    function displayTable() {
        //var input = $('#input2').val();
        //var data = $.csv.toArrays(input);
        var html = generateTable(input);
        $('#result').empty();
        $('#result').html(html);
    }

    function forEachRecord(element, index, array) {
        if (index > 0) {
            if (index == 1) {
                prevDateAsString = element[0];
                // create object
                myday.addRecord(element);
            } else if (index == array.length - 1) {
                myday.addRecord(element);
                dayList.push(myday);
            } else {
                var currentDateAsString = element[0];
                if (prevDateAsString.substring(0, 10) === currentDateAsString.substring(0, 10)) {
                    //console.log('same day =' + currentDateAsString );
                    // add to myday
                    myday.addRecord(element);
                } else {
                    prevDateAsString = element[0];
                    // create new myday objet and add to mydayobjectlist
                    dayList.push(myday);
                    myday = new MyDay();
                    myday.addRecord(element);

                }
            }
        }
    }


    // build HTML table data from an array (one or two dimensional)
    function generateTable(data) {
        var html = '';

        if (typeof (data[0]) === 'undefined') {
            return null;
        }

        if (data[0].constructor === Array) {
            for (var row in data) {
                html += '<tr>\r\n';
                for (var item in data[row]) {
                    html += '<td>' + data[row][item] + '</td>\r\n';
                }
                html += '</tr>\r\n';
            }
        }
        return html;
    }

    // build HTML table data from an array (one or two dimensional)
    function generateDivTable(data) {
        var html = '';
        var date = 'Date';
        var stepCount = 'Steps';
        var noCriticalSteps = 'True Step count';

        if (typeof (data[0]) === 'undefined') {
            return null;
        }


        html += '<div class="divtable accordion-xs">\r\n';
        html += '<div class="tr headings">\r\n';
        html += '<div class="th firstname">' + date + '</div>\r\n';
        html += '<div class="th lastname">' + stepCount + '</div>\r\n';
        html += '<div class="th username">' + noCriticalSteps + '</div>\r\n';
        html += '</div>\r\n';

        for (var row in data) {
            var day = data[row];

            html += '<div class="tr">\r\n';
            html += '<div class="td firstname accordion-xs-toggle">' + day.getDate() + '</div>\r\n';
            html += '<div class="accordion-xs-collapse" aria-expanded="false">\r\n';
            html += '<div class="inner">\r\n';
            html += '<div class="td lastname">' + day.getStepsCount() + '</div>\r\n';
            html += '<div class="td username">' + day.getStepsCountWithoutCritical() + '</div>\r\n';
            html += '</div>\r\n';
            html += '</div>\r\n';
            html += '</div>\r\n';
        }

        html += '</div>\r\n';
        html += '</div>';
        return html;
    }

    function displayResonsiveTable(data) {
        //var input = $('#input2').val();
        //var data = $.csv.toArrays(input);
        var html = generateDivTable(data);
        console.log();
        $('#resultTable').empty();
        $('#resultTable').html(html);
    }

    function makeTableResponsive() {
        $(function () {
            var isXS = false,
                $accordionXSCollapse = $('.accordion-xs-collapse');

            // Window resize event (debounced)
            var timer;
            $(window).resize(function () {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    isXS = Modernizr.mq('only screen and (max-width: 767px)');

                    // Add/remove collapse class as needed
                    if (isXS) {
                        $accordionXSCollapse.addClass('collapse');
                    } else {
                        $accordionXSCollapse.removeClass('collapse');
                    }
                }, 100);
            }).trigger('resize'); //trigger window resize on pageload    

            // Initialise the Bootstrap Collapse
            $accordionXSCollapse.each(function () {
                $(this).collapse({
                    toggle: false
                });
            });

            // <a href="http://www.jqueryscript.net/accordion/">Accordion</a> toggle click event (live)
            $(document).on('click', '.accordion-xs-toggle', function (e) {
                e.preventDefault();

                var $thisToggle = $(this),
                    $targetRow = $thisToggle.parent('.tr'),
                    $targetCollapse = $targetRow.find('.accordion-xs-collapse');

                if (isXS && $targetCollapse.length) {
                    var $siblingRow = $targetRow.siblings('.tr'),
                        $siblingToggle = $siblingRow.find('.accordion-xs-toggle'),
                        $siblingCollapse = $siblingRow.find('.accordion-xs-collapse');

                    $targetCollapse.collapse('toggle'); //toggle this collapse
                    $siblingCollapse.collapse('hide'); //close siblings

                    $thisToggle.toggleClass('collapsed'); //class used for icon marker
                    $siblingToggle.removeClass('collapsed'); //remove sibling marker class
                }
            });
        });
    }

}