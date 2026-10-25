import type { SitePage } from './types'

export const sampleBarbershop: SitePage = {
  businessName: 'Sharp Cut',
  accent: '#0f766e',
  theme: 'dark',
  blocks: [
    {
      type: 'hero',
      title: 'Барбершоп в центре Киева',
      subtitle: 'Три мастера, стрижка от 500 грн. Работаем ежедневно с 10 до 20.',
      cta: 'Записаться',
    },
    {
      type: 'services',
      title: 'Услуги и цены',
      items: [
        { name: 'Мужская стрижка', price: 'от 500 грн', description: 'Мытьё и укладка включены' },
        { name: 'Моделирование бороды', price: 'от 350 грн' },
        { name: 'Стрижка + борода', price: 'от 800 грн', description: 'Выгоднее, чем по отдельности' },
      ],
    },
    {
      type: 'features',
      title: 'Почему выбирают нас',
      items: [
        { title: 'Опытные мастера', text: 'Каждый работает с клиентами больше пяти лет.' },
        { title: 'Без очередей', text: 'Запись на точное время, ждать не придётся.' },
        { title: 'Уютная атмосфера', text: 'Кофе, музыка и спокойный разговор.' },
      ],
    },
    {
      type: 'contacts',
      title: 'Контакты',
      address: 'Киев, ул. Примерная, 10',
      phone: '+380 00 000 00 00',
      hours: 'Ежедневно 10:00 - 20:00',
    },
  ],
}