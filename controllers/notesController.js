const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')


// @desc Get all users
// @route GET /users
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    // Get all notes from MongoDB
    const notes = await Note.find().lean()

    // If no users 
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    const notesWithUser= await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return {...note, username: user.username}
    }))


    res.json(notesWithUser)
})

// @desc Create new notes
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    // Confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    if (note) { //created 
        res.status(201).json({ message: `New note created` })
    } else {
        res.status(400).json({ message: 'Invalid note data received' })
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // Confirm data 
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Does the user exist to update?
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // Check for duplicate 
    const duplicate = await Note.findOne({ title }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    note.user = user 
    note.title = title
    note.text = text
    note.completed = completed


    const updateNote = await note.save()

    res.json({ message: `${updatedNote.title} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID Required' })
    }

    // Does the user still have assigned notes?
    const note = await Note.findById({ id }).exec()
    
    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    
    const result = await note.deleteOne()

    const reply = `Note ${result.title} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}