const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
    // Serve data.json on both '/' and '/data'
    if ((req.url == '/' || req.url == '/data') && req.method == 'GET') {
        fs.readFile('data.json', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    }
    else if(req.url == '/data' && req.method == 'POST'){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            fs.readFile('data.json', 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                } else {
                    const existingdata = JSON.parse(data);
                    const newData = JSON.parse(body);
                    existingdata.push(newData);
                    fs.writeFile('data.json', JSON.stringify(existingdata), (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal server error' }));
                        } else {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Data added successfully' }));
                        }
                    });
                }
            });
        });
    }
    else{
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});