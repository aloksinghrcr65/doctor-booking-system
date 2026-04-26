export const errorHandler = (err, req, res, next) => {
  console.error(err); // i am using this for debugging purpose

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};