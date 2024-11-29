<script setup lang="ts">
import { ref } from "vue";
import { Card } from "./util/model/card";
import { ECategories } from "./util/enum/categories.enum";
import { populateInstructions } from "./util/instructions";
import { getCardHints } from "./services/openai";
import LoaderCard from "./components/LoaderCard.vue";
import LoaderCategory from "./components/LoaderCategory.vue";

const isDarkModePreferred = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
const darkTheme = ref(isDarkModePreferred);
setTheme();

const hideText = ref(false);
const loading = ref(false);

let card = ref<Card>();

const loadNewCard = async () => {
  try {
    card = ref<Card>();
    hideText.value = false;
    loading.value = true;
    const response = (await getCardHints()) as Card;
    if (response.answer) {
      card.value = response;
      card.value.hints = populateInstructions(card.value.hints.slice(0, 17));
    }
  } catch (error) {
    card = ref<Card>();
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

const handleShow = () => {
  hideText.value = !hideText.value;
};

function switchTheme() {
  darkTheme.value = !darkTheme.value;
  setTheme();
}

function setTheme() {
  if (darkTheme.value) {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  }
}
</script>

<template>
  <header class="header-container">
    <div class="content-header">
      <!-- <button class="primary">
        <font-awesome-icon icon="history" />
      </button> -->
      <button class="primary" @click="switchTheme">
        <font-awesome-icon :icon="darkTheme ? 'sun' : 'moon'" />
      </button>
      <button class="primary" @click="loadNewCard" v-if="card">
        <font-awesome-icon icon="arrow-right" />
      </button>
    </div>
  </header>

  <main class="main">
    <div class="card">
      <div class="card-header">
        <span class="category" v-if="card || loading">
          <p>
            Diga aos jogadores que sou um
            <span class="bold" v-if="card && !loading">
              {{ ECategories[card?.category] }}
            </span>
            <span class="category-loader" v-else>
              <LoaderCategory />
            </span>
          </p>

          <button v-if="card && !loading" class="icon" @click="handleShow">
            <font-awesome-icon v-if="hideText" icon="eye-slash" />
            <font-awesome-icon v-else icon="eye" />
          </button>
        </span>
        <h2 v-if="card && !loading">
          {{ !hideText ? card.answer : "" }}
        </h2>
        <h2 v-else-if="loading">Carregando Cartão...</h2>
        <h2 v-else>Criador de Carta Perfil</h2>
      </div>

      <div class="card-initial" v-if="!card && !loading">
        <p>Solicite uma nova carta clicando no botão</p>
        <button class="primary" @click="loadNewCard">INICIAR</button>
      </div>
      <div class="card-body" v-else>
        <template v-if="card && !loading">
          <p
            v-for="(text, index) in card.hints"
            :key="index"
            :class="{ blur: hideText }"
          >
            {{ `${index + 1}. ${text}` }}
          </p>
          <div v-if="hideText" class="card-hide">
            <font-awesome-icon icon="eye-slash" class="fa-10x" />
          </div>
        </template>
        <LoaderCard v-else />
      </div>
    </div>
  </main>
</template>

<style scoped>
.header-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}

.content-header {
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: space-between;
}

.main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem 0.5rem;
}

.card {
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: var(--color-background-mute);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.card-header .category {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header .category p {
  color: var(--color-heading);
  padding-left: 0.5rem;
  display: flex;
  gap: 8px;
}

.category-loader {
  width: 100px;
}

.card-header h2 {
  height: 40px;
  background-color: var(--color-green-1);
  text-align: center;
  align-content: center;
  color: var(--color-text-button);
}

.card-body {
  position: relative;
  padding: 0.5rem;
  flex: 1;
  max-height: calc(100vh - 115px - 2rem);
  overflow-y: auto;
}

.card-body::-webkit-scrollbar {
  width: 12px; /* width of the entire scrollbar */
}

.card-body::-webkit-scrollbar-track {
  background: var(--color-background-mute); /* color of the tracking area */
}

.card-body::-webkit-scrollbar-thumb {
  background-color: var(--color-border-hover); /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 3px solid var(--color-background-mute); /* creates padding around scroll thumb */
}

.card-initial {
  display: flex;
  position: relative;
  padding: 0.5rem;
  height: 200px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
}

.card-initial button {
  font-size: 1.3em;
  padding: 15px 30px;
}

.card-body:has(.card-hide) {
  overflow-y: hidden;
}

.card-hide {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  align-content: center;
  text-align: center;
}
</style>
