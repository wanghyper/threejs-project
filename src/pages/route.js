const modules = import.meta.globEager('./*.jsx');

export default Object.keys(modules).map(key => {
    const Components = modules[key].default;
    return {
        path:  Components.name,
        element: Components
    }
});