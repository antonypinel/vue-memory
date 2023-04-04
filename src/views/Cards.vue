<template>
    <div>
        <h1>{{ theme.name }}</h1>
        <button @click="goBack()">Retour</button>
        <hr />
        <h2>Ajouter une carte</h2>
        <form @submit.prevent="addCard">
            <div>
                <label>Recto</label>
                <input type="text" v-model="newCard.recto" />
            </div>
            <div>
                <label>Verso</label>
                <input type="text" v-model="newCard.verso" />
            </div>
            <button type="submit">Ajouter une carte</button>
        </form>
        <hr />
        <h2>Cartes</h2>
        <ul>
            <li v-for="card in theme.cards" :key="card.id">
                <div class="content">
                    <div v-if="card.id !== editedCardId">
                        <h3>{{ card.recto }}</h3>
                        <p>{{ card.verso }}</p>
                        <button @click="editCard(card.id)">Modifier</button>
                        <button @click="deleteCard(card.id)">Supprimer</button>
                    </div>
                    <form v-else @submit.prevent="updateCard">
                        <div>
                            <label>Recto</label>
                            <input type="text" v-model="editedCard.recto" />
                        </div>
                        <div>
                            <label>Verso</label>
                            <input type="text" v-model="editedCard.verso" />
                        </div>
                        <button type="submit">Enregistrer</button>
                        <button @click="cancelEdit" class="text-white font-bold">Annuler</button>
                    </form>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/stores/store';

export default defineComponent({
    setup() {
        const route = useRoute();
        const categoryId = Number(route.params.id);
        const themeId = Number(route.params.themeId);
        const store = useStore();
        const router = useRouter();

        const theme = ref(null);

        const getThemeById = (id) => {
            return store.getThemeById(categoryId, id);
        };

        theme.value = getThemeById(themeId);

        const newCard = ref({
            id: null,
            recto: '',
            verso: '',
        });

        const editedCardId = ref(null);
        const editedCard = ref({
            id: null,
            recto: '',
            verso: '',
        });

        const addCard = () => {
            store.addCard(categoryId, themeId, newCard.value);
            newCard.value = {
                id: null,
                recto: '',
                verso: '',
            };
        };

        const editCard = (id) => {
            const card = store.getCardById(categoryId, themeId, id);
            editedCard.value = {...card};
            editedCardId.value = id;
        };

        const updateCard = () => {
            store.updateCard(categoryId, themeId, editedCard.value);
            editedCardId.value = null;
        };

        const deleteCard = (id) => {
            store.deleteCard(categoryId, themeId, id);
        };

        const cancelEdit = () => {
            editedCardId.value = null
        };

        const goBack = () => {
            router.go(-1);
        };

        return {
            theme,
            categoryId,
            themeId,
            newCard,
            addCard,
            editedCardId,
            editedCard,
            editCard,
            updateCard,
            deleteCard,
            cancelEdit,
            goBack
        };
    },
});
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


