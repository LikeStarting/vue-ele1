<template>
    <div class="star" :class="starType">
        <span v-for="(itemClass, index) in itemClasses" class="star-item" :class="itemClass" :key="index"></span>
    </div>
</template>

<script>
const LENGTH = 5
const CLS_ON = 'on'
const CLS_OFF = 'off'
const CLS_HALF = 'half'

export default {
    data () {
        return  {}
    },
    props: {
        size: {
            type: Number
        },
        score: {
            type: Number
        }
    },
    computed: {
        starType() {
            return 'star-' + this.size
        },
        itemClasses() {
            let result = [];
            let score = Math.floor(this.score * 2) / 2;
            for(let i = 0; i < Math.floor(score); i++) {
                result.push(CLS_ON)
            }
            if(score % 1 !== 0) {
                result.push(CLS_HALF)
            }
            while(result.length < LENGTH) {
                result.push(CLS_OFF)
            }
            return result
        }
    }
}
</script>

<style lang="scss">
    @import '@/common/scss/mixin';

    .star {
        .star-item {
            display: inline-block;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        &.star-48 {
            .star-item {
                width: 20px;
                height: 20px;
                margin-right: 22px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    @include bg-image('../assets/img/stars/star48_on');
                }
                &.half {
                    @include bg-image('../assets/img/stars/star48_half');
                }
                &.off {
                    @include bg-image('../assets/img/stars/star48_off');
                }
            }
        }
        &.star-36 {
            .star-item {
                width: 15px;
                height: 15px;
                margin-right: 6px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    @include bg-image('../assets/img/stars/star36_on');
                }
                &.half {
                    @include bg-image('../assets/img/stars/star36_half');
                }
                &.off {
                    @include bg-image('../assets/img/stars/star36_off');
                }
            }
        }
        &.star-24 {
            .star-item {
                width: 10px;
                height: 10px;
                margin-right: 3px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    @include bg-image('../assets/img/stars/star24_on');
                }
                &.half {
                    @include bg-image('../assets/img/stars/star24_half');
                }
                &.off {
                    @include bg-image('../assets/img/stars/star24_off');
                }
            }
        }
    }
</style>