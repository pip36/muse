import Vex from 'vexflow'

let VF = Vex.Flow
let context = ''
let barWidth = 400
let verticalSpacing = 100
let scoreLeftPosition = 10
let currentBarPosition = { x: 0, y: 0 }
let currentTimeSig = ''
let notesData = []
let bars = []

function addNotes (stave, noteArray) {
    
    let notes = parseNoteArray(noteArray)
    
    let timesigArr = currentTimeSig.split('/')
    let voice = new VF.Voice({num_beats: timesigArr[0],  beat_value: timesigArr[1]});
    let formatter = new VF.Formatter()
    
    voice.addTickables(notes);      
    formatter.joinVoices([voice]).formatToStave([voice], stave);

    
    let tickables = voice.getTickables()
    tickables.forEach(element => {
      notesData.push(element)
    })

    
    let beams = VF.Beam.generateBeams(notes)
    VF.Formatter.FormatAndDraw(context,stave,notes)
    beams.forEach((beam) => {
      beam.setContext(context).draw()
    })
    

//let beam = new VF.Beam(notes)
//beam.setContext(context).draw()
    
    
}

function parseNoteArray (notesArray) {
  return notesArray.map((noteString) => {
    let arr = noteString.split('|'),
        notes = arr[0],
        duration = arr[1]
    return new VF.StaveNote({ clef: 'treble', keys: notes.split('+'), duration })
  })
}



export default { 

  init (el, width, height) {
    let div = document.getElementById(el)
    let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG)
    renderer.resize(width, height)
    context = renderer.getContext();
    currentBarPosition.x = scoreLeftPosition
  },

  drawBar (options = {}) {
    let stave = new VF.Stave(currentBarPosition.x, currentBarPosition.y, barWidth)
    if (options.timesignature) {
        stave.addTimeSignature(options.timesignature)
        currentTimeSig = options.timesignature
    }
    
    if (currentBarPosition.x === scoreLeftPosition) {
        stave.addClef("treble")
    }

    stave.setContext(context).draw()
    


    currentBarPosition.x += barWidth
    if (options.notes) {
      addNotes(stave, options.notes)
    }

    bars.push({
      timeSignature: currentTimeSig,
      positionX: currentBarPosition.x,
      positionY: currentBarPosition.y,
      notes: options.notes
    })
  },

  newLine () {
    currentBarPosition.y += verticalSpacing
    currentBarPosition.x = scoreLeftPosition
  },

  getNotesData () {
    return notesData
  },

  getBar(index) {
    return bars[index]
  }


}

