<template>
    <div class="cartcontrol">
        <transition name="fadeRotate">
            <div class="cart-decrease" v-show="oneFood.count > 0" @click.stop.prevent="decreaseFood($event)">
                <span class="icon-remove_circle_outline inner"></span>
            </div>
        </transition>
        <div class="cart-count" v-show="oneFood.count > 0">
            {{ oneFood.count }}
        </div>
        <div class="cart-add" @click.stop.prevent="addFood($event)">
            <i class="icon-add_circle"></i>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    data () {
        return {}
    },
    props: ['oneFood'],
    methods: {
        addFood(event) {
            if(!event._constructed) {
                return
            }
            if(!this.oneFood.count) {
                Vue.set(this.oneFood, 'count', 0)
            }
            this.oneFood.count++
            this.$emit('add-cart', event.target)
        },
        decreaseFood(event) {
            if(!event._constructed || !this.oneFood.count) {
                return
            }
            this.oneFood.count--
        }
    }
}
</script>

<style lang="scss">
    .cartcontrol {
        .cart-decrease {
            display: inline-block;
            padding: 6px;
            .inner {
                line-height: 24px;
                font-size: 24px;
                color: #00a0dc;
                    display: inline-block;
            }
            &.fadeRotate-enter-active, &.fadeRotate-leave-active {
                transform: translate3d(0, 0, 0);
                transition: all .4s linear;
                .inner {
                    transition: all .4s linear;
                    transform: rotate(0);
                }
            }
            &.fadeRotate-enter, &.fadeRotate-leave-to {
                opacity: 0;
                transform: translate3d(24px, 0, 0);
                .inner {
                    transform: rotate(180deg);
                }
            }
        }
        .cart-count, .cart-add {
            display: inline-block;
            vertical-align: top;
            line-height: 24px;
        }
        .cart-count {
            padding: 6px 0;
            font-size: 12px;
            color: #93999f;
            text-align: center;
        }
        .cart-add {
            padding: 6px;
            font-size: 24px;
            color: #00a0dc;
        }
    }
</style>