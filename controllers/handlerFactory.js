const AppErrorHandler = require('../utils/appErrorHandler');
const catchAsync = require('../utils/catchAsync');
const QueryFeatures = require('../utils/queryFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new AppErrorHandler(`No document found with ID {${req.params.id}}`, 404)
      );
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppErrorHandler(`No document found with ID {${req.params.id}}`, 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

  exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    
    let query = Model.findById(req.params.id);
    if(populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(
        new AppErrorHandler(`No document found with ID {${req.params.id}}`, 404)
      );
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

  exports.getAll = Model => catchAsync(async (req, res) => {

    // for nested GET Review 
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new QueryFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  
    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });