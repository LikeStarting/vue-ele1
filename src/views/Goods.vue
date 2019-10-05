<template>
    <div class="goods">
        <!-- 左侧导航 -->
        <div class="menu-wrapper" ref="menu">
            <ul>
                <li v-for="(item, index) in goods" :class="currentMenuIndex !== index ? 'menu-item' : 'current-item'" @click="selectMenu(index, $event)" :key="index">
                    <span class="text">
                        <span v-show="item.type > -1" :class="['iconMap', iconClassMap[item.type]]"></span>
                        {{ item.name }}
                    </span>
                </li>
            </ul>
        </div>
        <!-- 右侧二级分类 -->
        <div class="foods-wrapper" ref="foods">
            <ul>
                <li v-for="(item, index) in goods" class="food-list food-list-hook" :key="index">
                    <h2>{{ item.name }}</h2>
                    <ul>
                        <li v-for="(food, id) in item.foods" class="food-item" :key="id" @click="showDetail(food)">
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon"/>
                            </div>
                            <div class="content">
                                <h3>{{ food.name }}</h3>
                                <p v-if="food.description" class="description">{{ food.description }}</p>
                                <div class="sell-info">
                                    <span class="sellCount">月售{{ food.sellCount }}份</span>
                                    <span class="rating">好评率{{ food.rating }}%</span>
                                </div>
                                <div class="price">
                                    <span class="newPrice"><span class="unit">￥</span>{{ food.price }}</span>
                                    <span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :oneFood="food" @add-cart="_drop"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <shopcart ref="shopcart" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectedFoods="selectedFoods"></shopcart>
        <fooddetail :food="clickedFood" @goodDrop="_drop" v-if="clickedFood" ref="myfood"></fooddetail>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import shopcart from '@/components/ShopCart.vue'
import cartcontrol from '@/components/CartControl.vue'
import fooddetail from '@/components/FoodDetail.vue'

export default {
    props: ['seller'],
    data () {
        return {
            goods: [],
            foodsScrollY: 0,
            foodsListsHeight: [],
            clickedFood: ''
        }
    },
    created() {
        this.axios.get('assets/data.json').then(res => {
            this.goods = res.data.goods
            this.$nextTick(() => {
                this.initBScroll()
                this.foodsScroll.on('scroll', (pos) => {
                    this.foodsScrollY = Math.abs(Math.round(pos.y))
                }) 

                this.calculateListsHeight()
            })
        })
        this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'] 
    },
    computed: {
        currentMenuIndex() {
            let i = this.foodsListsHeight.findIndex( (item, index, arr) => {
                return !arr[index+1] || (this.foodsScrollY >= item && this.foodsScrollY < arr[index+1])
            })
            return i
        },
        selectedFoods() {
            let foodLists = []
            this.goods.forEach(item => {
                let food = item.foods.filter(val => {
                    return val.count
                })
                foodLists = foodLists.concat(food)
            })        
            return foodLists
        }
    },
    methods: {
        initBScroll() {
            this.menuScroll = new BScroll(this.$refs.menu, {
                click: true
            })
            this.foodsScroll = new BScroll(this.$refs.foods, {
                click: true,
                probeType: 3
            })
        },
        calculateListsHeight() {
            let foodsLists = this.$refs.foods.querySelectorAll('.food-list-hook')
            let height = 0
            let foodsListsArr = Array.from(foodsLists)
            this.foodsListsHeight.push(height)
            foodsListsArr.forEach(item => {
                height += item.clientHeight
                this.foodsListsHeight.push(height)
            })
        },
        selectMenu(index, event) {
            if(!event._constructed) {
                return
            }
            this.foodsScroll.scrollTo(0, -this.foodsListsHeight[index], 300)
        },
        _drop(target) {
            this.$nextTick(() => {
                this.$refs.shopcart.drop(target)
            })
        },
        showDetail(fd) {
            if(!event._constructed) {
                return
            }
            this.clickedFood = fd
            this.$nextTick(() => {
                this.$refs.myfood.toggleDetail()

            })
        }
    },
    components: {
        shopcart,
        cartcontrol,
        fooddetail
    }
}
</script>

<style lang="scss">
    @import '@/common/scss/mixin.scss';

    .goods {
        display: flex;
        position: absolute;
        top: 174px;
        bottom: 46px;
        width: 100%;
        overflow: hidden;
        .menu-wrapper {
            flex: 0 0 80px;
            width: 80px;
            background: #f3f5f7;
            margin-top: 2px;
            .menu-item,.current-item {
                position: relative;
                display: table;
                height: 54px;
                line-height: 14px;
                width: 56px;
                padding: 0 12px;
                .text {
                    display: table-cell;
                    vertical-align: middle;
                    font-size: 12px;
                    font-weight: 200;
                    white-space: normal;
                    line-height: 14px;
                    .iconMap {
                        width: 12px;
                        height: 12px;
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
                }
            }
            .menu-item {
                &:after {
                    content: '';
                    position: absolute;
                    left: 12px;
                    bottom: 0;
                    width: 56px;
                    border-bottom: 1px solid rgba(7,17,27,.1);
                }
            }
            .current-item {
                background: #fff;
                font-weight: 700;
                margin-top: -1px;
            }
        }
        .foods-wrapper {
            flex: 1;
            margin-top: 2px;
            .food-list {
                h2 {
                    height: 26px;
                    line-height: 26px;
                    padding-left: 12px;
                    font-size: 12px;
                    color: #93999f;
                    background: #f3f5f7;
                    border-left: 2px solid #d9dde1;
                }
            }
            .food-item {
                position: relative;
                display: flex;
                margin: 0 18px;
                padding: 18px 0;
                border-bottom: 1px solid rgba(7,17,27,.1);
                &:last-child {
                    border-bottom-color: transparent;
                }
                .icon {
                    flex: 0 0 57px;
                }
                .content {
                    flex: 1;
                    padding-left: 10px;
                    h3 {
                        margin: 2px 0 8px;
                        font-size: 14px;
                        line-height: 14px;
                        height: 14px;
                        font-weight: 700;
                        color: #07111b;
                        overflow: hidden;
                    }
                    .description {
                        font-size: 10px;
                        margin-bottom: 8px;
                        line-height: 12px;
                        color: #93999f;
                    }
                    .sell-info {
                        font-size: 12px;
                        color: #93999f;
                        line-height: 12px;
                        .sellCount {
                            margin-right: 4px;
                        }
                    }
                    .price {
                        font-size: 12px;
                        font-weight: 700;
                        line-height: 24px;
                        .newPrice {
                            font-size: 12px;
                            color: #f01414;
                            .unit {
                                font-size: 12px;
                                font-weight: 400;
                            }
                        }
                        .oldPrice {
                            text-decoration: line-through;
                            color: #93999f;
                            padding-left: 4px;
                        }
                    }
                    .cartcontrol-wrapper {
                        position: absolute;
                        right: 0;
                        bottom: 10px;
                    }
                }
            }
        }
    }
</style>