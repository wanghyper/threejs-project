import './App.css';
import {createHashRouter, NavLink, RouterProvider} from 'react-router-dom';
import modules from './pages/route';
console.log(modules)
const router = createHashRouter(
    modules
        .map(item => {
            return {
                path: item.path,
                element: <item.element />,
            };
        })
        .concat({
            path: '/',
            element: (
                <ul>
                    {modules.map(item => (
                        <li key={item.path}>
                            <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                    ))}
                </ul>
            ),
        })
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
