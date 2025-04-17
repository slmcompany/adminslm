<template>
  <div class="privacy-page">
    <div class="privacy-container">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="css" scoped>
.privacy-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
  min-height: 100vh;
  padding: 20px;
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.privacy-container {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 1024px;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  overflow-y: auto;
}

@media (max-width: 1100px) {
  .privacy-container {
    max-width: 90%;
    padding: 20px;
  }
}

@media (max-width: 600px) {
  .privacy-container {
    max-width: 100%;
    padding: 15px;
    margin: 10px;
  }
}
</style>
