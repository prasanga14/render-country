import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.render('index.ejs'));

app.post('/submit', async (req, res) => {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${req.body.countryName}`
    );
    const [data] = response.data;
    res.render('index.ejs', {
      image: data.flags.png,
      name: data.name.common,
      population: parseFloat(data.population / 1000000).toFixed(2) + ' Mil',
      border: data.borders[0],
      continent: data.continents,
    });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => console.log(`Server running at ${port}`));
