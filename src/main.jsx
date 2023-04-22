import modules from './pages/route';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createHashRouter, RouterProvider} from 'react-router-dom';
console.log(modules);
const router = createHashRouter(modules.map(item => {
    return{
        path:  item.path,
        element: <item.element/>
    }
}));
ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
