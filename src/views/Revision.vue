<template>
    <div class="revision">
        <h1>Révision</h1>
        <div v-if="!revisionStarted">
            <h2>Choisissez les thèmes</h2>
            <div v-for="theme in allThemes" :key="theme.id" class="theme">
                <input
                        :id="theme.id"
                        v-model="selectedThemes"
                        :value="theme"
                        type="checkbox"
                />
                <label :for="theme.id">{{ theme.name }}</label>
            </div>
            <div v-if="selectedThemes.length > 0">
                <h2>Nombre de niveaux</h2>
                <input
                        v-model.number="numberOfLevels"
                        max="10"
                        min="1"
                        type="number"
                />
                <h2>Nombre de nouvelles cartes par jour</h2>
                <input
                        v-model.number="newCardsPerDay"
                        max="50"
                        min="1"
                        type="number"
                />
                <button @click="startRevision">Commencer la révision</button>
            </div>
        </div>
        <div v-if="revisionStarted">
            <div v-if="currentCard" class="card" @click="showFront = !showFront">
                <div
                        :class="{ 'card-flip': !showFront }"
                        class="card-content"
                >
                    <h2>{{ currentCard.recto }}</h2>
                </div>
                <div
                        :class="{ 'card-flip': showFront }"
                        class="card-content"
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
                <button @click="scheduleDailyReminder">Planifier un rappel quotidien</button>
                <button>
                    <router-link :to="`/`">Retourner à l'accueil</router-link>
                </button>
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
                    reminderTime.setDate(reminderTime.getDate());
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
