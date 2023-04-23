const modules = import.meta.globEager('./**/*.jsx');
console.log(modules)
export default Object.keys(modules).map(key => {
    const Components = modules[key].default;
    const name = /\.\/(.*)\.jsx/.exec(key);
    return {
        path:  name?.[1],
        name: Components.name,
        element: Components
    }
});