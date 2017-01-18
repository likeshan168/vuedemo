<template>
    <div>
        <input type="text">
        <input type="text" v-focus>
    </div>

</template>
<script>
    export default {
        directives: {
            focus: {
                inserted: function (el) {
                    // 聚焦元素
                    el.focus()
                }
            }
        }
    }
</script>