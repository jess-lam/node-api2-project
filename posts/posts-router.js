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

module.exports = router;