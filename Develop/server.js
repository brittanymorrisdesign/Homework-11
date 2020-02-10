const express = require('express');
const fs = require('fs');
const path = require('path');

// Sets up Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
