class QueryFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        const queryObj = {...this.queryString}; // creating shallow copy
        const excludedFields = ['page', 'sort', 'limit', 'fields']; // excluding not required params
        excludedFields.forEach( el => delete queryObj[el]) ;
        // creating comparison filterations [gte|gt|lte|lt]
        let queryStr = JSON.stringify (queryObj) ;
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr)) ;

        return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortByQuery = this.queryString.sort.split(',').join(' '); // can have one or more sprting params
            this.query = this.query.sort(sortByQuery); // [price, ratingsAverage] | [-price, -ratingsAverage] 
            // (plu-minus for asc-desc order)  
        } else {
            this.query = this.query.sort('-createdAt'); // default sort param
        }

        return this;
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' '); // include fields to show as results 
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v'); // removing mongodb '__v' field by default
        }

        return this;
    }

    paginate(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 20;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = QueryFeatures;