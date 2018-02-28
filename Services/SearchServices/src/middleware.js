var joi = require('express-joi').Joi; // expand of JOI to create schemas and custom types
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
  },

  errorHandler: async(err,req,res,next) => {
    if(err.error.isJoi) {
      // we had a joi error lets return custom 400 response
      res.status(400).json({
        type: err.type,
        message: err.error.toString()
      });
    } else {
      // pass on to another error handler
      next(err);
    }
  },

  // input validation
  search_validate: {
    q: joi.string().max(60).required(),
    offset: joi.number().integer().min(0).default(0)
  },

  suggest_validate: {
    q:joi.string().max(60)
  }

}
