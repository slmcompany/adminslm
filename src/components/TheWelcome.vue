<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <a-row :gutter="[16, 16]">
    <a-col :span="24">
      <a-card>
        <WelcomeItem>
          <template #icon>
            <DocumentationIcon />
          </template>
          <template #heading>Documentation</template>

          Vue's
          <a-typography-link href="https://vuejs.org/" target="_blank">official documentation</a-typography-link>
          provides you with all information you need to get started.
        </WelcomeItem>
      </a-card>
    </a-col>

    <a-col :span="24">
      <a-card>
        <WelcomeItem>
          <template #icon>
            <ToolingIcon />
          </template>
          <template #heading>Tooling</template>

          This project is served and bundled with
          <a-typography-link href="https://vite.dev/guide/features.html" target="_blank">Vite</a-typography-link>. The
          recommended IDE setup is
          <a-typography-link href="https://code.visualstudio.com/" target="_blank">VSCode</a-typography-link>
          +
          <a-typography-link href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a-typography-link>. If
          you need to test your components and web pages, check out
          <a-typography-link href="https://vitest.dev/" target="_blank">Vitest</a-typography-link>
          and
          <a-typography-link href="https://www.cypress.io/" target="_blank">Cypress</a-typography-link>
          /
          <a-typography-link href="https://playwright.dev/" target="_blank">Playwright</a-typography-link>.

          <br />

          More instructions are available in
          <a-typography-link @click="openReadmeInEditor"><code>README.md</code></a-typography-link>.
        </WelcomeItem>
      </a-card>
    </a-col>

    <a-col :span="24">
      <a-card>
        <WelcomeItem>
          <template #icon>
            <EcosystemIcon />
          </template>
          <template #heading>Ecosystem</template>

          Get official tools and libraries for your project:
          <a-typography-link href="https://pinia.vuejs.org/" target="_blank">Pinia</a-typography-link>,
          <a-typography-link href="https://router.vuejs.org/" target="_blank">Vue Router</a-typography-link>,
          <a-typography-link href="https://test-utils.vuejs.org/" target="_blank">Vue Test Utils</a-typography-link>, and
          <a-typography-link href="https://github.com/vuejs/devtools" target="_blank">Vue Dev Tools</a-typography-link>. If
          you need more resources, we suggest paying
          <a-typography-link href="https://github.com/vuejs/awesome-vue" target="_blank">Awesome Vue</a-typography-link>
          a visit.
        </WelcomeItem>
      </a-card>
    </a-col>

    <a-col :span="24">
      <a-card>
        <WelcomeItem>
          <template #icon>
            <CommunityIcon />
          </template>
          <template #heading>Community</template>

          Got stuck? Ask your question on
          <a-typography-link href="https://chat.vuejs.org" target="_blank">Vue Land</a-typography-link>
          (our official Discord server), or
          <a-typography-link href="https://stackoverflow.com/questions/tagged/vue.js" target="_blank">StackOverflow</a-typography-link>. You should also follow the official
          <a-typography-link href="https://bsky.app/profile/vuejs.org" target="_blank">@vuejs.org</a-typography-link>
          Bluesky account or the
          <a-typography-link href="https://x.com/vuejs" target="_blank">@vuejs</a-typography-link>
          X account for latest news in the Vue world.
        </WelcomeItem>
      </a-card>
    </a-col>

    <a-col :span="24">
      <a-card>
        <WelcomeItem>
          <template #icon>
            <SupportIcon />
          </template>
          <template #heading>Support Vue</template>

          As an independent project, Vue relies on community backing for its sustainability. You can help
          us by
          <a-typography-link href="https://vuejs.org/sponsor/" target="_blank">becoming a sponsor</a-typography-link>.
        </WelcomeItem>
      </a-card>
    </a-col>
  </a-row>
</template>
