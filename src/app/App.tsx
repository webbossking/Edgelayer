import { RouterProvider } from 'react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <DataProvider>
            <RouterProvider router={router} />
          </DataProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}