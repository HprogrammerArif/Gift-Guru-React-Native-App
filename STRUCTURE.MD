project-root/
├── app/
│   ├── screens/
│   │   ├── AuthStack/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── MainStack/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── SplashScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── TextInput.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── features/
│   │   │   ├── UserProfile/
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   └── ProfileStats.tsx
│   │   │   └── PostList/
│   │   │       ├── PostCard.tsx
│   │   │       └── PostActions.tsx
│   │   └── index.ts
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── linking.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── storage.ts
│   │   └── notifications.ts
│   ├── state/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   └── postsSlice.ts
│   │   ├── store.ts
│   │   └── hooks.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   └── useStorage.ts
│   ├── styles/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── theme.ts
│   └── App.tsx
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── __tests__/
│   ├── components/
│   ├── screens/
│   ├── utils/
│   └── hooks/
├── app.json
├── package.json
├── tsconfig.json
└── babel.config.js