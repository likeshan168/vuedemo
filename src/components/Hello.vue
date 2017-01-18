<template>
  <div class="hello">
    <h1 v-text="title"></h1>
    <div id="andy" v-html="pro"></div>
    <input type="text" v-model.trim="newItem" @keydown.enter="addNew">
    <ol>
      <li v-for="(todo,index) in todos" :class="{finished:todo.finished}" @click="toggleFinish(todo)">{{todo.label}}:{{index}}</li>
    </ol>
    <p>msg from footer:{{childMsg}}</p>
    <!--<PageFooter msgfromfather='you die!' @child-tell-me-something="listen"></PageFooter>-->
    <PageFooter msgfromfather='you die!'></PageFooter>
    <One></One>
  </div>
</template>

<script>
  import Store from '../store';
  import PageFooter from './Footer';
  import One from './test/one'
  console.log(Store);
  export default {
    name: 'hello',
    data() {
      return {
        title: 'Todo List',
        pro: '<p>this is html</p>',
        todos: Store.getItems(),
        newItem: '',
        childMsg: ''

      }
    },
    events: {
      'child-tell-me-something': function (msg) {
        this.childMsg = msg;
      }
    },
    components: {
      PageFooter,
      One
    },
    watch: {
      todos: {
        handler: function (items) {
          Store.saveItems(items);
        },
        deep: true
      }
    },
    methods: {
      toggleFinish(item) {
        // this.todos[index].finished =  !this.todos[index].finished
        item.finished = !item.finished;
      },
      addNew() {
        if (this.newItem) {
          this.todos.push({
            label: this.newItem,
            finished: false
          });
          this.newItem = ''
        }
      },
      listen(msg) {
        this.childMsg = msg;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  font-style: italic;
}

/*ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}*/

a {
  color: #42b983;
}

#andy>p{
  background-color: red;
  font-size: 18px;
}
.finished{
  text-decoration: line-through;
  color:red
}
</style>