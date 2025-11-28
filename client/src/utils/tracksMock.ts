export const getAudioUrl = (trackId: number): string => {
  const audioMap: { [key: number]: string } = {
    1: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    2: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", 
    3: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    4: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    5: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    6: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    7: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    8: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    9: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    10: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  };
  
  return audioMap[trackId] || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
};