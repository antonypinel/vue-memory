import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
  state: () => ({
    categories: [],
    selectedCategory: null,
  }),
  actions: {
    // Categories
    addCategory(category) {
      category.id = Date.now();
      category.themes = [];
      this.categories.push(category);
    },
    updateCategory(updatedCategory) {
      const index = this.categories.findIndex(category => category.id === updatedCategory.id);
      if (index !== -1) {
        this.categories[index] = updatedCategory;
      }
    },
    deleteCategory(id) {
      this.categories = this.categories.filter((category) => category.id !== id);
    },

    // Themes
    addTheme(categoryId, theme) {
      const category = this.getCategoryById(categoryId);
      if (category) {
        theme.id = Date.now();
        category.themes.push(theme);
      }
    },
    updateTheme(categoryId, updatedTheme) {
      const category = this.getCategoryById(categoryId);
      if (category) {
        const index = category.themes.findIndex(theme => theme.id === updatedTheme.id);
        if (index !== -1) {
          category.themes[index] = updatedTheme;
        }
      }
    },
    deleteTheme(categoryId, themeId) {
      const category = this.getCategoryById(categoryId);
      if (category) {
        category.themes = category.themes.filter(theme => theme.id !== themeId);
      }
    },

    // Cards
    addCard(categoryId, themeId, card) {
      const theme = this.getThemeById(categoryId, themeId);
      if (theme) {
        card.id = Date.now();
        if (!theme.cards) {
          theme.cards = [];
        }
        theme.cards.push(card);
      }
    },
    updateCard(categoryId, themeId, updatedCard) {
      const theme = this.getThemeById(categoryId, themeId);
      if (theme) {
        const index = theme.cards.findIndex(card => card.id === updatedCard.id);
        if (index !== -1) {
          theme.cards[index] = updatedCard;
        }
      }
    },
    deleteCard(categoryId, themeId, cardId) {
      const theme = this.getThemeById(categoryId, themeId);
      if (theme) {
        theme.cards = theme.cards.filter(card => card.id !== cardId);
      }
    },

    // Getters
    getCategoryById(id) {
      return this.categories.find(category => category.id === id);
    },
    getThemeById(categoryId, themeId) {
      const category = this.getCategoryById(categoryId);
      if (category) {
        return category.themes.find(theme => theme.id === themeId);
      }
      return null;
    },
    getCardById(categoryId, themeId, cardId) {
      const theme = this.getThemeById(categoryId, themeId);
      if (theme) {
        return theme.cards.find(card => card.id === cardId);
      }
      return null;
    }
  },
  persist: true,
});
