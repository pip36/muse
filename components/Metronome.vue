<template>
  <div class="metronome">
    Tempo: {{ tempo }}
    {{ currentBeat }}
    On/Off: <input type="checkbox" v-model="isActive"/>
  </div>
</template>

<script>

export default {
  name: 'metronome',
  props: ['audio', 'tempo', 'active'],
  data () {
    return {
      currentBeat: 0,
      beatsPerBar: 4,
      beatValue: 4,
      nextBeatTime: 0,
      playbackInterval: null,
      clickQueue: [0],
      isActive: false
    }
  },

  methods: {
    start() {
      if(this.isActive) this.audio.playBeep(this.nextBeatTime, 300, 'square')
      this.playbackInterval = setInterval(this.scheduler, 50)
    },

    stop () {
      this.nextBeatTime = 0
      this.currentBeat = 0
      this.clickQueue = [0]
      clearInterval(this.playbackInterval)
    },

    scheduler () {
    
      while (this.nextBeatTime < this.audio.context().currentTime + 0.1 && this.isActive) {
        let secondsPerBeat = 60/this.tempo
        this.nextBeatTime += secondsPerBeat
        
        this.currentBeat === this.beatsPerBar - 1 ? this.audio.playBeep(this.nextBeatTime, 300, 'square') : this.audio.playBeep(this.nextBeatTime,200, 'square')
        this.clickQueue.shift()
        this.currentBeat++
      
        if(this.currentBeat > this.beatsPerBar) this.currentBeat = 1
        
        this.clickQueue.push(this.currentBeat)
      }
    }
  }
}
</script>

<style>
  .metronome{
    border: 5px solid goldenrod;
  }
</style>
