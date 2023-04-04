<template>
  <div>
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold">{{ category.name }}</h1>
      <p class="mt-2">{{ category.description }}</p>
      <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          @click="goBack"
      >
        Retour
      </button>
      <hr class="my-6" />
    </div>

    <div class="container mx-auto">
      <h2 class="text-2xl font-bold">Ajouter un thème</h2>
      <form class="flex flex-col mt-4" @submit.prevent="addTheme">
        <input
            class="border border-gray-300 p-2 rounded-md mb-2"
            v-model="newTheme.name"
            placeholder="Nom"
            required
        />
        <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
        >
          Ajouter un thème
        </button>
      </form>
      <hr class="my-6" />
    </div>

    <h2 class="text-2xl font-bold container mx-auto">Thèmes</h2>
    <ul class="flex flex-wrap justify-center mt-4">
      <li
          v-for="theme in category.themes"
          :key="theme.id"
          class="border border-gray-300 rounded-md p-4 m-2 w-3/12 relative"
      >
        <div class="content">
          <div v-if="theme.id !== editedThemeId">
            <h3 class="text-xl font-bold mb-2">{{ theme.name }}</h3>
            <button
                class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                @click="editTheme(theme.id)"
            >
              Modifier
            </button>
            <button
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                @click="deleteTheme(theme.id)"
            >
              Supprimer
            </button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <router-link
                  :to="'/categories/' + categoryId + '/themes/' + theme.id"
                  class="text-white"
              >
                Voir
              </router-link>
            </button>
          </div>
          <form v-else class="flex flex-col mt-4" @submit.prevent="updateTheme">
            <input
                class="border border-gray-300 p-2 rounded-md mb-2"
                v-model="editedTheme.name"
                placeholder="Nom"
                required
            />
            <button
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                type="submit"
            >
              Enregistrer
            </button>
            <button
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                @click="cancelEdit"
            >
              Annuler
            </button>
          </form>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/stores/store'

export default defineComponent({
    setup() {
        const route = useRoute()
        const categoryId = Number(route.params.id)
        const store = useStore()
        const router = useRouter()

        const category = ref(null)

        const getCategoryById = (id) => {
            return store.categories.find((category) => category.id === id)
        }

        category.value = getCategoryById(categoryId)

        const newTheme = ref({
            id: null,
            name: '',
        })

        const editedThemeId = ref(null)
        const editedTheme = ref({
            id: null,
            name: '',
        })

        const addTheme = () => {
            store.addTheme(categoryId, newTheme.value)
            newTheme.value = {
                id: null,
                name: '',
            }
        }

        const editTheme = (id) => {
            const theme = store.getThemeById(categoryId, id)
            editedTheme.value = {...theme}
            editedThemeId.value = id
        }

        const updateTheme = () => {
            store.updateTheme(categoryId, editedTheme.value)
            editedThemeId.value = null
        }

        const deleteTheme = (id) => {
            store.deleteTheme(categoryId, id)
        }

        const cancelEdit = () => {
            editedThemeId.value = null
        }

        const goBack = () => {
            router.go(-1)
        }

        return {
            category,
            categoryId,
            newTheme,
            addTheme,
            editedThemeId,
            editedTheme,
            editTheme,
            updateTheme,
            deleteTheme,
            cancelEdit,
            goBack
        }
    }
})
</script>

<style>
  .container {
    margin-top: 10px;
    max-width: 900px;
  }
</style>
