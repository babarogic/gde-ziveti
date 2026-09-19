import './globals.css';
import { Agentation } from 'agentation';

export const metadata = {
  title: 'Gde ćemo živeti?',
  description: 'Zajednički alat za poređenje mesta, razgovor i sledeći korak.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr-Latn">
      <body>
        <main id="main-content">{children}</main>
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </body>
    </html>
  );
}
