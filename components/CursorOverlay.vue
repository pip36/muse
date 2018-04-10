<template>
<div>
  <canvas id="score-overlay" width="1220" height="500"> </canvas>
</div>
</template>

<script>

export default {
  name: 'cursorOverlay',
  props: ['audio', 'tempo'],
  data () {
    return {
      cursorTargetPosition: { x: 70, y: 10 },
      cursorPosition: 70,
      cursorUpdate: null,
      maxNoteDifference: 0,
      animationDuration: 1,
      lastFrameTime: 0,
      currentBar: 1
    }
  },

  mounted () {
    this.initCanvas()
  },

  methods: {
    start () {
      this.cursorUpdate = requestAnimationFrame(this.updateCursor) 
    },

    stop () {
      cancelAnimationFrame(this.cursorUpdate)
      this.currentBar = 1
      this.cursorPosition = 70
      this.cursorTargetPosition = { x: 70, y: 10 }
      this.maxNoteDifference = 0
      this.animationDuration = 1
      this.lastFrameTime = 0
      this.clearCanvas()
    },

    setCursorTarget(note) {
      let largeOffset = 80, smallOffset = 25
     
      if(note) {
        let target = note.positionX + ((this.currentBar - 1) * 400)
        this.currentBar === 1 ? target += largeOffset : target += smallOffset
        this.cursorTargetPosition.x = target  
      }   
    },

    updateAnimation (note) {
      this.setCursorTarget(note)
      this.maxNoteDifference = this.cursorTargetPosition.x - this.cursorPosition
      this.lastFrameTime = this.audio.context().currentTime
    },

    initCanvas () {
      var c=document.getElementById("score-overlay");
      var ctx=c.getContext("2d");
      this.setCursorTarget()
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,0,0,0.3)';
      ctx.fillRect(this.cursorPosition,this.cursorTargetPosition.y,20,20);    
    },

    clearCanvas () {
      var c=document.getElementById("score-overlay");
      var ctx=c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
    },

    updateCursor () {  
      let timeSinceLastFrame = this.audio.context().currentTime - this.lastFrameTime
      let distanceToMove = (timeSinceLastFrame/this.animationDuration) * this.maxNoteDifference
      let relativePosition = this.cursorTargetPosition.x - this.cursorPosition
      let height = Math.abs(relativePosition - (this.maxNoteDifference/2))
      
      this.cursorPosition += distanceToMove
      this.cursorTargetPosition.y = height/3 
      this.lastFrameTime = this.audio.context().currentTime

      this.clearCanvas()
      this.initCanvas()
      requestAnimationFrame(this.updateCursor)
    }
  }
}
</script>

<style>
 
</style>
