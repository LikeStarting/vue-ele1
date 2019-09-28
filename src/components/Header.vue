<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img :src="seller.avatar" width="64" height="64" />
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{ seller.name }}</span>
                </div>
                <div class="description">{{ seller.description }} / {{ seller.deliveryTime}}分钟送达</div>
                <div class="supports" v-if="seller.supports">
                    <div class="supports_desc">
                        <span :class="['icon', iconClassMap[seller.supports[0].type]]"></span>
                        <span class="text">{{ seller.supports[0].description }}</span>
                    </div>
                </div>
            </div>
            <div class="sup-count" v-if="seller.supports" @click="showDetail">
                <span class="count">{{ seller.supports.length }}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin-wrapper" @click="showDetail">
            <span class="bulletin-title"></span>
            <span class="bulletin-text">{{ seller.bulletin }}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="bg">
            <img :src="seller.avatar" width="100%" height="100%"/>
        </div>
        <transition name="fade">
            <div v-if="detailShow" class="header-detail">
                <div class="detail-wrapper">
                    <div class="detail-main">
                        <h1 class="name">{{ seller.name }}</h1>
                        <div class="star-wrapper">
                            <star :size="48" :score="seller.score"></star>
                        </div>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul v-if="seller.supports" class="supports">
                            <li class="support-item" v-for="item in seller.supports" :key="item.type">
                                <span :class="['icon', iconClassMap[item.type]]"></span>
                                <span class="text">{{ item.description }}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">{{ seller.bulletin }}</div>
                    </div>
                </div>
                <div class="detail-close" @click="hideDetail">
                    <i class="icon-close"></i>
                </div>
            </div>                  
        </transition>
    </div>
</template>

<script>
import Star from '@/components/Star.vue'

export default {
    data () {
        return {
            detailShow: false,
            iconClassMap: []
        }
    },
    props: ['seller'],
    created() {
        this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']  
    },
    methods: {
        showDetail() {
            this.detailShow = true
        },
        hideDetail() {
            this.detailShow = false
        }
    },
    components: {
        Star
    }
}
</script>

<style lang="scss">
    @import '@/common/scss/mixin';

    .header {
        position: relative;
        background: rgba(7,17,27,0.5);
        color: #fff;
        overflow: hidden;
        .content-wrapper {
            position: relative;
            display: flex;
            padding: 24px 12px 18px 24px;
            font-size: 12px;
            .avatar img {
                border-radius: 4px;
            }
            .content {
                margin-left: 16px;
                .title {
                    margin: 2px 0 8px 0;
                    font-size: 16px;
                    .brand {
                        display: inline-block;
                        vertical-align: top;
                        width: 30px;
                        height: 18px;
                        @include bg-image('../assets/img/brand');
                        background-size: 30px 18px;
                        background-repeat: no-repeat;
                    }
                    .name {
                        display: inline-block;
                        margin-left: 6px;
                        font-size: 16px;
                        line-height: 18px;
                        font-weight: bold;
                    }
                }
                .description {
                    font-size: 12px;
                    margin-bottom: 10px;
                }
                .supports {
                    .icon {
                        display: inline-block;
                        vertical-align: top;
                        width: 12px;
                        height: 12px;
                        margin-right: 4px;
                        background-size: 12px 12px;
                        background-repeat: no-repeat;
                        &.decrease {
                            @include bg-image('../assets/img/decrease_1');
                        }
                        &.discount {
                            @include bg-image('../assets/img/discount_1');
                        }
                        &.guarantee {
                            @include bg-image('../assets/img/guarantee_1');
                        }
                        &.invoice {
                            @include bg-image('../assets/img/invoice_1');
                        }
                        &.special {
                            @include bg-image('../assets/img/special_1');
                        }
                    }
                    .text {
                        font-size: 12px;
                        line-height: 12px;
                    }
                }
            }
            .sup-count {
                position: absolute;
                right: 12px;
                bottom: 18px;
                padding: 0 8px;
                height: 24px;
                line-height: 24px;
                border-radius: 14px;
                background-color: rgba(0,0,0,.2);
                text-align: center;
                .count {
                    vertical-align: top;
                    font-size: 12px;
                }
                .icon-keyboard_arrow_right {
                    font-size: 12px;
                    margin-left: 2px;
                }
            }
        }
        .bulletin-wrapper {
            position: relative;
            height: 28px;
            line-height: 28px;
            padding: 0 22px 0 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            background: rgba(7,17,27,.2);
            .bulletin-title {
                display: inline-block;
                vertical-align: top;
                margin-top: 8px;
                width: 22px;
                height: 12px;
                @include bg-image('../assets/img/bulletin');
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }
            .bulletin-text {
                font-size: 12px;
                vertical-align: top;
                margin: 0 4px;
            }
            .icon-keyboard_arrow_right {
                position: absolute;
                right: 12px;
                top: 8px;
                font-size: 12px;
            }
        }
        .bg {
            position: absolute;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            filter: blur(10px);
            z-index: -1;
        }
        .header-detail {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100;
            background: rgba(7,17,27,0.8);
            backdrop-filter: blur(10px);
            .detail-wrapper {
                min-height: 100%;
                width: 100%;
                .detail-main {
                    padding-top: 64px;
                    padding-bottom: 64px;
                    .name {
                        font-size: 16px;
                        font-weight: 700;
                        width: 100%;
                        color: #fff;
                        line-height: 16px;
                        text-align: center;
                    }
                    .star-wrapper {
                        margin: 16px 0 28px;
                        text-align: center;
                    }
                    .title {
                        display: flex;
                        width: 80%;
                        margin: 0 auto 24px;
                        .line {
                            flex: 1;
                            height: 1px;
                            margin: auto;
                            background: hsla(0,0%,100%,.2);
                        }
                        .text {
                            padding: 0 12px;
                            font-size: 14px;
                            font-weight: 700;
                        }
                    }
                    .supports {
                        padding: 0 0 28px 36px;
                        .support-item {
                            color: #fff;
                            padding: 0 6px 12px 16px;
                            .icon {
                                display: inline-block;
                                vertical-align: top;
                                width: 16px;
                                height: 16px;
                                margin-right: 6px;
                                background-size: 100% 100%;
                                background-repeat: no-repeat;
                                &.decrease {
                                    @include bg-image('../assets/img/decrease_2');
                                }
                                &.discount {
                                    @include bg-image('../assets/img/discount_2');
                                }
                                &.guarantee {
                                    @include bg-image('../assets/img/guarantee_2');
                                }
                                &.invoice {
                                    @include bg-image('../assets/img/invoice_2');
                                }
                                &.special {
                                    @include bg-image('../assets/img/special_2');
                                }
                            }
                            .text {
                                font-size: 12px;
                                font-weight: 200;
                                color: #fff;
                                line-height: 12px;
                            }
                        }
                    }
                    .bulletin {
                        padding: 0 48px;
                        font-size: 12px;
                        font-weight: 200;
                        color: #fff;
                        line-height: 24px;
                        max-height: 240px;
                        overflow: hidden;
                    }
                }
            }
            .detail-close {
                position: relative;
                width: 32px;
                height: 32px;
                margin: -64px auto 0;
                font-size: 32px;
                color: hsla(0,0%,100%,.5);
            }
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>