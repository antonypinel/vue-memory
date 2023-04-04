<template>
  <div class="revision">
    <h1>Révision</h1>
    <div v-if="!revisionStarted">
      <h2>Choisissez les thèmes</h2>
      <div v-for="theme in allThemes" :key="theme.id" class="theme">
        <input
            type="checkbox"
            :id="theme.id"
            v-model="selectedThemes"
            :value="theme"
        />
        <label :for="theme.id">{{ theme.name }}</label>
      </div>
      <div v-if="selectedThemes.length > 0">
        <h2>Nombre de niveaux</h2>
        <input
            type="number"
            v-model.number="numberOfLevels"
            min="1"
            max="10"
        />
        <h2>Nombre de nouvelles cartes par jour</h2>
        <input
            type="number"
            v-model.number="newCardsPerDay"
            min="1"
            max="50"
        />
        <button @click="startRevision">Commencer la révision</button>
      </div>
    </div>
    <div v-if="revisionStarted">
      <div v-if="currentCard" class="card" @click="showFront = !showFront">
        <div
            class="card-content"
            :class="{ 'card-flip': !showFront }"
        >
          <h2>{{ currentCard.recto }}</h2>
        </div>
        <div
            class="card-content"
            :class="{ 'card-flip': showFront }"
        >
          <h2>{{ currentCard.verso }}</h2>
          <button @click.stop="cardAnswered(true)">
            Yes, I remember
          </button>
          <button @click.stop="cardAnswered(false)">
            No, I forgot
          </button>
        </div>
      </div>
      <div v-else>
        <h2>Révision terminée</h2>
        <button @click="resetRevision">Réviser à nouveau</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from '@/stores/store';

export default {
  name: 'Revision',
  setup() {
    const store = useStore();
    const allThemes = computed(() => store.getAllThemes());
    const selectedThemes = ref([]);
    const numberOfLevels = ref(1);
    const newCardsPerDay = ref(5);
    const revisionStarted = ref(false);
    const revisionCards = ref([]);
    const currentCardIndex = ref(0);
    const showFront = ref(true);

    function startRevision() {
      revisionStarted.value = true;
      revisionCards.value = getRevisionCards();
      console.log('revisionCards:', revisionCards.value);
    }

    function resetRevision() {
      revisionStarted.value = false;
      currentCardIndex.value = 0;
    }

    function getRevisionCards() {
      const cards = selectedThemes.value
          .flatMap((theme) => {
            return theme.cards
                .filter((card) => {
                  const currentDate = new Date();
                  const lastRevisionDate = card.lastRevisionDate
                      ? new Date(card.lastRevisionDate)
                      : new Date(0);
                  const daysSinceLastRevision = Math.floor(
                      (currentDate - lastRevisionDate) / (1000 * 60 * 60 * 24)
                  );
                  return (
                      card.level <= numberOfLevels.value &&
                      daysSinceLastRevision >= card.level
                  );
                })
                .sort((a, b) => b.level - a.level); // triez par niveau décroissant
          });
      console.log(cards);

      const revisionCards = [...cards]; // Ajoutez "cards" à "revisionCards"

      // ajoutez les cartes les plus récentes à partir du niveau le plus élevé
      for (let i = numberOfLevels.value; i >= 1; i--) {
        const levelCards = cards.filter((card) => card.level === i);
        levelCards.sort((a, b) => b.lastRevisionDate - a.lastRevisionDate); // triez par date de la dernière révision décroissante
        console.log(`Cards for level ${i}:`, levelCards); // Ajouter cette ligne ici
        revisionCards.push(...levelCards.slice(0, newCardsPerDay.value));
        if (revisionCards.length >= newCardsPerDay.value) break;
      }

// ajoutez les cartes les plus récentes à partir du niveau 1
      for (let i = 1; i <= numberOfLevels.value; i++) {
        const levelCards = cards.filter((card) => card.level === i);
        levelCards.sort((a, b) => b.lastRevisionDate - a.lastRevisionDate); // triez par date de la dernière révision décroissante
        console.log(`Cards for level ${i}:`, levelCards); // Ajouter cette ligne ici
        revisionCards.push(
            ...levelCards.slice(0, newCardsPerDay.value - revisionCards.length)
        );
        if (revisionCards.length >= newCardsPerDay.value) break;
      }


      return revisionCards;
    }

    function cardAnswered(remembered) {
      const currentCard = revisionCards.value[currentCardIndex.value];
      const newLevel = remembered
          ? Math.min(currentCard.level + 1, numberOfLevels.value)
          : Math.max(currentCard.level - 1, 1);

      console.log(currentCard.categoryId, currentCard.themeId, currentCard.id);

      store.updateCardLevel(
          currentCard.categoryId,
          currentCard.themeId,
          currentCard.id,
          newLevel
      );
      store.updateCardLastRevisionDate(
          currentCard.categoryId,
          currentCard.themeId,
          currentCard.id,
          new Date()
      );

      currentCard.level = newLevel; // mettez à jour le niveau de la carte actuelle dans revisionCards
      currentCard.lastRevisionDate = new Date(); // mettez à jour la date de la dernière révision de la carte actuelle dans revisionCards
      currentCardIndex.value++;
      showFront.value = true;

      // Remplacez la carte actuelle par la prochaine carte de révision dans revisionCards
      if (currentCardIndex.value < revisionCards.value.length) {
        const nextCard = revisionCards.value[currentCardIndex.value];
        nextCard.level = newLevel;
        nextCard.lastRevisionDate = new Date();
        revisionCards.value.splice(currentCardIndex.value, 1, nextCard);
      } else {
        currentCardIndex.value = 0; // Réinitialisez currentCardIndex à 0 pour recommencer la révision à partir de la première carte
      }
    }

    const currentCard = computed(() => {
      return revisionCards.value[currentCardIndex.value] || null;
    });

    return {
      allThemes,
      selectedThemes,
      numberOfLevels,
      newCardsPerDay,
      revisionStarted,
      currentCard,
      showFront,
      startRevision,
      resetRevision,
      cardAnswered,
    };
  },
};
</script>

<style scoped>
.revision {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.theme {
  display: flex;
  align-items: center;
}

input[type='number'] {
  width: 50px;
  margin-bottom: 20px;
}

.card {
  perspective: 1000px;
  width: 300px;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
}

.card-content {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: transform 0.6s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-flip {
  transform: rotateY(180deg);
}

</style>
