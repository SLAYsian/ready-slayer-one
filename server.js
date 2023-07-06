const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sharp = require('sharp');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Middleware for background image processing
app.use((req, res, next) => {
  sharp('public/img/bg-3dmap1.png')
    .resize(1920, 1080)
    .toFile('public/img/resized-background.jpg', (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Background image resized successfully!');
      }
      next();
    });
});

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 600000,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening on http://localhost:3001'));
});