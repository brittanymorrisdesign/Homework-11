// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================
const fs = require('fs');

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------
  // Routes - one to index, one to notes
  app.get('/api/notes', function(req, res) {
    fs.readFile('./db/db.json', (err, data) => {
      if (err) throw err;
      dbData = JSON.parse(data);
      res.send(dbData);
    });
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the array)
  // ---------------------------------------------------------------------------

  // API POST Requests

  app.post('/api/notes', function(req, res) {
    const userNotes = req.body;

    fs.readFile('./db/db.json', (err, data) => {
      if (err) throw err;
      dbData = JSON.parse(data);
      dbData.push(userNotes);
      let number = 1;
      dbData.forEach((note, index) => {
        note.id = number;
        number++;
        return dbData;
      });
      console.log(dbData);

      stringData = JSON.stringify(dbData);

      fs.writeFile('./db/db.json', stringData, (err, data) => {
        if (err) throw err;
      });
    });
    res.send('Thank you for your note!');
  });

  // API DELETE Requests
  // API route that allows user to delete a note and updates json data
  app.delete('/api/notes/:id', function(req, res) {
    // Gets id number of note to delete
    const deleteNote = req.params.id;
    console.log(deleteNote);

    fs.readFile('./db/db.json', (err, data) => {
      if (err) throw err;

      // Comparing each note's id to delete note
      dbData = JSON.parse(data);
      // for each function, comparing each note's id to the chosen_for_death variable
      for (let i = 0; i < dbData.length; i++) {
        if (dbData[i].id === Number(deleteNote)) {
          dbData.splice([i], 1);
        }
      }
      console.log(dbData);
      stringData = JSON.stringify(dbData);

      fs.writeFile('./db/db.json', stringData, (err, data) => {
        if (err) throw err;
      });
    });
    // Express response.status(204)
    res.status(204).send();
  });
};
