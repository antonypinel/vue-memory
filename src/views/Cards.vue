<template>
  <div class="max-w-3xl mx-auto px-4">
    <h1 class="text-3xl mt-8 mb-4">{{ theme.name }}</h1>
    <button @click="goBack()" class="my-4 py-2 px-4 rounded-md border border-blue-500 bg-blue-500 hover:bg-blue-700 text-white">Retour</button>
    <hr class="my-4" />
    <h2 class="text-xl">Ajouter une carte</h2>
    <form @submit.prevent="addCard">
      <div class="my-2">
        <label class="block">Recto</label>
        <input type="text" v-model="newCard.recto" class="block w-full border border-gray-400 rounded-md p-2" required/>
      </div>
      <div class="my-2">
        <label class="block">Verso</label>
        <input type="text" v-model="newCard.verso" class="block w-full border border-gray-400 rounded-md p-2" required/>
      </div>
      <button type="submit" class="my-4 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-700">Ajouter une carte</button>
    </form>
    <hr class="my-4" />
    <h2 class="text-xl">Cartes</h2>
    <ul>
      <li v-for="card in theme.cards" :key="card.id" class="my-4">
        <div class="content border border-gray-400 rounded-md p-2">
          <div v-if="card.id !== editedCardId">
            <h3 class="text-lg">{{ card.recto }}</h3>
            <p class="my-2">{{ card.verso }}</p>
            <div class="flex justify-end">
              <button @click="editCard(card.id)" class="bg-blue-500 text-white rounded-md px-4 py-2 mr-2 hover:bg-blue-700">Modifier</button>
              <button @click="deleteCard(card.id)" class="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-700">Supprimer</button>
            </div>
          </div>
          <form v-else @submit.prevent="updateCard">
            <div class="my-2">
              <label class="block">Recto</label>
              <input type="text" v-model="editedCard.recto" class="block w-full border border-gray-400 rounded-md p-2" />
            </div>
            <div class="my-2">
              <label class="block">Verso</label>
              <input type="text" v-model="editedCard.verso" class="block w-full border border-gray-400 rounded-md p-2" />
            </div>
            <div class="flex justify-end">
              <button type="submit" class="bg-green-500 text-white rounded-md px-4 py-2 mr-2 hover:bg-green-700">Enregistrer</button>
              <button @click="cancelEdit" class="bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-700">Annuler</button>
            </div>
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

