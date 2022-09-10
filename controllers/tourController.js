const fs = require('fs'); 

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.validateId = (req, res, next, val) => {
    const id = req.params.id * 1; // string to int conversion
    if(id >= tours.length ){
        return (
            res.status(404).json({
                status: 'failed',
                message: `No tour found with id: ${val}`
            })
        );
    }
    next();
}

// Check for valid request body
exports.validateReqBody = (req, res, next) => {
    console.log(req.body.name);
    if(!req.body.name || !req.body.price){
        return (
            res.status(400).json({
                status: 'failed',
                message: 'Missing {name} or {price} in the request body!'
            })
        );
    }
    next();
}

// Get All Tours
exports.getAllTours = (req, res) => {
res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
        tours
    }
})
};

// Get Tour by ID
exports.getTourById = (req, res) => {
const id = req.params.id * 1; // string to int conversion
const tour = tours.find(t => t.id === id);
    // on success
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
};

// Update Tour details by ID
exports.updateTour = (req, res) => {
    // on success
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updating Tour...>'
        }
    })
};

// Delete Tour by ID
exports.deleteTour = (req, res) => {
const id = req.params.id * 1; // string to int conversion
const tour = tours.find(t => t.id === id);
// on success
res.status(204).json({
    status: 'success',
    data: {
        tour: '<Deleting Tour...>'
    }
})
};

// Create a new Tour
exports.createNewTour = (req, res) => {
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
