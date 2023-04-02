<template>
    <div>
        <form @submit.prevent="addCategory">
            <input v-model="newCategory.name" placeholder="Nom" required />
            <textarea v-model="newCategory.description" placeholder="Description" required></textarea>
            <button type="submit">Ajouter une catégorie</button>
        </form>

        <ul>
            <li v-for="category in categories" :key="category.id">
                <div class="content">
                    <div v-if="category.id !== editedCategoryId">
                        <h3>{{ category.name }}</h3>
                        <p>{{ category.description }}</p>
                        <button @click="editCategory(category.id)">Modifier</button>
                        <button @click="deleteCategory(category.id)">Supprimer</button>
                        <button>
                            <router-link :to="`/categories/${category.id}/`">Voir</router-link>
                        </button>
                    </div>

                    <form v-else @submit.prevent="updateCategory">
                        <input v-model="editedCategory.name" placeholder="Nom" required />
                        <textarea v-model="editedCategory.description" placeholder="Description" required></textarea>
                        <button type="submit">Enregistrer</button>
                        <button @click="cancelEdit">Annuler</button>
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

<style scoped>
/* Styles de base */
form {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 20px;
    margin-top: 20px;
}

input,
textarea {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
}

button {
    cursor: pointer;
    padding: 10px;
    border: none;
    border-radius: 4px;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

button[type="submit"] {
    background-color: #4caf50;
    color: #fff;
}

button[type="submit"]:hover {
    background-color: #45a049;
}

button:not([type="submit"]) {
    background-color: #f1f1f1;
    margin-right: 5px;
}

button:not([type="submit"]):hover {
    background-color: #ddd;
}

ul {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
}

li {
    border: 1px solid #ccc;
    width: 40%;
    border-radius: 5px;
    padding: 20px;
    margin: 10px 10px 20px;
    position: relative;
    height: 10%;
}

h3, p {
    margin-bottom: 10px;
}

/* Responsive */
@media (max-width: 768px) {
    form {
        width: 100%;
    }

    input,
    textarea {
        font-size: 14px;
    }

    button {
        font-size: 14px;
    }
}
</style>

