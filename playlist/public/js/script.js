window.addEventListener("beforeunload", function (e) {
  //Local storage the table data
  this.localStorage.setItem("playlist", JSON.stringify(playlist))
});

window.addEventListener('load', (event) => {

  //Make table based on local storage
  savedPlaylist = JSON.parse(localStorage.getItem("playlist"))
  localStorageTable(savedPlaylist)

})

function localStorageTable(pL){

  for(let i = 0; i < pL.length; i++){
    addToTable(pL[i], i)
  }

  playlist = pL

}

function addToTable(song, rowNum){
  let tableLocation = document.getElementById("playlistTable")

  //Create buttons
  let removeButton = createRemoveButton(song.trackId)
  let upButton = createUpButton(song.trackId)
  let downButton = createDownButton(song.trackId)

  //Get song name and artist name
  let name = document.createElement("html")
  name.innerHTML = JSON.stringify(song.trackCensoredName).replaceAll('"', "")
  let artist = document.createElement("html")
  artist.innerHTML = JSON.stringify(song.artistName).replaceAll('"', "")

  //Get picture
  let picture = document.createElement("img")
  picture.src = song.artworkUrl60

  //Insert info into table rows
  let row = tableLocation.insertRow(rowNum)
  row.id = song.trackId
  let buttonCol = row.insertCell(0)
  let songName = row.insertCell(1)
  let artistName = row.insertCell(2)
  let trackPic = row.insertCell(3)
  
  buttonCol.appendChild(removeButton)
  buttonCol.appendChild(upButton)
  buttonCol.appendChild(downButton)
  songName.appendChild(name)
  artistName.appendChild(artist)
  trackPic.appendChild(picture)
}

function getSong() {

  let songName = document.getElementById('songName').value
  if(songName === '') {
      return alert('Please enter a song')
  }

  let songDiv = document.getElementById('songs')
  songDiv.innerHTML = ""

  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
          let response = JSON.parse(xhr.responseText)
          songDiv.innerHTML = songDiv.innerHTML + `<h1>Songs matching: ${songName} </h1>`
          createButtons(response)
      }
  }
  xhr.open('GET', `/song?songName=${songName}`, true)
  xhr.send()
}

const ENTER=13

function handleKeyUp(event) {
event.preventDefault()
 if (event.keyCode === ENTER) {
    document.getElementById("submit_button").click()
}
}


document.addEventListener('DOMContentLoaded', function() {
document.getElementById('submit_button').addEventListener('click', getSong)

//add key handler for the document as a whole, not separate elements.
document.addEventListener('keyup', handleKeyUp)

})

function createButtons(songs){
  //Get access to the div tag with the id named "spmgs"
  let songsLocation = document.getElementById("songs")

  let tableLocation = document.createElement("table")
  tableLocation.id = "songTable"

  let rowNum = 0;

  songs.results.forEach(song =>{

    //Create button
    let addButton = document.createElement("button")
    addButton.innerHTML = " + "
    addButton.id = song.trackId
    addButton.storage = JSON.stringify(song)
    addButton.onclick = addSong

    //Get song name and artist name
    let name = document.createElement("html")
    name.innerHTML = JSON.stringify(song.trackCensoredName).replaceAll('"', "")
    let artist = document.createElement("html")
    artist.innerHTML = JSON.stringify(song.artistName).replaceAll('"', "")

    //Get picture
    let picture = document.createElement("img")
    picture.src = song.artworkUrl60

    //Insert info into table rows
    let row = tableLocation.insertRow(rowNum)
    row.id = song.trackId
    let buttonCell = row.insertCell(0)
    let songName = row.insertCell(1)
    let artistName = row.insertCell(2)
    let trackPic = row.insertCell(3)
    
    buttonCell.appendChild(addButton)
    songName.appendChild(name)
    artistName.appendChild(artist)
    trackPic.appendChild(picture)

    rowNum++
  })

  songsLocation.append(tableLocation)

}

let playlist = []

//This function is called whenever a button is clicked.
function addSong(event){

  let tableLocation = document.getElementById("playlistTable")

  if(tableLocation.rows.namedItem(this.id)){
    alert("This song is already in your playlist")
    return
  }

  playlist.push(JSON.parse(this.storage))

  //Create buttons
  let removeButton = createRemoveButton(this.id)
  let upButton = createUpButton(this.id)
  let downButton = createDownButton(this.id)

  //Get table
  let songTable = document.getElementById("songTable")

  let element = songTable.rows.namedItem(this.id)

  //Make copy
  let row = tableLocation.insertRow(-1)

  row.id = this.id
  
  let newButtons = row.insertCell(0)
  let addedName = row.insertCell(1)
  let addedArtist = row.insertCell(2)
  let addedPic = row.insertCell(3)

  newButtons.appendChild(removeButton)
  newButtons.appendChild(upButton)
  newButtons.appendChild(downButton)

  addedName.innerHTML = element.cells[1].innerHTML
  addedArtist.innerHTML = element.cells[2].innerHTML
  addedPic.innerHTML = element.cells[3].innerHTML
}

function removeSong(event){

  //Get the element and remove it from table
  let removeElement = document.getElementById(this.id)
  removeElement.parentNode.removeChild(removeElement)
  
  //Remove it from the playlist for local storage
  let pLRemove = playlist

  const map1 = pLRemove.map((song, index) =>{
    if(parseInt(song.trackId) === parseInt(this.id)) {
      return index
    }
  });
  const map2 = map1.filter((item) =>{ if(item) return item})

  let index = playlist.indexOf(map2)
  playlist.splice(index, 1)


}

function moveUp(event){

  let tableLocation = document.getElementById("playlistTable")

  let row = tableLocation.rows.namedItem(this.id)
  let index = row.rowIndex

  //Check if it's at the top already
  if(!check(index, 0)){
    return
  }
  
  row.parentNode.insertBefore(row, tableLocation.rows[index-1])

  let temp = playlist[index - 1]
  playlist[index - 1] = playlist[index]
  playlist[index] = temp

}

function moveDown(event){

  let tableLocation = document.getElementById("playlistTable")

  let row = tableLocation.rows.namedItem(this.id)
  let index = row.rowIndex

  //Check if it's at the top or bottom already
  if(!check(index, tableLocation.rows.length - 1)){
    return
  }

  row.parentNode.insertBefore(row, tableLocation.rows[index + 2])

  let temp = playlist[index]
  playlist[index] = playlist[index + 1]
  playlist[index + 1] = temp

}

function check(index, bound){

  if(index == bound){
    return false
  }
  return true

}

function createRemoveButton(id){
  let removeButton = document.createElement("button")
  removeButton.innerHTML = " - "
  removeButton.id = id
  removeButton.onclick = removeSong

  return removeButton
}

function createUpButton(id){
  let upButton = document.createElement("button")
  upButton.innerHTML = " &#11014 "
  upButton.id = id
  upButton.onclick = moveUp

  return upButton
}

function createDownButton(id){
  let downButton = document.createElement("button")
  downButton.innerHTML = " &#11015 "
  downButton.id = id
  downButton.onclick = moveDown

  return downButton
}