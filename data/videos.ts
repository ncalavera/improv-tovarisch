export type VideoResource = {
  id: string
  title: string
  description: string
  url: string
  previewImage: string
  platform: 'YouTube' | 'VK Видео' | string
  duration?: string
}

export function getVideos(): VideoResource[] {
  return [
    {
      id: 'vk-video-229967683_456239039',
      title: 'Импровизационная миниатюра «Импров Товарищ»',
      description:
        'Запись выступления с живой импровизацией: работа с предложениями зрителей и командная динамика.',
      url: 'https://vkvideo.ru/video-229967683_456239039',
      previewImage: 'https://static-cdn.vk.com/images/video/video_16x9_fallback.png',
      platform: 'VK Видео',
      duration: '12 минут'
    },
    {
      id: 'sVKInDHnsSU',
      title: 'Amateur vs Pro Bike Rider Vs Cheap Bike | GCN',
      description:
        'Экспериментальная импровизация: ведущие обыгрывают разницу между профессионалом и новичком на сцене.',
      url: 'https://www.youtube.com/watch?v=sVKInDHnsSU',
      previewImage: 'https://i.ytimg.com/vi/sVKInDHnsSU/hqdefault.jpg',
      platform: 'YouTube',
      duration: '14 минут'
    },
    {
      id: 'Ri5nU6FDi3w',
      title: 'Опора на поиски тёплых мыслей, два конкретных способа',
      description:
        'Видео-разбор техник создания тёплой атмосферы на импровизационной сцене с практическими примерами.',
      url: 'https://www.youtube.com/watch?v=Ri5nU6FDi3w',
      previewImage: 'https://i.ytimg.com/vi/Ri5nU6FDi3w/hqdefault.jpg',
      platform: 'YouTube',
      duration: '21 минута'
    },
    {
      id: 'improv-yes-and',
      title: 'Yes, And — классические основы импровизации',
      description:
        'Обзор фундаментального принципа «Yes, And» и того, как его применять в разных форматах выступлений.',
      url: 'https://www.youtube.com/watch?v=3qacfQm7Nns',
      previewImage: 'https://i.ytimg.com/vi/3qacfQm7Nns/hqdefault.jpg',
      platform: 'YouTube',
      duration: '9 минут'
    }
  ]
}
