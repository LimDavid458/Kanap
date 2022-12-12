/* Utilities */
// check the presence of the "cart" key in the storage room.(return tab object else [])
export function getFromLocalStorage () {
    return localStorageHasKey() ? JSON.parse(localStorage.getItem('cart')) : [];
}

export function localStorageHasKey() {
    return !!localStorage.getItem('cart');
}

export function saveToLocalStorage(products) {
    localStorage.setItem('cart', JSON.stringify(products));
}