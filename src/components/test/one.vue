<template>
    <div>
        <span>{{message}}</span>
        <span>{{textContent}}</span>
        <button @click="changeMsg">changeMsg</button>
        <!--<transition name="custom-classes-transition" enter-active-class="animated tada" leave-active-class="animated bounceOutRight">
            <p v-if="show">hello</p>
        </transition>-->
        <!--<transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave" v-bind:css="false">
            <p v-if="show">
                Demo
            </p>
        </transition>-->
        <input type="radio" id="A" value="A" v-model="checkedcomps">
        <label for="A">A</label>
        <input type="radio" id="B" value="B" v-model="checkedcomps">
        <label for="B">B</label>

        <transition name="component-fade" mode="out-in">
            <component v-bind:is="view"></component>
        </transition>

        <button v-on:click="shuffle">Shuffle</button>
        <button v-on:click="add">Add</button>
        <button v-on:click="remove">Remove</button>
        <transition-group name="list-complete" tag="p">
            <span v-for="item in items" v-bind:key="item" class="list-complete-item">
                {{ item }}
            </span>
        </transition-group>
    </div>
</template>
<script>
    export default {
        name: 'one',
        data() {
            return {
                message: 123,
                textContent: '',
                show: true,
                view: 'v-a',
                checkedcomps: 'A',
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                nextNum: 10
            }
        },
        components: {
            'v-a': {
                template: '<div>Component A</div>'
            },
            'v-b': {
                template: '<div>Component B</div>'
            }
        },
        watch: {
            checkedcomps: function (newValue, oldValue) {
                let vm = this;
                vm.view = newValue === 'A' ? 'v-a' : 'v-b';
            }
        },
        methods: {
            changeMsg() {
                this.message = "hello world";
                // console.log(this.$el.textContent);
                this.show = !this.show;
                this.$nextTick(function () {
                    // console.log(this.$el.textContent);
                    console.log(this.checkedcomps);
                    this.textContent = 'waiting for updating...';
                })
            },
            beforeEnter: function (el) {
                el.style.opacity = 0
                el.style.transformOrigin = 'left'
            },
            enter: function (el, done) {
                Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
                Velocity(el, { fontSize: '1em' }, { complete: done })
            },
            leave: function (el, done) {
                Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
                Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
                Velocity(el, {
                    rotateZ: '45deg',
                    translateY: '30px',
                    translateX: '30px',
                    opacity: 0
                }, { complete: done })
            },
            randomIndex: function () {
                return Math.floor(Math.random() * this.items.length)
            },
            add: function () {
                this.items.splice(this.randomIndex(), 0, this.nextNum++)
            },
            remove: function () {
                this.items.splice(this.randomIndex(), 1)
            },
            shuffle: function () {
                this.items = _.shuffle(this.items)
            }
        }
    }
</script>

<style>
    /*.fade-enter-active, .fade-leave-active {
        transition: opacity 1s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }*/
  
  /*.slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-active {
        transform: translateX(10px);
        opacity: 0;
    }*/

    .bounce-enter-active {
        animation: bounce-in .5s;
    }
    .bounce-leave-active {
        animation: bounce-out .5s;
    }
    @keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.5);
    }
    100% {
        transform: scale(1);
    }
    }
    @keyframes bounce-out {
    0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.5);
        }
        100% {
            transform: scale(0);
        }
    }

    .list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-active {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>