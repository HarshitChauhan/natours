const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
const port = 8000;

// 3rd party Middleware
app.use(morgan('dev')); //Morgan is a logger
app.use(express.json());

// custom Middleware
app.use((req, res, next)=>{
    req.requestTime= new Date().toISOString();
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Get All Tours
const getAllTours = (req, res) => {
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

// Get all Users
const getAllUsers = (req,res) => {
    res.status(500).send({
        status: 'error',
        message: 'This route is not implemented yet!'
    })
}

// Create a new User
const createNewUser = (req,res) => {
    res.status(500).send({
        status: 'error',
        message: 'This route is not implemented yet!'
    })
}

// Get User by ID
const getUserById = (req,res) => {
    res.status(500).send({
        status: 'error',
        message: 'This route is not implemented yet!'
    })
}

// Update User
const updateUser = (req,res) => {
    res.status(500).send({
        status: 'error',
        message: 'This route is not implemented yet!'
    })
}

// Delete User
const deleteUser = (req,res) => {
    res.status(500).send({
        status: 'error',
        message: 'This route is not implemented yet!'
    })
}

{/*-----Creating and Mounting Routers-----*/}
const tourRouter = express.Router(); // creating Router
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter); // Mounting Router
app.use('/api/v1/users', userRouter);


tourRouter.route('/')
    .get(getAllTours)
    .post(createNewTour);

    tourRouter.route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);

userRouter.route('/')
    .get(getAllUsers)
    .post(createNewUser);

userRouter.route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser);

app.listen(port,()=>{
    console.log(`App server running on port ${port}!`);
});