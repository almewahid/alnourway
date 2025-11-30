// Firestore Collections Structure for alnourway
// Based on Base44 Schema Export

const collections = {
  // 1. Users (Built-in with Firebase Auth)
  users: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    full_name: "string",
    email: "string",
    role: "string", // admin or user
  },

  // 2. Islamic Centers
  islamicCenters: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    name: "string",
    address: "string",
    city: "string",
    country: "string",
    phone: "string",
    email: "string",
    description: "string",
    services: "array",
    latitude: "number",
    longitude: "number",
  },

  // 3. Lectures
  lectures: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    title: "string",
    speaker: "string",
    description: "string",
    type: "string", // audio or video
    category: "string", // learn_islam, repentance, general
    topic: "string",
    url: "string",
    duration: "string",
    thumbnail_url: "string",
    views_count: "number",
    likes_count: "number",
    shares_count: "number",
  },

  // 4. User Preferences
  userPreferences: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    user_email: "string",
    interested_topics: "array",
    view_history: "array", // {content_type, content_id, viewed_at}
    search_history: "array",
    preferred_speakers: "array",
    notification_preferences: {
      new_content: "boolean",
      live_streams: "boolean",
      fatwa_answers: "boolean",
      scheduled_meetings: "boolean",
    },
  },

  // 5. Analytics Events
  analyticsEvents: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    event_type: "string", // view, search, download, share, like, comment, enroll, request
    user_email: "string",
    content_type: "string",
    content_id: "string",
    search_query: "string",
    metadata: "object",
    user_country: "string",
    user_language: "string",
    device_type: "string", // mobile, tablet, desktop
  },

  // 6. Conversations
  conversations: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    user_email: "string",
    user_name: "string",
    scholar_email: "string",
    scholar_name: "string",
    scholar_type: "string", // mufti, preacher, teacher
    last_message: "string",
    last_message_time: "timestamp",
    unread_count_user: "number",
    unread_count_scholar: "number",
    status: "string", // active, archived, blocked
  },

  // 7. Chat Messages
  chatMessages: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    conversation_id: "string",
    sender_email: "string",
    sender_name: "string",
    sender_type: "string", // user or scholar
    receiver_email: "string",
    receiver_name: "string",
    message_text: "string",
    is_read: "boolean",
    attachment_url: "string",
  },

  // 8. Content Recommendations
  contentRecommendations: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    user_email: "string",
    content_type: "string",
    content_id: "string",
    recommendation_score: "number", // 0-100
    recommendation_reason: "string",
    based_on: "array",
  },

  // 9. Stories
  stories: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    title: "string",
    author: "string",
    content: "string",
    category: "string", // convert, repentance
    excerpt: "string",
    image_url: "string",
    country: "string",
  },

  // 10. Fatwas
  fatwas: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    question: "string",
    answer: "string",
    mufti: "string",
    category: "string",
    tags: "array",
    reference: "string",
  },

  // 11. Fatwa Requests
  fatwaRequests: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    name: "string",
    email: "string",
    question: "string",
    category: "string",
    status: "string", // pending, answered, in_progress
    answer: "string",
    answered_by: "string",
  },

  // 12. Contact Requests
  contactRequests: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    name: "string",
    email: "string",
    phone: "string",
    request_type: "string",
    message: "string",
    preferred_contact_method: "string",
    status: "string", // معلق, تم التواصل, مكتمل
  },

  // 13. Scholars
  scholars: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    name: "string",
    type: "string", // mufti, preacher, scholar, teacher
    specialization: "string", // fiqh, hadith, tafsir, aqeedah, quran, general
    gender: "string", // male or female
    languages: "array",
    phone: "string",
    whatsapp: "string",
    email: "string",
    google_meet_link: "string",
    country: "string",
    bio: "string",
    is_available: "boolean",
  },

  // 14. Join Team Requests
  joinTeamRequests: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    role_type: "string", // mufti, preacher, islamic_center
    full_name: "string",
    age: "number",
    address: "string",
    country: "string",
    languages: "array",
    qualification: "string",
    courses: "string",
    phone: "string",
    email: "string",
    whatsapp: "string",
    status: "string", // pending, approved, rejected
  },

  // 15. Favorites
  favorites: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    user_email: "string",
    item_type: "string", // lecture, story, fatwa
    item_id: "string",
    item_title: "string",
    item_data: "object",
  },

  // 16. Books
  books: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    title: "string",
    author: "string",
    description: "string",
    category: "string", // hadith, tafsir, fiqh, azkar, seerah, general
    pages: "number",
    cover_url: "string",
    pdf_url: "string",
    content: "string",
    language: "string",
  },

  // 17. Quran Courses
  quranCourses: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    title: "string",
    teacher_name: "string",
    description: "string",
    type: "string", // memorization, recitation, tajweed
    gender: "string", // male or female
    level: "string", // beginner, intermediate, advanced
    schedule: "string",
    duration: "string",
    max_students: "number",
    current_students: "number",
    google_meet_link: "string",
    is_active: "boolean",
    start_date: "timestamp",
  },

  // 18. Course Enrollments
  courseEnrollments: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    course_id: "string",
    user_email: "string",
    user_name: "string",
    phone: "string",
    gender: "string",
    status: "string", // pending, approved, rejected, completed
    notes: "string",
  },

  // 19. Comments
  comments: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    user_name: "string",
    user_email: "string",
    content_type: "string", // lecture, story, fatwa, book
    content_id: "string",
    comment_text: "string",
    parent_comment_id: "string",
    is_approved: "boolean",
    likes_count: "number",
  },

  // 20. Ratings
  ratings: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    user_email: "string",
    content_type: "string",
    content_id: "string",
    rating: "number", // 1-5
    review: "string",
  },

  // 21. Live Streams
  liveStreams: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    title: "string",
    description: "string",
    speaker: "string",
    category: "string", // lecture, quran_class, qa_session, special_event
    scheduled_time: "timestamp",
    stream_url: "string",
    is_live: "boolean",
    thumbnail_url: "string",
    viewers_count: "number",
    recording_url: "string",
    chat_enabled: "boolean",
    language: "string",
    notification_sent: "boolean",
    reminder_sent: "boolean",
  },

  // 22. Notifications
  notifications: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    user_email: "string",
    message: "string",
    type: "string",
    is_read: "boolean",
    target_url: "string",
  },

  // 23. Reconciliation Committee
  reconciliationCommittee: {
    id: "string",
    created_date: "timestamp",
    updated_date: "timestamp",
    created_by: "string",
    // Add specific fields based on your needs
  },
};

console.log("Firestore Collections Structure:");
console.log(JSON.stringify(collections, null, 2));

module.exports = collections;
