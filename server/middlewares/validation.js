// Example validation middleware for Express
// Usage: Add to routes where you want to validate req.body, req.query, or req.params

export function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        success: false
      });
    }
    next();
  };
}
