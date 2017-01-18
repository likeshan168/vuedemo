const _notes = [
    {
        title:'one',
        text: 'test note1',
        favorite: false
    },
    {
        title:'two',
        text: 'test note2',
        favorite: false
    },
    {
        title:'three',
        text: 'test note3',
        favorite: false
    },
    {
        title:'four',
        text: 'test note4',
        favorite: false
    },
    {
        title:'five',
        text: 'test note5',
        favorite: false
    },
    {
        title:'six',
        text: 'test note6',
        favorite: false
    },
    {
        title:'seven',
        text: 'test note7',
        favorite: false
    },
    {
        title:'eight',
        text: 'test note8',
        favorite: false
    },
    {
        title:'nine',
        text: 'test note9',
        favorite: false
    },
    {
        title:'ten',
        text: 'test note10',
        favorite: false
    },
    {
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