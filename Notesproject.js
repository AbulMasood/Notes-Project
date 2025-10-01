let notes =[]
let editingNoteId =null
function loadNotes(){
    const savedNotes =localStorage.getItem("quicknotes")
    if(savedNotes){
        return JSON.parse(savedNotes)
    }else{
        return []
    }
}
const dialog = document.getElementById('noteDialog')
const addButton = document.querySelector('.add-note-btn')
const titleInput =document.getElementById('noteTitle')
const contentInput =document.getElementById('noteContent')
function openNoteDialog(noteId=null){
    dialog.showModal()
    titleInput.focus()
    if(noteId){
        const noteToEdit =notes.find(note=>note.id===noteId)
        editingNoteId=noteId
        document.getElementById('dialogTitle').textContent='Edit Note'
        titleInput.value=noteToEdit.title
        contentInput.value=noteToEdit.content
    }else{
        editingNoteId=null
        document.getElementById('dialogTitle').textContent="Add New Note"
        titleInput.value=""
        contentInput.value=""
    }
    
    
}
const close =document.querySelector('.close-btn')
function closeNoteDialog(){
    dialog.close();
}
const wrapper = document.querySelector('.dialog-content')
addButton.addEventListener("click",()=>openNoteDialog(null))
close.addEventListener("click",closeNoteDialog)
const cancel = document.querySelector('.cancel-btn')
cancel.addEventListener("click",closeNoteDialog)
dialog.addEventListener("click",(e)=>{
    if(!wrapper.contains(e.target)){
        dialog.close();
    }
})
function saveNote(event){
    event.preventDefault()
    const title = document.querySelector('#noteTitle').value.trim()
    const content =document.querySelector('#noteContent').value.trim()

    if(editingNoteId){
        const noteIndex =notes.findIndex(note=>note.id===editingNoteId)
        notes[noteIndex]={
            ...notes[noteIndex],
            title:title,
            content:content
        }
    }else{
        notes.unshift({
        id:generateId(),
        title:title,
        content:content
        })
    }
    saveNotes()
    closeNoteDialog()
    renderNotes()
}
function generateId(){
    return Date.now().toString()
}

function saveNotes(){
    localStorage.setItem("quicknotes",JSON.stringify(notes))
}
function deleteNote(noteId){
    notes=notes.filter(note=>note.id!=noteId)
    saveNotes()
    renderNotes()
}
function renderNotes(){
    const notesContainer = document.querySelector('#notesContainer')
    notesContainer.innerHTML=""
    if(notes.length===0){
        const emptyState =document.createElement("div")
        emptyState.className="empty-state"
        const heading = document.createElement("h2")
        heading.textContent="No notes yet"
        const para = document.createElement("p")
        para.textContent="Create your first note to get started!"
        const button =document.createElement("button")
        button.className="add-note-btn"
        button.textContent="+ Add Your First Note"
        button.addEventListener("click",()=>openNoteDialog())
        emptyState.append(heading,para,button)
        notesContainer.appendChild(emptyState)
        return
    }

    notes.forEach(note=>{
        const card = document.createElement("div")
        card.className="notes-card"
        const title =document.createElement("h3")
        title.className="note-title"
        title.textContent=note.title
        const content =document.createElement("p")
        content.className="note-content"
        content.textContent=note.content
        
        const actions =document.createElement("div")
        actions.className="notes-actions"
        const editBtn =document.createElement("button")
        editBtn.className="edit-btn"
        editBtn.title="Edit Note"
        const editIcon =document.createElement("img")
        editIcon.src= "Images/Edit1.png"
        editIcon.alt ="Edit"
        editIcon.width=32
        editIcon.height=32
        editBtn.append(editIcon)
        editBtn.addEventListener("click",()=>openNoteDialog(note.id))

        const deleteBtn =document.createElement("button")
        deleteBtn.className="delete-btn"
        deleteBtn.title="Delete Note"
        const deleteIcon =document.createElement("img")
        deleteIcon.src= "Images/Delete1.png"
        deleteIcon.alt ="Delete"
        deleteIcon.width=32
        deleteIcon.height=32
        deleteBtn.append(deleteIcon)
        deleteBtn.addEventListener("click",()=>deleteNote(note.id))
        actions.append(editBtn,deleteBtn)
        card.append(title,content,actions)
        notesContainer.appendChild(card)
    })
}

function toggleTheme(){
    const isDark =document.body.classList.toggle("dark-theme")
    localStorage.setItem("theme",isDark ?"dark":"light")
    document.getElementById("themeToggleBtn").textContent=isDark ? "☀️":"🌙"
}
function applyStoredTheme(){
    if(localStorage.getItem("theme")==="dark"){
        document.body.classList.add("dark-theme")
        document.getElementById("themeToggleBtn").textContent="☀️"
    }
}
applyStoredTheme()
notes=loadNotes()
renderNotes()
const save = document.querySelector('#noteForm')
save.addEventListener("submit",saveNote)
const theme =document.querySelector("#themeToggleBtn")
theme.addEventListener("click",toggleTheme)
