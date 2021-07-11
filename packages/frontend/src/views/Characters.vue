<!--
 * @Author: vspirit803
 * @Date: 2021-06-28 17:27:09
 * @Description:
 * @LastEditTime: 2021-07-11 20:05:19
 * @LastEditors: vspirit803
-->

<template>
  <div class="container">
    <HomeButton />
    <div class="characters-container column">
      <div class="toolbar row shadow-1">
        <q-toolbar class="col-4">
          <q-input v-model="characterName" label="姓名" dense>
            <template #append>
              <q-icon v-if="characterName !== ''" name="mdi-close" class="cursor-pointer" @click="characterName = ''" />
              <q-icon name="mdi-magnify" />
            </template>
          </q-input>
        </q-toolbar>
        <q-toolbar class="col-8">
          <div class="q-gutter-sm">
            <q-radio v-model="sortKey" dense val="id" label="序号" />
            <q-radio v-model="sortKey" dense val="name" label="姓名" />
            <q-radio v-model="sortKey" dense val="level" label="等级" />
          </div>
          <q-space />
          <div class="q-gutter-sm">
            <q-radio v-model="sortOrder" dense val="asc" label="升序" />
            <q-radio v-model="sortOrder" dense val="desc" label="降序" />
          </div>
        </q-toolbar>
      </div>
      <div class="characters row content-start q-mt-sm">
        <div
          v-for="each of filteredCharacters"
          :key="each.uuid"
          class="character img-container"
          :class="{ 'character-selected': each.uuid === selectedCharacter.uuid }"
          @click="selectedCharacter = each"
        >
          <q-img class="img" :src="`/images/characters/${each.id}.png`" />
          <!-- {{ each.name }} -->
        </div>
      </div>
    </div>
    <CharacterDetail class="character-detail" :character="selectedCharacter" />
  </div>
</template>

<script lang="ts" setup>
import { CharacterCenter, CharacterNormal, Game } from 'sora-game-core';
import { computed, ref } from 'vue';

import CharacterDetail from '@/components/CharacterDetail.vue';

const game = Game.getInstance();
const characterCenter: CharacterCenter = game.characterCenter;

const characters = characterCenter.userCharacters;
const selectedCharacter = ref<CharacterNormal>(characters[0]);
const characterName = ref('');

const sortKey = ref<keyof CharacterNormal>('id');
const sortOrder = ref<'asc' | 'desc'>('asc');

function compare(a: CharacterNormal, b: CharacterNormal) {
  if (sortKey.value === 'name') {
    return a.name.localeCompare(b.name);
  }

  return a[sortKey.value] > b[sortKey.value] ? 1 : a[sortKey.value] < b[sortKey.value] ? -1 : 0;
}

const filteredCharacters = computed(() =>
  characters
    .filter((each) => !characterName.value || each.name.includes(characterName.value.trim()))
    .sort((a, b) => compare(a, b) * (sortOrder.value === 'asc' ? 1 : -1)),
);
</script>

<style lang="scss">
.container {
  display: flex;
}

.characters-container {
  flex: 0 0 33rem;

  .characters {
    gap: 0.333rem;
  }

  .toolbar {
    flex-grow: 0;
  }

  .character {
    height: 12rem;
    width: 8rem;
    outline: 1px red dashed;
    outline-offset: -1px;

    &-selected {
      outline: 2px red solid;
      outline-offset: -2px;
    }
  }
}

.img-container {
  width: 100%;
  height: 100%;

  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-size: cover;
  }
}

.character-detail {
  flex-grow: 1;
}
</style>
