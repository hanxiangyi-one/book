<template>
  <div class="ebook-home">
      <search-bar></search-bar>
      <flap-card :data="random"></flap-card>
      <scroll :top="ontop" @onScroll="onPulldown" ref="scroll">
          <div class="banner-img">
              <img class="img" :src="banner" />
          </div>
          <guess-you-like :data="guessYouLike"></guess-you-like>
          <recommend :data="recommend" class="recommend"></recommend>
          <featured class="featured" :data="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')"></featured>
          <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
              <category-book :data="item"></category-book>
          </div>
          <category class="category" :data="categories"></category>
      </scroll>
  </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar'
import Scroll from '../../components/common/Scroll'
import FlapCard from '../../components/home/FlapCard'
import guessYouLike from '../../components/home/GuessYouLike'
import Recommend from '../../components/home/Recommend'
import Featured from '../../components/home/Featured'
import CategoryBook from '../../components/home/CategoryBook'
import Category from '../../components/home/Category'
import { storeHomemixin } from '../../utils/mixin'
import { home } from '../../api/store'
export default {
    mixins: [storeHomemixin],
    components: {
        SearchBar,
        Scroll,
        FlapCard,
        guessYouLike,
        Recommend,
        Featured,
        CategoryBook,
        Category
    },
    data () {
        return {
            ontop: 94,
            random: {},
            banner: '',
            guessYouLike: null,
            recommend: null,
            featured: null,
            categoryList: null,
            categories: null
        }
    },
    methods: {
        onPulldown (offsetY) {
            this.setoffsetY(offsetY)
            if (offsetY > 0) {
                this.ontop = 52
            } else {
                this.ontop = 94
            }
            this.$refs.scroll.refresh()
        }
    },
    mounted() {
        home().then(response => {
            if (response && response.status === 200) {
                const data = response.data
                const randomIndex = Math.floor(Math.random() * data.random.length)
                this.random = data.random[randomIndex]
                this.banner = data.banner
                this.guessYouLike = data.guessYouLike
                this.recommend = data.recommend
                this.featured = data.featured
                this.categoryList = data.categoryList
                this.categories = data.categories
            }
        })
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";

.ebook-home{
    width: 100%;
    height: 100%;
  .banner-img{
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
      .img {
        width: 100%;
        height: px2rem(150);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .recommend{
        margin-top: px2rem(10);
    }
    .featured{
        margin-top: px2rem(10);
    }
    .category-list-wrapper{
        margin-top: px2rem(10);
    }
    .category{
        margin-top: px2rem(10);
    }
}

</style>
