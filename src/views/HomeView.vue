<template>
  <div class="home">
    <BlogPost v-if="!user" :post="welcomeScreen" />
    <BlogPost :post="post" v-for="(post, index) in blogPostsFeed" :key="index" />
    <div class="blog-card-wrap">
        <div class="container">
          <h3>View More Recent Blogs</h3>
          <div class="blog-cards">
             <BlogCards :post="post" v-for="(post, index) in blogPostscards" :key="index" />
          </div>
        </div>
      </div>
      <div v-if="!user" class="updates">
        <div class="container">
          <h2> never miss a post . Registre a free account today</h2>
          <router-link class="router-button" :to="{name:'RegisterView'}">  registre for FireBlogs <img src="../assets/Icons/arrow-right-light.svg" class="arrow arrow-light" />

          </router-link>
        </div>
      </div>
  </div>
</template> 
<script>

import BlogPost from "../components/BlogPost"
import BlogCards from "../components/BlogCard"

export default {
  name: "HomeView",
  components :{BlogPost,BlogCards},
  data() {
    return {
      welcomeScreen: {
        title: "Welcome!",
        blogPost: "Weekly blog articles with all things programming including HTML, CSS, JavaScript and more. Register today to never miss a post.",
        welcomeScreen:true,
        photo: "coding", // Assuming 'coding' refers to an image asset
      },
     
    };
  },
  computed: {
    blogPostsFeed(){
      return this.$store.getters.blogPostsFeed;
    },
    blogPostscards(){
      return this.$store.getters.blogPostscards;
    },
    user(){
            return this.$store.state.user;
        }
  }
};
</script>
<style lang="scss" scoped>
  .blog-card-wrap {
    h3 {
      font-weight: 300;
      font-size: 28px;
      margin-bottom: 32px;
    }
  }

  .updates {
    .container {
      padding: 100px 25px;
      display: flex;
      flex-direction: column;
      align-items: center;

      @media (min-width: 800px) {
        padding: 125px 25px;
        flex-direction: row;
      }
    }

    .router-button {
      display: flex;
      font-size: 14px;
      text-decoration: none;

      @media (min-width: 800px) {
        margin-left: auto;
      }
    }

    h2 {
      font-weight: 300;
      font-size: 32px;
      max-width: 425px;
      width: 100%;
      text-align: center;
      text-transform: uppercase;

      @media (min-width: 800px) {
        text-align: initial;
        font-size: 40px;
      }
    }
}

</style>
