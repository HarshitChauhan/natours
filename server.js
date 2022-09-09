const app = require('./app');
const port = 8000;

app.listen(port,()=>{
    console.log(`App server running on port ${port}!`);
});