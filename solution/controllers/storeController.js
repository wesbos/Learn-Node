exports.homePage = (req, res) => {
  console.log(req.name);
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add store" });
};

exports.createStore = (req, res) => {
  // todo
  console.log(req.body);
  res.json(req.body);
};
