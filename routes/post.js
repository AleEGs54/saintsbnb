const router = require('express').Router();
const postController = require('../controllers/post');

router.get('/', postController.getAll);
router.get('/:id', postController.getById);
router.get('/location/:location', postController.getByLocation);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
