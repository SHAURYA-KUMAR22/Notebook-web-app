const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//Route 1: get all notes using : get "/api/auth/getuser" login req
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }); //fetching notes of a particular user
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("some error occured");
  }
});

//Route 2 :add new notes using post "/api/auth/addnote" login req

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", "at least 5 charac").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if errors return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); //give list of errors if not validated properly
      }

      //making new model of note with the fetched notes from req.body in line 29
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await note.save();
      res.json(savedNotes);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route 3 :update  existing notes using put "/api/notes/updatenote" login req
router.put(
  "/updatenote/:id", // id is noteid not user id
  fetchuser, // so that only logged in user can update notes and can update only their notes
  async (req, res) => {
    const { title, description, tag } = req.body;
    try {
      //create a newNote object
      const newNote = {};
      if (title) {
        newNote.title = title;
      } //if user giving title in req then update title
      if (description) {
        newNote.description = description;
      } //if user giving descriptin in req then update title
      if (tag) {
        newNote.tag = tag;
      } //if user giving tag in req then update title

      //find the note to be updated
      let note = await Note.findById(req.params.id);
      if (!note) {
        res.status(404).send("not found");
      }

      if (note.user.toString() !== req.user.id) {
        //cheching if given id is equal to the existed note id
        return res.status(401).send("not allowed");
      }

      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      ); //updating ,new content also
      res.json(note);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route 4 :delete  existing notes using delete "/api/notes/deletenote" login req
router.delete(
  "/deletenote/:id", // id is noteid
  fetchuser, // so that only logged in user can update notes and can update only their notes
  async (req, res) => {
    try {
      //find the note to be deleted and delete it
      let note = await Note.findById(req.params.id);
      if (!note) {
        res.status(404).send("not found");
      }

      //allow deletion only if user has this note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("not allowed");
      }

      note = await Note.findByIdAndDelete(req.params.id); //delete note
      res.json({ success: "note deleted", note: note });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

module.exports = router;
