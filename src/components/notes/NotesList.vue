<template>
    <div id="notes-list">
        <div id="list-header">
            <h2>Notes|coligo</h2>
            <!--search-->
            <div class="container">
                <input type="text" v-model="searchWord" class="form-control">
            </div>
            <div class="btn-group btn-group-justified" role="group">
                <!-- All Notes button -->
                <div class="btn-group" role="group">
                    <button type="button" @click="show='all'" :class="{active:show==='all'}" class="btn btn-default">
                        All Notes
                    </button>
                </div>
                <!-- Favorites Button -->
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-default" @click="show = 'favorites'" :class="{active: show === 'favorites'}">
                        Favorites
                    </button>
                </div>
            </div>
        </div>

        <!-- render notes in a list -->
        <div class="container">
            <div class="list-group">
                <a v-for="note in filteredNotes" class="list-group-item" href="#" :class="{active: activeNote === note}" @click="updateActiveNote(note)">
                    <h4 class="list-group-item-heading">
                        {{note.title}}
                    </h4>
                </a>
                <nav v-if="showPagination">
                    <ul class="pagination">
                        <li v-if="showPrePage"><a href="#" @click="prePage">&laquo;</a></li>
                        <li v-for="pageNum in pageNums" :class="{active: pageNum === currentPage}"><a href="#" @click="getSpecifiedPage">{{pageNum}}</a></li>
                        <li v-if="showNextPage"><a href="#" @click="nextPage">&raquo;</a></li>
                    </ul>
                </nav>
            </div>
        </div>

    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';
    import 'lodash'
    export default {
        data() {
            return {
                show: 'all',
                searchWord: '',
                pageNums: [1, 2, 3, 4, 5],
                currentPage: 1,
                showPagination: true
            }
        },
        computed: {

        ...mapGetters({
                activeNote:'activeNote',
                notes: 'allNotes'
            }),
            showPrePage() {
                return this.currentPage > _.min(this.pageNums);
            },
            showNextPage() {
                return this.currentPage < _.max(this.pageNums);
            },

            filteredNotes() {
                let ns = this.notes;
                let word = this.searchWord;
                let totalPages = 0;
                let result;
                if (this.show === 'all') {
                    if (word) {
                        result = _.chain(this.notes).filter(note => _.includes(note.title, word));
                    } else {
                        result = _.chain(ns);
                    }

                } else if (this.show === 'favorites') {
                    if (word) {
                        result = _.chain(this.notes).filter(note => note.favorite && _.includes(note.title, word));
                    } else {
                        result = _.chain(this.notes).filter(note => note.favorite);
                    }

                }
                totalPages = result.size().value();
                let pages = Math.floor(totalPages / 5);
                this.showPagination = pages > 0;
                this.pageNums = []
                for (let i = 1; i <= pages + 1; i++) {
                    this.pageNums.push(i);
                }
                let tst;
                tst = result.take(this.currentPage * 5).reject((rst, index) => {
                    if (index < ((this.currentPage - 1) * 5))
                        return rst;
                }).value();
                return tst;
            }
        },

        methods: {
            ...mapActions({
                updateActiveNote: 'setActiveNote' 
            }),
            getSpecifiedPage(e) {
                this.currentPage = +e.target.text;
                console.log(e.target.text);
            },
            nextPage(e) {
                this.currentPage++;
            },
            prePage(e) {
                this.currentPage--;
            }
        }
    }
</script>