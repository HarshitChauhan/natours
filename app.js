const express = require('express');

const app = express();
const port = 8000;

app.get('/', (req, res) => {
    res.status(200).send('Helloooo! from Express Server 👋🏻');
})

app.post('/', (req, res) => {
    res.status(405).send('POST method not allowed on this endpoint 🚫');
})

app.listen(port,()=>{
    console.log(`App server running on port ${port}!`);
});