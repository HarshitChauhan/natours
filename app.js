const express = require('express');
const fs = require('fs');

const app = express();
const port = 8000;

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Get All Tours
const getAllTours = (req, res) => {
res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
        tours
    }
})
};

// Get Tour by ID
const getTourById = (req, res) => {
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
};

// Update Tour details by ID
const updateTour = (req, res) => {
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
};

// Delete Tour by ID
const deleteTour = (req, res) => {
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
};

// Create a new Tour
const createNewTour = (req, res) => {
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
};

/*
app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', createNewTour);
app.get('/api/v1/tours/:id', getTourById);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
*/

{/*-----Refactoring routes in better way-----*/}
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createNewTour);

app.route('/api/v1/tours/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);
    
app.listen(port,()=>{
    console.log(`App server running on port ${port}!`);
});