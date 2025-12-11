export default {
  "User": {
    "name": "User",
    "type": "object",
    "properties": {
      "full_name": { "type": "string" },
      "email": { "type": "string" },
      "role": {
        "type": "string",
        "enum": ["user", "moderator", "admin"],
        "default": "user"
      },
      "is_active": {
        "type": "boolean",
        "default": true,
        "description": "حالة الحساب"
      },
      "id": { "type": "string", "format": "uuid", "description": "Auto-generated ID" },
      "created_date": { "type": "string", "format": "date-time" },
      "updated_date": { "type": "string", "format": "date-time" }
    },
    "required": ["email"]
  },
  "CourseEnrollment": {
    "name": "CourseEnrollment",
    "type": "object",
    "properties": {
      "course_id": { "type": "string", "description": "معرف الدورة" },
      "user_email": { "type": "string", "description": "البريد الإلكتروني للطالب" },
      "user_name": { "type": "string", "description": "اسم الطالب" },
      "phone": { "type": "string", "description": "رقم الهاتف" },
      "gender": { "type": "string", "enum": ["male", "female"], "description": "الجنس" },
      "status": { "type": "string", "enum": ["pending", "approved", "rejected", "completed"], "default": "pending", "description": "حالة التسجيل" },
      "progress": { "type": "number", "default": 0, "description": "نسبة التقدم %" },
      "completed_lessons": { "type": "array", "items": { "type": "string" }, "description": "الدروس المكتملة" },
      "notes": { "type": "string", "description": "ملاحظات" },
      "id": { "type": "string", "format": "uuid" },
      "created_date": { "type": "string", "format": "date-time" }
    },
    "required": ["course_id", "user_email", "user_name", "gender"]
  },
  "Book": {
    "name": "Book",
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "author": { "type": "string" },
      "description": { "type": "string" },
      "category": { "type": "string", "enum": ["hadith", "tafsir", "fiqh", "azkar", "seerah", "general"] },
      "pages": { "type": "number" },
      "cover_url": { "type": "string" },
      "pdf_url": { "type": "string" },
      "content": { "type": "string" },
      "language": { "type": "string", "default": "ar" }
    },
    "required": ["title", "author", "category"]
  },
  "QuranCourse": {
    "name": "QuranCourse",
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "teacher_name": { "type": "string" },
      "description": { "type": "string" },
      "type": { "type": "string", "enum": ["memorization", "recitation", "tajweed"] },
      "gender": { "type": "string", "enum": ["male", "female"] },
      "level": { "type": "string", "enum": ["beginner", "intermediate", "advanced"] },
      "schedule": { "type": "string" },
      "duration": { "type": "string" },
      "max_students": { "type": "number" },
      "current_students": { "type": "number", "default": 0 },
      "google_meet_link": { "type": "string" },
      "is_active": { "type": "boolean", "default": true },
      "start_date": { "type": "string", "format": "date" }
    },
    "required": ["title", "teacher_name", "type", "gender"]
  },
  "Lecture": {
    "name": "Lecture",
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "speaker": { "type": "string" },
      "description": { "type": "string" },
      "type": { "type": "string", "enum": ["audio", "video"] },
      "category": { "type": "string", "enum": ["learn_islam", "repentance", "general"] },
      "topic": { "type": "string" },
      "url": { "type": "string" },
      "duration": { "type": "string" },
      "thumbnail_url": { "type": "string" },
      "views_count": { "type": "number", "default": 0 },
      "likes_count": { "type": "number", "default": 0 },
      "shares_count": { "type": "number", "default": 0 }
    },
    "required": ["title", "speaker", "type", "category"]
  },
  "Fatwa": {
    "name": "Fatwa",
    "type": "object",
    "properties": {
      "question": { "type": "string" },
      "answer": { "type": "string" },
      "mufti": { "type": "string" },
      "category": { "type": "string" },
      "tags": { "type": "array", "items": { "type": "string" } },
      "reference": { "type": "string" }
    },
    "required": ["question", "answer", "category"]
  },
  "Story": {
    "name": "Story",
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "author": { "type": "string" },
      "content": { "type": "string" },
      "category": { "type": "string", "enum": ["convert", "repentance"] },
      "excerpt": { "type": "string" },
      "image_url": { "type": "string" },
      "country": { "type": "string" }
    },
    "required": ["title", "content", "category"]
  },
  "LiveStream": {
    "name": "LiveStream",
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "description": { "type": "string" },
      "speaker": { "type": "string" },
      "category": { "type": "string", "enum": ["lecture", "quran_class", "qa_session", "special_event"] },
      "scheduled_time": { "type": "string", "format": "date-time" },
      "stream_url": { "type": "string" },
      "is_live": { "type": "boolean", "default": false },
      "thumbnail_url": { "type": "string" },
      "viewers_count": { "type": "number", "default": 0 },
      "recording_url": { "type": "string" },
      "chat_enabled": { "type": "boolean", "default": true },
      "language": { "type": "string", "default": "ar" },
      "notification_sent": { "type": "boolean", "default": false },
      "reminder_sent": { "type": "boolean", "default": false }
    },
    "required": ["title", "speaker", "category", "scheduled_time"]
  },
  "Scholar": {
    "name": "Scholar",
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "type": { "type": "string", "enum": ["mufti", "preacher", "scholar", "teacher"] },
      "specialization": { "type": "string", "enum": ["fiqh", "hadith", "tafsir", "aqeedah", "quran", "general"] },
      "gender": { "type": "string", "enum": ["male", "female"] },
      "languages": { "type": "array", "items": { "type": "string" } },
      "phone": { "type": "string" },
      "whatsapp": { "type": "string" },
      "email": { "type": "string" },
      "google_meet_link": { "type": "string" },
      "country": { "type": "string" },
      "bio": { "type": "string" },
      "is_available": { "type": "boolean", "default": true }
    },
    "required": ["name", "type"]
  },
  "Comment": {
    "name": "Comment",
    "type": "object",
    "properties": {
      "user_name": { "type": "string" },
      "user_email": { "type": "string" },
      "content_type": { "type": "string", "enum": ["lecture", "story", "fatwa", "book"] },
      "content_id": { "type": "string" },
      "comment_text": { "type": "string" },
      "parent_comment_id": { "type": "string" },
      "is_approved": { "type": "boolean", "default": true },
      "likes_count": { "type": "number", "default": 0 }
    },
    "required": ["user_name", "user_email", "content_type", "content_id", "comment_text"]
  },
  "Rating": {
    "name": "Rating",
    "type": "object",
    "properties": {
      "user_email": { "type": "string" },
      "content_type": { "type": "string", "enum": ["lecture", "story", "fatwa", "book"] },
      "content_id": { "type": "string" },
      "rating": { "type": "number", "minimum": 1, "maximum": 5 },
      "review": { "type": "string" }
    },
    "required": ["user_email", "content_type", "content_id", "rating"]
  },
  "Notification": {
    "name": "Notification",
    "type": "object",
    "properties": {
      "user_email": { "type": "string" },
      "title": { "type": "string" },
      "message": { "type": "string" },
      "type": { "type": "string", "enum": ["live_stream", "new_content", "comment_reply", "general"] },
      "link": { "type": "string" },
      "is_read": { "type": "boolean", "default": false },
      "icon": { "type": "string" }
    },
    "required": ["user_email", "title", "message", "type"]
  },
  "ReconciliationCommittee": {
    "name": "ReconciliationCommittee",
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "title": { "type": "string" },
      "position": { "type": "string" },
      "photo_url": { "type": "string" },
      "specialization": { "type": "array", "items": { "type": "string" } },
      "qualifications": { "type": "array", "items": { "type": "string" } },
      "experience_years": { "type": "number" },
      "bio": { "type": "string" },
      "achievements": { "type": "array", "items": { "type": "string" } },
      "contact_email": { "type": "string" },
      "contact_phone": { "type": "string" },
      "is_active": { "type": "boolean", "default": true },
      "order": { "type": "number" }
    },
    "required": ["name", "title", "position"]
  },
  "ReconciliationRequest": {
    "name": "ReconciliationRequest",
    "type": "object",
    "properties": {
      "requester_name": { "type": "string" },
      "requester_email": { "type": "string" },
      "requester_phone": { "type": "string" },
      "conflict_type": { "type": "string" },
      "conflict_description": { "type": "string" },
      "status": {
        "type": "string",
        "enum": ["pending", "under_review", "scheduled", "in_progress", "resolved", "rejected"],
        "default": "pending"
      },
      "meeting_date": { "type": "string", "format": "date-time" },
      "meeting_link": { "type": "string" },
      "notes_from_committee": { "type": "string" }
    }
  }
};