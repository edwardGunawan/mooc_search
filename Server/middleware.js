module.exports = {
  // loggging all executed file
  logger: async (req,res,next) => {
    const start = Date.now();
    await next();
    const ms = Date.now()-start; // get the amount of time running the routes
    console.log(`${req.method} ${req.originalUrl} - ${ms}`);
  },

  // logging errors
  logErrors: async(err,req,res,next) =>{
    console.log(err.stack);
    next(err);
  }

}
