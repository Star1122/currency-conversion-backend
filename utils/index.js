const { ValidationError } = require('mongoose').Error;

function handleError(res, statusCode = 500) {
  return (err) => {
    if (err) {
      if (err.statusCode) {
        ({ statusCode } = err);
      } else if (err instanceof ValidationError) {
        statusCode = 422;
      }

      console.error(err);
      res.status(statusCode);
      res.send(err);
    }
  };
}

function responseWithResult(res, statusCode = 200) {
  return (entity) => {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

const reducer = field => (total, current) => total + current[field];

module.exports = {
  handleError,
  responseWithResult,
  reducer,
};
