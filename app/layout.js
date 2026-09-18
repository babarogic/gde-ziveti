import './globals.css';
import { Agentation } from 'agentation';

export const metadata = {
  title: 'Gde živeti — naš framework',
  description: 'Alat za usklađivanje — prioriteti, faze života i lokacije.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body>
        <main id="main-content">{children}</main>
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </body>
    </html>
  );
}
