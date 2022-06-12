import React, { useContext, useEffect, useRef, useState } from "react";
import Noteitem from "./Noteitem";

import noteContext from "../context/notes/noteContext";
import AddNote from "./AddNote";

const Notes = () => {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;

  const ref = useRef(null);
  const refClose = useRef(null);


  useEffect(() => {
    getNotes();
    // eslint-disable-next-line
  }, []); //fetch all notes only once

  const [note, setNote] = useState({
      id:"",
    etitle: "",
    edescription: "",
    etag: "",
  });
  const updateNote = (currentNote) => {
    ref.current.click(); //on clicking edit updatenote function get called reference is to the button which is hidden
    setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
  };
  

  const handleClick = (e) => {
      console.log("updating the note", note)
      //before closing edit the note 
      editNote(note.id, note.etitle, note.edescription, note.etag)
      refClose.current.click();   //clicking update button but affecting the cloe button to do its function
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value }); //name is getting updated to value(enterd)
  };

  return (
    <>
      <AddNote />
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none "
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    aria-describedby="emailHelp"
                    onChange={onChange}
                    value={note.etitle}
                  />
                  <div id="emailHelp" className="form-text"></div>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    onChange={onChange}
                    value={note.edescription}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag" ///////////////
                    name="etag" //////////   ///
                    onChange={onChange}
                    value={note.etag}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
              ref={refClose}
                type="button"
                className="btn btn-secondary" 
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button onClick={handleClick} type="button" className="btn btn-primary">
                update note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h1>Your Notes</h1>
        {notes.map((note) => {
          return (
            <Noteitem key={note._id} updateNote={updateNote} note={note} />
          );
        })}
      </div>
    </>
  );
};

export default Notes;
