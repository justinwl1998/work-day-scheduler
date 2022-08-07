var curDate = moment().format("dddd, MMMM Do");
var curHour = moment().format("HH");
var timeBlocks = $(".timeBlock");
var eventTexts = $("textarea");

// In the 0th index, the current date is there, to facillitate resetting the entire schedule if the day passes
var schedule = [curDate, "", "", "", "", "", "", "", "", ""];

// timeInterval for updating the schedule
var dateUpdater = setInterval(function() {

    // update the date if the time ever passes while the page is open, this is pretty difficult to test but all for the sake of being forward thinking
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
    if (moment().format("HH") !== curHour) {
        console.log("Hour has changed!")
        updateTimeblockStatus();
        curHour = moment().format("HH");
        return;
    }

    updateTimeblockStatus();
}, 1000); // having this check every second is probably a bad idea, but this schedule has to update somehow

function updateTimeblockStatus() {
    for (var i = 0; i < timeBlocks.length; i++) {
        var curBlock = timeBlocks.eq(i).children().eq(1);
        
        // removes the past, present and future classes, this prevents multiple classes from being added
        curBlock.removeClass("past present future");

        // Set timeblock status based on it if is before, during or after an hour
        if (moment().hour() < 9+i) {
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

        // checks if the date has changed since then
        if (curDate !== schedule[0]) {
            schedule = [curDate, "", "", "", "", "", "", "", "", ""]
            localStorage.setItem('dateStorage', JSON.stringify(schedule));
        }

        // and then put them in each textarea

        for (var i = 1; i < schedule.length; i++) {
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

    $("#status").css("visibility", "visible");

    setTimeout(function() {
        $("#status").css("visibility", "hidden");
    }, 1000);

});

init();