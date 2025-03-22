/**
 * Application constants
 */

// App information
export const APP_NAME: string = 'AnginOmbak';
export const APP_TITLE: string = 'AnginOmbak';
export const APP_DESCRIPTION: string = 'Plan your windsurfing adventures';

// Page titles
export const PAGE_TITLES: { [key: string]: string } = {
  LOGIN: 'Sign in',
  PAGE_TITLE: 'Adventure Setup',
  REGISTER: 'Create Account',
};

// Checkpoint titles
export const CHECKPOINT_TITLES: { [key: string]: string } = {
  PLAYER_1: 'Primary Player',
  PLAYER_2: 'Partner Player',
  START_LOCATION: 'Starting Point',
  NUM_CHECKPOINTS: 'Route Planning',
  DURATION: 'Time Allocation',
  MAKE_PUBLIC: 'Visibility Settings',
};

// Mobile-friendly checkpoint titles (shorter)
export const MOBILE_CHECKPOINT_TITLES: { [key: string]: string } = {
  PLAYER_1: 'Primary',
  PLAYER_2: 'Partner',
  START_LOCATION: 'Start',
  NUM_CHECKPOINTS: 'Route',
  DURATION: 'Time',
  MAKE_PUBLIC: 'Visibility',
};

// Form labels
export const FORM_LABELS: { [key: string]: string } = {
  PLAYER_1: 'Primary Player:',
  PLAYER_2: 'Partner Player:',
  START_LOCATION: 'Start Location',
  CHECKPOINTS: 'Number of Checkpoints',
  START_DATE_TIME: 'Start Date and Time',
  DURATION: 'Duration',
  MAKE_EVENT_PUBLIC: 'Make Event Public',
  USERNAME: 'Username',
  REMEMBER_ME: 'Remember me',
  FORGOT_USERNAME: 'Forgot username?',
  CREATE_ACCOUNT: 'Create a New Account',
};

// Button labels
export const BUTTON_LABELS: { [key: string]: string } = {
  SIGN_IN: 'Sign In',
  BACK: 'Back',
  NEXT: 'Next',
  CONTINUE: 'Continue',
  FINISH: 'Finish',
};

// Placeholders
export const PLACEHOLDERS: { [key: string]: string } = {
  PLAYER_NAME: 'Enter player description or prompt here...',
  USERNAME: 'Username',
};
