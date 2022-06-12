// import react from "react";
// import { useState } from "react";
import NoteContext from "./noteContext";
import { useState } from "react";

//this will provide all the note state
const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial) //notes value set to notesinitial

   //fetching all notes
   const getNotes = async () => {
     // to do api call to fetch all notes
     const response = await fetch(`${host}/api/notes/fetchallnotes`, {
       method: 'GET', // *GET, POST, PUT, DELETE, etc.
       headers: {
         "Content-Type": "application/json",
         "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI2ZTI1MjVhM2E2ODQyZDZjYTAxZDUzIn0sImlhdCI6MTY1MTM4NTY2OX0.2lUOwOFGv9j7tGRhxQJ9ddavS4alDlkMw4k5_hdZVdY",
       },
     });
    const json = await response.json()
     console.log(json)
     setNotes(json)
  };

  //Add a note
  const addNote = async (title, description, tag) => {
    console.log("adding a new note");
    // to do api call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI2ZTI1MjVhM2E2ODQyZDZjYTAxZDUzIn0sImlhdCI6MTY1MTM4NTY2OX0.2lUOwOFGv9j7tGRhxQJ9ddavS4alDlkMw4k5_hdZVdY",
      },
      body: JSON.stringify({title,description,tag}), // body data type must match "Content-Type" header
    });
    const json = response.json(); // parses JSON response into native JavaScript objects
    console.log(json)


    const note = {
      _id: "626aa07bb79b24d6fdsjh750e339",
      user: "6269993fde848d650bc27029",
      title: title,
      description: description,
      tag: tag,
      date: "2022-04-28T14:11:07.728Z",
      __v: 0,
    };
    setNotes(notes.concat(note)); //concat new note to array ,push will update the array
  };

  
  //Delete a note
  const deleteNote = async (id) => {

    // to do api call
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI2ZTI1MjVhM2E2ODQyZDZjYTAxZDUzIn0sImlhdCI6MTY1MTM4NTY2OX0.2lUOwOFGv9j7tGRhxQJ9ddavS4alDlkMw4k5_hdZVdY",
        },
         // no body as deleteing the node
      });
      const json = response.json();
      console.log(json)

    console.log("delete note with id: " + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    }); //if given id matches with id of any item of list it will get filterd
    setNotes(newNotes); //concat new note to array ,push will update the array
  };

  //Edit a note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI2ZTI1MjVhM2E2ODQyZDZjYTAxZDUzIn0sImlhdCI6MTY1MTM4NTY2OX0.2lUOwOFGv9j7tGRhxQJ9ddavS4alDlkMw4k5_hdZVdY",
      },
      body: JSON.stringify({title,description,tag}), // body data type must match "Content-Type" header
    });
    const json = await response.json(); // parses JSON response into native JavaScript objects
    console.log(json)

    let newNotes = JSON.parse(JSON.stringify(notes))  //cant directly modify the array therefore making a copy and updating it then setting notes to newNotes
    // logic to edit the note
    for (let index = 0; index < newNotes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {/*exporting both so that we can use notes as well as setNotes to change */}
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
