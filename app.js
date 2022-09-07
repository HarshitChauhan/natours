const express = require('express');
const fs = require('fs');

const app = express();
const port = 8000;

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// Get All Tours
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})
// Get Tour by ID
app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1; // string to int conversion
    const tour = tours.find(t => t.id === id);

    // tour not found
    if(!tour){
        return (
            res.status(404).json({
                status: 'failed',
                message: `No tour found with id: ${id}`
            })
        );
    }

    // on success
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})
// Patch Tour details by ID
app.patch('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1; // string to int conversion
    const tour = tours.find(t => t.id === id);

    // tour not found
    if(id >= tours.length ){
        return (
            res.status(404).json({
                status: 'failed',
                message: `No tour found with id: ${id}`
            })
        );
    }

    // on success
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updating Tour...>'
        }
    })
})
// Delete Tour by ID
app.delete('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1; // string to int conversion
    const tour = tours.find(t => t.id === id);

    // tour not found
    if(id >= tours.length ){
        return (
            res.status(404).json({
                status: 'failed',
                message: `No tour found with id: ${id}`
            })
        );
    }

    // on success
    res.status(204).json({
        status: 'success',
        data: {
            tour: '<Deleting Tour...>'
        }
    })
})
// Create a new Tour
app.post('/api/v1/tours', (req, res) => {
    console.log((req.body));
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    });
})

app.listen(port,()=>{
    console.log(`App server running on port ${port}!`);
});