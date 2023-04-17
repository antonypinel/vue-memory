<template>
    <div class="container mx-auto px-4 lg:px-0">
        <h1 class="text-3xl mt-8 mb-4">{{ theme.name }}</h1>
        <button @click="goBack()"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Retour
        </button>
        <hr class="my-4"/>
        <h2 class="text-2xl font-bold">Ajouter une carte</h2>
        <form @submit.prevent="addCard">
            <div class="my-2">
                <input placeholder="Recto" type="text" v-model="newCard.recto"
                       class="block w-full border border-gray-400 rounded-md p-2"
                       required/>
            </div>
            <div class="my-2">
                <input placeholder="Verso" type="text" v-model="newCard.verso"
                       class="block w-full border border-gray-400 rounded-md p-2"
                       required/>
            </div>
            <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Ajouter
                une carte
            </button>
        </form>
        <hr class="my-4"/>
        <h2 class="text-xl">Cartes</h2>
        <ul>
            <li v-for="card in theme.cards" :key="card.id" class="my-4">
                <div class="content border border-gray-400 rounded-md p-2">
                    <div v-if="card.id !== editedCardId">
                        <h3 class="text-lg overflow-y-auto h-10">{{ card.recto }}</h3>
                        <p class="my-2 overflow-y-auto h-10">{{ card.verso }}</p>
                        <div class="flex justify-end">
                            <button @click="editCard(card.id)"
                                    class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Modifier
                            </button>
                            <button @click="deleteCard(card.id)"
                                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Supprimer
                            </button>
                        </div>
                    </div>
                    <form v-else @submit.prevent="updateCard">
                        <div class="my-2">
                            <label class="block">Recto</label>
                            <input type="text" v-model="editedCard.recto"
                                   class="block w-full border border-gray-400 rounded-md p-2"/>
                        </div>
                        <div class="my-2">
                            <label class="block">Verso</label>
                            <input type="text" v-model="editedCard.verso"
                                   class="block w-full border border-gray-400 rounded-md p-2"/>
                        </div>
                        <div class="flex justify-end">
                            <button type="submit"
                                    class="bg-green-500 text-white font-bold rounded-md px-4 py-2 mr-2 hover:bg-green-700">
                                Enregistrer
                            </button>
                            <button @click="cancelEdit"
                                    class="bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-700 font-bold text-white">
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
import {defineComponent, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useStore} from '@/stores/store';

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

