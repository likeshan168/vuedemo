<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<hello2></hello2>-->
    <!--<two>
      <div slot="s1">
        it will replace the slot s1
      </div>
      <div slot="s2">
        it will replace the slot s2
      </div>
      <div>
        it will replace the default slot
      </div>
    </two>
    <Three :level="1">hello</Three>
    <Three :level="2">hello</Three>
    <Three :level="3">hello</Three>
    <four></four>-->
    <toolbar></toolbar>
    <notes-list></notes-list>
    <editor></editor>
  </div>
</template>

<script>
  // import Hello2 from './components/Hello'
  // import Two from './components/test/two'
  // import Three from './components/test/three'
  // import Four from './components/test/four'
  // export default {
  //   name: 'app',
  //   components: {
  //     Hello2,
  //     Two,
  //     Three,
  //     Four
  //   }
  // }
  import Toolbar from './components/notes/Toolbar.vue'
  import NotesList from './components/notes/NotesList.vue'
  import Editor from './components/notes/Editor.vue'

  export default {
    components: {
      Toolbar,
      NotesList,
      Editor
    }
  }
</script>

<style>
/*#test {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
@import url(https://fonts.googleapis.com/css?family=Raleway:400,300);

html, #app {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  border: 0;
  height: 100%;
  max-height: 100%;
  position: relative;
}

#toolbar {
  float: left;
  width: 80px;
  height: 100%;
  background-color: #30414D;
  color: #767676;
  padding: 35px 25px 25px 25px;
}

#notes-list {
  float: left;
  width: 300px;
  height: 100%;
  background-color: #F5F5F5;
  font-family: 'Raleway', sans-serif;
  font-weight: 400;
}

#list-header {
  padding: 5px 25px 25px 25px;
}

#list-header h2 {
  font-weight: 300;
  text-transform: uppercase;
  text-align: center;
  font-size: 22px;
  padding-bottom: 8px;
}

#notes-list .container {
  height: calc(100% - 137px);
	max-height: calc(100% - 137px);
	overflow: auto;
  width: 100%;
  padding: 0;
}

#notes-list .container .list-group-item {
  border: 0;
  border-radius: 0;
}

.list-group-item-heading {
  font-weight: 300;
  font-size: 15px;
}

#note-editor {
  height: 100%;
  margin-left: 380px;
}

#note-editor textarea {
  height: 100%;
  border: 0;
  border-radius: 0;
}

#toolbar i {
  font-size: 30px;
  margin-bottom: 35px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.5s ease;
}

#toolbar i:hover {
  opacity: 1;
}

.starred {
  color: #F7AE4F;
}
</style>