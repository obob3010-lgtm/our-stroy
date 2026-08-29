window.MUSEUM_CONFIG = {
  enabled: true,
  supabaseUrl: "https://nxqylkiqyvzefdxqdybu.supabase.co",
  supabaseAnonKey: "sb_publishable_vzLmlnwG_2HB1f_HLPjobQ_NcZ8wC5k",
  museumRoomId: "815a4534b7d0d7317abed08e5e8bdcd174b655a29ce7319e",
  bucket: "museum-media",

  // Photo compression before upload.
  imageMaxDimension: 2000,
  imageQuality: 0.84,

  // Client-side guardrails. Change only if your Supabase plan supports larger files.
  maxImagesPerPost: 6,
  maxVideosPerPost: 3,
  maxVideoMB: 120,
  maxAudioMB: 60,
  maxMusicTracks: 100,

  // Atmosphere: use "auto" in normal mode. For testing: "winter" + "night", etc.
  seasonMode: "winter",
  timeMode: "night",

  // Optional built-in local soundtrack. Leave empty when using the cloud music library.
  musicTracks: []
};
