const TODO_KEY = 'todo_items';
export default {
    getItems() {
        return JSON.parse(window.localStorage.getItem(TODO_KEY) || '[]');
    },
    saveItems(items) {
        window.localStorage.setItem(TODO_KEY, JSON.stringify(items));
    }
}
