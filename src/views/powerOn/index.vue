<template>
  <div class="powerOn">
    <div class="content">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQAAQMAAABF07nAAAAABlBMVEUAAAAAeNjKiRDXAAAAAXRSTlMAQObYZgAAAfhJREFUeNrt1zEVACAMxcDPwzjScFYWFHTqcFFwayJJkiRJkiRJkiRJkn67Wp1kVasbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEmSJEmSNGTPAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACRJkiRJkiRJkiRJ0gP8tfuwwWeYiQAAAABJRU5ErkJggg=="
        alt="windows11 logo"
      />
      <div class="loading">
        <i>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { onUnmounted } from "vue";

const router = useRouter();
let img: HTMLImageElement | null = null;
let timeoutId: number | null = null;

function isLoaded() {
  // 使用 public 目录中的图片，避免 Vite 预加载
  const loginImagePath = "/assets/wallpaper/login.jpg";
  
  img = new Image();
  img.src = loginImagePath;

  const handleLoad = () => {
    cleanup();
    router.push("/login");
  };

  const handleError = () => {
    cleanup();
    router.push("/login");
  };

  img.onload = handleLoad;
  img.onerror = handleError;

  timeoutId = window.setTimeout(() => {
    cleanup();
    router.push("/login");
  }, 10000);
}

function cleanup() {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  if (img) {
    img.onload = null;
    img.onerror = null;
    img = null;
  }
}

onUnmounted(() => {
  cleanup();
});

isLoaded();
</script>

<style lang="scss" scoped>
.powerOn {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  img {
    width: 136px;
    height: 136px;
    margin-bottom: 50px;
  }
}

.loading {
  width: 34px;
  height: 34px;
  position: relative;
}

.loading i {
  position: absolute;
  top: calc(50% - 17px);
  left: calc(50% - 17px);
  width: 34px;
  height: 34px;
  display: block;
}

.loading span {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.loading span:after {
  content: "";
  display: block;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 5px;
  height: 5px;
  background-color: #fff;
  border-radius: 50%;
}

.loading span:nth-child(1) {
  animation: i1 5.5s 0.2s infinite;
}

.loading span:nth-child(2) {
  animation: i2 5.5s 0.4s infinite;
}

.loading span:nth-child(3) {
  animation: i3 5.5s 0.6s infinite;
}

.loading span:nth-child(4) {
  animation: i4 5.5s 0.8s infinite;
}

.loading span:nth-child(5) {
  animation: i5 5.5s 1s infinite;
}

.loading span:nth-child(6) {
  animation: i6 5.5s 1.2s infinite;
}

@keyframes i1 {
  0% {
    opacity: 1;
    transform: rotate(190deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }
  7% {
    opacity: 1;
    transform: rotate(300deg);
    animation-timing-function: linear;
  }
  30% {
    opacity: 1;
    transform: rotate(450deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }
  39% {
    opacity: 1;
    transform: rotate(645deg);
    animation-timing-function: linear;
  }
  63% {
    opacity: 1;
    transform: rotate(800deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }
  68% {
    opacity: 1;
    transform: rotate(920deg);
    animation-timing-function: ease-in;
  }
  69% {
    opacity: 0;
    transform: rotate(930deg);
  }
}
@keyframes i2 {
  0% {
    opacity: 1;
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }
  7% {
    opacity: 1;
    transform: rotate(300deg);
    animation-timing-function: linear;
  }
  30% {
    opacity: 1;
    transform: rotate(450deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }
  39% {
    opacity: 1;
    transform: rotate(645deg);
    animation-timing-function: linear;
  }
  63% {
    opacity: 1;
    transform: rotate(800deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }
  68% {
    opacity: 1;
    transform: rotate(910deg);
    animation-timing-function: ease-in;
  }
  69% {
    opacity: 0;
    transform: rotate(920deg);
  }
}
@keyframes i3 {
  0% {
    opacity: 1;
    transform: rotate(170deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }
  7% {
    opacity: 1;
    transform: rotate(300deg);
    animation-timing-function: linear;
  }
  30% {
    opacity: 1;
    transform: rotate(450deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }
  39% {
    opacity: 1;
    transform: rotate(645deg);
    animation-timing-function: linear;
  }
  63% {
    opacity: 1;
    transform: rotate(800deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }
  68% {
    opacity: 1;
    transform: rotate(900deg);
    animation-timing-function: ease-in;
  }
  69% {
    opacity: 0;
    transform: rotate(910deg);
  }
}
@keyframes i4 {
  0% {
    opacity: 1;
    transform: rotate(160deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }
  7% {
    opacity: 1;
    transform: rotate(300deg);
    animation-timing-function: linear;
  }
  30% {
    opacity: 1;
    transform: rotate(450deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }
  39% {
    opacity: 1;
    transform: rotate(645deg);
    animation-timing-function: linear;
  }
  63% {
    opacity: 1;
    transform: rotate(800deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }
  68% {
    opacity: 1;
    transform: rotate(890deg);
    animation-timing-function: ease-in;
  }
  69% {
    opacity: 0;
    transform: rotate(900deg);
  }
}
@keyframes i5 {
  0% {
    opacity: 1;
    transform: rotate(150deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }
  7% {
    opacity: 1;
    transform: rotate(300deg);
    animation-timing-function: linear;
  }
  30% {
    opacity: 1;
    transform: rotate(450deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }
  39% {
    opacity: 1;
    transform: rotate(645deg);
    animation-timing-function: linear;
  }
  63% {
    opacity: 1;
    transform: rotate(800deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }
  68% {
    opacity: 1;
    transform: rotate(880deg);
    animation-timing-function: ease-in;
  }
  69% {
    opacity: 0;
    transform: rotate(880deg);
  }
}
@keyframes i6 {
  0% {
    opacity: 1;
    transform: rotate(140deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }
  7% {
    opacity: 1;
    transform: rotate(300deg);
    animation-timing-function: linear;
  }
  30% {
    opacity: 1;
    transform: rotate(450deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }
  39% {
    opacity: 1;
    transform: rotate(645deg);
    animation-timing-function: linear;
  }
  63% {
    opacity: 1;
    transform: rotate(800deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }
  68% {
    opacity: 1;
    transform: rotate(870deg);
    animation-timing-function: ease-in;
  }
  69% {
    opacity: 0;
    transform: rotate(880deg);
  }
}
</style>
