import * as types from '../mutation_types'
import noteApi from '../../api/notes'
import 'lodash'
//init state
const state = {
    notes: [],
    activeNote: {}
}

//getters
const getters = {
    allNotes: state => state.notes,
    activeNote: state => state.activeNote
}
//actions
const actions = {
    getAllNotes({commit}) {
        noteApi.getNotes(notes => {
            commit(types.GET_ALL_NOTES, { notes });
        })
    },
    addNote({commit}) {
        commit(types.ADD_NOTE)
    },
    editNote({commit}, e) {
        commit(types.EDIT_NOTE, e);
    },
    editTitle({commit}, e) {
        commit(types.EDIT_TITLE, e);
    },
    deleteNote({commit}) {
        commit(types.DELETE_NOTE)
    },
    toggleFavorite({commit}) {
        commit(types.TOGGLE_FAVORITE)
    },
    setActiveNote({commit}, note) {
        commit(types.SET_ACTIVE_NOTE, note);
    }
}

//mutations
const mutations = {
    [types.ADD_NOTE](state) {
        const newNote = {
            title: 'New note',
            text: 'New note',
            favorite: false
        }
        state.notes.push(newNote)
        state.activeNote = newNote
    },

    [types.EDIT_NOTE](state, e) {
        state.activeNote.text = e.target.value
    },
    [types.EDIT_TITLE](state, e) {
        state.activeNote.title = e.target.value
    },

    [types.DELETE_NOTE](state) {
        _.remove(state.notes, (n) => n === state.activeNote);
        state.activeNote = state.notes[0]
    },

    [types.TOGGLE_FAVORITE](state) {
        state.activeNote.favorite = !state.activeNote.favorite
    },

    [types.SET_ACTIVE_NOTE](state, note) {
        state.activeNote = note
    },
    [types.GET_ALL_NOTES](state, {notes}) {
        state.notes = notes
        state.activeNote = notes[0];
    }
}

//export
export default {
    state,
    getters,
    actions,
    mutations
}