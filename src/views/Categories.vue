<template>
  <div class="container mx-auto">
    <form @submit.prevent="addCategory" class="w-full md:w-3/5 flex flex-col items-center mb-10 mt-10">
      <input v-model="newCategory.name" placeholder="Nom" required class="mb-4 p-4 border border-gray-300 rounded-lg font-sans text-base w-full" />
      <textarea v-model="newCategory.description" placeholder="Description" required class="mb-4 p-4 border border-gray-300 rounded-lg font-sans text-base w-full"></textarea>
      <button type="submit" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-sans text-white font-bold">Ajouter une catégorie</button>
    </form>

    <ul class="flex flex-col md:flex-row justify-center md:justify-between flex-wrap list-none p-0">
      <li v-for="category in categories" :key="category.id" class="border border-gray-300 w-full md:w-2/5 rounded-lg p-8 m-5 relative">
        <div class="content">
          <div v-if="category.id !== editedCategoryId">
            <h3 class="mb-4 text-lg font-bold">{{ category.name }}</h3>
            <p class="mb-4 text-base">{{ category.description }}</p>
            <div class="flex flex-col md:flex-row justify-center md:justify-end md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <button @click="editCategory(category.id)" class="bg-yellow-500 hover:bg-yellow-700 text-black py-2 px-4 rounded-lg font-sans text-white font-bold">Modifier</button>
              <button @click="deleteCategory(category.id)" class="bg-red-500 hover:bg-red-700 text-black py-2 px-4 rounded-lg font-sans text-white font-bold">Supprimer</button>
              <button>
                <router-link :to="`/categories/${category.id}/`" class="bg-blue-500 hover:bg-blue-700 text-black py-2 px-4 rounded-lg font-sans text-white font-bold">Voir</router-link>
              </button>
            </div>
          </div>

          <form v-else @submit.prevent="updateCategory" class="flex flex-col items-center">
            <input v-model="editedCategory.name" placeholder="Nom" required class="mb-4 p-4 border border-gray-300 rounded-lg font-sans text-base w-full" />
            <textarea v-model="editedCategory.description" placeholder="Description" required class="mb-4 p-4 border border-gray-300 rounded-lg font-sans text-base w-full"></textarea>
            <div class="flex flex-col md:flex-row justify-center md:justify-end md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <button type="submit" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-sans text-base">Enregistrer</button>
              <button @click="cancelEdit" class="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg font-sans text-base">Annuler</button>
            </div>
          </form>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, watch} from 'vue';
import { useStore } from '@/stores/store';
import {RouterLink, useRouter} from 'vue-router';

export default {
    components: {RouterLink},
    setup() {
        const router = useRouter();
        const store = useStore();
        const categories = ref(store.$state.categories);

        watch(
            () => store.$state.categories,
            (newCategories) => {
                categories.value = newCategories;
            },
            {deep: true}
        );

        const newCategory = ref({
            id: null,
            name: '',
            description: '',
            themes: [],
        });

        const editedCategoryId = ref(null);
        const editedCategory = ref({
            id: null,
            name: '',
            description: '',
            themes: [],
        });

        const addCategory = () => {
            newCategory.value.id = Date.now();
            store.addCategory(newCategory.value);
            newCategory.value = {
                id: null,
                name: '',
                description: '',
                themes: [],
            };
        };

        const editCategory = (id) => {
            const category = store.$state.categories.find((category) => category.id === id);
            editedCategory.value = {...category};
            editedCategoryId.value = id;
        };

        const updateCategory = () => {
            store.updateCategory(editedCategory.value);
            editedCategoryId.value = null;
        };

        const deleteCategory = (id) => {
            store.deleteCategory(id);
        };

        const cancelEdit = () => {
            editedCategoryId.value = null;
        };

        return {
            categories,
            newCategory,
            addCategory,
            editedCategoryId,
            editedCategory,
            editCategory,
            updateCategory,
            deleteCategory,
            cancelEdit,
            router,
        };
    },
}
</script>
