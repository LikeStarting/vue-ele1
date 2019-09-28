<template>
    <div class="seller-wrapper" ref="sellerWrapper">
        <div class="seller-content">
            <div class="info">
                <div class="title">
                    <div class="text">{{ seller.name }}</div>
                    <div class="star-wrapper">
                        <star :size="36" :score="seller.score"></star>
                        <span class="rate-count">({{ seller.ratingCount }})</span>
                        <span class="sell-count">月售{{ seller.sellCount }}单</span>
                    </div>
                    <div class="collect" @click="collectflag=!collectflag">
                        <span class="icon-favorite" :class="{'active':collectflag}"></span>
                        <span class="text">{{ collectflag ? '已收藏' : '收藏' }}</span>
                    </div>
                </div>
                <div class="remark">
                    <div class="block">
                        <h2>起送价</h2>
                        <div class="content">
                            <span class="num">{{ seller.minPrice }}</span>元
                        </div>
                    </div>
                    <div class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                        <span class="num">{{ seller.deliveryPrice }}</span>元
                        </div>
                    </div>
                    <div class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="num">{{ seller.deliveryTime }}</span>分钟
                        </div>
                    </div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="activities">
                <div class="bulletin">
                    <h2>公告与活动</h2>
                    <div class="content">{{ seller.bulletin }}</div>
                </div>
            </div>
            <div class="supports">
                <ul>
                    <li class="item" v-for="(item,index) in seller.supports" :key="index">
                        <span :class="['iconMap', iconClassMap[item.type]]"></span>
                        <span class="text">{{ item.description }}</span>
                    </li>
                </ul>
            </div>
            <div class="divider"></div>
            <div class="seller-imgs">
                <h2>商家实景</h2>
                <div class="img-wrapper" ref="imgWrapper">
                    <div class="img-lists" ref="picList">
                        <img v-for="(pic,index) in seller.pics" :src="pic" :key="index" width="120" height="90">
                    </div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="seller-info">
                <h2>商家信息</h2>
                <ul class="info-list">
                    <li class="info" v-for="(info,index) in seller.infos" :key="index">{{ info }}</li>
                </ul>
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
            collectflag: false,
            iconClassMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'] 
        }
    },
    created() {
        this.axios.get('assets/data.json').then(res => {
            this.seller = res.data.seller
            this.$nextTick(() => {
                this.initBScroll()                         
            })
        })
    },
    methods: {
        calculateImgListsWidth() {
            const marginRight = 6
            let imgLists = this.$refs.picList
            let imgListsArr = Array.from(imgLists.querySelectorAll('img'))
            let widthArr = imgListsArr.map( (item,i, arr) => {
                if(i < arr.length - 1) {
                    return item.clientWidth + marginRight
                }
                return item.clientWidth
            })
            let imgListsWidth = widthArr.reduce((pre, cur, i) => {
                return pre + cur
            })
            imgLists.style.width = imgListsWidth + 'px'
        },
        initBScroll() {            
            this.sellerScroll = new BScroll(this.$refs.sellerWrapper, {
                click:true
            })
            
            this.calculateImgListsWidth()

            this.imgScroll = new BScroll(this.$refs.imgWrapper, {
                scrollX: true
            })
        }
    },
    components: {
        star
    }
}
</script>

<style lang="scss" scoped>
    @import '@/common/scss/mixin.scss';

    .seller-wrapper {
        position: absolute;
        top: 174px;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        .seller-content {
            .info {
                position: relative;
                margin: 0 18px;
                padding: 18px 0;
                .title {
                    padding-bottom: 18px;
                    border-bottom: 1px solid rgba(7,17,27,.1);
                    .text {
                        font-size: 14px;
                        color: #07111b;
                        line-height: 14px;
                    }
                    .star-wrapper {
                        padding-top: 8px;
                        font-size: 0;
                        .star {
                            display: inline-block;
                            vertical-align: top;
                        }
                        .rate-count,.sell-count {
                            display: inline-block;
                            font-size: 12px;
                            color: #4d555d;
                            line-height: 18px;
                        }
                        .rate-count {
                            padding: 0 12px 0 8px;
                        }
                    }
                    .collect {
                        position: absolute;
                        top: 18px;
                        right: -10px;
                        width: 50px;
                        text-align: center;
                        .icon-favorite {
                            font-size: 24px;
                            line-height: 24px;
                            color: #d4d6d9;
                            &.active {
                                color: #f01414;
                            }
                        }
                        .text {
                            display: block;
                            font-size: 10px;
                            color: #4d555d;
                            line-height: 10px;
                            padding-top: 4px;
                        }
                    }
                }
                .remark {
                    display: flex;
                    .block {
                        flex: 1;
                        margin-top: 18px;
                        text-align: center;
                        border-right: 1px solid rgba(7,17,27,.1);
                        &:last-child {
                            border-right-color: transparent;
                        }
                        h2 {
                            margin-bottom: 4px;
                            font-size: 10px;
                            line-height: 10px;
                            color: #93999f;
                        }
                        .content {
                            font-size: 10px;
                            line-height: 24px;
                            font-weight: 200;
                            color: #07111b;
                            .num {
                                position: relative;
                                top: 2px;
                                font-size: 24px;
                            }
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
            .activities {
                padding-top: 18px;
                .bulletin {
                    margin: 0 18px;
                    border-bottom: 1px solid rgba(7,17,27,.1);
                    h2 {
                        font-size: 14px;
                        color: #07111b;
                        line-height: 14px;
                    }
                    .content {
                        padding: 8px 12px 16px;
                        font-size: 12px;
                        font-weight: 200;
                        line-height: 24px;
                        color: #f01414;
                    }
                }
            }
            .supports {
                margin: 0 18px;
                .item {
                    padding: 16px;
                    border-bottom: 1px solid rgba(7,17,27,.1);
                    font-size: 0;
                    &:last-child {
                        border-bottom-color: transparent;
                    }
                    .iconMap {
                        width: 16px;
                        height: 16px;
                        margin-right: 6px;
                        vertical-align: top;
                        display: inline-block;
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                        &.decrease {
                            @include bg-image('../assets/img/decrease_4');
                        }
                        &.discount {
                            @include bg-image('../assets/img/discount_4');
                        }
                        &.guarantee {
                            @include bg-image('../assets/img/guarantee_4');
                        }
                        &.invoice {
                            @include bg-image('../assets/img/invoice_4');
                        }
                        &.special {
                            @include bg-image('../assets/img/special_4');
                        }
                    }
                    .text {
                        font-size: 12px;
                        font-weight: 200;
                        color: #07111b;
                        line-height: 16px;
                    }
                }
            }
            .seller-imgs {
                margin: 18px;
                white-space: nowrap;
                overflow: hidden;
                h2 {
                    font-size: 14px;
                    line-height: 14px;
                    margin-bottom: 12px;
                }
                img {
                    margin-right: 6px;
                }
            }
            .seller-info {
                h2 {
                    font-size: 14px;
                    line-height: 14px;
                    margin: 0 18px;
                    padding: 18px 0 12px;
                }
                .info {
                    font-size: 12px;
                    font-weight: 200;
                    color: #07111b;
                    line-height: 16px;
                    padding: 16px 12px;
                    border-top: 1px solid rgba(7,17,27,.1);
                }
            }
        }
    }
</style>