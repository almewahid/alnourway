#!/usr/bin/env python3
"""
سكريبت تقسيم الترجمات - يعمل مباشرة مع JSX
"""

import os
import re

INPUT_FILE = "translations_PERFECT.jsx"
OUTPUT_DIR = "src/locales"

def extract_language_data(content, lang_code):
    """استخراج بيانات لغة معينة"""
    
    # البحث عن قسم اللغة
    pattern = rf'{lang_code}:\s*\{{'
    match = re.search(pattern, content)
    
    if not match:
        return {}
    
    start = match.end()
    
    # البحث عن نهاية القسم
    brace_count = 1
    end = start
    
    while brace_count > 0 and end < len(content):
        if content[end] == '{':
            brace_count += 1
        elif content[end] == '}':
            brace_count -= 1
        end += 1
    
    return content[start:end-1]

def split_translations():
    """تقسيم الترجمات"""
    
    print("🚀 بدء تقسيم ملف الترجمات...\n")
    
    if not os.path.exists(INPUT_FILE):
        print(f"❌ الملف غير موجود: {INPUT_FILE}")
        return
    
    # قراءة الملف
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # إنشاء المجلد
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"✅ تم إنشاء المجلد: {OUTPUT_DIR}")
    
    languages = {
        'ar': 'العربية',
        'en': 'English',
        'fr': 'Français',
        'zh': '中文'
    }
    
    # تقسيم كل لغة
    for lang_code, lang_name in languages.items():
        print(f"📝 معالجة {lang_name} ({lang_code})...")
        
        lang_data = extract_language_data(content, lang_code)
        
        if not lang_data:
            print(f"   ⚠️ لم يتم العثور على بيانات!")
            continue
        
        # إنشاء ملف اللغة مع backticks بدلاً من quotes
        output_content = f"export const {lang_code} = {{\n"
        
        # معالجة كل سطر
        lines = lang_data.split('\n')
        line_count = 0
        
        for line in lines:
            # تخطي التعليقات والأقواس
            stripped = line.strip()
            if not stripped or stripped.startswith('//'):
                output_content += line + '\n'
                continue
            
            # إذا كان سطر ترجمة
            if ':' in line and ('"' in line or "'" in line):
                # استبدال double quotes بـ backticks
                # البحث عن النمط: key: "value",
                match = re.match(r'(\s*)([^:]+):\s*"(.+)",?\s*$', line)
                if match:
                    indent = match.group(1)
                    key = match.group(2)
                    value = match.group(3)
                    
                    # escape backticks في القيمة
                    value = value.replace('`', '\\`')
                    value = value.replace('${', '\\${')
                    
                    output_content += f'{indent}{key}: `{value}`,\n'
                    line_count += 1
                else:
                    output_content += line + '\n'
            else:
                output_content += line + '\n'
        
        output_content += "};\n"
        
        # حفظ الملف
        output_file = os.path.join(OUTPUT_DIR, f"{lang_code}.js")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(output_content)
        
        print(f"   ✅ تم حفظ {output_file} ({line_count} نص)")
    
    # إنشاء index.js
    index_content = """// ملف التجميع - Aggregator file
import { ar } from './ar';
import { en } from './en';
import { fr } from './fr';
import { zh } from './zh';

export const translations = {
  ar,
  en,
  fr,
  zh
};
"""
    
    index_file = os.path.join(OUTPUT_DIR, "index.js")
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(index_content)
    
    print(f"✅ تم إنشاء {index_file}")
    
    print("\n✨ تم الانتهاء!")
    print("\n" + "="*50)
    print("📊 النتيجة:")
    print("="*50)
    print("✅ تم تقسيم الترجمات إلى:")
    for lang_code in languages.keys():
        print(f"   • src/locales/{lang_code}.js")
    print(f"   • src/locales/index.js")
    
    print("\n💡 الآن:")
    print("   npm run dev")

if __name__ == "__main__":
    split_translations()