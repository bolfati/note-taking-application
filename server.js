const express = require("express");
const path = require("path");
const uuid = require("./uuid");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;
//setting up necessary variables 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // lets us translate strings into url available characters
app.use(express.static("public"));


app.get("/notes", (req, res) => //setting up our big html route for grabbing from our db
res.sendFile(path.join(__dirname, "./public/notes.html")) 

);

app.get("/api/notes", (req, res) => { //setting up our big api route
console.info(`${req.method} received request for big notes`)
const db = JSON.parse(fs.readFileSync("./db/db.json"));
res.json(db);

});


app.post("/api/notes", (req, res) => { //big posting using the post method for our note, parsing with fs
console.info(`${req.method} request to add note received`);
const { title, text } = req.body;
const db = JSON.parse(fs.readFileSync("./db/db.json"));
console.log(db);
if (title && text) {
    const newNote = {
        title,
        text,
        id: uuid()
    };
    db.push(newNote)
    const newNoteStringify = JSON.stringify(db)
    fs.writeFileSync("./db/db.json", newNoteStringify)
    res.json(db);
} else {
    res.status(400).send("Please include title and text - both are required fields.")
}
});

app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;
    console.log(noteId);
    const db = JSON.parse(fs.readFileSync("./db/db.json"))
    for (let i = 0; i < db.length; i++) {
        if (noteId === db[i].id) {
            db.splice(i, 1);
            fs.writeFileSync("./db/db.json", JSON.stringify(db))
        }
    }
    res.json(db);
})

app.listen(PORT, () =>
console.log(`Example app listening at http://localhost:${PORT}`));