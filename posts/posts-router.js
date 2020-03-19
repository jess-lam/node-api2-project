const express = require('express');

const Posts = require('../data/db');

const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.query);
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: 'The posts information could not be retrieved.'
        });
    });
})

//works on Postman

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(posts => {
        if(posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({
                message: 'The post with the specified ID does not exist.'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: 'The post information could not be retrieved.'
        })
    })
})
//works on Postman

router.post('/', (req, res) => {
    Posts.insert(req.body)
    .then(post => {
        if (post) {
            res.status(201).json(post)
        } else {
            res.status(404).json({
                errorMessage: 'Please provide title and contents for the post.'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: 'There was an error while saving the post to the database.'
        })
    })
})

//works on Postman


router.get('/:id/comments', async (req, res) => {
    try {
        const post_id = Number(req.params.id);
        console.log(typeof post_id);
        const comments = await Posts.findPostComments(post_id);
        if(post_id) {
            res.status(200).json(comments);
        } else {
            res.status(404).json({message: 'The post with the specified ID does not exist'})
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error retriving the messages for this hub.'
        })
    }
})

//works on Postman

router.post('/:id/comments', async (req, res) => {
    const commentInfo = {...req.body, post_id: req.params.id};

    try {
        const comment = await Posts.insertComment(commentInfo);
        res.status(201).json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({err})
    }
})

//Works on Postman


router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
    .then(posts => {
        if (posts > 0) {
            res.status(200).json({message: 'The post has been nuked'});
        } else {
            res.status(404).json({message: ' The post with the specified ID does not exist.'})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: 'The post could not be removed.'
        })
    })
})

//works on Postman

router.put('/:id', (req, res) => {
    const changes = req.body;
    Posts.update(req.params.id, changes)
    .then(post => {
        if(post) {
            res.status(200),json(post);
        } else if (!post) {
            res.status(404).json({message: 'The post with the specified ID does not exist.'})
        } else {
            res.status(400).json({errorMessage: 'Please provide title and contents for the post.'})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: 'The post information could not be modified.'
        });
    });
})

//Updating on Postman

module.exports = router;