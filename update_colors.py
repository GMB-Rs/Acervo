import json

# Official brand colors for all 53 libraries
colors = {
    "shadcn-ui": "#000000",
    "radix-ui": "#161618",
    "react-aria-components": "#6733FF",
    "headless-ui": "#66E3FF",
    "ark-ui": "#EB5E41",
    "mantine": "#339AF0",
    "ant-design": "#1677FF",
    "mui": "#0079F5",
    "chakra-ui": "#14BCAA",
    "semantic-ui-react": "#00B5AD",
    "base-ui": "#EDEDED",
    "tanstack-form": "#FF5F5F",
    "react-hook-form": "#EC5990",
    "formik": "#0052CC",
    "tanstack-table": "#FFA05C",
    "ag-grid": "#FF8B00",
    "recharts": "#FC521F",
    "visx": "#FF5A5F",
    "lucide-react": "#F56565",
    "phosphor-icons": "#C4E456",
    "heroicons": "#8B5CF6",
    "iconify": "#026C9C",
    "framer-motion": "#0055FF",
    "gsap": "#0AE448",
    "auto-animate": "#FF6B6B",
    "tailwindcss": "#38BDF8",
    "unocss": "#858585",
    "panda-css": "#F6E458",
    "styled-components": "#DB7093",
    "emotion": "#D36AC2",
    "vue": "#42B883",
    "vuetify": "#1867C0",
    "naive-ui": "#5FBC21",
    "element-plus": "#409EFF",
    "primevue": "#10B981",
    "svelte": "#FF3E00",
    "shadcn-svelte": "#EC4F27",
    "skeleton": "#101010",
    "angular-material": "#FF32D9",
    "ngx-bootstrap": "#7952B3",
    "kobalte": "#0284C7",
    "hope-ui": "#00A6E2",
    "qwik-ui": "#00B9FC",
    "material-web": "#00639B",
    "webawesome": "#F36944",
    "lit": "#324FFF",
    "ionic": "#3880FF",
    "hyperui": "#06B6D4",
    "uiverse": "#060606",
    "daisyui": "#FFC63A",
    "flowbite": "#1B64F2",
    "bulma": "#00D1B2",
    "open-props": "#3B5BDB",
}

with open("src/data/libraries.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for lib in data:
    slug = lib["slug"]
    if slug in colors:
        lib["color"] = colors[slug]
    else:
        print(f"WARNING: No color for {slug}")

with open("src/data/libraries.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated all colors")
print(json.dumps(colors, indent=2))