import type { SitePage } from './types'
import type { Lang } from './i18n'

type DemoText = {
  name: string
  title: string
  subtitle: string
  cta: string
  services: [string, string][]
}

type Demo = { accent: string; theme: SitePage['theme']; text: Record<Lang, DemoText> }

const SERVICES_TITLE: Record<Lang, string> = { en: 'Services', ru: 'Услуги', uk: 'Послуги' }

const DEMOS: Demo[] = [
  {
    accent: '#e4572e',
    theme: 'dark',
    text: {
      en: {
        name: 'Northside Barbers',
        title: 'Sharp cuts, no waiting',
        subtitle: 'Book a chair and walk in on time.',
        cta: 'Book a visit',
        services: [
          ['Haircut', 'Wash and styling included'],
          ['Beard trim', 'Shape and care'],
          ['Haircut + beard', 'Everything in one visit'],
        ],
      },
      ru: {
        name: 'Барбершоп «Север»',
        title: 'Чёткие стрижки без ожидания',
        subtitle: 'Запишитесь и приходите ко времени.',
        cta: 'Записаться',
        services: [
          ['Стрижка', 'Мытьё и укладка'],
          ['Моделирование бороды', 'Форма и уход'],
          ['Стрижка и борода', 'Всё за один визит'],
        ],
      },
      uk: {
        name: 'Барбершоп «Північ»',
        title: 'Чіткі стрижки без очікування',
        subtitle: 'Запишіться й приходьте вчасно.',
        cta: 'Записатися',
        services: [
          ['Стрижка', 'Миття й укладання'],
          ['Моделювання бороди', 'Форма та догляд'],
          ['Стрижка і борода', 'Усе за один візит'],
        ],
      },
    },
  },
  {
    accent: '#e0a100',
    theme: 'warm',
    text: {
      en: {
        name: 'Morning Loaf',
        title: 'Bread baked before you wake up',
        subtitle: 'Fresh loaves and pastries every day.',
        cta: 'See today’s bakes',
        services: [
          ['Sourdough', 'Baked daily'],
          ['Croissants', 'Flaky and warm'],
          ['Cakes to order', 'Tell us what you need'],
        ],
      },
      ru: {
        name: 'Утренний хлеб',
        title: 'Хлеб, который выпекли до вашего пробуждения',
        subtitle: 'Свежие буханки и выпечка каждый день.',
        cta: 'Что сегодня в печи',
        services: [
          ['Хлеб на закваске', 'Выпекаем ежедневно'],
          ['Круассаны', 'Слоёные и тёплые'],
          ['Торты на заказ', 'Расскажите, что нужно'],
        ],
      },
      uk: {
        name: 'Ранковий хліб',
        title: 'Хліб, який випекли до вашого пробудження',
        subtitle: 'Свіжі буханки та випічка щодня.',
        cta: 'Що сьогодні в печі',
        services: [
          ['Хліб на заквасці', 'Випікаємо щодня'],
          ['Круасани', 'Шаруваті й теплі'],
          ['Торти на замовлення', 'Розкажіть, що потрібно'],
        ],
      },
    },
  },
  {
    accent: '#2f6fed',
    theme: 'modern',
    text: {
      en: {
        name: 'Pixel & Pine',
        title: 'Websites that bring customers',
        subtitle: 'We design, build and support small-business sites.',
        cta: 'Start a project',
        services: [
          ['Landing pages', 'Clear, fast, mobile-first'],
          ['Online stores', 'Catalog and checkout'],
          ['Support after launch', 'Updates when you need them'],
        ],
      },
      ru: {
        name: 'Пиксель и сосна',
        title: 'Сайты, которые приводят клиентов',
        subtitle: 'Проектируем, делаем и поддерживаем сайты для малого бизнеса.',
        cta: 'Начать проект',
        services: [
          ['Лендинги', 'Понятно, быстро, для телефона'],
          ['Интернет-магазины', 'Каталог и оплата'],
          ['Поддержка после запуска', 'Правки, когда нужны'],
        ],
      },
      uk: {
        name: 'Піксель і сосна',
        title: 'Сайти, що приводять клієнтів',
        subtitle: 'Проєктуємо, робимо й підтримуємо сайти для малого бізнесу.',
        cta: 'Почати проєкт',
        services: [
          ['Лендінги', 'Зрозуміло, швидко, для телефона'],
          ['Інтернет-магазини', 'Каталог і оплата'],
          ['Підтримка після запуску', 'Правки, коли потрібні'],
        ],
      },
    },
  },
  {
    accent: '#0f766e',
    theme: 'modern',
    text: {
      en: {
        name: 'Bright Smile Dental',
        title: 'Gentle care, clear prices',
        subtitle: 'Check-ups, cleaning and treatment in one visit.',
        cta: 'Book a check-up',
        services: [
          ['Check-up', 'Exam and advice'],
          ['Cleaning', 'Polish and care'],
          ['Treatment plan', 'Explained before we start'],
        ],
      },
      ru: {
        name: 'Стоматология «Светлая улыбка»',
        title: 'Бережное лечение, понятные цены',
        subtitle: 'Осмотр, чистка и лечение за один визит.',
        cta: 'Записаться на осмотр',
        services: [
          ['Осмотр', 'Диагностика и советы'],
          ['Чистка', 'Полировка и уход'],
          ['План лечения', 'Объясняем до начала'],
        ],
      },
      uk: {
        name: 'Стоматологія «Світла усмішка»',
        title: 'Дбайливе лікування, зрозумілі ціни',
        subtitle: 'Огляд, чистка та лікування за один візит.',
        cta: 'Записатися на огляд',
        services: [
          ['Огляд', 'Діагностика та поради'],
          ['Чистка', 'Полірування й догляд'],
          ['План лікування', 'Пояснюємо до початку'],
        ],
      },
    },
  },
]

export const DEMO_COUNT = DEMOS.length

export function demoPage(index: number, lang: Lang): SitePage {
  const demo = DEMOS[index % DEMOS.length]
  const t = demo.text[lang]
  return {
    businessName: t.name,
    accent: demo.accent,
    theme: demo.theme,
    lang,
    blocks: [
      { type: 'hero', title: t.title, subtitle: t.subtitle, cta: t.cta },
      {
        type: 'services',
        title: SERVICES_TITLE[lang],
        items: t.services.map(([name, description]) => ({ name, price: null, description })),
      },
    ],
  }
}