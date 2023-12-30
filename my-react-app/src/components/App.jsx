import React, {useState, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import {io} from "socket.io-client";


function App() {

    const [notes, setNotes] = useState([]);

    useEffect(() => {
        // use socket io to automatically receive data from backend server
        const socket = io("http://localhost:5000");
        socket.on("dataUpdated", (newData) => {
            console.log(newData);
            setNotes(newData);
        });


        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/message");
                const result = await response.json();
                setNotes(result);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };
        
        fetchData();
    }, []);

    function deleteNote(note) {

        setNotes(prevValue => {
            const index = prevValue.indexOf(note);
            return prevValue.toSpliced(index, 1);
        });

        const sendData = async () => {
            try {
              const response = await fetch("http://localhost:5000/delete", {
                method: "post",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(note),
              });
        
              const result = await response.json();
              console.log(result);
            } catch (error) {
              console.error('Error submitting data', error);
            }
          };
          sendData();
    }

    return (
        <div>
            <Header />
            <CreateArea />
            {notes.map((notes) => <Note 
                key={notes.key}
                title={notes.title}
                content={notes.content}
                note={notes}
                onDelete={deleteNote}
            />)}
            <Footer />
        </div>
    );
}

export default App;

