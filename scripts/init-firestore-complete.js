// init-firestore-complete.js
// Script كامل لإنشاء جميع الـ 23 Collections بنفس بنية Base44 تماماً

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc,
  Timestamp 
} from 'firebase/firestore';

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MSG_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function للتاريخ
const now = () => new Date().toISOString();

// =============================================================================
// البيانات التجريبية الكاملة - مطابقة لـ Base44
// =============================================================================

const sampleData = {
  
  // 1. User - سيتم إدارته من Firebase Auth
  // لكن يمكن إضافة بيانات إضافية في collection منفصل إذا لزم الأمر
  
  // 2. IslamicCenter
  IslamicCenter: [
    {
      id: "islamic_center_1",
      created_date: "2024-01-15T10:00:00Z",
      updated_date: "2024-10-20T14:30:00Z",
      created_by: "admin@example.com",
      name: "المركز الإسلامي بأسلو",
      address: "Åkebergveien 28B, 0650 Oslo",
      city: "Oslo",
      country: "Norway",
      phone: "+4722681530",
      email: "info@islamiccenter.no",
      description: "أحد أكبر المراكز الإسلامية في النرويج، يقدم خدمات تعليمية واجتماعية.",
      services: ["صلاة الجماعة", "دروس دينية", "تحفيظ قرآن", "إفطارات جماعية"],
      latitude: 59.911491,
      longitude: 10.757933
    },
    {
      id: "islamic_center_2",
      created_date: "2023-05-20T11:00:00Z",
      updated_date: "2024-09-01T09:00:00Z",
      created_by: "admin@example.com",
      name: "مسجد التوحيد",
      address: "Motzfeldts gate 10, 0187 Oslo",
      city: "Oslo",
      country: "Norway",
      phone: "+4722177000",
      email: "post@tawhid.no",
      description: "مسجد معروف بتنظيم الأنشطة الشبابية والمحاضرات المتنوعة.",
      services: ["صلاة الجمعة", "دورات علمية", "مساعدة الأسر", "مكتبة إسلامية"],
      latitude: 59.914270,
      longitude: 10.767930
    }
  ],

  // 3. Lecture
  Lecture: [
    {
      id: "lecture_1",
      created_date: "2024-05-01T18:00:00Z",
      updated_date: "2024-11-20T10:00:00Z",
      created_by: "scholar1@example.com",
      title: "فضل تلاوة القرآن الكريم",
      speaker: "الشيخ أحمد",
      description: "محاضرة قيمة تتناول أهمية تلاوة القرآن وفوائدها الروحية والنفسية.",
      type: "audio",
      category: "general",
      topic: "القرآن الكريم",
      url: "https://example.com/audio/quran-recitation.mp3",
      duration: "45:30",
      thumbnail_url: "https://example.com/thumbnails/quran-recitation.jpg",
      views_count: 1250,
      likes_count: 300,
      shares_count: 80
    },
    {
      id: "lecture_2",
      created_date: "2024-06-10T19:30:00Z",
      updated_date: "2024-11-25T11:00:00Z",
      created_by: "scholar2@example.com",
      title: "أركان الإيمان الستة",
      speaker: "الداعية يوسف",
      description: "شرح مفصل ومبسط لأركان الإيمان التي يجب على المسلم الإعتقاد بها.",
      type: "video",
      category: "learn_islam",
      topic: "العقيدة",
      url: "https://example.com/video/pillars-of-faith.mp4",
      duration: "1:10:15",
      thumbnail_url: "https://example.com/thumbnails/pillars-of-faith.jpg",
      views_count: 2500,
      likes_count: 650,
      shares_count: 150
    },
    {
      id: "lecture_3",
      created_date: "2024-07-22T17:00:00Z",
      updated_date: "2024-11-18T09:00:00Z",
      created_by: "scholar3@example.com",
      title: "كيف تبدأ رحلة التوبة الصادقة؟",
      speaker: "المفتي محمد",
      description: "خطوات عملية ونصائح مهمة للمسلمين الراغبين في التوبة والعودة إلى الله.",
      type: "audio",
      category: "repentance",
      topic: "التوبة",
      url: "https://example.com/audio/repentance-journey.mp3",
      duration: "30:00",
      thumbnail_url: "https://example.com/thumbnails/repentance-journey.jpg",
      views_count: 3100,
      likes_count: 900,
      shares_count: 220
    }
  ],

  // 4. UserPreference
  UserPreference: [
    {
      id: "pref_user1",
      created_date: "2024-01-01T08:00:00Z",
      updated_date: "2024-11-27T15:00:00Z",
      created_by: "user1@example.com",
      user_email: "user1@example.com",
      interested_topics: ["quran", "fiqh", "hadith"],
      view_history: [
        {
          content_type: "lecture",
          content_id: "lecture_1",
          viewed_at: "2024-11-20T09:00:00Z"
        },
        {
          content_type: "story",
          content_id: "story_1",
          viewed_at: "2024-11-15T14:00:00Z"
        }
      ],
      search_history: ["تفسير البقرة", "أحكام الصلاة"],
      preferred_speakers: ["الشيخ أحمد", "الشيخ خالد"],
      notification_preferences: {
        new_content: true,
        live_streams: true,
        fatwa_answers: false,
        scheduled_meetings: true
      }
    }
  ],

  // 5. AnalyticsEvent
  AnalyticsEvent: [
    {
      id: "event_1",
      created_date: "2024-11-28T08:00:00Z",
      updated_date: "2024-11-28T08:00:00Z",
      created_by: "user1@example.com",
      event_type: "view",
      user_email: "user1@example.com",
      content_type: "lecture",
      content_id: "lecture_1",
      search_query: "",
      metadata: { duration: "300s" },
      user_country: "Norway",
      user_language: "ar",
      device_type: "desktop"
    },
    {
      id: "event_2",
      created_date: "2024-11-28T09:15:00Z",
      updated_date: "2024-11-28T09:15:00Z",
      created_by: "user2@example.com",
      event_type: "search",
      user_email: "user2@example.com",
      content_type: "query",
      content_id: "",
      search_query: "أحكام الصيام",
      metadata: { results_count: 5 },
      user_country: "Sweden",
      user_language: "en",
      device_type: "mobile"
    }
  ],

  // 6. Conversation
  Conversation: [
    {
      id: "conv_1",
      created_date: "2024-10-01T10:00:00Z",
      updated_date: "2024-11-28T12:00:00Z",
      created_by: "user1@example.com",
      user_email: "user1@example.com",
      user_name: "فاطمة محمد",
      scholar_email: "mufti@example.com",
      scholar_name: "المفتي عبد الله",
      scholar_type: "mufti",
      last_message: "شكراً جزيلاً على الإجابة الوافية.",
      last_message_time: "2024-11-28T12:00:00Z",
      unread_count_user: 0,
      unread_count_scholar: 1,
      status: "active"
    }
  ],

  // 7. ChatMessage
  ChatMessage: [
    {
      id: "msg_1",
      created_date: "2024-10-01T10:05:00Z",
      updated_date: "2024-10-01T10:05:00Z",
      created_by: "user1@example.com",
      conversation_id: "conv_1",
      sender_email: "user1@example.com",
      sender_name: "فاطمة محمد",
      sender_type: "user",
      receiver_email: "mufti@example.com",
      receiver_name: "المفتي عبد الله",
      message_text: "السلام عليكم ورحمة الله، لدي سؤال حول زكاة المال.",
      is_read: true,
      attachment_url: ""
    },
    {
      id: "msg_2",
      created_date: "2024-10-01T10:10:00Z",
      updated_date: "2024-10-01T10:10:00Z",
      created_by: "mufti@example.com",
      conversation_id: "conv_1",
      sender_email: "mufti@example.com",
      sender_name: "المفتي عبد الله",
      sender_type: "scholar",
      receiver_email: "user1@example.com",
      receiver_name: "فاطمة محمد",
      message_text: "وعليكم السلام، تفضلي بسؤالك.",
      is_read: true,
      attachment_url: ""
    }
  ],

  // 8. ContentRecommendation
  ContentRecommendation: [
    {
      id: "rec_1",
      created_date: "2024-11-20T07:00:00Z",
      updated_date: "2024-11-20T07:00:00Z",
      created_by: "system",
      user_email: "user1@example.com",
      content_type: "lecture",
      content_id: "lecture_2",
      recommendation_score: 85,
      recommendation_reason: "بناءً على اهتمامات المستخدم في العقيدة",
      based_on: ["interested_topics:aqeedah", "view_history:lecture_1"]
    }
  ],

  // 9. Story
  Story: [
    {
      id: "story_1",
      created_date: "2024-03-05T10:00:00Z",
      updated_date: "2024-08-10T14:00:00Z",
      created_by: "editor@example.com",
      title: "رحلة نرويجي إلى الإسلام",
      author: "سامي يوهانسن",
      content: "كان يوهانسن شاباً نرويجياً ملحداً يبحث عن المعنى في حياته. بعد قراءة متأنية للقرآن...",
      category: "convert",
      excerpt: "قصة مؤثرة لشاب نرويجي اعتنق الإسلام بعد رحلة بحث طويلة عن الحقيقة.",
      image_url: "https://example.com/images/norwegian-convert.jpg",
      country: "Norway"
    },
    {
      id: "story_2",
      created_date: "2024-04-12T11:00:00Z",
      updated_date: "2024-09-01T09:00:00Z",
      created_by: "editor@example.com",
      title: "التوبة من الإدمان: قصة أمل",
      author: "فاطمة أحمد",
      content: "عانت فاطمة من الإدمان لسنوات، لكن بفضل الله وعزمها الصادق، تمكنت من التوبة والعودة إلى حياة كريمة...",
      category: "repentance",
      excerpt: "قصة ملهمة لامرأة تابت من الإدمان وعادت إلى طريق الله.",
      image_url: "https://example.com/images/repentance-addiction.jpg",
      country: "Egypt"
    }
  ],

  // 10. Fatwa
  Fatwa: [
    {
      id: "fatwa_1",
      created_date: "2024-02-01T13:00:00Z",
      updated_date: "2024-07-01T10:00:00Z",
      created_by: "mufti@example.com",
      question: "ما حكم الاحتفال بأعياد الميلاد في الإسلام؟",
      answer: "لا يجوز الاحتفال بأعياد الميلاد لأنها من البدع التي لا أصل لها في الشرع المطهر، وقد ثبت عن النبي صلى الله عليه وسلم أنه قال: (من أحدث في أمرنا هذا ما ليس منه فهو رد).",
      mufti: "المفتي عبد الله",
      category: "الفقه",
      tags: ["أعياد الميلاد", "بدعة", "احتفال"],
      reference: "فتاوى اللجنة الدائمة للإفتاء"
    },
    {
      id: "fatwa_2",
      created_date: "2024-03-10T14:00:00Z",
      updated_date: "2024-08-05T11:00:00Z",
      created_by: "mufti2@example.com",
      question: "هل يجوز للمسلم أن يتزوج بغير المسلمة؟",
      answer: "يجوز للمسلم أن يتزوج بالكتابية (اليهودية والنصرانية) بشروط معينة، منها أن تكون عفيفة. ولا يجوز له الزواج من غير الكتابيات كالمجوسية أو الوثنية.",
      mufti: "الشيخ فهد",
      category: "النكاح",
      tags: ["زواج", "كتابية", "أهل الكتاب"],
      reference: "كتاب فقه السنة"
    }
  ],

  // 11. FatwaRequest
  FatwaRequest: [
    {
      id: "fatwa_req_1",
      created_date: "2024-11-25T09:00:00Z",
      updated_date: "2024-11-25T09:00:00Z",
      created_by: "user3@example.com",
      name: "محمود سعيد",
      email: "user3@example.com",
      question: "أرجو توضيح حكم البيع بالتقسيط مع زيادة السعر.",
      category: "المعاملات",
      status: "pending",
      answer: "",
      answered_by: ""
    },
    {
      id: "fatwa_req_2",
      created_date: "2024-11-20T11:00:00Z",
      updated_date: "2024-11-22T14:00:00Z",
      created_by: "user4@example.com",
      name: "ليلى خالد",
      email: "user4@example.com",
      question: "هل يجوز للمرأة أن تعمل في مجال يختلط فيه الرجال والنساء؟",
      category: "المرأة",
      status: "answered",
      answer: "يجوز للمرأة أن تعمل بشرط الالتزام بالضوابط الشرعية كالحجاب الشرعي، وعدم الخضوع بالقول، وعدم الخلوة بالرجل الأجنبي، وأن يكون العمل مباحًا.",
      answered_by: "المفتية سارة"
    }
  ],

  // 12. ContactRequest
  ContactRequest: [
    {
      id: "contact_req_1",
      created_date: "2024-11-26T10:00:00Z",
      updated_date: "2024-11-26T10:00:00Z",
      created_by: "guest",
      name: "مجهول",
      email: "anon@example.com",
      phone: "+966501234567",
      request_type: "التعرف على الإسلام",
      message: "أنا مهتم بمعرفة المزيد عن الإسلام وأرغب في محادثة مع داعية.",
      preferred_contact_method: "واتساب",
      status: "معلق"
    }
  ],

  // 13. Scholar
  Scholar: [
    {
      id: "scholar_1",
      created_date: "2023-01-01T09:00:00Z",
      updated_date: "2024-11-01T10:00:00Z",
      created_by: "admin@example.com",
      name: "المفتي عبد الله",
      type: "mufti",
      specialization: "fiqh",
      gender: "male",
      languages: ["العربية", "الإنجليزية"],
      phone: "+966501112222",
      whatsapp: "+966501112222",
      email: "mufti@example.com",
      google_meet_link: "https://meet.google.com/abc-defg-hij",
      country: "السعودية",
      bio: "مفتي متخصص في الفقه وأصوله، لديه العديد من المؤلفات والدروس.",
      is_available: true
    },
    {
      id: "scholar_2",
      created_date: "2023-02-15T10:00:00Z",
      updated_date: "2024-10-20T11:00:00Z",
      created_by: "admin@example.com",
      name: "الداعية خديجة",
      type: "preacher",
      specialization: "general",
      gender: "female",
      languages: ["العربية", "الفرنسية"],
      phone: "+33612345678",
      whatsapp: "+33612345678",
      email: "preacher@example.com",
      google_meet_link: "",
      country: "فرنسا",
      bio: "داعية تركز على قضايا الشباب والمرأة في الإسلام.",
      is_available: true
    }
  ],

  // 14. JoinTeamRequest
  JoinTeamRequest: [
    {
      id: "join_req_1",
      created_date: "2024-11-01T09:00:00Z",
      updated_date: "2024-11-01T09:00:00Z",
      created_by: "user5@example.com",
      role_type: "preacher",
      full_name: "أحمد سمير",
      age: 35,
      address: "شارع النيل، القاهرة",
      country: "مصر",
      languages: ["العربية", "الإنجليزية"],
      qualification: "إجازة في الشريعة الإسلامية",
      courses: "دورات في الخطابة والوعظ",
      phone: "+201112345678",
      email: "user5@example.com",
      whatsapp: "+201112345678",
      status: "pending"
    }
  ],

  // 15. Favorite
  Favorite: [
    {
      id: "fav_1",
      created_date: "2024-11-10T08:00:00Z",
      updated_date: "2024-11-10T08:00:00Z",
      created_by: "user1@example.com",
      user_email: "user1@example.com",
      item_type: "lecture",
      item_id: "lecture_1",
      item_title: "فضل تلاوة القرآن الكريم",
      item_data: {
        title: "فضل تلاوة القرآن الكريم",
        speaker: "الشيخ أحمد",
        category: "general",
        url: "https://example.com/audio/quran-recitation.mp3"
      }
    }
  ],

  // 16. Book
  Book: [
    {
      id: "book_1",
      created_date: "2023-08-01T12:00:00Z",
      updated_date: "2024-06-15T09:00:00Z",
      created_by: "admin@example.com",
      title: "رياض الصالحين",
      author: "الإمام النووي",
      description: "كتاب يجمع أحاديث الرسول صلى الله عليه وسلم في الأخلاق والآداب والسلوك.",
      category: "hadith",
      pages: 700,
      cover_url: "https://example.com/covers/riyad-saliheen.jpg",
      pdf_url: "https://example.com/pdfs/riyad-saliheen.pdf",
      content: "الحديث الأول: عن أمير المؤمنين أبي حفص عمر بن الخطاب رضي الله عنه قال: سمعت رسول الله صلى الله عليه وسلم يقول: (إنما الأعمال بالنيات)...",
      language: "ar"
    },
    {
      id: "book_2",
      created_date: "2023-09-10T14:00:00Z",
      updated_date: "2024-07-20T10:00:00Z",
      created_by: "admin@example.com",
      title: "تفسير السعدي",
      author: "عبد الرحمن بن ناصر السعدي",
      description: "تفسير ميسر للقرآن الكريم يمتاز بالوضوح والتركيز على المعنى الإجمالي للآيات.",
      category: "tafsir",
      pages: 1200,
      cover_url: "https://example.com/covers/saadi-tafsir.jpg",
      pdf_url: "https://example.com/pdfs/saadi-tafsir.pdf",
      content: "قوله تعالى: (الحمد لله رب العالمين) أي الثناء الكامل بجميع أنواعه لله تعالى...",
      language: "ar"
    }
  ],

  // 17. QuranCourse
  QuranCourse: [
    {
      id: "quran_course_1",
      created_date: "2024-01-01T09:00:00Z",
      updated_date: "2024-11-20T10:00:00Z",
      created_by: "teacher@example.com",
      title: "دورة تحفيظ جزء عم للمبتدئين",
      teacher_name: "المحفظ محمد",
      description: "دورة مكثفة لتحفيظ الجزء الثلاثين من القرآن الكريم مع التجويد الأساسي.",
      type: "memorization",
      gender: "male",
      level: "beginner",
      schedule: "الأحد والثلاثاء والخميس، 16:00-17:00",
      duration: "3 أشهر",
      max_students: 15,
      current_students: 10,
      google_meet_link: "https://meet.google.com/quran-course-beginners",
      is_active: true,
      start_date: "2025-01-01"
    },
    {
      id: "quran_course_2",
      created_date: "2024-03-01T10:00:00Z",
      updated_date: "2024-10-15T11:00:00Z",
      created_by: "teacher2@example.com",
      title: "دورة التجويد المتقدمة (رواية حفص عن عاصم)",
      teacher_name: "المعلمة أمينة",
      description: "دورة متخصصة في قواعد التجويد المتقدمة مع تطبيق عملي لرواية حفص.",
      type: "tajweed",
      gender: "female",
      level: "advanced",
      schedule: "الاثنين والأربعاء، 19:00-20:30",
      duration: "شهرين",
      max_students: 10,
      current_students: 8,
      google_meet_link: "https://meet.google.com/tajweed-advanced",
      is_active: true,
      start_date: "2025-02-01"
    }
  ],

  // 18. CourseEnrollment
  CourseEnrollment: [
    {
      id: "enroll_1",
      created_date: "2024-11-15T11:00:00Z",
      updated_date: "2024-11-15T11:00:00Z",
      created_by: "user1@example.com",
      course_id: "quran_course_1",
      user_email: "user1@example.com",
      user_name: "فاطمة محمد",
      phone: "+966509876543",
      gender: "female",
      status: "pending",
      notes: "أرغب في بدء الدورة في أقرب وقت ممكن."
    },
    {
      id: "enroll_2",
      created_date: "2024-11-18T10:00:00Z",
      updated_date: "2024-11-20T14:00:00Z",
      created_by: "user7@example.com",
      course_id: "quran_course_1",
      user_email: "user7@example.com",
      user_name: "يوسف علي",
      phone: "+201234567890",
      gender: "male",
      status: "approved",
      notes: ""
    }
  ],

  // 19. Comment
  Comment: [
    {
      id: "comment_1",
      created_date: "2024-11-20T15:00:00Z",
      updated_date: "2024-11-20T15:00:00Z",
      created_by: "user1@example.com",
      user_name: "فاطمة محمد",
      user_email: "user1@example.com",
      content_type: "lecture",
      content_id: "lecture_1",
      comment_text: "محاضرة رائعة ومفيدة جداً، جزاكم الله خيراً.",
      parent_comment_id: "",
      is_approved: true,
      likes_count: 5
    },
    {
      id: "comment_2",
      created_date: "2024-11-21T10:00:00Z",
      updated_date: "2024-11-21T10:00:00Z",
      created_by: "scholar1@example.com",
      user_name: "الشيخ أحمد",
      user_email: "scholar1@example.com",
      content_type: "lecture",
      content_id: "lecture_1",
      comment_text: "وبارك الله فيكم أختي، نسأل الله القبول.",
      parent_comment_id: "comment_1",
      is_approved: true,
      likes_count: 2
    }
  ],

  // 20. Rating
  Rating: [
    {
      id: "rating_1",
      created_date: "2024-11-22T09:00:00Z",
      updated_date: "2024-11-22T09:00:00Z",
      created_by: "user1@example.com",
      user_email: "user1@example.com",
      content_type: "lecture",
      content_id: "lecture_1",
      rating: 5,
      review: "المحاضرة كانت شاملة ومبسطة، استفدت منها كثيراً."
    },
    {
      id: "rating_2",
      created_date: "2024-11-23T11:00:00Z",
      updated_date: "2024-11-23T11:00:00Z",
      created_by: "user2@example.com",
      user_email: "user2@example.com",
      content_type: "book",
      content_id: "book_1",
      rating: 4,
      review: "كتاب قيم جداً، ولكن كنت أتمنى لو كان الخط أكبر قليلاً."
    }
  ],

  // 21. LiveStream
  LiveStream: [
    {
      id: "live_stream_1",
      created_date: "2024-11-27T18:00:00Z",
      updated_date: "2024-11-27T18:00:00Z",
      created_by: "scholar1@example.com",
      title: "بث مباشر: أسئلة وأجوبة في الفقه",
      description: "بث مباشر للإجابة على أسئلة الجمهور الفقهية.",
      speaker: "المفتي عبد الله",
      category: "qa_session",
      scheduled_time: "2024-11-29T20:00:00Z",
      stream_url: "https://youtube.com/live/someid123",
      is_live: false,
      thumbnail_url: "https://example.com/thumbnails/qa-session.jpg",
      viewers_count: 0,
      recording_url: "",
      chat_enabled: true,
      language: "ar",
      notification_sent: false,
      reminder_sent: false
    },
    {
      id: "live_stream_2",
      created_date: "2024-11-28T10:00:00Z",
      updated_date: "2024-11-28T10:00:00Z",
      created_by: "scholar2@example.com",
      title: "محاضرة: صفات عباد الرحمن",
      description: "شرح لصفات عباد الرحمن كما جاءت في القرآن الكريم والسنة النبوية.",
      speaker: "الداعية خديجة",
      category: "lecture",
      scheduled_time: "2024-12-05T19:00:00Z",
      stream_url: "https://meet.google.com/live-lecture-rahman",
      is_live: false,
      thumbnail_url: "https://example.com/thumbnails/ibad-rahman.jpg",
      viewers_count: 0,
      recording_url: "",
      chat_enabled: true,
      language: "ar",
      notification_sent: false,
      reminder_sent: false
    }
  ],

  // 22. Notification
  Notification: [
    {
      id: "notif_1",
      created_date: "2024-11-28T08:00:00Z",
      updated_date: "2024-11-28T08:00:00Z",
      created_by: "system",
      user_email: "user1@example.com",
      message: "محاضرة جديدة متاحة: أركان الإيمان الستة",
      type: "new_content",
      is_read: false,
      target_url: "/lectures/lecture_2"
    },
    {
      id: "notif_2",
      created_date: "2024-11-27T19:00:00Z",
      updated_date: "2024-11-27T19:00:00Z",
      created_by: "system",
      user_email: "user1@example.com",
      message: "بث مباشر غداً: أسئلة وأجوبة في الفقه",
      type: "live_stream",
      is_read: true,
      target_url: "/live-streams/live_stream_1"
    }
  ],

  // 23. ReconciliationCommittee
  ReconciliationCommittee: [
    {
      id: "recon_1",
      created_date: "2024-10-01T10:00:00Z",
      updated_date: "2024-11-15T14:00:00Z",
      created_by: "admin@example.com",
      case_title: "نزاع عائلي بخصوص الميراث",
      applicant_name: "محمد أحمد",
      applicant_email: "mohamed@example.com",
      applicant_phone: "+201234567890",
      case_description: "نزاع بين الورثة حول توزيع الميراث",
      status: "in_progress",
      assigned_mediator: "الشيخ عبد الله",
      notes: "تم عقد جلسة أولى"
    }
  ]
};

// =============================================================================
// Function لإنشاء Documents
// =============================================================================

async function createDocument(collectionName, data) {
  try {
    // إزالة الـ id من البيانات لأن Firebase سيولده تلقائياً
    const { id, ...dataWithoutId } = data;
    
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, dataWithoutId);
    console.log(`✅ Created ${collectionName}: ${docRef.id}`);
  } catch (error) {
    console.error(`❌ Error creating ${collectionName}:`, error.message);
  }
}

// =============================================================================
// Main Function
// =============================================================================

async function initializeFirestore() {
  console.log("🚀 بدء إنشاء قاعدة البيانات الكاملة...\n");
  console.log("📋 سيتم إنشاء 23 Collection بجميع البيانات التجريبية\n");

  let totalCreated = 0;

  for (const [collectionName, documents] of Object.entries(sampleData)) {
    console.log(`\n📦 إنشاء Collection: ${collectionName}`);
    
    for (const doc of documents) {
      await createDocument(collectionName, doc);
      totalCreated++;
    }
    
    console.log(`✅ تم إنشاء ${documents.length} وثيقة في ${collectionName}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log(`🎉 تم الانتهاء بنجاح!`);
  console.log(`📊 إجمالي الوثائق المُنشأة: ${totalCreated}`);
  console.log(`📁 إجمالي Collections: ${Object.keys(sampleData).length}`);
  console.log("=".repeat(60));
  console.log("\n✅ يمكنك الآن فتح Firebase Console للتحقق من البيانات");
  console.log("🔗 https://console.firebase.google.com/u/0/project/alnourway-1/firestore\n");
  
  process.exit(0);
}

// تشغيل الـ Script
initializeFirestore().catch((error) => {
  console.error("\n❌ حدث خطأ:", error);
  process.exit(1);
});
