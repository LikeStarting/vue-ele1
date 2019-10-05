<template>
    <transition name="move">
        <div class="detailWrapper" ref="detailWrapper" v-show="showDetail">
            <div class="foodDetail">
                <div class="back" @click="toggleDetail">
                    <i class="icon-arrow_lift"></i>
                </div>
                <img :src="food.image" height="425" width="100%">
                <div class="info">
                    <div class="title">{{food.name}}</div>
                    <div class="desc">
                        <span>月售{{food.sellCount}}</span>
                        <span>好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="unit">￥</span>{{food.price}}
                        <span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="shopCart">
                        <transition name="fade">
                            <div class="text" v-show="!food.count" @click="addCart($event)">加入购物车</div>
                        </transition>
                    </div>
                    <cartcontrol :oneFood="food" @add-cart="sonDrop"></cartcontrol>
                </div>
                <div class="divider"></div>
                <div class="desc">
                    <div class="title">商品介绍</div>
                    <div class="content">{{food.info || '暂无介绍！'}}</div>
                </div>
                <div class="divider"></div>
                <div class="evaluation">
                    <div class="title">
                        商品评价
                    </div>
                    <div class="classify">
                        <div class="classify">
                            <span v-for="(item, index) in classifyArr" :class="{'item': true, 'active': item.active, 'bad': index == 2, 'badActive': item.active && index == 2}" :key="index" @click="filterEval(index)">
                                {{ item.name }}<span class="count">{{ item.count }}</span>
                            </span>
                        </div>
                    </div>
                    <div class="switch" @click="evalFlag = !evalFlag">
                        <span :class="['icon-check_circle', evalFlag ? 'on' : '']"></span>
                        <span class="text">只看有内容的评价</span>
                    </div>
                    <div class="eval-list">
                        <ul>
                            <li class="eval" v-for="(val, i) in evalArr" :key="i">
                                <div class="userInfo">
                                <div class="time">{{ val.rateTime | dateFormat }}</div>
                                <div class="user">
                                    <span>{{val.username}}</span>
                                    <span class="avatar"><img :src="val.avatar" width="12" height="12"></span>
                                </div>
                                </div>
                                <div class="content">
                                    <span class="icon" :class="val.rateType ? 'icon-thumb_down' : 'icon-thumb_up'"></span>
                                    <span class="text">{{val.text}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import cartcontrol from '@/components/CartControl.vue'
import BScroll from 'better-scroll'
export default {
    data() {
        return {
            showDetail: false,
            classifyArr: [
                {
                    name: '全部',
                    count: this.food.ratings.length,
                    active: true
                },
                {
                    name: '推荐',
                    count: this.food.ratings.filter(item => item.rateType === 0).length,
                    active: false
                },
                {
                    name: '吐槽',
                    count: this.food.ratings.filter(item => item.rateType === 1).length,
                    active: false
                }
            ],
            selectedIndex: 0,
            evalFlag: false
        }
    },
    props: {
        food: {}
    },
    computed: {
        evalArr () {
            if (this.selectedIndex === 1) {
                return this.food.ratings.filter(item => this.evalFlag ? (item.rateType == 0 && item.text) : item.rateType == 0)
            } else if (this.selectedIndex === 2) {
                return this.food.ratings.filter(item => this.evalFlag ? (item.rateType == 1 && item.text) : item.rateType == 1)
            }
            if (this.ratingScroll) {
                this.$nextTick(() => {
                    this.ratingScroll.refresh()
                })
            }
            return this.food.ratings.filter(item => this.evalFlag ? item.text : true)
        }
    },
    methods: {
        toggleDetail() {
            this.showDetail = !this.showDetail
            if(this.showDetail) {
                this.initScroll()
            }
        },
        initScroll() {
            this.$nextTick(() => {
                if(!this.ratingScroll) {
                    this.ratingScroll = new BScroll(this.$refs.detailWrapper, {
                        click: true
                    })
                } else {
                    this.ratingScroll.refresh()
                }
            })
        },
        addCart(event) {
            if(!event._constructed) {
                return
            }
            this.$set(this.food, 'count', 1)
            this.$emit('goodDrop', event.target)
        },
        sonDrop(target) {
            this.$emit('goodDrop', target)
        },
        filterEval (i) {
            this.selectedIndex = i
            this.classifyArr.forEach((item,index) => {
                if (i === index) {
                    item.active = true
                } else {
                    item.active = false
                }
            })
        }
    },
    components: {
        cartcontrol
    }
}
</script>
<style lang="scss" scoped>
    .detailWrapper {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 48px;
        width: 100%;
        background: #fff;
        &.move-enter, &.move-leave-to {
            opacity: 0;
            transform: translate3d(100%,0,0);
        }
        &.move-enter-active, &.move-leave-active {
            transition: all 0.5s ease;
        }
    }
    .foodDetail {
        .back {
            position: absolute;
            color: #fff;
            top: 12px;
            left: 6px;
            font-size: 20px;
            padding: 10px;
        }
        .info {
            position: relative;
            width: 100%;
            padding: 18px;
            box-sizing: border-box;
            .title {
                font-size: 14px;
                line-height: 14px;
                font-weight: 700;
                color: #07111b;
            }
            .desc {
                display: flex;
                padding: 0;
                padding-top: 8px;
                font-size: 10px;
                color: #93999f;
                line-height: 10px;
                span:last-child {
                    padding-left: 15px;
                }
            }
            .price {
                display: flex;
                padding-top: 18px;
                font-size: 14px;
                font-weight: 700;
                color: #f01414;
                line-height: 24px;
                .unit {
                    font-size: 10px;
                    font-weight: 400;
                }
                .oldPrice {
                    padding-left: 12px;
                    font-size: 10px;
                    font-weight: 400;
                    color: #93999f;
                    line-height: 24px;
                }                
            }
            .shopCart {
                position: absolute;
                right: 18px;
                bottom: 18px;
                height: 24px;
                text-align: center;
                z-index: 2;
                .text {
                    box-sizing: border-box;
                    height: 100%;
                    line-height: 24px;
                    color: #fff;
                    font-size: 10px;
                    padding: 0 12px;
                    border-radius: 12px;
                    background: #00a0dc;
                    &.fade-enter, &.fade-leave-to {
                        opacity: 0;
                    }
                    &.fade-enter-active, &.fade-leave-active {
                        transition: all 0.5s ease;
                    }
                }
            }
            .cartcontrol {
                position: absolute;
                right: 12px;
                bottom: 12px;
            }
        }
        & > .desc {
            padding: 18px;
            .title {
                font-size: 14px;
                font-weight: 500;
                color: #07111b;
                margin-bottom: 6px;
            }
            .content {
                font-size: 12px;
                font-weight: 200;
                color: #4d555d;
                line-height: 24px;
                padding: 0 8px;
            }
        }
        .evaluation {
            padding: 18px 0;
            position: relative;
            .title {
                padding-left: 18px;
                font-size: 14px;
                font-weight: 500;
                color: #07111b;
            }
            .classify {
                padding: 18px 0;
                margin: 0 18px;
                border-bottom: 1px solid rgba(7,17,27,.1);
                .item {
                    display: inline-block;
                    margin-right: 8px;
                    padding: 8px 12px;
                    line-height: 16px;
                    font-size: 12px;
                    color: #4d555f;
                    background: rgba(0,160,220,.2);
                    .count {
                        font-size: 12px;
                        padding-left: 2px;
                    }
                    &.bad {
                        background: rgba(77,85,93,.2);
                    }
                    &.active {
                        color: #fff;
                        background: #00a9dc;
                    }
                    &.badActive {
                        background: #4d555d;
                    }
                }
            }
            .switch {
                width: 100%;
                padding: 12px 0 12px 18px;
                font-size: 12px;
                color: #93999f;
                border-bottom: 1px solid rgba(7,17,27,.1);
                .icon-check_circle {
                    font-size: 24px;
                    vertical-align: middle;
                    &.on {
                        color: #00c850;
                    }
                }
            }
            .eval-list {
                margin: 0 18px;
                .eval {
                    padding: 16px 0;
                    border-bottom: 1px solid rgba(7,17,27,.1);
                    .userInfo {
                        display: flex;
                        color: #93999f;
                        font-size: 10px;
                        line-height: 12px;
                        .time {
                            flex: 1;
                        }
                        .user {
                            flex: 1;
                            text-align: right;
                            .avatar {
                                vertical-align: middle;
                                img {
                                    padding-left: 6px;
                                    border-radius: 50%;
                                }
                            }
                        }
                    }
                    .content {
                        padding-top: 6px;
                        .icon {
                            font-size: 12px;
                            line-height: 24px;
                            &.icon-thumb_up {
                                color: #00a0dc;
                            }
                            &.icon-thumb_down {
                                color: #93999f;
                            }
                        }
                        .text {
                            font-size: 12px;
                            color: #07111b;
                            line-height: 16px;
                            padding-left: 4px;
                        }
                    }
                }
            }
        }
    }
</style>