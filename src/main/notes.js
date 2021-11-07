// import "@jxa/global-type";
const { run } = require('@jxa/run');

exports.notes = () => {
  return run(() => {
    try {
      var notesApp = Application('Notes');
      let lists = notesApp.folders().map((list) => ({
        name: list.name(),
        id: list.id(),
      }));

      // if (args.list) lists = lists.filter((f) => args.list.includes(f.name));

      const allNotesList = {};
      lists.forEach((l) => {
        const list = notesApp.folders.byId(l.id).notes;
        const props = args.props || ['name'];

        const propFns = props.reduce((obj, prop) => {
          obj[prop] = list[prop]();
          return obj;
        }, {});
        const finalList = [];

        for (let i = 0; i < propFns.name.length; i++) {
          const note = props.reduce((obj, prop) => {
            obj[prop] = propFns[prop][i];
            return obj;
          }, {});
          finalList.push(note);
        }
        allNotesList[l.name] = finalList;
      });
      return allNotesList;
    } catch (e) {
      console.log('Notes', e);
      return [];
    }
  });
};
