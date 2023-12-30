import React, {useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

function CreateArea(props) {

  const [newNote, setNewNote] = useState({
    title: "",
    content: ""
  });

  const [isExpand, setIsExpand] = useState(false)

 
  function handleChange(event) {

    const {name, value} = event.target;

    setNewNote(prevValue => {
      if (name === "title") {
        return {
          title: value,
          content: prevValue.content
        };
      } else if (name === "content") {
        return {
          title: prevValue.title,
          content: value
        };
      }
    });
  }

  function handleInputClick() {
    setIsExpand(true);
  }

  function handleClick(event) {
    event.preventDefault(); //prevent the entire reloading of the page

    const sendData = async () => {
      try {
        const response = await fetch("http://localhost:5000/add", {
          method: "post",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNote),
        });
  
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error('Error submitting data', error);
      }
    };

    sendData();

    setNewNote({
      title: "",
      content: ""
    });
  }

  return (
    <div>
      <form onSubmit={handleClick} className="create-note">
        {isExpand && <input name="title" placeholder="Title" onChange={handleChange} value={newNote.title} />}
        <textarea name="content" placeholder="Take a note..." onChange={handleChange} onClick={handleInputClick} value={newNote.content} rows={isExpand? "3": "1"} />
        <Zoom in={isExpand}>
          <Fab type="submit">
              <AddIcon />
            </Fab>
          </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
