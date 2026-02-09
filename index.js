const express = require('express');
const course = require('./course')
const app = express();
const port = 3000;
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/course', course);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});