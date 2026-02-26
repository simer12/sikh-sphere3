// Translation strings for English and Punjabi

export type Language = 'en' | 'pa';

export interface Translations {
  // Navigation
  home: string;
  nitnem: string;
  dasamGranth: string;
  history: string;
  more: string;
  profile: string;
  
  // Common
  loading: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  back: string;
  search: string;
  close: string;
  yes: string;
  no: string;
  ok: string;
  
  // Home Screen
  dailyHukamnama: string;
  liveKirtan: string;
  quickAccess: string;
  morningPrayers: string;
  eveningPrayers: string;
  explore: string;
  
  // Nitnem
  nitnemTitle: string;
  nitnemDescription: string;
  morningNitnem: string;
  eveningNitnem: string;
  nightNitnem: string;
  
  // Banis
  japjiSahib: string;
  jaapSahib: string;
  tavPrasadSavaiye: string;
  chaupaiSahib: string;
  anandSahib: string;
  rehrasSahib: string;
  kirtanSohila: string;
  
  // Profile
  editProfile: string;
  preferences: string;
  readingHistory: string;
  bookmarks: string;
  notifications: string;
  helpSupport: string;
  about: string;
  logout: string;
  
  // Preferences
  display: string;
  fontSize: string;
  small: string;
  medium: string;
  large: string;
  extraLarge: string;
  darkMode: string;
  language: string;
  primaryLanguage: string;
  audio: string;
  autoPlay: string;
  downloads: string;
  wifiOnly: string;
  resetToDefault: string;
  
  // Notifications
  notificationsTitle: string;
  dailyHukamnamaNotif: string;
  nitnemReminder: string;
  gurpurabReminder: string;
  weeklyProgress: string;
  newContent: string;
  
  // Reading History
  readingHistoryTitle: string;
  dayStreak: string;
  totalReads: string;
  minutes: string;
  uniqueBanis: string;
  noHistory: string;
  startReading: string;
  
  // Bookmarks
  bookmarksTitle: string;
  noBookmarks: string;
  addBookmark: string;
  removeBookmark: string;
  all: string;
  
  // Calendar
  sikhCalendar: string;
  gurpurab: string;
  martyrdom: string;
  historical: string;
  
  // Messages
  signInRequired: string;
  comingSoon: string;
  error: string;
  success: string;
  
  // Misc
  readMore: string;
  showLess: string;
  share: string;
  today: string;
  yesterday: string;
  
  // Authentication
  login: string;
  signup: string;
  signIn: string;
  signUp: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  forgotPassword: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  orContinueWith: string;
  googleSignIn: string;
  guestContinue: string;
  
  // Nitnem Screen
  dailyPrayers: string;
  nitnemBanis: string;
  loadingAuthentic: string;
  pleaseWait: string;
  connectionError: string;
  retry: string;
  loadedFromAPI: string;
  lines: string;
  readNow: string;
  
  // Bani Detail
  gurmukhi: string;
  transliteration: string;
  translation: string;
  meaning: string;
  
  // Bookmarks Detail
  myBookmarks: string;
  filterBookmarks: string;
  remove: string;
  areYouSure: string;
  removeBookmarkConfirm: string;
  addToBookmarks: string;
  
  // Reading History Detail
  currentStreak: string;
  daysInRow: string;
  readingStats: string;
  clearHistory: string;
  clearAllHistory: string;
  exploreBarns: string;
  
  // Notifications Detail
  enableNotifications: string;
  dailyReminders: string;
  morningReminder: string;
  eveningReminder: string;
  nightReminder: string;
  
  // Edit Profile
  displayName: string;
  profilePhoto: string;
  accountInfo: string;
  emailAddress: string;
  userId: string;
  memberSince: string;
  saveChanges: string;
  changePhoto: string;
  
  // Common Messages
  fillAllFields: string;
  invalidEmail: string;
  passwordsNotMatch: string;
  loginFailed: string;
  signupFailed: string;
  welcomeBack: string;
  accountCreated: string;
  savedSuccessfully: string;
  errorOccurred: string;
  tryAgain: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    home: 'Home',
    nitnem: 'Nitnem',
    dasamGranth: 'Dasam Granth',
    history: 'History',
    more: 'More',
    profile: 'Profile',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    search: 'Search',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    
    // Home Screen
    dailyHukamnama: 'Daily Hukamnama',
    liveKirtan: 'Live Kirtan',
    quickAccess: 'Quick Access',
    morningPrayers: 'Morning Prayers',
    eveningPrayers: 'Evening Prayers',
    explore: 'Explore',
    
    // Nitnem
    nitnemTitle: 'Daily Nitnem',
    nitnemDescription: 'Essential Sikh prayers for daily practice',
    morningNitnem: 'Morning Nitnem',
    eveningNitnem: 'Evening Nitnem',
    nightNitnem: 'Night Nitnem',
    
    // Banis
    japjiSahib: 'Japji Sahib',
    jaapSahib: 'Jaap Sahib',
    tavPrasadSavaiye: 'Tav-Prasad Savaiye',
    chaupaiSahib: 'Chaupai Sahib',
    anandSahib: 'Anand Sahib',
    rehrasSahib: 'Rehras Sahib',
    kirtanSohila: 'Kirtan Sohila',
    
    // Profile
    editProfile: 'Edit Profile',
    preferences: 'Preferences',
    readingHistory: 'Reading History',
    bookmarks: 'Bookmarks',
    notifications: 'Notifications',
    helpSupport: 'Help & Support',
    about: 'About',
    logout: 'Logout',
    
    // Preferences
    display: 'Display',
    fontSize: 'Font Size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    extraLarge: 'Extra Large',
    darkMode: 'Dark Mode',
    language: 'Language',
    primaryLanguage: 'Primary Language',
    audio: 'Audio',
    autoPlay: 'Auto-play Audio',
    downloads: 'Downloads',
    wifiOnly: 'Download on WiFi Only',
    resetToDefault: 'Reset to Default',
    
    // Notifications
    notificationsTitle: 'Notifications',
    dailyHukamnamaNotif: 'Daily Hukamnama',
    nitnemReminder: 'Nitnem Reminders',
    gurpurabReminder: 'Gurpurab Reminders',
    weeklyProgress: 'Weekly Progress',
    newContent: 'New Content',
    
    // Reading History
    readingHistoryTitle: 'Reading History',
    dayStreak: 'Day Streak',
    totalReads: 'Total Reads',
    minutes: 'Minutes',
    uniqueBanis: 'Unique Banis',
    noHistory: 'No Reading History',
    startReading: 'Start reading Banis to track your spiritual journey',
    
    // Bookmarks
    bookmarksTitle: 'My Bookmarks',
    noBookmarks: 'No Bookmarks Yet',
    addBookmark: 'Add Bookmark',
    removeBookmark: 'Remove Bookmark',
    all: 'All',
    
    // Calendar
    sikhCalendar: 'Sikh Calendar',
    gurpurab: 'Gurpurab',
    martyrdom: 'Martyrdom',
    historical: 'Historical',
    
    // Messages
    signInRequired: 'Sign In Required',
    comingSoon: 'Coming Soon',
    error: 'Error',
    success: 'Success',
    
    // Misc
    readMore: 'Read More',
    showLess: 'Show Less',
    share: 'Share',
    today: 'Today',
    yesterday: 'Yesterday',
    
    // Authentication
    login: 'Login',
    signup: 'Sign Up',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    orContinueWith: 'Or continue with',
    googleSignIn: 'Continue with Google',
    guestContinue: 'Continue as Guest',
    
    // Nitnem Screen
    dailyPrayers: 'Daily Prayers',
    nitnemBanis: 'Nitnem Banis',
    loadingAuthentic: 'Loading authentic Gurbani from BaniDB...',
    pleaseWait: 'Please wait while we fetch the prayers',
    connectionError: 'Connection Error',
    retry: 'Retry',
    loadedFromAPI: 'Loaded from BaniDB API',
    lines: 'lines',
    readNow: 'Read Now',
    
    // Bani Detail
    gurmukhi: 'Gurmukhi',
    transliteration: 'Transliteration',
    translation: 'Translation',
    meaning: 'Meaning',
    
    // Bookmarks Detail
    myBookmarks: 'My Bookmarks',
    filterBookmarks: 'Filter',
    remove: 'Remove',
    areYouSure: 'Are you sure?',
    removeBookmarkConfirm: 'Are you sure you want to remove this bookmark?',
    addToBookmarks: 'Add to Bookmarks',
    
    // Reading History Detail
    currentStreak: 'Current Streak',
    daysInRow: 'days in a row',
    readingStats: 'Reading Statistics',
    clearHistory: 'Clear History',
    clearAllHistory: 'Clear all reading history?',
    exploreBarns: 'Explore Banis',
    
    // Notifications Detail
    enableNotifications: 'Enable Notifications',
    dailyReminders: 'Daily Reminders',
    morningReminder: 'Morning',
    eveningReminder: 'Evening',
    nightReminder: 'Night',
    
    // Edit Profile
    displayName: 'Display Name',
    profilePhoto: 'Profile Photo',
    accountInfo: 'Account Information',
    emailAddress: 'Email Address',
    userId: 'User ID',
    memberSince: 'Member Since',
    saveChanges: 'Save Changes',
    changePhoto: 'Change Photo',
    
    // Common Messages
    fillAllFields: 'Please fill in all fields',
    invalidEmail: 'Invalid email address',
    passwordsNotMatch: 'Passwords do not match',
    loginFailed: 'Login Failed',
    signupFailed: 'Sign Up Failed',
    welcomeBack: 'Welcome Back!',
    accountCreated: 'Account Created Successfully',
    savedSuccessfully: 'Saved Successfully',
    errorOccurred: 'An error occurred',
    tryAgain: 'Please try again',
  },
  
  pa: {
    // Navigation
    home: 'ਘਰ',
    nitnem: 'ਨਿਤਨੇਮ',
    dasamGranth: 'ਦਸਮ ਗ੍ਰੰਥ',
    history: 'ਇਤਿਹਾਸ',
    more: 'ਹੋਰ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    
    // Common
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    save: 'ਸੁਰੱਖਿਅਤ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    delete: 'ਮਿਟਾਓ',
    edit: 'ਸੋਧੋ',
    back: 'ਵਾਪਸ',
    search: 'ਖੋਜੋ',
    close: 'ਬੰਦ ਕਰੋ',
    yes: 'ਹਾਂ',
    no: 'ਨਹੀਂ',
    ok: 'ਠੀਕ ਹੈ',
    
    // Home Screen
    dailyHukamnama: 'ਰੋਜ਼ਾਨਾ ਹੁਕਮਨਾਮਾ',
    liveKirtan: 'ਲਾਈਵ ਕੀਰਤਨ',
    quickAccess: 'ਤੇਜ਼ ਪਹੁੰਚ',
    morningPrayers: 'ਸਵੇਰ ਦੀਆਂ ਬਾਣੀਆਂ',
    eveningPrayers: 'ਸ਼ਾਮ ਦੀਆਂ ਬਾਣੀਆਂ',
    explore: 'ਖੋਜੋ',
    
    // Nitnem
    nitnemTitle: 'ਰੋਜ਼ਾਨਾ ਨਿਤਨੇਮ',
    nitnemDescription: 'ਰੋਜ਼ਾਨਾ ਅਭਿਆਸ ਲਈ ਜ਼ਰੂਰੀ ਸਿੱਖ ਬਾਣੀਆਂ',
    morningNitnem: 'ਸਵੇਰ ਦਾ ਨਿਤਨੇਮ',
    eveningNitnem: 'ਸ਼ਾਮ ਦਾ ਨਿਤਨੇਮ',
    nightNitnem: 'ਰਾਤ ਦਾ ਨਿਤਨੇਮ',
    
    // Banis
    japjiSahib: 'ਜਪੁਜੀ ਸਾਹਿਬ',
    jaapSahib: 'ਜਾਪੁ ਸਾਹਿਬ',
    tavPrasadSavaiye: 'ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵਯੇ',
    chaupaiSahib: 'ਚੌਪਈ ਸਾਹਿਬ',
    anandSahib: 'ਆਨੰਦ ਸਾਹਿਬ',
    rehrasSahib: 'ਰਹਿਰਾਸ ਸਾਹਿਬ',
    kirtanSohila: 'ਕੀਰਤਨ ਸੋਹਿਲਾ',
    
    // Profile
    editProfile: 'ਪ੍ਰੋਫ਼ਾਈਲ ਸੰਪਾਦਿਤ ਕਰੋ',
    preferences: 'ਤਰਜੀਹਾਂ',
    readingHistory: 'ਪੜ੍ਹਨ ਦਾ ਇਤਿਹਾਸ',
    bookmarks: 'ਬੁੱਕਮਾਰਕ',
    notifications: 'ਸੂਚਨਾਵਾਂ',
    helpSupport: 'ਸਹਾਇਤਾ ਅਤੇ ਸਹਾਇਤਾ',
    about: 'ਬਾਰੇ',
    logout: 'ਲਾਗ ਆਊਟ',
    
    // Preferences
    display: 'ਡਿਸਪਲੇ',
    fontSize: 'ਫੌਂਟ ਆਕਾਰ',
    small: 'ਛੋਟਾ',
    medium: 'ਮੱਧਮ',
    large: 'ਵੱਡਾ',
    extraLarge: 'ਬਹੁਤ ਵੱਡਾ',
    darkMode: 'ਡਾਰਕ ਮੋਡ',
    language: 'ਭਾਸ਼ਾ',
    primaryLanguage: 'ਮੁੱਖ ਭਾਸ਼ਾ',
    audio: 'ਆਡੀਓ',
    autoPlay: 'ਆਟੋ-ਪਲੇ ਆਡੀਓ',
    downloads: 'ਡਾਊਨਲੋਡ',
    wifiOnly: 'ਸਿਰਫ਼ WiFi ਤੇ ਡਾਊਨਲੋਡ ਕਰੋ',
    resetToDefault: 'ਡਿਫੌਲਟ ਤੇ ਰੀਸੈੱਟ ਕਰੋ',
    
    // Notifications
    notificationsTitle: 'ਸੂਚਨਾਵਾਂ',
    dailyHukamnamaNotif: 'ਰੋਜ਼ਾਨਾ ਹੁਕਮਨਾਮਾ',
    nitnemReminder: 'ਨਿਤਨੇਮ ਯਾਦ ਦਿਵਾਉਣੇ',
    gurpurabReminder: 'ਗੁਰਪੁਰਬ ਯਾਦ ਦਿਵਾਉਣੇ',
    weeklyProgress: 'ਹਫ਼ਤਾਵਾਰੀ ਤਰੱਕੀ',
    newContent: 'ਨਵੀਂ ਸਮੱਗਰੀ',
    
    // Reading History
    readingHistoryTitle: 'ਪੜ੍ਹਨ ਦਾ ਇਤਿਹਾਸ',
    dayStreak: 'ਦਿਨ ਦੀ ਲੜੀ',
    totalReads: 'ਕੁੱਲ ਪਾਠ',
    minutes: 'ਮਿੰਟ',
    uniqueBanis: 'ਵਿਲੱਖਣ ਬਾਣੀਆਂ',
    noHistory: 'ਕੋਈ ਪੜ੍ਹਨ ਦਾ ਇਤਿਹਾਸ ਨਹੀਂ',
    startReading: 'ਆਪਣੀ ਅਧਿਆਤਮਕ ਯਾਤਰਾ ਨੂੰ ਟ੍ਰੈਕ ਕਰਨ ਲਈ ਬਾਣੀਆਂ ਪੜ੍ਹਨਾ ਸ਼ੁਰੂ ਕਰੋ',
    
    // Bookmarks
    bookmarksTitle: 'ਮੇਰੇ ਬੁੱਕਮਾਰਕ',
    noBookmarks: 'ਅਜੇ ਕੋਈ ਬੁੱਕਮਾਰਕ ਨਹੀਂ',
    addBookmark: 'ਬੁੱਕਮਾਰਕ ਜੋੜੋ',
    removeBookmark: 'ਬੁੱਕਮਾਰਕ ਹਟਾਓ',
    all: 'ਸਾਰੇ',
    
    // Calendar
    sikhCalendar: 'ਸਿੱਖ ਕੈਲੰਡਰ',
    gurpurab: 'ਗੁਰਪੁਰਬ',
    martyrdom: 'ਸ਼ਹੀਦੀ',
    historical: 'ਇਤਿਹਾਸਕ',
    
    // Messages
    signInRequired: 'ਸਾਈਨ ਇਨ ਲੋੜੀਂਦਾ ਹੈ',
    comingSoon: 'ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ',
    error: 'ਗਲਤੀ',
    success: 'ਸਫਲਤਾ',
    
    // Misc
    readMore: 'ਹੋਰ ਪੜ੍ਹੋ',
    showLess: 'ਘੱਟ ਦਿਖਾਓ',
    share: 'ਸਾਂਝਾ ਕਰੋ',
    today: 'ਅੱਜ',
    yesterday: 'ਕੱਲ੍ਹ',
    
    // Authentication
    login: 'ਲਾਗਇਨ',
    signup: 'ਸਾਈਨ ਅੱਪ',
    signIn: 'ਸਾਈਨ ਇਨ',
    signUp: 'ਸਾਈਨ ਅੱਪ',
    email: 'ਈਮੇਲ',
    password: 'ਪਾਸਵਰਡ',
    confirmPassword: 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    fullName: 'ਪੂਰਾ ਨਾਮ',
    forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    dontHaveAccount: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
    alreadyHaveAccount: 'ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?',
    orContinueWith: 'ਜਾਂ ਇਸ ਨਾਲ ਜਾਰੀ ਰੱਖੋ',
    googleSignIn: 'Google ਨਾਲ ਜਾਰੀ ਰੱਖੋ',
    guestContinue: 'ਮਹਿਮਾਨ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ',
    
    // Nitnem Screen
    dailyPrayers: 'ਰੋਜ਼ਾਨਾ ਪ੍ਰਾਰਥਨਾਵਾਂ',
    nitnemBanis: 'ਨਿਤਨੇਮ ਬਾਣੀਆਂ',
    loadingAuthentic: 'BaniDB ਤੋਂ ਪ੍ਰਮਾਣਿਕ ​​ਗੁਰਬਾਣੀ ਲੋਡ ਹੋ ਰਹੀ ਹੈ...',
    pleaseWait: 'ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ ਜਦੋਂ ਅਸੀਂ ਬਾਣੀਆਂ ਲਿਆਉਂਦੇ ਹਾਂ',
    connectionError: 'ਕਨੈਕਸ਼ਨ ਗਲਤੀ',
    retry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
    loadedFromAPI: 'BaniDB API ਤੋਂ ਲੋਡ ਕੀਤਾ ਗਿਆ',
    lines: 'ਲਾਈਨਾਂ',
    readNow: 'ਹੁਣ ਪੜ੍ਹੋ',
    
    // Bani Detail
    gurmukhi: 'ਗੁਰਮੁਖੀ',
    transliteration: 'ਲਿਪੀਅੰਤਰਨ',
    translation: 'ਅਨੁਵਾਦ',
    meaning: 'ਅਰਥ',
    
    // Bookmarks Detail
    myBookmarks: 'ਮੇਰੇ ਬੁੱਕਮਾਰਕ',
    filterBookmarks: 'ਫਿਲਟਰ',
    remove: 'ਹਟਾਓ',
    areYouSure: 'ਕੀ ਤੁਹਾਨੂੰ ਯਕੀਨ ਹੈ?',
    removeBookmarkConfirm: 'ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਤੌਰ ਤੇ ਇਸ ਬੁੱਕਮਾਰਕ ਨੂੰ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?',
    addToBookmarks: 'ਬੁੱਕਮਾਰਕ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ',
    
    // Reading History Detail
    currentStreak: 'ਮੌਜੂਦਾ ਲੜੀ',
    daysInRow: 'ਦਿਨ ਇੱਕ ਕਤਾਰ ਵਿੱਚ',
    readingStats: 'ਪੜ੍ਹਨ ਦੇ ਅੰਕੜੇ',
    clearHistory: 'ਇਤਿਹਾਸ ਸਾਫ਼ ਕਰੋ',
    clearAllHistory: 'ਸਾਰਾ ਪੜ੍ਹਨ ਇਤਿਹਾਸ ਸਾਫ਼ ਕਰੋ?',
    exploreBarns: 'ਬਾਣੀਆਂ ਦੀ ਖੋਜ ਕਰੋ',
    
    // Notifications Detail
    enableNotifications: 'ਸੂਚਨਾਵਾਂ ਯੋਗ ਕਰੋ',
    dailyReminders: 'ਰੋਜ਼ਾਨਾ ਯਾਦ ਦਿਵਾਉਣੇ',
    morningReminder: 'ਸਵੇਰ',
    eveningReminder: 'ਸ਼ਾਮ',
    nightReminder: 'ਰਾਤ',
    
    // Edit Profile
    displayName: 'ਡਿਸਪਲੇ ਨਾਮ',
    profilePhoto: 'ਪ੍ਰੋਫਾਈਲ ਫੋਟੋ',
    accountInfo: 'ਖਾਤਾ ਜਾਣਕਾਰੀ',
    emailAddress: 'ਈਮੇਲ ਪਤਾ',
    userId: 'ਯੂਜ਼ਰ ID',
    memberSince: 'ਮੈਂਬਰ ਤੋਂ',
    saveChanges: 'ਤਬਦੀਲੀਆਂ ਸੁਰੱਖਿਅਤ ਕਰੋ',
    changePhoto: 'ਫੋਟੋ ਬਦਲੋ',
    
    // Common Messages
    fillAllFields: 'ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖੇਤਰ ਭਰੋ',
    invalidEmail: 'ਅਵੈਧ ਈਮੇਲ ਪਤਾ',
    passwordsNotMatch: 'ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ',
    loginFailed: 'ਲਾਗਇਨ ਅਸਫਲ',
    signupFailed: 'ਸਾਈਨ ਅੱਪ ਅਸਫਲ',
    welcomeBack: 'ਵਾਪਸੀ ਦਾ ਸੁਆਗਤ ਹੈ!',
    accountCreated: 'ਖਾਤਾ ਸਫਲਤਾਪੂਰਵਕ ਬਣਾਇਆ ਗਿਆ',
    savedSuccessfully: 'ਸਫਲਤਾਪੂਰਵਕ ਸੁਰੱਖਿਅਤ ਕੀਤਾ',
    errorOccurred: 'ਇੱਕ ਗਲਤੀ ਆਈ',
    tryAgain: 'ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
  },
};

// Hook to use translations
export const useTranslation = (language: Language = 'en'): Translations => {
  return translations[language];
};
