<template>
    <div>
        <p>{{msg}}</p>
        <slot name="s1">
            there will be slot s1 content
        </slot>
        <slot>
            there will be default slot content
        </slot>
        <slot name="s2">
            there will be slot s2 content
        </slot>
        
    </div>
</template>

<script>
    export default {
        name: 'testtwo',
        data() {
            return {
                msg: 'this is a slot demo'
            }
        }
    }
</script>