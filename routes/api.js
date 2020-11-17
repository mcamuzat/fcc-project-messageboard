/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const CONNECTION_STRING = process.env.MONGO_URI;
const Board = require('../models/board.js');
const Reply = require('../models/reply.js');
const Thread = require('../models/thread.js');
const mongoose = require('mongoose');

module.exports = function (app) {
  mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
  app.route('/api/threads/:board')
    .get( async (req, res) => {
      const board = await Board.findOne({name: req.params.board}).exec();

    Thread.find({board: board._id})
      .populate({path: 'replies', model: Reply, select: 'text created_on updated_on', options: {limit: 3}})
      .limit(10)
      .sort({bumped_on: 'desc'})
      .select({reported: false, delete_password: false, board: false})
      .exec((error, data) => {
        if(error) console.log(error);

        res.json(data);
      });
    })

    .post(async (req, res) => {
      // find or create the board
      let board = await Board.findOneAndUpdate(
          {name: req.params.board}, 
          {name: req.params.board},
          { upsert: true, new: true }).exec();

      let thread = new Thread({
        text: req.body.text,
        reported: false,
        delete_password: req.body.delete_password,
        board: board._id,
        replies: []
      });

      await thread.save();
      return res.redirect('/b/' + board.name+'/');

    })

    .put(async (req, res) => {
      await Thread.findByIdAndUpdate(req.body.thread_id, {reported: true}).exec();
      return res.send('success');
    })

    .delete(async (req, res) => {
      const thread = await Thread.findById(req.body.thread_id);
      if(thread.delete_password !== req.body.delete_password){
        return res.send('incorrect password');
      }

      await Thread.findByIdAndDelete(thread._id);

      return res.send('success');
    });
    
  app.route('/api/replies/:board')
    .get(async (req, res) => {
         
      let data = await Thread.findById(
        req.query.thread_id, 
      )
      .populate({ path: 'replies', model: Reply, select: 'text created_on updated_on' })
      .select({reported: false, delete_password: false, board: false})
  
      return res.json(data);
        
    })

    .post(async (req, res) => {
      let reply = new Reply({
        text: req.body.text,
        reported: false,
        delete_password: req.body.delete_password
      });

      reply = await reply.save();
      
      await Thread.findByIdAndUpdate(
            req.body.thread_id, 
            {$push: { replies: reply._id }},
      );

      return res.redirect('/b/' + req.params.board + '/' + req.params.threadid);

    })

    .put(async (req, res) => {
        await Reply.findByIdAndUpdate(req.body.reply_id, {reported: true});
        return res.send('success');
    })

    .delete(async (req, res) => {
      const reply = await Reply.findById(req.body.reply_id);

      if(reply.delete_password !== req.body.delete_password){
        return res.send('incorrect password');
      }

      await Reply.findByIdAndDelete(reply._id);
      return res.send('success');
    });

};
