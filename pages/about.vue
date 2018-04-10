<template>
  <section class="container">
    <div>
      <div class="links">
        <nuxt-link to="/" class="button--green"> Home </nuxt-link>
      </div>
      <h1 class="title">
        Music Test
      </h1>
    
      <metronome ref="clickTrack" :audio="audio" :tempo="tempo"> </metronome>
 
      <input v-model="tempo" type="range" min=40 max=200>
      <button v-if="!isPlaying" class="button button--green" @click="startPlayback()"> Play </button>
      <button v-if="isPlaying" class="button button--green" @click="reset()"> Stop </button>
      <div class="score-container">
        <cursor-overlay ref="overlay" :audio="audio" :tempo="tempo" :currentBar="currentBar"></cursor-overlay>
        <div id="score"></div>
      </div>
 
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import Score from '~/helpers/musicscore.js'
import Audio from '~/helpers/audioHelper.js'
import Metronome from '~/components/Metronome.vue'
import CursorOverlay from '~/components/CursorOverlay.vue'

export default {
  components: {
    Logo,
    Metronome,
    CursorOverlay
  },
  transition: 'about',
  data () {
    return {
      tempo: 60,
      nextNoteTime: 0,
      notes: [],
      currentNote: 0,
      currentBar: 1,
      playbackLoop: null,
      audio: null,
      noteQueue: [],
      noteValueSum: 0,
      isPlaying: false
    }
  },

  mounted () {
    this.audio = Audio
    this.loadScore() 
    this.setNoteData()
  },

  methods: { 
    loadScore () {
      let testNotes = ['c/4|4', 'd/4|4','e/4|4','d/4|4']
      let testQuavers = ['c/4|8', 'd/4|8','e/4|8','d/4|8','c/4|8', 'd/4|8','e/4|8','d/4|8']
      let testSemiQuavers = ['c/4|16', 'd/4|16','e/4|16','d/4|16','c/4|16', 'd/4|8','d/4|16',
                             'c/4|16', 'd/4|16','e/4|16','d/4|8','d/4|16','e/4|16','d/4|16']
      let testNotes2 = ['e/4|4','e/4|4', 'f/4|16', 'f/4|16', 'f/4|16', 'f/4|16', 'e/4|4']
      Score.init('score', 1220, 500)
      Score.drawBar({ timesignature: '4/4', notes: testNotes2 })
      Score.drawBar({notes: testQuavers})
      Score.drawBar({notes: testSemiQuavers})
      Score.newLine()
      Score.drawBar({notes: testNotes})
    },

    setNoteData () {
      this.notes = Score.getNotesData().map((note) => ({ positionX: note.tickContext.x, duration: note.duration }))
    },

    startPlayback () {
      this.isPlaying = true
      this.audio.init()
      this.audio.playBeep(this.nextNoteTime, 600)
      this.playbackLoop = window.setInterval(this.scheduler, 50.0)
      this.$refs.clickTrack.start()
      this.$refs.overlay.start()
    },

    scheduler () {
      while(this.nextNoteTime < this.audio.context().currentTime + 0.1) {

        if(this.currentNote > this.notes.length - 1) {   
          this.reset()
          return 
        }
   
        if(this.noteQueue[0]) {
          let secondsPerBeat = 60/this.tempo
          let noteDurationInBeats = 4/this.noteQueue[0].duration

          this.$refs.overlay.animationDuration = (4/this.notes[this.currentNote].duration) * (60/this.tempo)
          this.noteQueue.shift()
          this.nextNoteTime += noteDurationInBeats * secondsPerBeat
          this.noteValueSum += noteDurationInBeats
          let barTotalTime = Score.getBar(this.currentBar - 1).timeSignature.split('/')[0]

          if(this.noteValueSum === Number(barTotalTime)) {
            this.currentBar++
            this.$refs.overlay.currentBar++
            this.noteValueSum = 0
          }

          this.audio.playBeep(this.nextNoteTime, 600)
          this.currentNote++
        }
    
        this.noteQueue.push(this.notes[this.currentNote])   
        this.$refs.overlay.updateAnimation(this.noteQueue[0]) 
      }
    },

    reset () {
      this.isPlaying = false
      clearInterval(this.playbackLoop)
      this.$refs.overlay.stop()
      this.$refs.clickTrack.stop()

      this.currentNote = 0
      this.nextNoteTime = 0
      this.currentBar = 1
      this.noteQueue = []
      this.noteValueSum = 0

      this.audio.context().close()
    },

  }

}
</script>

<style>
.container
{
  min-height: 100vh;
 
}
.title
{
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.subtitle
{
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.
.score-container
{
  position: relative;
}
#score-overlay
{
  position: absolute;
  border: 1px solid red;
}
#score
{
  position: absolute;
  border: 1px solid green;
}
</style>
