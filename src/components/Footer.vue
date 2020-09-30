<template>
  <footer class="footer">
    <section class="f-container">
      <div>
        <img
          src="@/assets/image/footer-logo.svg"
          alt="footer"
          class="footer-logo"
        />
        <p class="f-text">&copy;2020 499DAO</p>
      </div>
      <section class="f-nav">
        <a
          class="fn-item"
          href="#"
          v-for="(item, idx) in linkItem"
          :key="idx"
          target="_blank"
        >
          <img :src="item.src" alt="icon" />
        </a>
      </section>
    </section>
  </footer>
</template>

<script>
import github from '../icons/github.svg';
import twitter from '../icons/twitter.svg';
export default {
  data() {
    return {
      linkItem: [
        {
          label: '',
          src: github
        },
        {
          label: '',
          src: twitter
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;

  box-sizing: border-box;
  height: 214px;
  background-color: #000;
}
.f-container {
  max-width: 1200px;
  padding: 0 20px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.footer-logo {
  height: 50px;
  color: #fff;
}
.f-text {
  color: #fff;
  font-size: 18px;
  padding: 0;
  margin: 2px 0 0 0;
  line-height: 20px;
}

.f-nav {
  display: flex;
  align-items: center;
  height: 100%;
  .fn-item {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: #575556;
    display: flex;
    align-items: center;
    justify-items: center;
    overflow: hidden;
    margin: 0 0 0 20px;
    img {
      width: 80%;
      height: 80%;
      object-fit: contain;
      margin: 0 auto;
    }
  }
}

@media screen and (max-width: 750px) {
  .footer {
    height: 120px;
  }
  .footer-logo {
    height: 30px;
  }
  .f-text {
    font-size: 12px;
  }
  .f-nav .fn-item {
    width: 30px;
    height: 30px;
    img {
      width: 60%;
      height: 60%;
    }
  }
}
</style>
