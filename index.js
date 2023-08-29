import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { render } from 'ejs';

// creating app using express
const app = express();
const port = 3000;

// middleware to access the public folder to access static files
app.use(express.static('public'));

// middleware to get the submitted data from form at index.ejs in urlencoded(object) form
app.use(bodyParser.urlencoded({ extended: true }));

// display the frontend using ejs
app.get('/', (req, res) => res.render('index.ejs'));

// get and send the obtained data from api to index.ejs
app.post('/submit', async (req, res) => {
  try {
    // using API to get data
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${req.body.countryName}`
    );
    const [data] = response.data;
    console.log(data);
    // sending data to index.ejs
    res.render('index.ejs', {
      image: data.flags.png,
      name: data.name.common,
      population: parseFloat(data.population / 1000000).toFixed(2) + ' Mil',
      border: data.borders[0],
      continent: data.continents,
    });
    // since if user hit wrong country throw the error
    if (data === undefined) throw new Error();
  } catch (error) {
    console.log(error.message);
    // catching and sending the error
    res.render('index.ejs', { err: error.message });
  }
});

// run server at port 3000
app.listen(port, () => console.log(`Server running at ${port}`));
