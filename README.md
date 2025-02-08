# 📸 Social Photo Feed

![GitHub repo size](https://img.shields.io/github/repo-size/knizinsky/react-my-photo-feed)
![GitHub contributors](https://img.shields.io/github/contributors/knizinsky/react-my-photo-feed)
![GitHub stars](https://img.shields.io/github/stars/knizinsky/react-my-photo-feed?style=social)
![GitHub forks](https://img.shields.io/github/forks/knizinsky/react-my-photo-feed?style=social)

Social Photo Feed to aplikacja społecznościowa do udostępniania zdjęć, zbudowana przy użyciu React, TypeScript i Vite. Użytkownicy mogą dodawać zdjęcia, posty, komentować oraz przeglądać profile innych użytkowników.

## 🚀 Funkcje

- 📸 Dodawanie i przeglądanie zdjęć
- 📝 Tworzenie i przeglądanie postów
- 💬 Komentowanie postów
- 👤 Przeglądanie profili użytkowników
- 🔒 Autoryzacja i uwierzytelnianie za pomocą Supabase

## 🛠️ Technologie

- **React** - Biblioteka do budowania interfejsów użytkownika
- **TypeScript** - Język programowania z typowaniem statycznym
- **Vite** - Narzędzie do budowania aplikacji
- **Supabase** - Backend jako usługa (BaaS)
- **Styled Components** - Stylowanie komponentów w React

## 📦 Instalacja

1. Sklonuj repozytorium:

   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo```

2. Zainstaluj zależności:

```sh 
npm install
```

3. Skonfiguruj zmienne środowiskowe w pliku .env:

```sh
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Uruchom aplikację w trybie deweloperskim:

```sh
npm run dev
```

## 📄 Skrypty

- `npm run dev` - Uruchamia aplikację w trybie deweloperskim
- `npm run build` - Buduje aplikację do produkcji
- `npm run lint` - Uruchamia ESLint w celu sprawdzenia kodu
- `npm run preview` - Uruchamia podgląd zbudowanej aplikacji

## 📚 Struktura projektu
```
├── public/
│   ├── background.jpg
│   ├── default-user-avatar.jpg
│   └── favicon.jpg
├── src/
│   ├── components/
│   │   ├── CheckSession.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── PhotoCard.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── ui/
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── FeedPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── PostsPage.tsx
│   │   └── UserPage.tsx
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── supabaseClient.ts
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🖼️ Zrzuty ekranu
![image](https://github.com/user-attachments/assets/0d89f600-549c-46a7-bd75-da0033e7a08c)
