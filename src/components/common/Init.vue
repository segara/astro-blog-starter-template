<template>
  <div class="hide hidden"></div>
</template>

<script setup>
import { watch, ref, onMounted, onUnmounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useDebounceFn } from "@vueuse/core";
import { showContact } from "@src/store";
const { width } = useWindowSize();
const shown = ref(false);
let contactClickHandler;
let contactHashHandler;

onMounted(() => {
  const root = document.documentElement;
  const html = document.getElementsByTagName("html")[0];
  const start = new Date().getTime();

  /* GET TIME TO LOAD PAGE */
  window.onload = function () {
    const end = new Date().getTime();
    const timeTaken = end - start;
    document.documentElement.setAttribute(
      "data-speed",
      Math.round(timeTaken / 1000),
    );
  };
  /* CHECK IF IS IOS DEVICE */
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) {
    document.documentElement.setAttribute("data-ios", 1);
  }
  /* SET SCROLL BEHAVIOR (PAGE VIEW ANIMATIONS + SMOOTH SCROLL IS NOT WORKING ) */
  setTimeout(() => {
    html.style["scroll-behavior"] = "smooth";
  }, 500);

  /* SCROLL OBSERVER FOR PAGE */
  let prevPos = 0;
  let isScrollingUp = false;

  function flip(attr, state) {
    root.setAttribute(attr, String(state));
  }

  // Set initial states to ensure UI elements (like header) are visible
  flip("data-is-scrolling-up", true);
  flip("data-is-top", window.scrollY < 100);
  flip(
    "data-is-bottom",
    window.scrollY + window.innerHeight > document.body.offsetHeight - 100,
  );

  const scrollHandler = useDebounceFn(() => {
    const pos = window.scrollY;
    const delta = pos - prevPos;
    const scrollDirection = Math.sign(delta) === -1;
    const isBottom =
      pos + window.innerHeight > document.body.offsetHeight - 100;
    const isTop = pos < 100;

    if (delta < -15 || delta > 15) {
      isScrollingUp = scrollDirection;
    }

    flip("data-is-scrolling-up", isScrollingUp);
    flip("data-is-bottom", isBottom);
    flip("data-is-top", isTop);

    prevPos = pos;
  }, 20);

  window.addEventListener("scroll", () => scrollHandler(), { passive: true });

  contactClickHandler = (e) => {
    const contactLink = e.target.closest?.("a[href='#contact']");
    if (contactLink) {
      e.preventDefault();
      showContact.set(true);
    }
  };

  document.addEventListener("click", contactClickHandler);

  contactHashHandler = () => {
    if (window.location.hash === "#contact") {
      showContact.set(true);
    }
  };

  window.addEventListener("hashchange", contactHashHandler);
  contactHashHandler();

  /* PARALLAX ANIMATIONS */
  const parallaxReveal = document.querySelectorAll(".nebulix-parallax");
  const canUseScrollTimeline =
    typeof ViewTimeline !== "undefined" &&
    typeof CSS !== "undefined" &&
    typeof CSS.percent === "function";

  if (!document.documentElement.dataset.ios && canUseScrollTimeline) {
    parallaxReveal.forEach((el) => {
      const img = el.querySelector(".parallax");
      if (!img?.animate) return;

      img.animate(
        {
          transform: ["none", "translateY(30%)"],
        },
        {
          fill: "both",
          timeline: new ViewTimeline({ subject: el }),
          rangeStart: { rangeName: "exit", offset: CSS.percent(5) },
          rangeEnd: { rangeName: "exit", offset: CSS.percent(100) },
        },
      );
    });
  }
});

onUnmounted(() => {
  if (contactClickHandler) {
    document.removeEventListener("click", contactClickHandler);
  }
  if (contactHashHandler) {
    window.removeEventListener("hashchange", contactHashHandler);
  }
});
/* CREDITS, PLEASE LEAVE THIS IN PLACE */
watch(width, (val) => {
  if (!shown.value) {
    console.log(
      "%c ♻️🔋+ 🧠👷🏽+ 🗜 = 🚀🍃🌐" +
        "\n%cThis site has a low carbon footprint " +
        "\n%c🪙CREDITS:" +
        "\n%cTheme based on Nebulix 🌌" +
        "\n%cby: https://unfolding.io",
      "font-family:Verdana; font-size: 20px; color: #2A4D47; font-weight:bold; padding: 5px 0; opacity: 0.5; ",
      "font-family:Verdana; font-size: 25px; color: #2A4D47; font-weight:bold; padding: 5px 0; ",
      "font-family:Verdana; font-size:16px; color: #2A4D47; font-weight:bold;  padding: 5px 0; ",
      "font-family:Verdana; font-size:12px; color: #2A4D47; padding: 2px 0; ",
      "font-family:Verdana; font-size:12px; color: #2A4D47; padding: 2px 0; ",
    );
    shown.value = true;
  }
});
</script>
