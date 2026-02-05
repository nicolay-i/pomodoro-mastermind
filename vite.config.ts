import { defineConfig, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")?.[1];
  const isUserOrOrgPages = !!repoName && repoName.endsWith(".github.io");
  const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
  const base =
    isGitHubPagesBuild && repoName && !isUserOrOrgPages ? `/${repoName}/` : "/";

  return {
    base,
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
});
