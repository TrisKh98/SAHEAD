const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const multer  = require('multer')
const cors = require("cors");
const upload = require('./config/multer');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config/db');
//Connect DB

db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(methodOverride('_method'))

app.use(morgan('combined'));

app.use(cors());

//Template Engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    helpers: {
      sum: (a,b)=> a+b,
  }
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources','views'));

//route init
route(app);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
