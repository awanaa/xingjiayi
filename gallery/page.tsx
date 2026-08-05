import fs from 'fs';
import path from 'path';

export default async function GalleryPage() {
  const galleryDir = path.join(process.cwd(), 'public', 'gallery');
  let files: string[] = [];
  try {
    files = fs.readdirSync(galleryDir).filter(f => f.toLowerCase().endsWith('.jpg'));
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">临时画廊 (用于挑选图片)</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {files.map((file) => (
          <div key={file} className="border border-gray-700 rounded-lg overflow-hidden flex flex-col">
            <div className="relative h-48 w-full bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/gallery/${file}`} alt={file} className="object-cover w-full h-full" loading="lazy" />
            </div>
            <div className="p-2 text-center text-sm font-mono break-all bg-gray-900 border-t border-gray-700">
              {file}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
