import { importantLinks } from '@/data/important-link';
import { ChevronRight } from 'lucide-react';

const ImportantLink = () => {
  return (
    <div className="border-s p-4 sticky top-40 bg-white">
      <h5 className="heading">important links</h5>
      <ul className="mt-2 space-y-2 px-4 py-5 bg-orange-100 shadow-lg">
        {importantLinks.map((link, index) => (
          <li key={index}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-black text-base flex items-center"
            >
              <ChevronRight className="inline w-5 mb-1 text-yellow-400" />
              <span className="ml-2">{link.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImportantLink;
