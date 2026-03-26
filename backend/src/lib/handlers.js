export const wrapRequestHandler = (func) => {
  return async (req, res, next) => {

    try {
      await func(req, res, next); 
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  };
};
