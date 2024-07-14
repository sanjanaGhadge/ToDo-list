const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const filesDir = path.join(__dirname, 'files');
const uploadDir = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/', function(req, res) {
    fs.readdir(filesDir, function(err, files) {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Unable to read directory');
            return;
        }
        res.render('notes', { files: files });
    });
});

app.post('/create', function(req, res) {
    const filename = req.body.title.split(' ').join('') + '.txt';
    fs.writeFile(path.join(filesDir, filename), req.body.details, function(err) {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Unable to create task');
            return;
        }
        res.redirect('/');
    });
});

app.get('/edit/:filename', function(req, res) {
    const filePath = path.join(filesDir, req.params.filename);
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Unable to read file');
            return;
        }
        const title = req.params.filename.replace('.txt', '');
        res.render('edit', { filename: req.params.filename, title: title, content: data });
    });
});


// New route to read a file and display its content
app.get('/read/:filename', (req, res) => {
    const filePath = path.join(filesDir, req.params.filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Unable to read file');
        }
        res.render('read', { title: req.params.filename.replace('.txt', ''), content: data });
    });
});



app.post('/update/:filename', upload.single('image'), function(req, res) {
    const oldFilePath = path.join(filesDir, req.params.filename);
    const newFilename = req.body.title.split(' ').join('') + '.txt';
    const newFilePath = path.join(filesDir, newFilename);
    const newContent = req.body.details;

    fs.rename(oldFilePath, newFilePath, function(err) {
        if (err) {
            console.error('Error renaming file:', err);
            res.status(500).send('Unable to rename file');
            return;
        }
        let updatedContent = newContent;
        if (req.file) {
            const imagePath = '/uploads/' + req.file.filename;
            updatedContent += `\n\n<img src="${imagePath}" alt="Task Image">`;
        }
        fs.writeFile(newFilePath, updatedContent, function(err) {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).send('Unable to update task');
                return;
            }
            res.redirect('/');
        });
    });
});


app.listen(3100, function() {
    console.log('Server is running on port 3100');
});
