const title = document.getElementById('title');
const price = document.getElementById('price');
const taxes = document.getElementById('taxes');
const ads = document.getElementById('ads');
const discount = document.getElementById('discount');
const total = document.getElementById('total');
const count = document.getElementById('count');
const category = document.getElementById('category');
const submit = document.getElementById('submit');
const search = document.getElementById('search');
const tableBody = document.querySelector('tbody') || document.getElementById('tbody');
const deleteAllBtn = document.getElementById('deleteAll');

let datapro = JSON.parse(localStorage.getItem('product') || '[]');
let mode = 'create';
let selectedIndex = null;
let searchMode = 'title';

function saveData() {
    localStorage.setItem('product', JSON.stringify(datapro));
}

function getTotal() {
    if (price.value !== '') {
        const result = Number(price.value || 0)
            + Number(taxes.value || 0)
            + Number(ads.value || 0)
            - Number(discount.value || 0);

        total.textContent = result;
        total.style.background = '#040';
    } else {
        total.textContent = '0';
        total.style.background = '#a00d02';
    }
}

function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.textContent = '0';
    total.style.background = '#a00d02';
    count.value = '';
    category.value = '';
    submit.textContent = 'Create';
    mode = 'create';
    selectedIndex = null;
}

function renderTable(items = datapro) {
    if (!tableBody) return;

    if (items.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="10">No products found</td></tr>';
    } else {
        tableBody.innerHTML = items.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.title}</td>
                <td>${item.price}</td>
                <td>${item.taxes}</td>
                <td>${item.ads}</td>
                <td>${item.discount}</td>
                <td>${item.total}</td>
                <td>${item.category}</td>
                <td><button type="button" onclick="updateProduct(${index})">update</button></td>
                <td><button type="button" onclick="deleteProduct(${index})">delete</button></td>
            </tr>
        `).join('');
    }

    if (deleteAllBtn) {
        deleteAllBtn.innerHTML = datapro.length > 0
            ? '<button type="button" onclick="deleteAll()">Delete All</button>'
            : '';
    }
}

function showData() {
    renderTable();
}

function createProduct() {
    const productCount = Number(count.value) || 1;

    for (let i = 0; i < productCount; i++) {
        const newProduct = {
            title: title.value.trim(),
            price: Number(price.value) || 0,
            taxes: Number(taxes.value) || 0,
            ads: Number(ads.value) || 0,
            discount: Number(discount.value) || 0,
            total: Number(total.textContent) || 0,
            category: category.value.trim()
        };

        if (!newProduct.title || !newProduct.category) {
            alert('Title and category are required');
            return;
        }

        datapro.push(newProduct);
    }

    saveData();
    showData();
    clearData();
}

function updateProduct(index) {
    const product = datapro[index];
    if (!product) return;

    title.value = product.title;
    price.value = product.price;
    taxes.value = product.taxes;
    ads.value = product.ads;
    discount.value = product.discount;
    total.textContent = product.total;
    total.style.background = '#040';
    category.value = product.category;
    submit.textContent = 'Save';
    mode = 'update';
    selectedIndex = index;
}

function saveUpdatedProduct() {
    if (selectedIndex === null) return;

    datapro[selectedIndex] = {
        title: title.value.trim(),
        price: Number(price.value) || 0,
        taxes: Number(taxes.value) || 0,
        ads: Number(ads.value) || 0,
        discount: Number(discount.value) || 0,
        total: Number(total.textContent) || 0,
        category: category.value.trim()
    };

    saveData();
    showData();
    clearData();
}

function deleteProduct(index) {
    datapro.splice(index, 1);
    saveData();
    showData();

    if (selectedIndex !== null && selectedIndex >= datapro.length) {
        clearData();
    }
}

function deleteAll() {
    datapro = [];
    saveData();
    showData();
    clearData();
}

submit.onclick = function () {
    if (mode === 'update') {
        saveUpdatedProduct();
    } else {
        createProduct();
    }
};

search.addEventListener('input', function () {
    const term = search.value.trim().toLowerCase();

    if (!term) {
        showData();
        return;
    }

    const filtered = datapro.filter((item) => {
        const value = String(item[searchMode] || '').toLowerCase();
        return value.includes(term);
    });

    renderTable(filtered);
});

document.getElementById('searchTitle').addEventListener('click', function () {
    searchMode = 'title';
    search.focus();
});

document.getElementById('searchCategory').addEventListener('click', function () {
    searchMode = 'category';
    search.focus();
});

window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;
window.deleteAll = deleteAll;

showData();
