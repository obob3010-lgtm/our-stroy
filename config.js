window.MUSEUM_CONFIG = {
  // Вставь данные своего проекта Supabase. Пока false — сайт будет работать локально.
  enabled: true,
  supabaseUrl: "https://nxqylkiqyvzefdxqdybu.supabase.co",
  supabaseAnonKey: "sb_publishable_vzLmlnwG_2HB1f_HLPjobQ_NcZ8wC5k",

  // Случайная длинная строка. Она определяет, какой музей видит эта копия сайта.
  museumRoomId: "815a4534b7d0d7317abed08e5e8bdcd174b655a29ce7319e",

  // Имя приватного bucket в Supabase Storage.
  bucket: "museum-media",

  // Размеры сжатия фото перед загрузкой.
  imageMaxDimension: 1800,
  imageQuality: 0.82
};
