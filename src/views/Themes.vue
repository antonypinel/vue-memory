<template>
    <div>
        <h1>{{ category.name }}</h1>
        <p>{{category.description}}</p>
        <button @click="goBack()">Retour</button>
        <hr />
        <h2>Ajouter un thème</h2>
        <form @submit.prevent="addTheme">
            <input v-model="newTheme.name" placeholder="Nom" required />
            <button type="submit">Ajouter un thème</button>
        </form>
        <hr />
        <h2>Thèmes</h2>
        <ul>
            <li v-for="theme in category.themes" :key="theme.id">
                <div class="content">
                    <div v-if="theme.id !== editedThemeId">
                        <h3>{{ theme.name }}</h3>
                        <button @click="editTheme(theme.id)">Modifier</button>
                        <button @click="deleteTheme(theme.id)">Supprimer</button>
                        <button>
                            <router-link :to="'/categories/' + categoryId + '/themes/' + theme.id">Voir</router-link>
                        </button>
                    </div>
                    <form v-else @submit.prevent="updateTheme">
                        <input v-model="editedTheme.name" placeholder="Nom" required />
                        <button type="submit">Enregistrer</button>
                        <button @click="cancelEdit">Annuler</button>
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
