# MyMental — Mental Health Journaling Platform

MyMental is an iOS-focused mental health journaling application developed as part of the Bachelor of Computer and Information Sciences Research & Development (R&D) project at Auckland University of Technology (AUT).

The application helps users record daily journal entries, track personal wellbeing metrics, and review patterns in their wellbeing over time.

## Project Overview

**Project:** MyMental — iOS Mental Health Journaling Platform  

## Features

- **Daily journaling:** Create and manage personal journal entries.
- **Mood tracking:** Record mood using five levels, from very bad to great.
- **Wellbeing metrics:** Track sleep, physical activity, social interaction, productivity, screen time, stress, and energy.
- **Dashboard:** Review journal activity and wellbeing summaries.
- **Insights:** Explore relationships between tracked metrics and recorded mood.
- **Journal history:** View, edit, and delete journal entries.
- **User authentication:** Register and sign in using Firebase Authentication.
- **Cloud storage:** Store journal entries in Firebase Cloud Firestore, associated with individual user accounts.
- **Customisable tracking:** Select which wellbeing metrics are included in the journaling process.

MyMental is a journaling and self-reflection tool. It is not intended to replace professional mental health care or provide a clinical diagnosis.

## Technology Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile application framework |
| Expo | Development environment and application tooling |
| Expo Router | File-based navigation |
| TypeScript | Application development with static typing |
| Firebase Authentication | User registration and authentication |
| Cloud Firestore | Cloud database for user and journal data |
| Zustand | Application state management |
| AsyncStorage | Local persistent storage where configured |

## Project Structure

The application source code is located in the `MyMental/` directory of this repository.

```text
mymental/
└── MyMental/
    ├── app/
    │   ├── authentication/
    │   ├── (tabs)/
    │   │   ├── dashboard
    │   │   ├── journal
    │   │   ├── insights
    │   │   └── profile
    │   └── entry/
    │       ├── new
    │       └── [id]
    ├── src/
    ├── store/
    ├── scripts/
    ├── package.json
    ├── package-lock.json
    └── tsconfig.json
```

The `app/` directory contains the application's routes and screens. Supporting components, application logic, state management, and configuration are organised in the other source directories.

## Getting Started

### Prerequisites

Before running the application, ensure you have:

- Node.js and npm installed.
- Git installed.
- Expo Go installed on a compatible iOS device.
- Access to the required Firebase project configuration.
- Internet access for dependency installation and Firebase services.

### 1. Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/Karlos-Schaaf/mymental.git
cd mymental/MyMental
```

### 2. Install dependencies

Run:

```bash
npm ci
```

This installs the dependencies recorded in `package-lock.json`.

### 3. Configure Firebase

Create a `.env` file in the `MyMental/` directory. Add the Firebase configuration values supplied through the authorised project handover channel.

Use the following template:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Fill in the values before starting the application. Do not commit the `.env` file to GitHub.

The application requires the corresponding Firebase project to have Email/Password Authentication enabled and Cloud Firestore configured with the appropriate security rules.

### 4. Start the application

Run the development server:

```bash
npx expo start
```

Open Expo Go on your iOS device and scan the QR code displayed in the terminal or development interface.

Keep the development server running while using the application. Your computer and mobile device should be connected to a network that allows them to communicate.

For more detailed setup and troubleshooting instructions, refer to the **Final Build Instructions** provided with the project portfolio.

## Available Commands

Run these commands from the `MyMental/` directory.

| Command | Description |
|---|---|
| `npm start` | Start the Expo development server |
| `npm run ios` | Start Expo with the iOS simulator option |
| `npm run android` | Start Expo with the Android option |
| `npm run web` | Start the web development option |
| `npm run lint` | Run the configured linting command |

The availability of a command does not mean that platform has been fully tested. The primary handover workflow is running the application through Expo Go on iOS.


## Known Scope and Limitations

- The primary intended platform is iOS through Expo Go.
- Running the application requires the appropriate Firebase configuration and backend access.
- Android, web, and standalone production builds should be treated as unverified unless supported by recorded testing evidence.
- Insights depend on the availability and quality of recorded journal data.
- MyMental is a wellbeing journaling application, not a diagnostic or emergency mental health service.
