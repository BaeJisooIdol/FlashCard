# FlashCard Learning App

An interactive flashcard application for effective learning, built with React and Bootstrap.

## Key Features

- **Flashcard Management**

  - Create, view, update, and delete flashcards
  - Support for assigning multiple categories to each flashcard
  - Search and filter flashcards by category

- **Deck Management**

  - Organize flashcards into decks
  - Create new decks with multiple categories
  - Add flashcards from multiple categories to decks
  - Edit deck information and categories

- **Learning Modes**

  - Study Mode: flip flashcards to learn
  - Quiz Mode: test your knowledge with multiple-choice questions
  - Auto-start quiz when selecting a deck
  - Display results and statistics after completing a quiz

- **Sharing and Collaboration**

  - Share decks with other users
  - Public and private decks
  - Comment and rate public decks

- **Dashboard**

  - Learning statistics and progress
  - Flashcard distribution chart by category
  - View quiz result history
  - Retry previous quizzes

- **User Interface**
  - Fully responsive design
  - Light/Dark mode switching
  - Toast notifications for actions
  - User-friendly interface

## Technology Stack

- React 18
- React Router v6+
- React Bootstrap
- React Icons
- Context API for state management
- Axios for API calls
- JSON Server for backend

## Getting Started

### Requirements

- Node.js (>= 14.x)
- npm (>= 6.x)

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory

```bash
cd flashcard-app
```

3. Install dependencies

```bash
npm install
```

### Running the Application

1. Start JSON Server (in one terminal)

```bash
npm run server
```

This will start the backend JSON server at http://localhost:5000

2. Start the React development server (in another terminal)

```bash
npm start
```

This will run the app in development mode at http://localhost:3000

## Usage

- **Home Page**: Overview of the application and features
- **Flashcards**: View, search, and manage all your flashcards
- **Shared Decks**: Explore and use public decks or decks shared with you
- **My Decks**: Manage decks you've created
- **Create Flashcard**: Add new flashcards to your collection
- **Study Mode**: Flip through flashcards to learn
- **Quiz Mode**: Test your knowledge with multiple-choice questions
- **Dashboard**: Track your progress and view your statistics

## Project Structure

```
flashcard-app/
  ├── public/              # Static resources
  ├── src/
  │   ├── assets/          # Images and resources
  │   ├── components/      # React components
  │   │   ├── common/      # Common components
  │   │   ├── dashboard/   # Dashboard components
  │   │   ├── flashcards/  # Flashcard components
  │   │   ├── layout/      # Layout components
  │   │   ├── quiz/        # Quiz mode components
  │   │   └── study/       # Study mode components
  │   ├── context/         # Context API
  │   ├── pages/           # Application pages
  │   ├── routes/          # Routing configuration
  │   ├── services/        # API and services
  │   ├── styles/          # CSS and styles
  │   └── utils/           # Utilities and helpers
  ├── db.json              # JSON Server database
  └── package.json         # Dependencies and scripts
```

## License

MIT

## Acknowledgements

- React Bootstrap for UI components
- JSON Server for mock backend
- React Icons for beautiful icon set
