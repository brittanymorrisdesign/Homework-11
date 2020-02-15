// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================
const fs = require('fs');
const path = require('path');
const util = require('util');
const userNotes = require('../db/db.json');

// ===============================================================================
// ROUTING
// ===============================================================================
const writeFileAsync = util.promisify(fs.writeFile);

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------
  // Exporting get/post/delete
  app.get('/api/notes', function(req, res) {
    fs.readFile(path.join(__dirname, '../db/db.json'), (err, data) => {
      if (err) throw err;
      console.log(JSON.parse(data));
      res.json(JSON.parse(data));
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

  app.post('/api/db', function(req, res) {
    const newNote = req.body;

    console.log(`Adding note: ${newNote.title}`);
    userNotes.push(newNote);

    writeFileAsync(
      path.join(__dirname, '../db/db.json'),
      JSON.stringify(userNotes)
    ).then(() => {});
    res.json(newNote);
  });

  // API DELETE Requests
  // API route that allows user to delete a note and updates json data
  app.delete('/api/db', function(req, res) {
    const { id } = req.body;
    console.log('Note has been removed!');

    userNotes.splice(id, 1);

    writeFileAsync(
      path.join(__dirname, '../db/db.json'),
      JSON.stringify(userNotes)
    ).then(() => {
      console.log('Note has been created!');
    });
    res.json(id);
  });
};
