// import "@jxa/global-type";
const { run } = require( "@jxa/run");

exports.calendar = () => {
    return run(() => {
        var calendarApp = Application("Calendar");
        var endDate = new Date();
        var startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 10);

        var calendarName = 'Calendar'
        // var currentCalendar = calendarApp.calendars.whose({ name: calendarName })[0];
        // try {
        //     currentCalendar.get();
        // } catch (e) {
        //     app.displayAlert('Could not find a calendar with name "' + calendarName + '".\n\nPlease make sure a calendar with that name existis in Calendar.app, or change the calendar name in the script.');
        //     return;
        // }

        // for(let i in [...Array(calendarApp.calendars.length).keys()]) {
        //     console.log(calendarApp.calendars[i].name())
        // }
        var events = calendarApp.calendars[0].events.whose({
            _and: [
                { startDate: { _greaterThan: startDate } },
                { endDate: { _lessThan: endDate } }
            ]
        });
        var convertedEvents = events();
        var summary = []
        for (var cal of convertedEvents) {
            // for (var ev of cal) {
                summary.push(cal.summary());
            // }
        }
        return summary
    });
}
