<template>
    <div class="ratings">
        <div class="ratingsWrapper" ref="ratingsWrapper">
            <div class="ratings-content">
                <div class="info">
                    <div class="mark">
                        <div class="num">{{ seller.score }}</div>
                        <div class="text">综合评分</div>
                        <div class="contrast">高于周边商家{{ seller.rankRate }}%</div>
                    </div>
                    <div class="stars">
                    <div class="serviceScore">
                        <span class="text">服务态度</span>
                        <star :size="36" :score="seller.serviceScore"></star>
                        <span class="num">{{ seller.serviceScore }}</span>
                    </div>
                    <div class="foodScore">
                        <span class="text">商品评分</span>
                        <star :size="36" :score="seller.foodScore"></star>
                        <span class="num">{{ seller.foodScore }}</span>
                    </div>
                    <div class="deliveryTime">
                        <span class="text">送达时间</span>
                        <span class="time">{{ seller.deliveryTime }}分钟</span>
                    </div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="evaluation">
                    <div class="classify">
                        <span v-for="(item, index) in classifyArr" :class="{'item': true, 'active': item.active, 'bad': index == 2, 'badActive': item.active && index == 2}" :key="index" @click="filterEval(index)">
                            {{ item.name }}<span class="count">{{ item.count }}</span>
                        </span>
                    </div>
                    <div class="switch" @click="evalFlag = !evalFlag">
                        <span :class="['icon-check_circle', evalFlag ? 'on' : '']"></span>
                        <span class="text">只看有内容的评价</span>
                    </div>
                    <div class="eval-list">
                        <ul>
                            <li class="eval" v-for="(item, index) in evalArr" :key="index">
                                <div class="avatar">
                                    <img :src="item.avatar" width="28" height="28">
                                </div>
                                <div class="content">
                                    <div class="user">
                                        <span class="name">{{ item.username }}</span>
                                        <span class="rateTime">{{ item.rateTime | dateFormat}}</span>
                                    </div>
                                    <div class="star-wrapper">
                                        <star :size="24" :score="item.score"></star>
                                        <span class="deliveryTime">{{ item.deliveryTime}}分钟送达</span>
                                    </div>
                                    <div class="text">
                                        {{ item.text }}
                                    </div>
                                    <div class="recommend">
                                        <span class="icon icon-thumb_up" v-show="item.recommend.length"></span>
                                        <span class="dish" v-for="(dish, i) in item.recommend" :key="i">{{ dish }}</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import star from '@/components/Star.vue'
import BScroll from 'better-scroll'

export default {
    data () {
        return {
            seller: {},
            ratings: [],
            classifyArr: [
                {
                    name: '全部',
                    count: 0,
                    active: true
                },
                {
                    name: '推荐',
                    count: 0,
                    active: false
                },
                {
                    name: '吐槽',
                    count: 0,
                    active: false
                },
            ],
            selectedIndex: 0,
            evalFlag: false
        }
    },
    created () {
        this.axios.get('assets/data.json').then(res => {
            this.seller = res.data.seller
            this.ratings = res.data.ratings
            this.initClassifyArr()
            this.$nextTick(() => {
                this.init()
            })
        })
    },
    computed: {
        evalArr () {
            if (this.selectedIndex === 1) {
                return this.ratings.filter(item => this.evalFlag ? (item.rateType == 0 && item.text) : item.rateType == 0)
            } else if (this.selectedIndex === 2) {
                return this.ratings.filter(item => this.evalFlag ? (item.rateType == 1 && item.text) : item.rateType == 1)
            }

            if (this.ratingScroll) {
                this.$nextTick(() => {
                    this.ratingScroll.refresh()
                })
            }
            return this.ratings.filter(item => this.evalFlag ? item.text : true)
        }
    },
    methods: {
        init () {
            this.ratingScroll = new BScroll(this.$refs.ratingsWrapper, {
                click: true
            })
        },
        initClassifyArr () {
            this.classifyArr.forEach((item, i) => {
                if (i === 0) {
                    item.count = this.ratings.length
                } else {
                    item.count = this.ratings.filter(val => val.rateType == i - 1).length
                }
            })
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
        star
    }
}
</script>

<style lang="scss" scoped>
    .ratingsWrapper {
        position: absolute;
        top: 174px;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        .info {
            display: flex;
            .mark {
                flex: 0 0 138px;
                margin: 18px 0;
                text-align: center;
                border-right: 1px solid rgba(7,17,27,.1);
                .num {
                    font-size: 24px;
                    color: #f90;
                    line-height: 28px;
                }
                .text {
                    padding: 6px 0 8px;
                    font-size: 12px;
                    color: #07111b;
                    line-height: 12px;
                }
                .contrast {
                    font-size: 10px;
                    color: #07111b;
                    line-height: 10px;
                    margin-bottom: 6px;
                }
            }
            .stars {
                padding: 18px 24px;
                .serviceScore, .foodScore, .deliveryTime {
                    display: flex;
                    margin-bottom: 8px;
                    .text {
                        font-size: 12px;
                        color: #07111b;
                        line-height: 18px;
                        margin-right: 12px;
                    }
                    .num {
                        padding-left: 12px;
                        font-size: 12px;
                        line-height: 18px;
                        color: #f90;
                    }
                }
                .deliveryTime {
                    margin-bottom: 0;
                    .time {
                        font-size: 12px;
                        line-height: 18px;
                        color: #93999f;
                    }
                }
            }
        }
        .divider {
            height: 16px;
            width: 100%;
            background: #f3f5f7;
            border-top: 1px solid rgba(7, 17, 27, 0.1);
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        }
        .evaluation {
            padding: 18px 0;
            position: relative;
            .classify {
                padding-bottom: 18px;
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
                .eval {
                    display: flex;
                    padding: 18px 0;
                    margin: 0 18px;
                    border-bottom: 1px solid rgba(7,17,27,.1);
                    .avatar {
                        flex: 0 0 28px;
                        margin-right: 12px;
                        img {
                            border-radius: 50%;
                        }
                    }
                    .content {
                        flex: 1;
                        .user {
                            font-size: 10px;
                            color: #07111b;
                            line-height: 12px;
                            position: relative;
                            .rateTime {
                                position: absolute;
                                font-weight: 200;
                                right: 0;
                                color: #93999f;
                            }
                        }
                        .star-wrapper {
                            font-size: 0;
                            padding-top: 4px;
                            margin-bottom: 6px;
                            .star {
                                display: inline-block;
                            }
                            .deliveryTime {
                                font-size: 12px;
                                padding-left: 6px;
                                font-weight: 200;
                                color: #93999f;
                            }
                        }
                        .text {
                            font-size: 12px;
                            color: #07111b;
                            line-height: 18px;
                        }
                        .recommend {
                            padding-top: 4px;
                            .icon {
                                font-size: 12px;
                                line-height: 16px;
                                color: #00a0dc;
                            }
                            .dish {
                                display: inline-block;
                                margin-top: 4px;
                                margin-right: 8px;
                                padding: 2px 6px;
                                font-size: 12px;
                                line-height: 16px;
                                color: #93999f;
                                border: 1px solid rgba(7,17,27,.1);
                            }
                        }
                    }
                }
            }
        }
    }
</style>