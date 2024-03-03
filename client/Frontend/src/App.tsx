import { router } from './router.tsx';
import { LocationProvider } from './locationContext.tsx';
import './index.css';
import { UserContextProvider } from './contexts/UserContext.tsx';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = () => {

  console.log(import.meta.env.VITE);

  return (
    <>
      <UserContextProvider>
        <LocationProvider>
          <RouterProvider router={router} />
        </LocationProvider>
      </UserContextProvider>
      <ToastContainer
        toastClassName={'font-[ComicStandar] text-black border-2 border-black'}
        toastStyle={{
          borderRadius: '0px',
          background:
            'url(\'data:image/svg+xml;utf8,<svg width="10" height="10" transform="rotate(0)" opacity="0.2" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g  fill="%23250E17"><circle cx="25" cy="25" r="12.5"/><circle cx="75" cy="75" r="12.5"/><circle cx="75" cy="25" r="12.5"/><circle cx="25" cy="75" r="12.5"/></g></svg>\'), #fff',
          boxShadow: '-5px 5px 0px #000',
        }}
      />
    </>
  );
};

export default App;
