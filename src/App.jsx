// ==============================|| APP.JS (CORRECTED SOCKET SETUP) ||============================== //
// ✅ Fixes:
// 1. Added missing useEffect import
// 2. Added process.env for REACT_APP_BASE_URL
// 3. Better socket lifecycle
// 4. Proper disconnect cleanup
// 5. Prevent duplicate socket instances
// 6. Recommended socket file usage

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';

// ✅ Import shared socket instance
import socket from 'utils/socket';

// ==============================|| APP ||============================== //

export default function App() {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Register logged-in user
    if (user?._id) {
      socket.emit('registerUser', user._id);
      console.log('Socket Registered:', user._id);
    }

    // Optional debug logs
    socket.on('connect', () => {
      console.log('Socket Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket Disconnected');
    });

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <ThemeCustomization>
      <NavigationScroll>
        <RouterProvider router={router} />
      </NavigationScroll>
    </ThemeCustomization>
  );
}
