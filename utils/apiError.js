const apiError = (msg) => {
  async (req, res) => {
    return res.status(400).send(msg);
  };
};

module.exports = apiError;
