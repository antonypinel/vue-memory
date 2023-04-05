<template>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <form @submit.prevent="addCategory" class="max-w-md mx-auto my-10">
            <input v-model="newCategory.name" placeholder="Nom" required
                   class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-base font-sans"/>
            <textarea v-model="newCategory.description" placeholder="Description" required
                      class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-base font-sans"
                      rows="3"></textarea>
            <button type="submit"
                    class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-bold text-base w-full">
                Ajouter une catégorie
            </button>
        </form>

        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-3">
            <li v-for="category in categories" :key="category.id"
                class="border border-gray-300 rounded-lg p-8 relative">
                <div class="content">
                    <div v-if="category.id !== editedCategoryId">
                        <h3 class="mb-4 text-lg font-bold overflow-y-auto h-10">{{ category.name }}</h3>
                        <p class="mb-4 text-base overflow-y-auto h-10">{{ category.description }}</p>
                        <div class="flex flex-col sm:flex-row justify-center sm:justify-end sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button @click="editCategory(category.id)"
                                    class="bg-yellow-500 hover:bg-yellow-700 py-2 px-4 rounded-lg font-bold text-white">
                                Modifier
                            </button>
                            <button @click="deleteCategory(category.id)"
                                    class="bg-red-500 hover:bg-red-700 py-2 px-4 rounded-lg font-bold text-white">
                                Supprimer
                            </button>
                            <button>
                                <router-link :to="`/categories/${category.id}/`"
                                             class="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-lg font-bold text-white">
                                    Voir
                                </router-link>
                            </button>
                        </div>
                    </div>

                    <form v-else @submit.prevent="updateCategory" class="flex flex-col items-center">
                        <input v-model="editedCategory.name" placeholder="Nom" required
                               class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-base font-sans"/>
                        <textarea v-model="editedCategory.description" placeholder="Description" required
                                  class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-base font-sans"
                                  rows="3"></textarea>
                        <div class="flex flex-col sm:flex-row justify-center sm:justify-end sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button type="submit"
                                    class="bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg font-bold text-white">
                                Enregistrer
                            </button>
                            <button @click="cancelEdit"
                                    class="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-lg font-bold text-white">
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {ref, watch} from 'vue';
import {useStore} from '@/stores/store';
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
