// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================
const fs = require('fs');
const path = require('path');
const util = require('util');

// ===============================================================================
// ROUTING
// ===============================================================================
const userArray = [];
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------
  // Exporting get/post/delete
  module.exports = function(app) {
    app.get('/api/notes', (req, res) => {
      fs.readFile('db/db.json', (err, data) => {
        if (err) throw err;
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

    app.post('/api/notes', function(req, res) {
      fs.readFile(path.join(__dirname, '../db/db.json'), (err, data) => {
        if (err) throw err;
        const newNote = req.body;
        // let id = Math.floor(Math.random() * 1000);
        const notesArr = JSON.parse(data);
        const id = notesArr[notesArr.length - 1].id + 1;
        newNote.id = id;
        notesArr.push(newNote);
        // req.body + `{"id":"${id}"}`);
        const notesString = JSON.stringify(notesArr);
        console.log(typeof notesString);
        fs.writeFileSync(path.join(__dirname, '../db/db.json'), notesString);
      });
    });

    // API DELETE Requests
    // API route that allows user to delete a note and updates json data
    app.delete('/api/notes/:id', function(req, res) {
      const selectedNoteId = req.params.id;
      // Read and remove new note to json data
      readFileAsync('./db/db.json', 'utf8').then(function(data) {
        // Object into string, splice selected Note by id to remove from array and reset index.
        data = JSON.parse(data);
        data.splice(selectedNoteId, 1);
        for (let i = 0; i < data.length; i++) {
          data[i].id = i;
        }
        // Update the json data with removed notes
        writeFileAsync('./db/db.json', JSON.stringify(data));
        res.json(data);
        console.log('Note succesfully removed!');
      });
    });
  };
};
