const searchBar = document.getElementById('search-bar');
const inStockCheckbox = document.getElementById('in-stock');
const productList = document.getElementById('product-list');

const fetchData = async () => {
    const url = 'https://gist.githubusercontent.com/dupontdenis/b2e5e1b7460c239b39deb76f8d458908/raw/817a898940170ae4ea6d5b16ef462f959c4d38d1/gistfile1.txt';
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.text(); 
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
};

function getUniqueCategories(products) {
    const categories = new Set();
    products.forEach(product => categories.add(product.category));
    return Array.from(categories);
}

function displayProducts(filteredProducts) {
    productList.innerHTML = '';

    const categories = getUniqueCategories(filteredProducts);

    categories.forEach(category => {
        const categoryRow = document.createElement('tr');
        const categoryCell = document.createElement('td');
        categoryCell.textContent = category;
        categoryCell.classList.add('category');
        categoryCell.setAttribute('colspan', 2);
        categoryRow.appendChild(categoryCell);  
        productList.appendChild(categoryRow);

        const categoryProducts = filteredProducts.filter(product => product.category === category);
        categoryProducts.forEach(product => {
            const productRow = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = product.name;

            if (!product.stocked) {
                nameCell.classList.add('out-of-stock');
            }

            const priceCell = document.createElement('td');
            priceCell.textContent = product.price;

            productRow.appendChild(nameCell);
            productRow.appendChild(priceCell);
            productList.appendChild(productRow);
        });
    });
}

function filterProducts(products) {
    const searchTerm = searchBar.value.toLowerCase();
    const inStockOnly = inStockCheckbox.checked;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesStock = !inStockOnly || product.stocked;
        return matchesSearch && matchesStock;
    });

    displayProducts(filteredProducts);
}

let array = []

const displayData = async () => {
    try {
      const data = await fetchData(); 
      const arrayString = data.match(/\[.*\]/s)[0]; 
      const products = eval(arrayString);
      array = products;

      displayProducts(array);

      searchBar.addEventListener('input', () => filterProducts(array));
      inStockCheckbox.addEventListener('change', () => filterProducts(array));

    } catch (error) {
      console.error('Error:', error); 
    }
};

displayData();
