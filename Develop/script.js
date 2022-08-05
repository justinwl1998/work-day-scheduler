console.log("Hello mo, goodbye mo.");

var curDate = moment().format("dddd, MMMM Do");
var curHour = moment().format("HH");
var timeBlocks = $(".timeBlock");
var eventTexts = $("textarea");
var schedule = [curDate, "", "", "", "", "", "", "", "", ""];

var dateUpdater = setInterval(function() {

    // update the date if the time ever passes
    if (moment().format("dddd, MMMM Do") !== curDate) {
        console.log("The date has changed!")
        curDate = moment().format("dddd, MMMM Do")
        $("#currentDay").text(curDate);

        // also reset the timeblocks
        updateTimeblockStatus();

        // clear all events in textareas
        for (var i = 0; timeBlocks.length; i++) {
            eventTexts.eq(i).val("");
        }

        //$("textarea").eq(i).parent().parent() <-- this is dumb, why

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
        console.log("No local storage defined!")
        localStorage.setItem('dateStorage', JSON.stringify(schedule));
    }
    else {
        console.log("Local storage is defined");

        // if it's defined, just retrieve the stored events in localStorage
        schedule = JSON.parse(localStorage.getItem('dateStorage'));
        // and then put them in each textarea

        for (var i = 1; i < schedule.length; i++) {
            console.log("Replacing schedule events...");
            console.log(eventTexts.eq(i-1));
            console.log("schedule index " + i + ": " +schedule[i]);
            eventTexts.eq(i-1).val(schedule[i]);
        }
    }

    $("#currentDay").text(curDate);

    //load the correct timeblock states

    updateTimeblockStatus();
}

$(".saveBtn").on("click", function() {
    console.log($(this))
    console.log($(this).parent().attr('class').split(/\s+/));
    console.log("The button clicked is for hour: " + $(this).parent().attr('class').split(/\s+/)[0])
    console.log("Index: " + $(this).parent().index());
    console.log
    var index = $(this).parent().index();
    var eventText = $("textarea").eq(index).val();

    schedule[index+1] = eventText;

    localStorage.setItem('dateStorage', JSON.stringify(schedule));

});

init();