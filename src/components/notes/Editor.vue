<template>
    <div id="note-editor">
        <input type="text" :value="title" @change="editTitle" class="form-control title">
        <br/>
        <textarea :value="text"  @change="editNote" class="form-control">
        </textarea>
    </div>
</template>

<script>
    import { mapGetters, mapActions, mapState } from 'vuex'

    export default {
        computed: {
            // ...mapGetters({
            //     activeNote:'activeNote'
            // }),
            //  ...mapState({
            //     title: state => state.activeNote.title,
            //     text: state => state.activeNote.text
            // })
            text: {
                get() {
                    return this.$store.getters.activeNote.text
                },
                // set(value) {
                //     this.$store.commit('EDIT_NOTE', value)
                // }
            },
            title: {
                get() {
                    return this.$store.getters.activeNote.title
                },
                // set(value) {
                //     this.$store.commit('EDIT_TITLE', value)
                // }
               
            }
        },
        methods: mapActions([
            'editNote',
            'editTitle',
        ])
        
    }
</script>

<style scoped>
.title{
    border-left: 0px;
    border-right: 0px;
    border-top: 0px;
}
</style>