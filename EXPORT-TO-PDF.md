# Экспорт страниц в PDF

## ✨ Быстрый способ (рекомендуется)

Созданы специальные страницы для печати со всем контентом:

### Главная страница

1. Откройте http://localhost:3001/print в браузере
2. Нажмите кнопку **🖨️ Печать / Сохранить PDF** ИЛИ **⌘ + P** (Command + P)
3. Выберите "Сохранить как PDF"
4. Сохраните как `improv-formats-main.pdf`

### Страница Harold

1. Откройте http://localhost:3001/formats/1/print в браузере
2. Нажмите кнопку **🖨️ Печать / Сохранить PDF** ИЛИ **⌘ + P** (Command + P)
3. Выберите "Сохранить как PDF"
4. Сохраните как `harold-format.pdf`

**Преимущества:**
- Все collapsible блоки уже раскрыты
- Оптимизировано для печати
- Правильные разрывы страниц
- Сохранены все цвета и стили

## Вариант 2: Автоматический экспорт (требует установки)

Если вы хотите автоматизировать процесс:

1. Установите Puppeteer (это займёт несколько минут):
   ```bash
   npm install --save-dev puppeteer
   ```

2. Запустите скрипт экспорта:
   ```bash
   node export-to-pdf.js
   ```

Это создаст два файла:
- `improv-formats-main.pdf` - главная страница
- `harold-format.pdf` - страница Harold со всеми раскрытыми блоками

## Настройки печати для лучшего результата

При печати в PDF в настройках укажите:
- **Ориентация:** Книжная (Portrait)
- **Поля:** Средние
- **Печать фона:** Включить
- **Масштаб:** 100% или "По размеру страницы"

## Альтернатива: Использование Chrome DevTools

Если у вас установлен Chrome:

```bash
# Главная страница (все форматы)
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu \
  --print-to-pdf="improv-formats-main.pdf" \
  --print-to-pdf-no-header \
  "http://localhost:3001/print"

# Страница Harold (детально)
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu \
  --print-to-pdf="harold-format.pdf" \
  --print-to-pdf-no-header \
  "http://localhost:3001/formats/1/print"
```

**Важно:** Используйте URL с `/print` в конце - на этих страницах все блоки уже раскрыты и оптимизированы для печати!
