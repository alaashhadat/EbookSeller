const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();
// handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', 'views');
//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set static folder
app.use(express.static(`${__dirname}/public`));
// index route
app.get('/', (req, res) => {
  res.render('index', {
    stripePublishableKey: keys.stripePublishableKey,
  });
});
app.get('/success', (req, res) => {
  res.render('success');
}),
  // charge route
  app.post('/charge', (req, res) => {
    const amount = 2500;
    stripe.customers
      .create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
      })
      .then(customer =>
        stripe.charges.create({
          amount,
          description: 'web development ebook',
          currency: 'eur',
          customer: customer.id,
        }),
      );
  });

app.get('*', (req, res) => {
  res.render('notFound');
});
// app.use(function(req, res, next) {
//   if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
//     return res.sendStatus(204);
//   }

//   return next();
// });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server started on ${port}`);
});
