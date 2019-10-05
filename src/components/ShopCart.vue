<template>
<div>
    <div class="shopcart" >
        <div class="content">
            <div class="content-left" @click="toggleLists">
                <div class="logo-wrapper">
                    <div class="badge" ref="badge" v-show="totalCounts > 0">{{ totalCounts }}</div>
                    <div :class="['logo', allPrice > 0 ? 'active' : '']">
                        <i class="icon-shopping_cart"></i>
                    </div>
                </div>
                <div :class="['price', allPrice > 0 ? 'active' : '']">￥{{ allPrice }}</div>
                <div class="desc">另需要配送费￥{{ deliveryPrice }}元</div>
            </div>
            <!-- <div :class="['content-right', allPrice >= minPrice ? 'enough' : '']">
                ￥{{ minPrice }}起送
            </div> -->
            <div class="content-right" v-if="!allPrice">
                ￥{{ minPrice }}起送
            </div>
            <div class="content-right" v-else-if="allPrice < minPrice">
                还差￥{{ minPrice - allPrice }}元
            </div>
            <div class="content-right enough" v-else>
                去结算
            </div>
        </div>
        <div class="ball-container">
            <transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter" v-for="(item, index) in balls" :key="index">
                <div class="ball" v-show="item.show"></div>
            </transition>
        </div>
        <transition name="transHeight">
            <div class="shopcart-list" v-show="showLists">
                <div class="list-header">
                    <h2 class="title">购物车</h2>
                    <span class="empty" @click="setEmpty">清空</span>
                </div>
                <div class="list-content" ref="foodslist">
                    <ul>
                        <li class="food" v-for="(item, index) in selectedFoods" :key="index">
                            <span class="name">{{ item.name }}</span>
                            <div class="price">
                                <span>￥{{ item.price * item.count }}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :oneFood="item" @add-cart="drop"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
    <transition name="transDrop">    
        <div class="backdrop" v-show="showDrop" @click="hideDrop"></div>
    </transition>
</div>
</template>

<script>
import cartcontrol from '@/components/CartControl.vue'
import BScroll from 'better-scroll'
export default {
    data() {
        return {
            showLists: false,
            balls: [
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                }
            ],
            dropedBalls: []
        }
    },
    props: {
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        },
        selectedFoods: {
            type: Array,
            default: []
        }
    },
    computed: {
        allPrice() {
            return this.selectedFoods.reduce((pre, cur) => {
                return pre + cur.price * cur.count
            }, 0)
        },
        totalCounts() {
            return this.selectedFoods.reduce((pre, cur) => {
                return pre + cur.count
            }, 0)
        },
        showDrop() {
            if(this.showLists && this.totalCounts) {
                return true
            }
            this.showLists = false
            return false
        }
    },
    methods: {
        toggleLists() {
            if (!this.selectedFoods.length) {
                return
            }
            this.showLists = !this.showLists
            if(this.showLists) {
                this.$nextTick(() => {
                    if (!this.listScroll) {
                        this.initScroll()
                    } else {
                        this.listScroll.refresh()
                    }
                })
                
            }        
        },
        initScroll() {
            this.listScroll = new BScroll(this.$refs.foodslist, {
                click: true
            })
        },
        hideDrop() {
            this.showLists = false
        },
        setEmpty() {
            this.selectedFoods.forEach( item => {
                item.count = 0
            })
        },
        drop(el) {
            for(let i = 0; i < this.balls.length; i++) {
                let ball = this.balls[i]
                if(!ball.show) {
                    ball.show = true;
                    ball.el = el
                    this.dropedBalls.push(ball)              
                    return
                }
            }
        },
        beforeEnter(el) {
            let length = this.balls.length
            while(length--) {
                let curBall = this.balls[length]
                if(curBall.show) {
                    let starRec = curBall.el.getBoundingClientRect()
                    let endRec = this.$refs.badge.getBoundingClientRect()
                    let x = starRec.left - endRec.left
                    let y = starRec.top - endRec.top
                    el.style.transform = `translate3d(${x}px,${y}px,0)`
                    el.style.webkitTransform = `translate3d(${x}px,${y}px,0)`
                }
            }
        },
        enter(el, done) {
            el.offsetWidth
            this.$nextTick(() => {
                el.style.transition = 'all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)'
                el.style.transform = 'translate3d(0,0,0)'
                el.style.webkitTransform = 'translate3d(0,0,0)'
                // done()
                el.addEventListener('transitionend', done)
            })
        },
        afterEnter(el) {
            el.style.display = 'none'
            let ball = this.dropedBalls.shift()
            if(ball) {
                ball.show = false
                ball.el = null
            }
        }
    },
    components: {
        cartcontrol
    }
}
</script>

<style lang="scss" scoped>
    .shopcart {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 48px;
        z-index: 50;
        .content {
            display: flex;
            background: #141d27;
            .content-left {
                flex: 1;
                height: 48px;
                .logo-wrapper {
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    height: 56px;
                    line-height: 56px;
                    border-radius: 50%;
                    width: 56px;
                    top: -10px;
                    background: #141d27;
                    margin: 0 12px;
                    padding: 6px;
                    box-sizing: border-box;
                    text-align: center;
                    .logo {
                        width: 100%;
                        height: 100%;
                        background: #2b343c;
                        border-radius: 50%;
                        font-size: 24px;
                        color: #80858a;
                        line-height: 44px;
                        font-weight: 700;
                        &.active {
                            background: #00a0dc;
                            color: #fff;
                        }
                    }
                    .badge {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 24px;
                        height: 16px;
                        line-height: 16px;
                        font-size: 9px;
                        font-weight: 700;
                        border-radius: 16px;
                        text-align: center;
                        color: #fff;
                        background: #f01414;
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,.4);
                    }
                }
                .price {
                    display: inline-block;
                    margin-top: 12px;
                    padding-right: 12px;
                    vertical-align: top;
                    font-size: 16px;
                    box-sizing: border-box;
                    font-weight: 700;
                    line-height: 24px;
                    color: hsla(0,0%,100%,.4);
                    border-right: 1px solid hsla(0,0%,100%,.1);
                    &.active {
                        color: #fff;
                    }
                }
                .desc {
                    position: relative;
                    display: inline-block;
                    vertical-align: top;
                    margin: 12px 0 0 12px;
                    font-size: 10px;
                    font-weight: 700;
                    line-height: 24px;
                    color: hsla(0,0%,100%,.4);
                }
            }
            .content-right {
                flex: 0 0 105px;
                font-size: 12px;
                font-weight: 700;
                background: #2b343c;
                color: hsla(0,0%,100%,.4);
                line-height: 48px;
                text-align: center;
                &.enough {
                    background: #00b43c;
                    color: #fff;
                }
            }
        }
        .shopcart-list {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background: #fff;
            z-index: -1;
            transform: translate3d(0,-100%,0);
            &.transHeight-enter-active, &.transHeight-leave-active {
                transition: all 0.5s ease;
            }
            &.transHeight-enter, &.transHeight-leave-to {
                transform: translate3d(0,0,0);
            }
            .list-header {
                height: 40px;
                line-height: 40px;
                background: #f3f5f7;
                border-bottom: 1px solid rgba(7,17,27,.1);
                .title {
                    display: inline-block;
                    font-size: 14px;
                    font-weight: 200;
                    color: #07111b;
                    padding-left: 18px;
                }
                .empty {
                    position: absolute;
                    right: 8px;
                    font-size: 12px;
                    color: #00a0dc;
                    padding: 0 10px;
                }
            }
            .list-content {
                max-height: 217px;
                overflow: hidden;
                .food {
                    position: relative;
                    display: flex;
                    height: 48px;
                    margin: 0 18px;
                    border-bottom: 1px solid rgba(7,17,27,.1);
                    .name {
                        flex: 1;
                        font-size: 14px;
                        line-height: 48px;
                        color: #07111b;
                        font-weight: 700;
                    }
                    .price {
                        padding: 0 12px 0 18px;
                        font-size: 14px;
                        font-weight: 700;
                        color: #f01414;
                        line-height: 48px;
                    }
                    .cartcontrol-wrapper {
                        font-size: 14px;
                        margin-top: 6px;
                    }
                }
            }
        }
    }
    .ball-container {
        .ball {
            position: absolute;
            left: 32px;
            bottom: 22px;
            z-index: 200;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: rgb(0,160,220);
        }
    }
    .backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(7,17,27,.6);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        z-index: 40;
        &.transDrop-enter, &.transDrop-leave-to {
            opacity: 0;
        }
        &.transDrop-enter-active, &.transDrop-leave-active {
            transition: all 0.5s;
        }
    }
</style>