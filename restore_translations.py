#!/usr/bin/env python3
"""
سكريبت دمج الترجمات القديمة مع الجديدة
"""

import json
import os

OLD_FILE = "translations_final.json"      # الترجمات القديمة (217 نص)
NEW_FILE = "translations_extracted.json"  # النصوص الجديدة
OUTPUT_FILE = "translations_merged.json"  # الناتج المدمج

def merge_translations():
    """دمج الترجمات القديمة مع النصوص الجديدة"""
    
    print("🔄 بدء دمج الترجمات...\n")
    
    # قراءة الملف القديم
    if not os.path.exists(OLD_FILE):
        print(f"❌ الملف غير موجود: {OLD_FILE}")
        return
    
    with open(OLD_FILE, 'r', encoding='utf-8') as f:
        old_data = json.load(f)
    
    print(f"✅ تم قراءة الترجمات القديمة")
    
    # قراءة الملف الجديد
    if not os.path.exists(NEW_FILE):
        print(f"❌ الملف غير موجود: {NEW_FILE}")
        return
    
    with open(NEW_FILE, 'r', encoding='utf-8') as f:
        new_data = json.load(f)
    
    print(f"✅ تم قراءة النصوص الجديدة")
    
    # الدمج
    merged_count = 0
    
    for category_name, category_data in new_data.items():
        if category_name not in old_data:
            continue
        
        for key, new_item in category_data.items():
            if key in old_data[category_name]:
                old_item = old_data[category_name][key]
                
                # نسخ الترجمات من القديم إلى الجديد
                if old_item.get('en'):
                    new_item['en'] = old_item['en']
                if old_item.get('fr'):
                    new_item['fr'] = old_item['fr']
                if old_item.get('zh'):
                    new_item['zh'] = old_item['zh']
                
                # تحديث الحالة
                new_item['needs_translation'] = old_item.get('needs_translation', False)
                merged_count += 1
    
    print(f"✅ تم دمج {merged_count} ترجمة\n")
    
    # حفظ النتيجة
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ تم حفظ النتيجة في: {OUTPUT_FILE}")
    
    # استبدال الملف القديم
    with open(NEW_FILE, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ تم تحديث: {NEW_FILE}")
    
    # حساب الإحصائيات
    total = 0
    translated = 0
    
    for category in new_data.values():
        for item in category.values():
            total += 1
            if not item.get('needs_translation', True):
                translated += 1
    
    percentage = (translated / total * 100) if total > 0 else 0
    
    print("\n" + "="*50)
    print("📊 النتيجة:")
    print("="*50)
    print(f"إجمالي النصوص: {total}")
    print(f"✅ مترجم: {translated}")
    print(f"⏳ يحتاج ترجمة: {total - translated}")
    print(f"📈 النسبة: {percentage:.1f}%")
    print("="*50)

if __name__ == "__main__":
    merge_translations()
    
    print("\n📝 الخطوة التالية:")
    print("   python check_progress.py")
