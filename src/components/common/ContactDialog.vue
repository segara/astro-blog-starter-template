<template>
  <Transition name="fade">
    <div
      v-show="$show"
      class="bg-dark-blur z-1000 dialog pointer-events-auto fixed inset-0 grid w-full cursor-pointer place-items-center"
      @click="hide()"
    >
      <div @click.stop class="container-md relative">
        <div
          class="surface-base dialog__inner dialog-grid relative overflow-hidden rounded-2xl shadow-xl"
        >
          <div class="overflow-hidden md:block">
            <slot name="image" />
          </div>
          <div
            class="hide-scrollbar dialog__content relative overflow-hidden p-8 md:p-14"
          >
            <div class="grid gap-4">
              <h2 class="title-sm">{{ contact?.title }}</h2>

              <slot name="content" />
            </div>
          </div>
        </div>
        <button
          class="btn btn-icon surface-dark btn-absolute -right-3 -top-3 z-10"
          @click="hide()"
        >
          <slot />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from "vue";
import { useStore } from "@nanostores/vue";
import { showContact } from "@src/store";

import {
  disableBodyScroll,
  enableBodyScroll,
} from "body-scroll-lock";

defineProps({
  contact: {
    type: Object,
  },
});

const $show = useStore(showContact);

const hide = () => {
  showContact.set(false);
};

watch(
  $show,

  (val) => {
    if (val) { 
      disableBodyScroll(document.body);
    } else {
      enableBodyScroll(document.body);
    }
  },
  { immediate: false },
);
</script>

<style lang="postcss">
.z-1000 {
  z-index: 1000;
}
.dialog-grid {
  @apply grid grid-cols-1;
  @screen md {
    grid-template-columns: 4fr 5fr;
  }
}

.bg-dark-blur {
  @apply bg-dark bg-opacity-50 backdrop-blur-sm;
}

.dialog {
  &__inner {
    max-height: calc(100vh - 2rem);
    overflow-x: hidden;
    overflow-y: auto;
    @screen md {
      height: min(100vh - 2rem, 40rem);
    }
  }

  &__content {
    @screen md {
      max-height: calc(100vh - 2rem);
      height: min(100vh - 2rem, 40rem);
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
