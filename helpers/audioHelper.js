let audioContext

function init () {
    audioContext  = new (window.AudioContext || window.webkitAudioContext)()
}

function playBeep(time, pitch = 200, type='sine') {
    let oscillator = audioContext.createOscillator()
    var gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.type = type 
    oscillator.frequency.value = pitch
    oscillator.start(time)
    oscillator.stop(time + 0.1)  
}

export default {
    context: ()  => audioContext,
    init,
    playBeep
}