#!/usr/bin/env python3
"""
سكريبت ترجمة مجاني باستخدام LibreTranslate API
لا يحتاج API Key ولا يكلف شيئاً!
"""

import json
import os
import time
import requests

# ============================================
# الإعدادات
# ============================================

INPUT_FILE = "translations_extracted.json"
OUTPUT_FILE = "translations_final.json"

# LibreTranslate API - مجاني تماماً!
LIBRETRANSLATE_URL = "https://libretranslate.com/translate"

# ============================================
# دوال الترجمة
# ============================================

def translate_text_libre(text, source_lang, target_lang):
    """ترجمة نص باستخدام LibreTranslate (مجاني)"""
    
    # تحويل رموز اللغات
    lang_map = {
        'ar': 'ar',
        'en': 'en',
        'fr': 'fr',
        'zh': 'zh'
    }
    
    source = lang_map.get(source_lang, 'ar')
    target = lang_map.get(target_lang, 'en')
    
    # تقسيم النصوص الطويلة
    if len(text) > 500:
        text = text[:500]
    
    # تنظيف النص
    text = text.replace('\n', ' ').strip()
    
    if not text:
        return ""
    
    try:
        response = requests.post(
            LIBRETRANSLATE_URL,
            data={
                'q': text,
                'source': source,
                'target': target,
                'format': 'text'
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get('translatedText', '')
        else:
            # إذا فشل، أرجع النص الأصلي
            return text
    
    except requests.exceptions.Timeout:
        return text
    except Exception as e:
        return text

def translate_batch_libre(data, max_translations=50):
    """ترجمة مجموعة من النصوص مجاناً"""
    
    translated_count = 0
    total_count = sum(
        len(category) for category in data.values()
    )
    
    print(f"\n🌐 بدء الترجمة المجانية ({total_count} نص)...\n")
    print("⚠️ الترجمة المجانية قد تكون أبطأ قليلاً\n")
    
    for category_name, category_data in data.items():
        print(f"📂 الفئة: {category_name}")
        
        for key, item in category_data.items():
            # تخطي إذا تمت الترجمة
            if not item.get('needs_translation', True):
                continue
            
            # تحديد اللغة المصدر
            source_text = item['ar'] if item['ar'] else item['en']
            source_lang = 'ar' if item['ar'] else 'en'
            
            if not source_text:
                continue
            
            print(f"   • {key[:30]}...")
            
            # ترجمة للغات المطلوبة
            if source_lang == 'ar':
                # ترجمة من العربية
                if not item.get('en'):
                    translated = translate_text_libre(source_text, 'ar', 'en')
                    if translated:
                        item['en'] = translated
                    else:
                        item['en'] = source_text  # استخدم الأصل إذا فشل
                    time.sleep(0.5)
                
                if not item.get('fr'):
                    translated = translate_text_libre(source_text, 'ar', 'fr')
                    if translated:
                        item['fr'] = translated
                    else:
                        item['fr'] = source_text
                    time.sleep(0.5)
                
                if not item.get('zh'):
                    translated = translate_text_libre(source_text, 'ar', 'zh')
                    if translated:
                        item['zh'] = translated
                    else:
                        item['zh'] = source_text
                    time.sleep(0.5)
            
            else:
                # ترجمة من الإنجليزية
                if not item.get('ar'):
                    translated = translate_text_libre(source_text, 'en', 'ar')
                    if translated:
                        item['ar'] = translated
                    else:
                        item['ar'] = source_text
                    time.sleep(0.5)
                
                if not item.get('fr'):
                    translated = translate_text_libre(source_text, 'en', 'fr')
                    if translated:
                        item['fr'] = translated
                    else:
                        item['fr'] = source_text
                    time.sleep(0.5)
                
                if not item.get('zh'):
                    translated = translate_text_libre(source_text, 'en', 'zh')
                    if translated:
                        item['zh'] = translated
                    else:
                        item['zh'] = source_text
                    time.sleep(0.5)
            
            # دائماً احفظ كـ "تمت الترجمة"
            item['needs_translation'] = False
            translated_count += 1
            
            # حد أقصى للترجمات في كل تشغيل
            if max_translations and translated_count >= max_translations:
                print(f"\n⚠️ تم الوصول للحد الأقصى ({max_translations} نص)")
                print(f"   شغّل السكريبت مرة أخرى لإكمال الترجمة")
                return data
        
        print()
    
    print(f"✅ تمت ترجمة {translated_count} نص")
    return data

# ============================================
# توليد ملف translations.jsx
# ============================================

def generate_translations_jsx(data):
    """توليد ملف translations.jsx من البيانات"""
    
    output = "export const translations = {\n"
    
    languages = ['ar', 'en', 'fr', 'zh']
    lang_comments = {
        'ar': 'Arabic',
        'en': 'English',
        'fr': 'Français',
        'zh': 'Chinese (Simplified)'
    }
    
    for lang in languages:
        output += f"  // ============================================\n"
        output += f"  // {lang_comments[lang]}\n"
        output += f"  // ============================================\n"
        output += f"  {lang}: {{\n"
        
        for category_name, category_data in sorted(data.items()):
            output += f"    // ============ {category_name} ============\n"
            output += f"    {category_name}: {{\n"
            
            for key, item in sorted(category_data.items()):
                value = item.get(lang, '').replace('\\', '\\\\').replace('"', '\\"')
                output += f'      {key}: "{value}",\n'
            
            output += f"    }},\n\n"
        
        output += f"  }},\n\n"
    
    output += "};\n"
    
    return output

# ============================================
# التشغيل
# ============================================

if __name__ == "__main__":
    print("🚀 بدء الترجمة المجانية...\n")
    print("✅ لا يحتاج API Key")
    print("✅ لا يكلف شيئاً!")
    print("⚠️ قد يكون أبطأ من Claude\n")
    
    # قراءة البيانات
    if not os.path.exists(INPUT_FILE):
        print(f"❌ الملف غير موجود: {INPUT_FILE}")
        print(f"   قم بتشغيل extract_texts.py أولاً")
        exit(1)
    
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # ترجمة النصوص - 50 نص في كل مرة
    translated_data = translate_batch_libre(data, max_translations=50)
    
    # حفظ النتائج
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ تم حفظ النتائج في: {OUTPUT_FILE}")
    
    # استبدال ملف الاستخراج تلقائياً
    with open(INPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ تم تحديث: {INPUT_FILE}")
    
    # توليد ملف translations.jsx
    jsx_content = generate_translations_jsx(translated_data)
    
    with open("translations_GENERATED.jsx", 'w', encoding='utf-8') as f:
        f.write(jsx_content)
    
    print(f"✅ تم توليد: translations_GENERATED.jsx")
    
    print(f"\n📝 الخطوة التالية:")
    print(f"   1. راجع ملف translations_GENERATED.jsx")
    print(f"   2. انسخه إلى src/components/translations.jsx")
    print(f"   3. شغّل السكريبت مرة أخرى إذا بقيت ترجمات")
    print(f"\n💡 نصيحة: قد تحتاج ~15 تشغيل لإكمال كل الترجمات")