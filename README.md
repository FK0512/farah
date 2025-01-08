README
GitHub Repositories App
This project is a React Native application that allows users to search GitHub repositories, view details about them, and manage a list of their favorite repositories.

Installation and Setup
Prerequisites
Node.js:
Install Node.js (v14.x or later is recommended). Download Node.js 
npm or yarn: Ensure you have either npm (comes with Node.js) or Yarn installed for dependency management.
React Native CLI: If you're running this on a physical device/emulator, install the React Native CLI.

Android/iOS Development Environment:
For Android: Install Android Studio.
For iOS: Ensure Xcode is installed (macOS only).

Steps to Install
Clone the repository:


git clone <repository-url>
cd <repository-folder>
Install dependencies:

npm install
Start the app:

For Android:
npx react-native run-android

For iOS (macOS only):
npx react-native run-ios

Dependencies
The following dependencies are required to run this project:

React: A JavaScript library for building user interfaces.
React Native: Framework for building native apps using React.
Axios: For making HTTP requests.

npm install axios
React Navigation: For navigating between screens.

npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons
Also, install the stack navigator:

npm install @react-navigation/stack

-----Features------
1.Search GitHub Repositories:
Users can search repositories by name.

2.View Repository Details:
Displays owner, description, stars, forks, and language.

3.Manage Favorites:
Add repositories to favorites.

4.Remove repositories from favorites.

5.Navigation:
Navigate between Home, Details, and Favorites screens.