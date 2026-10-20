# My Mental

**iOS Mental Health Journaling Platform**

Bachelor of Computer and Information Sciences — Research and Development  
Auckland University of Technology (AUT)  
Project Group: Mental Health Tracking App on iOS Platform — P12

## 1. Project Overview

My Mental is a mental health journaling application developed using React Native, Expo, TypeScript, and Firebase. It allows users to record journal entries and track personal wellbeing metrics over time.

This README explains how to set up the development environment, configure Firebase, and run the application on a compatible iOS device using Expo Go.

## 2. Development Requirements

Before setting up the project, ensure you have the following:

- A computer capable of running the required development tools.
- [Visual Studio Code](https://code.visualstudio.com/download) — recommended IDE.
- [Node.js](https://nodejs.org/en/download) — required to run the JavaScript development environment and npm.
- An active internet connection.
- An iOS device compatible with [Expo Go](https://expo.dev/go).
- Access to the project's GitHub repository.
- Access to the required Firebase project configuration.
- An Expo account for the login workflow described below.

## 3. Clone the Repository

### Step 1: Sign in to GitHub through Visual Studio Code

1. Open Visual Studio Code.
2. Select the Accounts icon in the bottom-left corner.
3. Select **Sign in → Continue with GitHub**.
4. Authenticate using an authorised GitHub account.

### Step 2: Clone the project

1. Open the Explorer panel using the file icon on the left.
2. Select **Clone Repository**.
3. Choose **Clone from GitHub**.
4. Select the repository: [Karlos-Schaaf/mymental](https://github.com/Karlos-Schaaf/mymental).
5. Choose a suitable local folder for the repository.
6. Open the cloned repository in Visual Studio Code.

### Step 3: Install dependencies

Open a new terminal in Visual Studio Code and navigate to the `MyMental` project directory:

```bash
cd MyMental
npm ci
```

The `npm ci` command installs the dependencies specified by the project's lockfile. It provides a consistent installation of the packages required by the application.

If the terminal is already in the `MyMental` directory, you do not need to run `cd MyMental` again.

## 4. Configure Firebase

The application uses Firebase for authentication and Firestore for storing user preferences and journal entries.

### Step 1: Create the environment file

Create a file named `.env` in the `MyMental` project root, alongside `package.json`.

### Step 2: Add the Firebase configuration

Copy the following template into `.env` and replace the placeholders with the corresponding values from the authorised Firebase project configuration.

```
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

**Important:** Obtain the actual values through the authorised project handover process. Do not commit the `.env` file or real credentials to GitHub.

These variables configure the application to connect to the intended Firebase project. They do not, by themselves, grant database access. Firebase Authentication and Firestore security rules determine which operations a signed-in user is permitted to perform.

## 5. Run the Application Using Expo Go

### Step 1: Sign in to Expo Go

1. Install and open Expo Go on your compatible iOS device.
2. Open the profile menu and sign in if prompted, using an authorised Expo account.

### Step 2: Sign in to Expo through the terminal

In the Visual Studio Code terminal, run:

```bash
npx expo login
```

Follow the prompts to authenticate with an authorised Expo account.

If the installed Expo CLI does not recognise this command, follow the login instructions provided by your installed Expo tooling.

### Step 3: Start the development server

Run:

```bash
npx expo start
```

Expo starts the development server and displays a QR code in the terminal or development interface.

### Step 4: Open My Mental on your iPhone

1. Ensure your computer and iPhone can communicate over the network.
2. Open Expo Go on the iPhone.
3. Scan the QR code displayed by Expo.
4. Wait for the application bundle to load.

The My Mental application should now open on your device.

If the application fails to load, check that dependencies are installed, the `.env` file is configured correctly, and the computer and phone have a working network connection.

## 6. Testing Account and Service Access

The project may require authorised access to the following services:

- **GitHub:** Access to clone the source repository.
- **Firebase:** Access to the project's configuration and backend services.
- **Expo:** Access to the development workflow described above.
- **Gmail:** Access only where required for the designated test account or related project services.

## 8. Troubleshooting

| Problem | Suggested action |
|---|---|
| Dependencies fail to install | Confirm Node.js is installed, then run `npm ci` from the project directory. |
| Expo cannot resolve a package or plugin | Check the Expo configuration and confirm that required dependencies are installed. |
| Firebase configuration errors | Check that `.env` exists in the project root and that the variable names and values are correct. |
| The QR code does not load the app | Confirm the phone and computer can communicate, then restart with `npx expo start --clear`. |
| Login or registration fails | Check the credentials, internet connection, Firebase Authentication configuration, and displayed error message. |
| Firestore operations fail | Check Firebase Authentication status and the project's Firestore security rules. |
