const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  const ryan = {name:"Ryan",color:"white",blah:"blah"};
  res.json(ryan);
});

router.get('/reverse/:name', (req,res)=> {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
