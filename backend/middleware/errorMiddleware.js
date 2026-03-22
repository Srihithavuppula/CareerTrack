const errorMiddleware = (err, req, res, next) => {
    console.error("Global error:", err);
  
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
    res.status(statusCode).json({
      error: err.message || "Server Error",
    });
  };
  
  module.exports = errorMiddleware;