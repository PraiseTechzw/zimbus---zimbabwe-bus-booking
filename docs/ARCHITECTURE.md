# ZimBus Project Architecture

This document describes the high-level architecture of the ZimBus platform.

## 🏗️ Technical Architecture

ZimBus is a modern, single-page application (SPA) built with React and powered by a serverless backend using Firebase.

### Frontend Layer (React + Vite)
The application is built using React for UI components and Vite for extreme build performance and hot reloading.

- **Routing**: Client-side routing is managed through the `View` state in `App.tsx`, providing a dynamic and fast navigation experience without page reloads.
- **State Management**: Primary application state is managed using React Hooks (`useState`, `useEffect`).
- **Styling**: Tailwind CSS 4.0 is used for atomic styling, ensuring a consistent design system while keeping the final CSS bundle small.

### Interaction Layer (Motion)
We use `motion/react` (formerly Framer Motion) to create smooth transitions, parallax effects, and micro-interactions that elevate the user experience.

- **Transitions**: Every major view switch is animated with a slide or fade effect.
- **Hero Animation**: Parallax and scale effects are used on the landing page for visual depth.

### Backend Layer (Firebase)
The application relies on Firebase for all backend services, making it scalable and secure.

- **Authentication**: Firebase Auth provides Google Sign-In, allowing for secure and simple user onboarding.
- **Database (Firestore)**: NoSQL database storing:
  - `users`: Profile and role information.
  - `bookings`: Booking records linked to users and buses.
  - `buses`: Dynamic schedule and pricing information (mocked).
- **Security Rules**: Firestore Rules ensure that users can only read/write their own data and that booking rules are strictly followed.

---

## 📂 Project Structure

- `src/`: Root of source code.
  - `components/`: Modular, reusable UI components.
  - `constants/`: Global fixed data like cities and mock buses.
  - `types/`: TypeScript definitions.
  - `firebase.ts`: Firebase SDK initialization and auth/firestore utilities.
  - `App.tsx`: Main application controller and routing logic.
- `index.html`: Entry point with SEO and font configuration.
- `index.css`: Global design tokens and glass-morphism utilities.
- `firebase.rules`: Security configuration for Firestore.

---

## 🔄 Search & Booking Flow

1.  **Search**: User selects dynamic cities and date in `SearchForm`.
2.  **Filter**: Results are retrieved (mocked from `constants`) and filtered/sorted in `App.tsx`.
3.  **Select**: User picks a bus, triggering a view change to `SeatPicker`.
4.  **Confirm**: User selects a seat and confirms.
5.  **Auth**: If not signed in, a Google popup is triggered.
6.  **Execute**: Once authenticated, the booking is saved to Firestore and confirmed.
