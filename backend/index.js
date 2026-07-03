const express = require('express') //importer librairie express comme si cetait include
const app = express() // creation app Express cest le server 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})