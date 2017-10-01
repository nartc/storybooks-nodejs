const express = require('express');
const router = express.Router();
const {
  ensureAuthenticated,
  ensureGuest
} = require('../helpers/auth');
const mongoose = require('mongoose');

const Story = mongoose.model('stories');
const User = mongoose.model('users');

router.get(
  '/',
  (req, res) => {
    Story.find({
        status: 'public'
      })
      .populate('user')
      .sort({
        date: 'desc'
      })
      .then(stories => {
        res.render('stories/index', {
          stories: stories
        });
      });
  }
);

//Show single story
router.get(
  '/show/:id',
  (req, res) => {
    Story.findById(req.params.id)
      .populate('user')
      .populate('comments.commentUser')
      .then(story => {
        if (req.user) {
          if (story.user.googleID != req.user.googleID) {
            story.views++;
            story.save();
          }
        } else {
          story.views++;
          story.save();
        }
        if (story.status == 'public') {
          res.render('stories/show', {
            story: story
          });
        } else {
          if (req.user) {
            if (story.user._id == req.user.id) {
              res.render('stories/show', {
                story: story
              });
            } else {
              res.redirect('/stories');
            }
          } else {
            res.redirect('/stories');
          }
        }
      });
  }
);

//List stories from a single user
router.get(
  '/user/:userId',
  (req, res) => {
    Story.find({
        user: req.params.userId,
        status: 'public'
      })
      .populate('user')
      .then(stories => {
        res.render('stories/index', {
          stories: stories
        });
      });
  }
);

//List all stories for one user
router.get(
  '/my',
  ensureAuthenticated,
  (req, res) => {
    Story.find({
        user: req.user.id
      })
      .populate('user')
      .then(stories => {
        res.render('stories/index', {
          stories: stories
        });
      });
  }
);

router.get(
  '/add',
  ensureAuthenticated,
  (req, res) => {
    res.render('stories/add');
  }
);

router.get(
  '/edit/:id',
  ensureAuthenticated,
  (req, res) => {
    Story.findById(req.params.id)
      .then(story => {
        if (story.user != req.user.id) {
          res.redirect('/stories');
        } else {
          res.render('stories/edit', {
            story: story
          });
        }
      });
  }
);

router.post(
  '/',
  (req, res) => {
    let allowComment;

    if (req.body.allowComment) {
      allowComment = true;
    } else {
      allowComment = false;
    }

    const newStory = {
      title: req.body.title,
      status: req.body.status,
      body: req.body.body,
      allowComment: allowComment,
      user: req.user.id
    }

    //Create story
    new Story(newStory)
      .save()
      .then(story => {
        res.redirect(`/stories/show/${story._id}`);
      });
  }
);

router.put(
  '/:id',
  (req, res) => {
    Story.findById(req.params.id)
      .then(story => {
        let allowComment;

        if (req.body.allowComment) {
          allowComment = true;
        } else {
          allowComment = false;
        }

        //New Value
        story.title = req.body.title;
        story.body = req.body.body;
        story.status = req.body.status;
        story.allowComment = allowComment;

        story.save()
          .then(story => {
            res.redirect('/dashboard');
          });
      });
  }
);

router.delete(
  '/:id',
  (req, res) => {
    Story.remove({
        _id: req.params.id
      })
      .then(() => {
        res.redirect('/dashboard');
      });
  }
);

router.post(
  '/comment/:id',
  (req, res) => {
    Story.findById(req.params.id)
      .then(story => {
        const newComment = {
          commentBody: req.body.commentBody,
          commentUser: req.user.id
        }

        story.comments.unshift(newComment);
        story.save()
          .then(story => {
            res.redirect(`/stories/show/${story.id}`);
          });
      });
  }
);

module.exports = router;