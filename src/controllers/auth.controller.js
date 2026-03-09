const AuthService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
