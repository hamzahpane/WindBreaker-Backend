const router = require('express').Router();
const tagControler = require('./controler');

router.get('/tags', tagControler.index);
router.post('/tags', tagControler.Create);
router.put('/tags/:id', tagControler.update);
router.delete('/tags/:id', tagControler.destroy);

module.exports = router;