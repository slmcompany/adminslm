<template>
  <a-row class="item" align="middle">
    <a-col :span="2">
      <div class="icon-container">
        <slot name="icon"></slot>
      </div>
    </a-col>
    <a-col :span="22">
      <div class="details">
        <a-typography-title :level="3">
          <slot name="heading"></slot>
        </a-typography-title>
        <a-typography-paragraph>
          <slot></slot>
        </a-typography-paragraph>
      </div>
    </a-col>
  </a-row>
</template>

<style scoped>
.item {
  margin-bottom: 16px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text);
}

.details {
  margin-left: 16px;
}

@media (min-width: 1024px) {
  .icon-container {
    width: 50px;
    height: 50px;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
  }
}
</style>
