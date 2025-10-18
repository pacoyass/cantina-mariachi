export const meta = () => [
  { title: "Not Found - Cantina" },
];

import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function NotFoundPage() {
  const { t } = useTranslation('common');
  return (
   
        <main className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="text-4xl font-bold  mb-4">404 - {t('notFound')}</h1>
          <p className="text-lg  mb-8">{t('resourceNotFound')}</p>
          
          {/* Optional: Add a button to go back home */}
          <Link to="/" className=" font-medium py-2 px-6 rounded-lg transition-colors duration-200">
          <Button>
          {t('backtohome')}

          </Button>
          </Link>
        </div>
      </main>
  );
}