const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.static('.')); // Serve static files
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
