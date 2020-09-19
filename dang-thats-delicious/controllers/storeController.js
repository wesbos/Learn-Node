exports.myMiddleware = (req, res, next) => {
    req.name = 'Wes';
    if (req.name === 'Wes') {
        throw Error('That is a stupid name');
    }
    next();
};

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
};