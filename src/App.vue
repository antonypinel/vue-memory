<script setup>
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
    <header class="bg-gray-800 shadow">
      <link rel="manifest" href="manifest.json" />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex justify-between h-16">
                <div class="flex">
                    <RouterLink to="/"
                                class="flex items-center text-white hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium ml-auto">
                        Accueil
                    </RouterLink>
                  <RouterLink to="/revision"
                              class="flex items-center text-white hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium ml-auto">
                    Révision
                  </RouterLink>
                    <RouterLink to="/about"
                                class="flex items-center text-white hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium ml-auto">
                        Règles
                    </RouterLink>
                </div>
            </nav>
        </div>
    </header>
    <RouterView/>
</template>


