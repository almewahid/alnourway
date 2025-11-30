// test-firestore.js
// Script بسيط لاختبار الاتصال

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

async function testSimpleCreate() {
  console.log("🧪 اختبار بسيط...\n");
  
  try {
    // اختبار 1: بيانات بسيطة جداً
    console.log("1️⃣ إنشاء وثيقة بسيطة...");
    const docRef = await addDoc(collection(db, "TestCollection"), {
      name: "اختبار",
      created_date: new Date().toISOString(),
    });
    console.log("✅ نجح! Document ID:", docRef.id);
    
  } catch (error) {
    console.error("❌ فشل:", error.message);
    console.error("التفاصيل:", error);
  }
  
  process.exit(0);
}

testSimpleCreate();
