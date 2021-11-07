// import "@jxa/global-type";
const { run } = require('@jxa/run');

exports.calendar = () => {
  return run(() => {
    try {
      var calendarApp = Application('Calendar');
      var endDate = new Date();
      var startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 10);

      var calendarName = 'Calendar';
      var currentCalendar = calendarApp.calendars.whose({ name: calendarName })[0];
      try {
          currentCalendar.get();
      } catch (e) {
          console.log('Could not find calendar ' + calendarName );
          return [];
      }

      // for(let i in [...Array(calendarApp.calendars.length).keys()]) {
      //     console.log(calendarApp.calendars[i].name())
      // }
      var events = currentCalendar.events.whose({
        _and: [
          { startDate: { _greaterThan: startDate } },
          { endDate: { _lessThan: endDate } },
        ],
      });
      var convertedEvents = events();
      var summary = [];
      for (var cal of convertedEvents) {
        // for (var ev of cal) {
        summary.push(cal.summary());
        // }
      }
      return summary;
    } catch (e) {
      console.log('calendar: ', e);
      return [];
    }
  });
};
