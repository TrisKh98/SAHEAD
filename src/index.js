const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const multer = require('multer');
const cors = require('cors');
const upload = require('./config/multer');
const { engine } = require('express-handlebars');
const moment = require('moment-timezone');
const session = require('express-session');
const app = express();

const { env } = require('./config/environment');
const { corsOptions } = require('./config/cors');

const SortMiddleware = require('./middlewares/sort');

const route = require('./routes');
const db = require('./config/db');
//Connect DB

db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/docs', express.static(path.join(__dirname, 'public/docs')));


app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(express.json({ limit: '100mb' }));

app.use(methodOverride('_method'));

app.use(morgan('combined'));

app.use(SortMiddleware)

app.use(session({
  secret: 'your_secret_key', // Thay bằng chuỗi bí mật bất kỳ
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Để `true` nếu chạy HTTPS
}));

//Xử lý Cors
app.use(cors());

//Template Engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    helpers: require('./helpers/handlebars'),
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//route init
route(app);

app.listen(env.APP_PORT, () => {
  console.log(`app listening on port ${env.APP_PORT}`);
});
