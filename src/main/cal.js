// import "@jxa/global-type";
const { run } = require('@jxa/run');

exports.calendar = () => {
  return run(() => {
    try {
      var calendarApp = Application('Calendar');
      var startDate = new Date();
      var endDate = new Date();
      endDate.setDate(startDate.getDate() + 2);

      const allCalendarItems = {};

      for (let i in [...Array(calendarApp.calendars.length).keys()]) {
        var currentCalendar = calendarApp.calendars[i];
        try {
          currentCalendar.get();
        } catch (e) {
          console.log('Could not find calendar ' + calendarName);
          return [];
        }
        var events = currentCalendar.events.whose({
          _and: [
            { startDate: { _greaterThan: startDate } },
            { endDate: { _lessThan: endDate } },
          ],
        });
        var convertedEvents = events();
        var summary = [];
        for (var cal of convertedEvents) {
          summary.push(cal.summary());
        }
        allCalendarItems[calendarApp.calendars[i].name()] = summary;
      }
      return allCalendarItems;
    } catch (e) {
      console.log('Calendar', e);
      return [];
    }
  });
};
