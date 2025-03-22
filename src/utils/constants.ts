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
  EXPLORE: 'Explore Adventures',
  RESPONSE_TITLE: 'Your Adventure',
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
  CREATE_NEW: 'Create New',
  JOIN_ADVENTURE: 'Join Adventure',
  GET_STARTED: 'Get Started',
  START: 'Start Adventure',
  REGENERATE: 'Re-generate',
};

// Placeholders
export const PLACEHOLDERS: { [key: string]: string } = {
  PLAYER_NAME: 'Enter player description or prompt here...',
  USERNAME: 'Username',
};

// Player 1 pill suggestions (Father teaching his son)
export const PLAYER1_SUGGESTIONS: { [key: string]: string } = {
  SAVING: "I want to teach my son the value of saving money. I gave him a piggy bank and encouraged him to set aside part of his allowance. Over time, he saved enough to buy something he really wanted, learning that small savings add up to big rewards.",
  INVESTING: "I want my son to understand how investing works. I set up a small stock portfolio in his name and showed him how companies grow over time. Years later, he used the investment gains to support his education, realizing the power of long-term financial planning.",
  BUDGETING: "I want to teach my son how to budget. During a grocery trip, I gave him a set amount of money and asked him to plan our meals for the week. He learned to compare prices, prioritize essentials, and avoid impulse spending, gaining a real-world understanding of financial responsibility."
};

// Player 2 pill suggestions (Son learning about the world)
export const PLAYER2_SUGGESTIONS: { [key: string]: string } = {
  VISIT_PARK: "I want to explore nature, so I visited a park with my dad. We watched squirrels, identified different trees, and even tried flying a kite. Every visit felt like a new adventure, making me more curious about the environment.",
  VISIT_BEACH: "I want to learn more about the ocean, so I went to the beach. I collected seashells, built sandcastles, and discovered how waves shape the shore. My dad explained why some shells are smooth while others are rough, making me see the beach as more than just a fun place—it’s full of science and history.",
  VISIT_HOTSPRINGS: "I want to see a hot spring, so we visited one during a road trip. As I soaked in the warm water, I learned how the Earth’s heat creates these natural wonders. The experience made me curious about geology and how nature works beneath the surface."
};
