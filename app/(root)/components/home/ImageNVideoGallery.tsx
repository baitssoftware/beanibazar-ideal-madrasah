'use client';

import { useGetList } from '@/hooks/APIHooks';
import { ThumbnailGallery } from './Image & Vids Thumbnail/ThumbnailGallery';

interface Photo {
  _id: string;
  title: string;
  image: string;
}

interface Video {
  _id: string;
  title: string;
  thumbnail: string;
  link: string;
}

const ImageNVideoGallery = () => {
  const { data: photos = [] } = useGetList<Photo>('/photo', 'photos');
  const { data: videos = [] } = useGetList<Video>('/video', 'videos');

  const photoGallery = photos.map((photo) => photo.image); // Ensure you're using correct image field
  const videoGallery = videos.map((video) => video.thumbnail); // Ensure you're using correct thumbnail field

  return (
    <div className="grid grid-cols-2 gap-4 pb-16">
      <div>
        <h2 className="heading mb-3">Video Gallery</h2>
        <ThumbnailGallery images={videoGallery} category="video" />
      </div>

      <div>
        <h2 className="heading mb-3">Photo Gallery</h2>
        <ThumbnailGallery images={photoGallery} category="photo" />
      </div>
    </div>
  );
};

export default ImageNVideoGallery;
