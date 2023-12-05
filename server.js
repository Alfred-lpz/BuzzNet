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

app.use(express.static('.')); // Serve static files

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
