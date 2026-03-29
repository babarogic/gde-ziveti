import './globals.css';
import { Agentation } from 'agentation';

export const metadata = {
  title: 'Gde živeti — naš framework',
  description: 'Framework za usklađivanje — prioriteti, faze života, lokacije.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </body>
    </html>
  );
}
