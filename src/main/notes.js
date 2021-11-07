// import "@jxa/global-type";
const { run } = require( "@jxa/run");

exports.notes = () => {
    return run(() => {
        var notesApp = Application("Notes");
        let lists = notesApp.folders().map(list => ({
          name: list.name(),
          id: list.id()
      }))
        const list = notesApp.folders.byId(lists[0].id).notes;
        //   const props = args.props || [ 'name', 'body', 'id', 'completed', 'completionDate', 'creationDate', 'dueDate', 'modificationDate', 'remindMeDate', 'priority' ];
        const props = ['name']
        // We could traverse all reminders and for each one get the all the props.
        // This is more inefficient than calling '.name()' on the very reminder list. It requires
        // less function calls.
        const propFns = props.reduce((obj, prop) => {
            obj[prop] = list[prop]();
            return obj;
        }, {});
        const finalList = [];

        // Flatten the object {name: string[], id: string[]} to an array of form
        // [{name: string, id: string}, ..., {name: string, id: string}] which represents the list
        // of reminders
        for (let i = 0; i < propFns.name.length; i++) {
            const reminder = props.reduce((obj, prop) => {
                obj[prop] = propFns[prop][i];
                return obj;
            }, {});
            finalList.push(reminder)
        }
        return finalList;
    });
}
