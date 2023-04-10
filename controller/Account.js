const register = (req, res) => {
  console.log("---Called /register---");
  res.send(" ---Register ---");
};

const login = (req, res) => {
  console.log("---Called /login---");
  res.send(" ---Login ---");
};

const getToken = (req, res) => {
  console.log("---Called /getToken---");
  res.send(' ---getToken ---');
};

const tmpFunction = (req, res) => {
    console.log("---Called /HHHHH---");
    res.send(" ---tmpFunction ---");
};

module.exports = {
  register: register,
  login: login,
  getToken: getToken,
  tmpFunction: tmpFunction
};
