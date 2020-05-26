<template>
  <div class="home">
    <div id="read"></div>
    <span class="icon-bookmark"></span>
  </div>
</template>

<script>
import Epub from 'epubjs'

export default {
  name: 'Home',
  components: {},
  methods: {
    showEpub () {
      this.book = new Epub('./2018_Book_AgileProcessesInSoftwareEngine.epub')
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight
      })
      this.rendition.display()
    }
  },
  mounted () {
    this.showEpub()
  }
}
</script>
