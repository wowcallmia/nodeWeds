// npm install --save body
const PORT = 9005;
const fs = require('fs');
const file = 'messages.json';
const uuid = require('uuid');
const http = require('http');
const anyBody = require('body/any');

const server = http.createServer((req, res) => {
  let {url, method} = req;
  let [, path, id] = url.split('/');
  switch (path) {
    case 'messages':
      switch (method) {
        case 'POST':
          anyBody(req, (err1, body) => {
            fs.readFile(file, (err2, buffer) => {
              if (err2 || err1) return err2 || err1;
              let messageArr = JSON.parse(JSON.parse(buffer));
              body.id = uuid();
              messageArr.push(body);
              let x = JSON.stringify(JSON.stringify(messageArr));
              fs.writeFile(file, x, err3 => {
                if (err3) {
                  res.statusCode = 500;
                  return res.end('NO U');
                }
                res.write(JSON.stringify(messageArr));
                res.end();
              });
            });
          });
          break;
        case 'GET':
          if (path === 'messages') {
            if (id) {
              fs.readFile(file, (err1, buffer) => {
                if (err1) return err1;
                let getArray = JSON.parse(JSON.parse(buffer));
                let getMessage = getArray.filter(cur => {
                  if (cur.id === id) {
                    return true;
                  }
                });
                res.write(JSON.stringify(JSON.stringify(getMessage)));
                res.end();
              });
            }
            else {
              fs.readFile(file, (err, buffer) => {
                if (err) return err;
                res.write(JSON.stringify(buffer));
                res.end();
              });
            }
          }
          break;
      case 'DELETE':
          if (path === 'messages') {
            if (id) {
              fs.readFile(file, (err2, buffer) => {
                console.log('buffer', buffer);
                if (err2) return err2;
                let deleteArray = JSON.parse(JSON.parse(buffer));
                let deleteMessage = deleteArray.filter(cur => {
                  if (cur.id !== id) {
                    return true;
                  }
                });
                fs.writeFile(file, JSON.stringify(deleteMessage), err3 => {
                  if (err3) {
                    res.statusCode = 500;
                    return res.end('NO U');
                  }
                });
                res.write(JSON.stringify(JSON.stringify(deleteMessage)));
                res.end();
              });
            }
          }
          break;
        case 'PUT':
          if (path === 'messages') {
            if (id) {
              anyBody(req, (err1, body) => {
                console.log('body', body);
                fs.readFile(file, (err2, buffer) => {
                  if (err1 || err2) return err1 || err2;
                  let putArray = JSON.parse(JSON.parse(buffer));
                  console.log('put', putArray);
                  let putMessage = putArray.map(cur => {
                    if (cur.id === id) {
                      return {
                        Author: body.Author,
                        Message: body.Message,
                        id: cur.id
                      };
                    } else {
                      return cur;
                    }
                  });
                  console.log('obj', putMessage);
                fs.writeFile(file, JSON.stringify(JSON.stringify(putMessage)), err3 => {
                  if (err3) {
                    res.statusCode = 500;
                    return res.end('NO U');
                  }
                });
                  res.write(JSON.stringify(JSON.stringify(putMessage)));
                  res.end();
                });
              });
            }
          }
          break;
        default:
          res.statuscode = 404;
          res.end('NO U');
          break;
      }
      break;
    default:
      res.statuscode = 404;
      res.end('NOT FOUND bottom');
      break;
  }
});

server.listen(PORT, err => {
  console.log(err || `Server listening...`);
});
