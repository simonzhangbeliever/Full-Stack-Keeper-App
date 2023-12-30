import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
const port = 5000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// io.attach(server);

// connect postgresql database 
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "keeper",
    password: "Xu19940521",
    port: 5432,
});
db.connect();


// use socket io to automatically send data to client side
io.on("connection", (socket) => {
    console.log('A user connected');

    socket.on('dataUpdated', (newData) => {
        // emit data to all connected clients
        io.emit('dataUpdated', newData);
    });

      // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


app.get("/message", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM notes ORDER BY key ASC");
        res.json(result.rows);
        
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post("/add", async (req, res) => {
    const newNote = req.body;
    res.json(newNote);
    console.log(newNote);

    try {
        await db.query("INSERT INTO notes (title, content) VALUES ($1, $2)", [newNote.title, newNote.content]);
        const result = await db.query("SELECT * FROM notes ORDER BY key ASC");
        io.emit('dataUpdated', result.rows); // send updated data to client side from database
    } catch (error) {
        console.error('Error inserting query', error);
    }
   
});

app.post("/delete", async (req, res) => {
    const deleteNote = req.body;
    res.json(deleteNote);
    console.log(deleteNote);

    try {
        await db.query("DELETE FROM notes WHERE key = $1", [deleteNote.key]);
        const result = await db.query("SELECT * FROM notes ORDER BY key ASC");
        io.emit('dataUpdated', result.rows); // send updated data to client side from database
    } catch (error) {
        console.error('Error inserting query', error);
    }
    
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

