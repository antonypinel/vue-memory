<template>
    <div class="revision">
        <h1 class="text-3xl md:text-4xl">Révision</h1>
        <div v-if="!revisionStarted">
            <h2 class="text-xl md:text-2xl mt-4 md:mt-8">Choisissez les thèmes</h2>
            <div v-for="theme in allThemes" :key="theme.id" class="theme">
                <input
                        :id="theme.id"
                        v-model="selectedThemes"
                        :value="theme"
                        type="checkbox"
                        class="mr-2 md:mr-4"
                        :disabled="areAllCardsReviewedToday(theme)"
                />
                <label :for="theme.id" class="text-base md:text-lg">{{ theme.name }}</label>
                <span v-if="areAllCardsReviewedToday(theme)" class="text-sm md:text-base text-gray-500 ml-2">
    (Toutes les cartes de ce thème ont déjà été révisées aujourd'hui)
  </span>
            </div>
            <div v-if="selectedThemes.length > 0" class="mt-4 md:mt-8">
                <h2 class="text-xl md:text-2xl">Nombre de niveaux</h2>
                <input
                        v-model.number="numberOfLevels"
                        max="10"
                        min="1"
                        type="number"
                        class="border-blue-400 rounded-md px-2 py-1 w-full md:w-2/5 mt-2 md:mt-4 border border-3"
                />
                <h2 class="text-xl md:text-2xl mt-4 md:mt-8">Nombre de nouvelles cartes par jour</h2>
                <input
                        v-model.number="newCardsPerDay"
                        max="50"
                        min="1"
                        type="number"
                        class="border-blue-400 rounded-md px-2 py-1 w-full md:w-2/5 mt-2 md:mt-4 border border-3"
                />
                <br>
                <button @click="startRevision"
                        class="bg-blue-500 text-white font-bold rounded-md py-2 px-4 mb-2 md:mb-0 hover:bg-blue-700 transition-colors duration-300">
                    Commencer la révision
                </button>
            </div>
        </div>
        <div v-if="revisionStarted">
            <div v-if="currentCard" class="card mt-4 md:mt-8" @click="showFront = !showFront">
                <div :class="{ 'card-flip': !showFront }" class="card-content">
                    <h2 class="text-2xl md:text-3xl">{{ currentCard.recto }}</h2>
                </div>
                <div :class="{ 'card-flip': showFront }" class="card-content">
                    <h2 class="text-2xl md:text-3xl">{{ currentCard.verso }}</h2>
                    <div class="mt-4 md:mt-8">
                        <button @click.stop="cardAnswered(true)"
                                class="bg-green-500 text-white rounded-md py-2 px-4 mr-2 md:mr-4 hover:bg-green-700 transition-colors duration-300">
                            Oui, je me souviens
                        </button>
                        <button @click.stop="cardAnswered(false)"
                                class="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-700 transition-colors duration-300">
                            Non, j'ai oublié
                        </button>
                    </div>
                </div>
            </div>
            <div v-else class="bg-white rounded-lg shadow-md p-8 mx-auto max-w-xl">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-center">
                    <h1 class="font-bold m-3">Révision terminée !</h1>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 sm:mr-4"
                            @click="resetRevision">Réviser à nouveau
                    </button>
                    <button class="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mb-4 sm:mr-4"
                            @click="scheduleDailyReminder">Planifier un rappel quotidien
                    </button>
                    <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4">
                        <router-link :to="`/`">Retourner à l'accueil</router-link>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from '@/stores/store';
import {format} from 'date-fns';

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
        const revisionInterval = ref(null);

        function startRevision() {
            const selectedThemesHaveCards = selectedThemes.value && selectedThemes.value.every(theme => theme.cards && theme.cards.length > 0);
            if (!selectedThemesHaveCards) {
                alert("Aucun des thèmes sélectionnés n'a de carte.");
                selectedThemes.value = [];
                return;
            }
            revisionStarted.value = true;
            revisionCards.value = getRevisionCards();
        }

        function resetRevision() {
            revisionStarted.value = false;
            currentCardIndex.value = 0;
        }

        function getRevisionCards() {
            const cards = selectedThemes.value.flatMap((theme) => {
                return theme.cards.filter((card) => {
                    const currentDate = new Date();
                    const lastRevisionDate = card.lastRevisionDate
                        ? new Date(card.lastRevisionDate)
                        : new Date(0);
                    const daysSinceLastRevision = Math.floor(
                        (currentDate - lastRevisionDate) / (1000 * 60 * 60 * 24)
                    );
                    return card.level <= numberOfLevels.value && daysSinceLastRevision >= card.level;
                });
            });
            const revisionCardsSet = new Set(cards);

            for (let i = numberOfLevels.value; i >= 1; i--) {
                const levelCards = cards.filter((card) => card.level === i);
                levelCards.sort((a, b) => b.lastRevisionDate - a.lastRevisionDate);
                for (const card of levelCards) {
                    if (revisionCardsSet.size >= newCardsPerDay.value) break;
                    revisionCardsSet.add(card);
                }
                if (revisionCardsSet.size >= newCardsPerDay.value) break;
            }
            for (let i = 1; i <= numberOfLevels.value; i++) {
                const levelCards = cards.filter((card) => card.level === i);
                levelCards.sort((a, b) => b.lastRevisionDate - a.lastRevisionDate);
                for (const card of levelCards) {
                    if (revisionCardsSet.size >= newCardsPerDay.value) break;
                    revisionCardsSet.add(card);
                }
                if (revisionCardsSet.size >= newCardsPerDay.value) break;
            }
            return [...revisionCardsSet];
        }

        function cardAnswered(remembered) {
            const currentCard = revisionCards.value[currentCardIndex.value];
            if (!currentCard) {
                return;
            }
            const newLevel = remembered
                ? Math.min(currentCard.level + 1, numberOfLevels.value)
                : Math.max(currentCard.level - 1, 1);

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

            currentCard.level = newLevel;
            currentCard.lastRevisionDate = new Date();
            currentCardIndex.value++;
            showFront.value = true;

            if (currentCardIndex.value < revisionCards.value.length) {
                const nextCard = revisionCards.value[currentCardIndex.value];
                nextCard.level = newLevel;
                nextCard.lastRevisionDate = new Date();
                revisionCards.value.splice(currentCardIndex.value, 1, nextCard);
            } else {
                clearInterval(revisionInterval.value);
                revisionInterval.value = null;
                revisionCards.value = [];
                currentCardIndex.value = 0;
                showFront.value = true;
            }
        }

        const currentCard = computed(() => {
            return revisionCards.value[currentCardIndex.value] || null;
        });

        function areAllCardsReviewedToday(theme) {
            const currentDate = new Date();
            return theme.cards.every((card) => {
                const lastRevisionDate = card.lastRevisionDate
                    ? new Date(card.lastRevisionDate)
                    : new Date(0);
                return (
                    currentDate.getFullYear() === lastRevisionDate.getFullYear() &&
                    currentDate.getMonth() === lastRevisionDate.getMonth() &&
                    currentDate.getDate() === lastRevisionDate.getDate()
                );
            });
        }

        function scheduleDailyReminder() {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        console.log('Notification permission granted.');
                        scheduleReminder();
                    }
                });
            } else {
                scheduleReminder();
            }

            function scheduleReminder() {
                const now = new Date();
                const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0);
                if (now.getTime() > reminderTime.getTime()) {
                    reminderTime.setDate(reminderTime.getDate() + 1);
                }
                const selectedTime = window.prompt(
                    'À quelle heure souhaitez-vous être notifié(e) chaque jour ? (h:min)',
                    format(reminderTime, 'HH:mm')
                );
                if (selectedTime) {
                    const [hour, minute] = selectedTime.split(':');
                    reminderTime.setHours(parseInt(hour, 10));
                    reminderTime.setMinutes(parseInt(minute, 10));
                    const delay = reminderTime.getTime() - new Date().getTime();
                    setInterval(() => {
                        const notification = new Notification('Rappel quotidien', {
                            body: `Il est ${selectedTime}, c'est l'heure de réviser tes cartes pour aujourd'hui !`,
                        });
                    }, delay);
                }
            }
        }

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
            areAllCardsReviewedToday,
            scheduleDailyReminder,
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
    width: 400px;
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.card-flip {
    transform: rotateY(180deg);
}

</style>
