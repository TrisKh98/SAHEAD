const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const multer = require('multer');
const cors = require('cors');
const upload = require('./config/multer');
const { engine } = require('express-handlebars');
const moment = require('moment-timezone');
const app = express();

const { env } = require('./config/environment');
const { corsOptions } = require('./config/cors');

const route = require('./routes');
const db = require('./config/db');
//Connect DB

db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(methodOverride('_method'));

app.use(morgan('combined'));

//Xử lý Cors
app.use(cors());

//Template Engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      getFileName: (path) => {
        return path ? path.split('/').pop() : '';
      },
      includes: (array, value) => {
        if (!Array.isArray(array) || !value) return false;
        return array.some(item => item?.toString() === value.toString());
      },
      formatDate: (date) => {
        return date ? moment(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : '';
    }
      
    },
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//route init
route(app);

app.listen(env.APP_PORT, () => {
  console.log(`app listening on port ${env.APP_PORT}`);
});
