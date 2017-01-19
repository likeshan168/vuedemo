const _notes = [
    {
        catetory:'vue',
        title:'one',
        text: 'test note1',
        favorite: false
    },
    {
        catetory:'vue',
        title:'two',
        text: 'test note2',
        favorite: false
    },
    {
        catetory:'angular2',
        title:'three',
        text: 'test note3',
        favorite: false
    },
    {
        catetory:'angular2',
        title:'four',
        text: 'test note4',
        favorite: false
    },
    {
        catetory:'angular2',
        title:'five',
        text: 'test note5',
        favorite: false
    },
    {
        catetory:'angular2',
        title:'six',
        text: 'test note6',
        favorite: false
    },
    {
        catetory:'angular2',
        title:'seven',
        text: 'test note7',
        favorite: false
    },
    {
        catetory:'angular2',
        title:'eight',
        text: 'test note8',
        favorite: false
    },
    {
        catetory:'angular2',
        title:'nine',
        text: 'test note9',
        favorite: false
    },
    {
        catetory:'',
        title:'ten',
        text: 'test note10',
        favorite: false
    },
    {
        catetory:'',
        title:'eleven',
        text: 'test note11',
        favorite: false
    },
]
//公开api接口
export default {
    getNotes(cb) {
        setTimeout(() => cb(_notes), 100);
    }
}