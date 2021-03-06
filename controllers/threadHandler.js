var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = process.env.DB;

function ThreadHandler() {
  this.newThread = function(req, res) { 
      // console.log('req.body: ' + JSON.stringify(req.body))
    var board = req.params.board;
    var thread = {
      text: req.body.text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password,
      replies: []
    };
    mongo.connect(url,function(err,db) {
      var collection = db.collection(board);
      collection.insert(thread, function(){
        res.redirect('/b/'+board+'/');
      });
    });
    
  }

  this.threadList = function(req, res) {
    var board = req.params.board;
    mongo.connect(url,function(err,db) {
      var collection = db.collection(board);
      collection.find(
        {},
        {
          reported: 0,
          delete_password: 0,
          "replies.delete_password": 0,
          "replies.reported": 0
        })
      .sort({bumped_on: -1})
      .limit(10)
      .toArray(function(err,docs){
        docs.forEach(function(doc){
          doc.replycount = doc.replies.length;
          if(doc.replies.length > 3) {
            doc.replies = doc.replies.slice(-3);
          }
        });
        res.json(docs);
      });
    });
  };
  
  this.reportThread = function(req, res) {
    var board = req.params.board;
    mongo.connect(url,function(err,db) {
      var collection = db.collection(board);
      collection.findAndModify(
        {_id: new ObjectId(req.body.report_id)},
        [],
        {$set: {reported: true}});
    });
    res.send('reported');
  };
  
  this.deleteThread = function(req, res) {
    var board = req.params.board;
    mongo.connect(url,function(err,db) {
      var collection = db.collection(board);
      // console.log('req.body: ' + JSON.stringify(req.body))
      collection.findAndModify(
        {
          _id: new ObjectId(req.body.thread_id),
          delete_password: req.body.delete_password
        },
        [],
        {},
        {remove: true, new: false},
        function(err, doc){
          // console.log('doc: ' + JSON.stringify(doc))
          if (doc.value === null) {
            res.send('incorrect password');
          } else {
            res.send('success');
          }
        });
        
    });
  };
  
}

module.exports = ThreadHandler;