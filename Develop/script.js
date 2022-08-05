var curDate = moment().format("dddd, MMMM Do");
var curHour = moment().format("HH");
var timeBlocks = $(".timeBlock");
var eventTexts = $("textarea");
// In the 0th index, the current date is there, to facillitate resetting the entire schedule if the day passes
var schedule = [curDate, "", "", "", "", "", "", "", "", ""];

var dateUpdater = setInterval(function() {

    // update the date if the time ever passes
    if (moment().format("dddd, MMMM Do") !== curDate) {
        curDate = moment().format("dddd, MMMM Do")
        $("#currentDay").text(curDate);

        // also reset the timeblocks
        updateTimeblockStatus();

        // clear all events in textareas
        for (var i = 0; timeBlocks.length; i++) {
            eventTexts.eq(i).val("");
        }

        // and clear the internal schedule array
        schedule = [curDate, "", "", "", "", "", "", "", "", ""];

        // ... and put it in localStorage
        localStorage.setItem('dateStorage', JSON.stringify(schedule));
        return;
    }

    // update the timeblocks if the hour changes
    if (moment().format("HH") != curHour) {
        updateTimeblockStatus();
        curHour = moment().format("HH");
    }

}, 1000);

function updateTimeblockStatus() {
    for (var i = 0; i < timeBlocks.length; i++) {
        // Set timeblock status based on it if is before, during or after an hour
        if (moment().isBefore(moment({ hour:9+i, minute: 0 }))) {
            timeBlocks.eq(i).children().eq(1).addClass("future");
        }
        else if (moment().hour() === 9+i) {
            timeBlocks.eq(i).children().eq(1).addClass("present");
        }
        else {
            timeBlocks.eq(i).children().eq(1).addClass("past");
        }
    }
}

function init() {
    // initialize local storage if it hasn't been already
    if (localStorage.getItem('dateStorage') === null) {
        localStorage.setItem('dateStorage', JSON.stringify(schedule));
    }
    else {
        // if it's defined, just retrieve the stored events in localStorage
        schedule = JSON.parse(localStorage.getItem('dateStorage'));
        // and then put them in each textarea

        for (var i = 1; i < schedule.length; i++) {
            console.log(eventTexts.eq(i-1));
            eventTexts.eq(i-1).val(schedule[i]);
        }
    }

    $("#currentDay").text(curDate);

    //load the correct timeblock states

    updateTimeblockStatus();
}

$(".saveBtn").on("click", function() {
    // get index the button belongs to and event text from textarea
    var index = $(this).parent().index();
    var eventText = eventTexts.eq(index).val();

    // Put the event in the schedule array, with the index offset by 1
    schedule[index+1] = eventText;


    // Update localStorage
    localStorage.setItem('dateStorage', JSON.stringify(schedule));

});

init();