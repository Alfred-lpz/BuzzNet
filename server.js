<<<<<<< HEAD
var messageStore = {}; 

const express = require('express');
const { exec } = require('child_process');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const os = require('os');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
app.use(express.static('.')); // Serve static files

let senderPort = 8080;
let receiverPort = 8081;

// Existing app.get for '/run-cpp-code'
app.get('/run-cpp-code', function(req, res) {
    // Existing code...
});

// Function to start server with Express and WebSocket
function startServer(port) {
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
        // Send chat history to the new client
        Object.keys(messageStore).forEach(chatPair => {
            messageStore[chatPair].forEach(message => {
                // Send each message as a raw message
                ws.send(JSON.stringify(message));
            });
        });
    
        ws.on('message', function incoming(rawMessage) {
            const message = JSON.parse(rawMessage);
            const chatPair = message.sender + "_" + message.chatBoxId;
    
            // Store the message in the messageStore
            if (!messageStore[chatPair]) {
                messageStore[chatPair] = [];
            }
            messageStore[chatPair].push(message);
    
            // Broadcast the new message to all clients
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(rawMessage); // Send the original message
                }
            });
        });
    });

    // Start HTTP server with WebSocket integrated
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        const url = `http://localhost:${port}`;
        console.log(`Attempting to open ${url} in the browser...`);
        import('open').then(open => {
            open.default(url); 
        }).catch(err => console.error('Failed to open URL:', err));
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying port ${port + 1}`);
            senderPort += 2;
            receiverPort += 2;
            startServer(port + 1);
        } else {
            console.error(err);
        }
    });
}
=======
const express = require('express');
const { exec } = require('child_process');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// For video
app.use('/uploads', express.static('uploads')); // Serve images from the uploads directory
app.get('/run-cpp-code', (req, res) => {
    exec('./Sender 8080', (error, stdout, stderr) => {
        if (error) {
            console.error(`Sender exec error: ${error}`);
        }
        if (stderr) {
            console.error(`Sender stderr: ${stderr}`);
        }
        console.log(`Sender stdout: ${stdout}`);
    });

    exec('./Receiver 8081', (error, stdout, stderr) => {
        if (error) {
            console.error(`Receiver exec error: ${error}`);
        }
        if (stderr) {
            console.error(`Receiver stderr: ${stderr}`);
        }
        console.log(`Receiver stdout: ${stdout}`);
    });

    //res.send("Sender and Receiver started");
});

>>>>>>> parent of 3407065 (Final)

// For posting

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Initialize SQLite database
const db = new sqlite3.Database('buzznet.db');

<<<<<<< HEAD
=======
app.use(express.static('.')); // Serve static files

>>>>>>> parent of 3407065 (Final)
app.post('/post', upload.single('image'), (req, res) => {
    const text = req.body.text;
    const file = req.file;
    const userIp = req.ip;

    db.run(`INSERT INTO posts (text, image_path, user_ip) VALUES (?, ?, ?)`, [text, file ? file.path : null, userIp], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.send('Post received');
    });
});

// Endpoint to get posts
app.get('/posts', (req, res) => {
    db.all(`SELECT id, text, image_path FROM posts`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// Delete post
app.delete('/delete-post/:id', (req, res) => {
    const postId = req.params.id;
<<<<<<< HEAD

    // First, retrieve the image path
    db.get(`SELECT image_path FROM posts WHERE id = ?`, postId, (err, row) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        // Delete the post record
        db.run(`DELETE FROM posts WHERE id = ?`, postId, function(err) {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            // Delete the image file if it exists
            if (row && row.image_path) {
                const fs = require('fs');
                const filePath = path.join(__dirname, row.image_path); // Ensure the path is correct
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete image: ${err.message}`);
                    } else {
                        console.log(`Deleted image: ${filePath}`);
                    }
                });
            }

            res.send('Post deleted');
        });
    });
});


startServer(3000);

=======
    db.run(`DELETE FROM posts WHERE id = ?`, postId, function(err) {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      res.send('Post deleted');
    });
  });

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
>>>>>>> parent of 3407065 (Final)
