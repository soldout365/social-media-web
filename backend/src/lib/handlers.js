export const wrapRequestHandler = (func) => {
  return async (req, res, next) => {
    // xủ lý bất đồng bộ trong express
    try {
      await func(req, res, next); // gọi hàm xử lý request
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  };
};
