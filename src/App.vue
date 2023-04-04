<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

/* Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Réinitialisation de base et polices */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
}

/* En-tête */
header {
    background-color: #333;
    height: 60px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
}

nav a {
    text-decoration: none;
    color: #fff;
    margin: 0 10px;
    transition: color 0.3s ease;
}

nav a:hover {
    color: #ff9900;
}

/* Responsive */
@media (max-width: 768px) {
    .wrapper {
        padding: 0 10px;
    }

    nav {
        flex-wrap: wrap;
    }

    nav a {
        margin: 5px 10px;
    }
}
</style>

