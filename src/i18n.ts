import { useEffect, useState } from 'react'
import type { SiteLang } from './types'

export type Lang = 'en' | 'ru' | 'uk'

export const SITE_LANGUAGES: { code: SiteLang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'uk', label: 'Українська' },
  { code: 'ru', label: 'Русский' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'pl', label: 'Polski' },
  { code: 'pt', label: 'Português' },
]

const en = {
  tagline: 'A website for your business in minutes',
  'f.desc': 'What do you do? *',
  'f.desc.ph': 'Web studio: we build websites and online stores, support after launch',
  'f.name': 'Business name',
  'f.city': 'City',
  'f.siteLang': 'Website language',
  'f.services': 'Services and prices',
  'f.service.ph': 'Service',
  'f.price.ph': 'Price',
  'f.addService': '+ Add service',
  'f.removeService': 'Remove service',
  'f.phone': 'Phone',
  'f.email': 'Email',
  'f.whatsapp': 'WhatsApp',
  'f.telegram': 'Telegram',
  'f.instagram': 'Instagram',
  'f.address': 'Address',
  'f.hours': 'Opening hours',
  'f.hours.ph': 'Mon-Fri 10:00-19:00',
  'key.summary': 'Your own Gemini key (if the free limit is used up)',
  'key.s1a': 'Open',
  'key.s1b': 'and sign in with your Google account.',
  'key.s2': 'Click "Create API key" and copy the key.',
  'key.s3': 'Paste it below. Do not enable billing in Google Cloud if you want to stay on the free tier.',
  'key.stored':
    'The key is stored only in your browser and sent with your request. We do not store it on our server.',
  privacy:
    'The text from the "What do you do?" field is processed by Google AI, so do not include personal data there. Phone, email, address and social links are not sent to the AI. We do not store your pages. To enforce daily limits we temporarily keep an anonymized fingerprint of your IP address.',
  'btn.generate': 'Generate',
  'btn.generating': 'Generating...',
  'btn.wait': 'Please wait...',
  preview: 'preview',
  edit: 'Edit text',
  'theme.modern': 'Light',
  'theme.warm': 'Warm',
  'theme.dark': 'Dark',
  color: 'Color',
  download: 'Download site (HTML)',
  empty: 'Your page will appear here. Fill in the form and click "Generate".',
  'cta.title': 'Need a custom website?',
  'cta.text':
    'Multi-page site, online store, booking or a redesign: send me a short description and I will get back to you as soon as possible.',
  'cta.email': 'Email me',
  'err.INVALID_INPUT':
    'Please describe your business in a bit more detail (one or two sentences) and check the other fields.',
  'err.OVERLOADED': 'The AI service is overloaded right now. Please try again in a minute.',
  'err.AI_RATE_LIMIT': 'The AI request limit was reached. Please try again in a minute.',
  'err.AI_BAD_RESPONSE': 'The AI returned an invalid answer. Please try again.',
  'err.KEY_REJECTED': 'Google rejected the API key. Check that it was copied completely.',
  'err.UPSTREAM': 'The AI service returned an error. Please try again later.',
  'err.FOREIGN_ORIGIN': 'A request from another site was rejected.',
  'err.REGION':
    'The service is not available in your region yet (EU, EEA, Switzerland, United Kingdom).',
  'err.TOO_LARGE': 'The request is too large.',
  'err.BAD_KEY': 'The API key looks invalid.',
  'err.NOT_CONFIGURED': 'The service is not configured.',
  'err.UNAVAILABLE': 'The service is temporarily unavailable.',
  'err.LIMIT_IP':
    'You have used your free generations for today. Paste your own Gemini key or come back tomorrow.',
  'err.LIMIT_IP_OWN': 'The daily request limit is reached. Please try again tomorrow.',
  'err.LIMIT_GLOBAL':
    'Free generations for today are used up for everyone. Paste your own Gemini key or come back tomorrow.',
  'err.BAD_REQUEST': 'Invalid request.',
  'err.INTERNAL': 'Internal server error.',
  'err.NETWORK': 'Could not reach the server. Check your connection.',
  'err.UNKNOWN': 'Something went wrong. Please try again.',
}

export type Key = keyof typeof en

const ru: Record<Key, string> = {
  tagline: 'Сайт для вашего бизнеса за несколько минут',
  'f.desc': 'Чем вы занимаетесь? *',
  'f.desc.ph': 'Веб-студия: делаем сайты и интернет-магазины, поддержка после запуска',
  'f.name': 'Название',
  'f.city': 'Город',
  'f.siteLang': 'Язык сайта',
  'f.services': 'Услуги и цены',
  'f.service.ph': 'Услуга',
  'f.price.ph': 'Цена',
  'f.addService': '+ Добавить услугу',
  'f.removeService': 'Удалить услугу',
  'f.phone': 'Телефон',
  'f.email': 'Email',
  'f.whatsapp': 'WhatsApp',
  'f.telegram': 'Telegram',
  'f.instagram': 'Instagram',
  'f.address': 'Адрес',
  'f.hours': 'График работы',
  'f.hours.ph': 'Пн-Пт 10:00-19:00',
  'key.summary': 'Свой ключ Gemini (если бесплатный лимит исчерпан)',
  'key.s1a': 'Откройте',
  'key.s1b': 'и войдите в аккаунт Google.',
  'key.s2': 'Нажмите «Create API key» и скопируйте ключ.',
  'key.s3':
    'Вставьте его ниже. Не подключайте оплату в Google Cloud, если хотите остаться на бесплатном уровне.',
  'key.stored':
    'Ключ хранится только в вашем браузере и отправляется вместе с запросом, на нашем сервере не сохраняется.',
  privacy:
    'Текст из поля «Чем вы занимаетесь» обрабатывается сервисом Google AI, поэтому не пишите там личные данные. Телефон, email, адрес и ссылки на соцсети в AI не отправляются. Страницы мы не сохраняем. Для суточных лимитов временно хранится обезличенный отпечаток IP-адреса.',
  'btn.generate': 'Сгенерировать',
  'btn.generating': 'Генерирую...',
  'btn.wait': 'Подождите немного...',
  preview: 'превью',
  edit: 'Править текст',
  'theme.modern': 'Светлая',
  'theme.warm': 'Тёплая',
  'theme.dark': 'Тёмная',
  color: 'Цвет',
  download: 'Скачать сайт (HTML)',
  empty: 'Здесь появится ваша страница. Заполните форму и нажмите «Сгенерировать».',
  'cta.title': 'Нужен индивидуальный сайт?',
  'cta.text':
    'Многостраничный сайт, интернет-магазин, запись клиентов или редизайн: пришлите краткое описание, и я отвечу как можно скорее.',
  'cta.email': 'Написать на email',
  'err.INVALID_INPUT':
    'Опишите бизнес подробнее (одно-два предложения) и проверьте остальные поля.',
  'err.OVERLOADED': 'AI-сервис сейчас перегружен. Попробуйте через минуту.',
  'err.AI_RATE_LIMIT': 'Достигнут лимит запросов к AI. Попробуйте через минуту.',
  'err.AI_BAD_RESPONSE': 'AI вернул неверный ответ. Попробуйте ещё раз.',
  'err.KEY_REJECTED': 'Google отклонил ключ API. Проверьте, что он скопирован полностью.',
  'err.UPSTREAM': 'AI-сервис вернул ошибку. Попробуйте позже.',
  'err.FOREIGN_ORIGIN': 'Запрос с чужого сайта отклонён.',
  'err.REGION':
    'Сервис пока недоступен в вашем регионе (ЕС, ЕЭЗ, Швейцария, Великобритания).',
  'err.TOO_LARGE': 'Слишком большой запрос.',
  'err.BAD_KEY': 'Ключ API выглядит неверно.',
  'err.NOT_CONFIGURED': 'Сервис не настроен.',
  'err.UNAVAILABLE': 'Сервис временно недоступен.',
  'err.LIMIT_IP':
    'Вы использовали бесплатные генерации на сегодня. Вставьте свой ключ Gemini или попробуйте завтра.',
  'err.LIMIT_IP_OWN': 'Суточный лимит запросов исчерпан. Попробуйте завтра.',
  'err.LIMIT_GLOBAL':
    'Бесплатные генерации на сегодня закончились у всех. Вставьте свой ключ Gemini или зайдите завтра.',
  'err.BAD_REQUEST': 'Некорректный запрос.',
  'err.INTERNAL': 'Внутренняя ошибка сервера.',
  'err.NETWORK': 'Не удалось связаться с сервером. Проверьте интернет.',
  'err.UNKNOWN': 'Что-то пошло не так. Попробуйте ещё раз.',
}

const uk: Record<Key, string> = {
  tagline: 'Сайт для вашого бізнесу за кілька хвилин',
  'f.desc': 'Чим ви займаєтесь? *',
  'f.desc.ph': 'Веб-студія: робимо сайти та інтернет-магазини, підтримка після запуску',
  'f.name': 'Назва',
  'f.city': 'Місто',
  'f.siteLang': 'Мова сайту',
  'f.services': 'Послуги та ціни',
  'f.service.ph': 'Послуга',
  'f.price.ph': 'Ціна',
  'f.addService': '+ Додати послугу',
  'f.removeService': 'Видалити послугу',
  'f.phone': 'Телефон',
  'f.email': 'Email',
  'f.whatsapp': 'WhatsApp',
  'f.telegram': 'Telegram',
  'f.instagram': 'Instagram',
  'f.address': 'Адреса',
  'f.hours': 'Графік роботи',
  'f.hours.ph': 'Пн-Пт 10:00-19:00',
  'key.summary': 'Власний ключ Gemini (якщо безкоштовний ліміт вичерпано)',
  'key.s1a': 'Відкрийте',
  'key.s1b': 'і увійдіть в акаунт Google.',
  'key.s2': 'Натисніть «Create API key» і скопіюйте ключ.',
  'key.s3':
    'Вставте його нижче. Не підключайте оплату в Google Cloud, якщо хочете залишитися на безкоштовному рівні.',
  'key.stored':
    'Ключ зберігається лише у вашому браузері й надсилається разом із запитом, на нашому сервері він не зберігається.',
  privacy:
    'Текст із поля «Чим ви займаєтесь» обробляє сервіс Google AI, тому не вказуйте там персональні дані. Телефон, email, адреса та посилання на соцмережі в AI не надсилаються. Сторінки ми не зберігаємо. Для добових лімітів тимчасово зберігається знеособлений відбиток IP-адреси.',
  'btn.generate': 'Згенерувати',
  'btn.generating': 'Генерую...',
  'btn.wait': 'Зачекайте трохи...',
  preview: 'перегляд',
  edit: 'Редагувати текст',
  'theme.modern': 'Світла',
  'theme.warm': 'Тепла',
  'theme.dark': 'Темна',
  color: 'Колір',
  download: 'Завантажити сайт (HTML)',
  empty: 'Тут з’явиться ваша сторінка. Заповніть форму та натисніть «Згенерувати».',
  'cta.title': 'Потрібен індивідуальний сайт?',
  'cta.text':
    'Багатосторінковий сайт, інтернет-магазин, запис клієнтів або редизайн: надішліть короткий опис, і я відповім якнайшвидше.',
  'cta.email': 'Написати на email',
  'err.INVALID_INPUT':
    'Опишіть бізнес докладніше (одне-два речення) і перевірте решту полів.',
  'err.OVERLOADED': 'AI-сервіс зараз перевантажений. Спробуйте за хвилину.',
  'err.AI_RATE_LIMIT': 'Досягнуто ліміт запитів до AI. Спробуйте за хвилину.',
  'err.AI_BAD_RESPONSE': 'AI повернув некоректну відповідь. Спробуйте ще раз.',
  'err.KEY_REJECTED': 'Google відхилив ключ API. Перевірте, що його скопійовано повністю.',
  'err.UPSTREAM': 'AI-сервіс повернув помилку. Спробуйте пізніше.',
  'err.FOREIGN_ORIGIN': 'Запит із чужого сайту відхилено.',
  'err.REGION':
    'Сервіс поки недоступний у вашому регіоні (ЄС, ЄЕЗ, Швейцарія, Великобританія).',
  'err.TOO_LARGE': 'Запит завеликий.',
  'err.BAD_KEY': 'Ключ API виглядає некоректно.',
  'err.NOT_CONFIGURED': 'Сервіс не налаштовано.',
  'err.UNAVAILABLE': 'Сервіс тимчасово недоступний.',
  'err.LIMIT_IP':
    'Ви використали безкоштовні генерації на сьогодні. Вставте власний ключ Gemini або спробуйте завтра.',
  'err.LIMIT_IP_OWN': 'Добовий ліміт запитів вичерпано. Спробуйте завтра.',
  'err.LIMIT_GLOBAL':
    'Безкоштовні генерації на сьогодні закінчилися в усіх. Вставте власний ключ Gemini або зазирніть завтра.',
  'err.BAD_REQUEST': 'Некоректний запит.',
  'err.INTERNAL': 'Внутрішня помилка сервера.',
  'err.NETWORK': 'Не вдалося зв’язатися з сервером. Перевірте інтернет.',
  'err.UNKNOWN': 'Щось пішло не так. Спробуйте ще раз.',
}

const dict: Record<Lang, Record<Key, string>> = { en, ru, uk }

function detect(): Lang {
  try {
    const saved = localStorage.getItem('ui-lang')
    if (saved === 'en' || saved === 'ru' || saved === 'uk') return saved
  } catch {
    /* хранилище недоступно */
  }
  const nav = (navigator.language || 'en').toLowerCase()
  if (nav.startsWith('uk')) return 'uk'
  if (nav.startsWith('ru')) return 'ru'
  return 'en'
}

export function useI18n() {
  const [lang, setLangState] = useState<Lang>(detect)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem('ui-lang', next)
    } catch {
      /* хранилище недоступно */
    }
  }

  const t = (key: Key) => dict[lang][key]

  // Текст ошибки по коду с сервера; если кода нет в словаре, берём сообщение сервера
  const te = (code?: string, fallback?: string) =>
    (dict[lang] as Record<string, string>)[`err.${code}`] ?? fallback ?? dict[lang]['err.UNKNOWN']

  return { lang, setLang, t, te }
}