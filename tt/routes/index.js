
var AM = require('./modules/account-manager');
var FR = require('./modules/friend');
var ME = require('./modules/message');

/* GET home page. */
module.exports = function(app){
var login = null;
app.get('/', function(req, res, next) {
  if (login == null)
  {
    res.render('login', { title: 'Login' });
  }else{
    ME.listMessage(login.email,function(e,o){
      if(o == null){
        console.log('ko co bai');
      }
      else{
      req.session.user = o;
      console.log(o.length);
      res.render('homemessage',{

      data:o
      }
    )};
    });
  }

});
app.post('/', function(req, res){
    console.log(req.body.email);
    console.log(req.body.pass);
		AM.manualLogin(req.body.email, req.body.pass, function(e, o){
			if (!o){
        console.log("Loi ko danh nhap dc");
				res.status(400).send(e);
			}	else{
        login = o;
        console.log("Trong login");
        console.log(login);
				}
			});
		});
    //Tao tai khoan
    app.get('/createlogin', function(req, res) {
      res.render('createlogin', {  title: 'create_account'});
    });

    app.post('/createlogin', function(req, res){
      AM.addNewAccount({
        name 	: req.body.name,
        email 	: req.body.email,
        pass	: req.body.pass
      }, function(e){
        if (e){
          res.status(400).send(e);
        }

      });
    });
      app.get('/homemessage', function(req, res) {
        var list = [];
        if(login == null){
          res.redirect('/');
        }else{
        ME.ReceiverlistMessage(login.email,function(e,o){
          if(o == null){
            console.log('ko co bai');
          }
          else{
          FR.listFriend(login.email,function(e,p){
            if(p != null)
            {
              console.log("So luong block");
              console.log(p.block.length);
              for(var i= 0 ; i < o.length ; i++)
              {
                console.log("Vo ham homemessage de kiem tra");
                var KT = false;
                for(var j = 0 ; j < p.block.length ; j++)
                {
                  if(o[i].sender == p.block[j])
                  {
                    KT = true;
                  }
                }
                if(KT == false)
                {
                  list.push(o[i]);
                }
              }
              res.render('homemessage',{
              data:list})
              }
            else{
              res.render('homemessage',{
              data:o
              })
            };
          });
          };

        });
      };
      });
    //Phan Outbox message
    app.get('/message', function(req, res) {
      if(login == null){
        res.redirect('/');
      }else{
      FR.listFriend(login.email,function(e,o){
        if(o == null){
          console.log('ko co bai');
        }
        else{
        console.log(o);
        res.render('message',{
        data:o
        }
      )};

      });
    }
	});
 app.post('/message', function(req, res){
   if(login == null){
     res.redirect('/');
   }else{
    ME.addNewMessage({
      sender 	: login.email,
      receiver 	: req.body.friend,
      message	: req.body.content,
      read: false
    }, function(e){
      if (e){
        res.status(400).send(e);
      }
      else{
        res.redirect('/message')
      }
    });
  }
  });
  //In box
  //Phan Outbox message

app.get('/viewmessage/:id', function(req, res) {
  var userID = req.params.id;
  if(login == null){
    res.redirect('/');
  }else{
  ME.Findmessage(userID,function(e,o){

    if(o == null){
      console.log('ko co bai');
    }
    else{
    ME.updateMessage(userID,function(e,p){
      if(p == null){
        console.log("Lỗi ko cập nhât");
      }
      else{
        ME.ReceiverlistMessage(login.email,function(e,p){
          if(p == null)
          {
            console.log("Khong co tin nhan");
          }
          else {
            res.render('viewmessage',{
            data:p,
            data1:o
            })
          };
        });

      };
    });
  };
});

  };
});


  app.get('/outbox', function(req, res) {
    if(login == null){
      res.redirect('/');
    }else{
    ME.SenderlistMessage(login.email,function(e,o){
      if(o == null){
        console.log('ko co bai');
      }
      else{
      res.render('outbox',{
      data:o
      }
    )};

    });
  }
  });
  app.get('/logout', function(req, res) {
    if(login != null){
      login = null;
      res.redirect('/');
    }
  });
  /*app.get('/friend', function(req, res) {
    var notfriend = [];
    AM.listaccount(function(e,o){
      if(o == null){
        console.log('ko co bai');
      }
      else{
      FR.listFriend(login.email,function(e,p){
        if(p != null){
        for(var i = 0 ; i < o.length ; i++)
        {
          var kt = false;
          for(var j = 0 ; j < p.friend.length; j++)
          {
            if(o[i].email == p.friend[i])
            {
              kt = true;
            }
          }
          if(kt == false)
          {
            notfriend.push(o[i]);
          }
        }
        res.render('friend',{
        data:p,
        data1:notfriend
        })
      }else{
        res.render('friend',{
        data:p,
        data1:o
        })
      }

      });
    };
    });

  });*/

  app.get('/friend', function(req, res) {
    var notfriend = [];
    AM.listaccount(function(e,o){
      if(o == null){
        console.log('ko co bai');
      }
      else{
      FR.listFriend(login.email,function(e,p){
        if(p != null){
        for(var i = 0 ; i < o.length ; i++)
        {
          var kt = false;
          for(var j = 0 ; j < p.friend.length; j++)
          {
            if(o[i].email == p.friend[i])
            {
              kt = true;
            }
          }
          if(kt == false)
          {
            notfriend.push(o[i]);
          }
        }
        res.render('friend',{
        data:p,
        data1:notfriend
        })
      }else{
        res.render('friend',{
        data:p,
        data1:o
        })
      }

      });
    };
    });

  });

  app.get('/viewOutbox/:id', function(req, res) {
    var userID = req.params.id;
    if(login == null){
      res.redirect('/');
    }else{
    ME.Findmessage(userID,function(e,o){

      if(o == null){
        console.log('ko co tin nhan');
      }
      else{
        ME.SenderlistMessage(login.email,function(e,p){
          if(p == null)
          {
            console.log("Khong co tin nhan");
          }
          else {
            res.render('viewOutbox',{
            data:p,
            data1:o
            })
          };
        });

        };
      });
    };
  });

  app.get('/friend/:email', function(req, res) {
    var emailfriend = req.params.email;
    if(login == null){
      res.redirect('/');
    }else{
    FR.addNewFriend(login.email,emailfriend, function(e,o){
      if (e){
        res.status(400).send(e);
      }
      else{
            res.redirect('/friend')
        }
      });
  }
});

app.get('/delete/:email', function(req, res){
  var emailfriend = req.params.email;
  if(login == null){
    res.redirect('/');
  }else{
    FR.deleteFriend(login.email,emailfriend,function(e, obj){
      if(e){
        res.status(400).send(e);
      }
      else{
        res.redirect('/friend')
      }
    });
  }
});

app.get('/block/:email', function(req, res) {
  var emailblock = req.params.email;
  if(login == null){
    res.redirect('/');
  }else{
  FR.addBlock(login.email,emailblock, function(e,o){
    if (e){
      res.status(400).send(e);
    }
    else{
          res.redirect('/friend')
      }
    });
}
});

app.get('/unblock/:email', function(req, res) {
  var emailblock = req.params.email;
  if(login == null){
    res.redirect('/');
  }else{
  FR.deleteBlock(login.email,emailblock, function(e,o){
    if (e){
      res.status(400).send(e);
    }
    else{
          res.redirect('/friend')
      }
    });
}
});

}
