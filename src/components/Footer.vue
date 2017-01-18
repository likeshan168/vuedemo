<template>
    <div>
        <h1>{{msgfromfather}}</h1>
        <footer>{{text}}</footer>
        <button @click="showMsg">show msg</button>
    </div>

</template>
<script> 
    export default {
        name: 'footer',
        data() {
            return {
                text: 'this is footer'
            }
        },
        methods: {
            showMsg() {
                console.log(this.msgfromfather);
                this.$emit('child-tell-me-something', this.text);
                console.log(this);
                this.$dispatch('child-tell-me-something', this.text);
            }
        },
        props: ['msgfromfather']
    }
</script>