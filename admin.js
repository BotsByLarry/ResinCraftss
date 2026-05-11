/* ============================================================
   RESINN CRAFTSS — Admin Logic (Firebase Integrated)
   ============================================================ */

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyAMG5t4q0XW48ErMuRxZAbEqQewETzryVw",
  authDomain: "resincraftss-b7a2e.firebaseapp.com",
  projectId: "resincraftss-b7a2e",
  storageBucket: "resincraftss-b7a2e.firebasestorage.app",
  messagingSenderId: "128573889928",
  appId: "1:128573889928:web:ba0545f981f562c7c16e3d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

let currentImageData = null; // This will hold the File object or existing URL
let products = [];

// --- Auth Check ---
const loginOverlay = document.getElementById('loginOverlay');
const adminPassword = document.getElementById('adminPassword');
const loginBtn = document.getElementById('loginBtn');

function checkPassword() {
  if (adminPassword.value === 'resin123') {
    loginOverlay.style.display = 'none';
    localStorage.setItem('admin_auth', 'true');
    loadProducts();
  } else {
    alert('Incorrect Access Key');
  }
}

if (localStorage.getItem('admin_auth') === 'true') {
  loginOverlay.style.display = 'none';
  window.onload = loadProducts;
}

loginBtn.addEventListener('click', checkPassword);

// --- Product Logic ---
async function loadProducts() {
  const list = document.getElementById('adminProductsList');
  list.innerHTML = '<p style="text-align:center; padding:2rem;">Loading products...</p>';

  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderProductsList();
  } catch (error) {
    console.error("Error loading products:", error);
    list.innerHTML = '<p style="color:red; text-align:center;">Failed to load products.</p>';
  }
}

function renderProductsList() {
  const list = document.getElementById('adminProductsList');
  list.innerHTML = '';

  if (products.length === 0) {
    list.innerHTML = '<p style="text-align:center; padding:2rem; color:#999;">No products found. Add your first item!</p>';
    return;
  }

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'admin-product-card';
    card.innerHTML = `
      <img src="${p.image}" class="admin-product-img" onerror="this.src='hero.png'" />
      <div class="admin-product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <span class="admin-product-price">₹${p.price}</span>
        ${p.isOutOfStock ? '<span class="stock-badge badge-out">Out of Stock</span>' : '<span class="stock-badge badge-in">In Stock</span>'}
      </div>
      <div class="admin-product-actions">
        <button class="btn-icon btn-edit" data-id="${p.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button class="btn-icon btn-delete" data-id="${p.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    `;
    list.appendChild(card);
  });

  // Attach event listeners
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.onclick = () => openModal(btn.getAttribute('data-id'));
  });
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.onclick = () => deleteProduct(btn.getAttribute('data-id'));
  });
}

// --- Modal & Form ---
const modal = document.getElementById('productModal');
const form = document.getElementById('productForm');
const pImage = document.getElementById('pImage');

pImage.oninput = (e) => {
  const url = e.target.value;
  if (url) {
    imagePreview.src = url;
    imagePreview.style.display = 'block';
    imagePlaceholder.style.display = 'none';
  } else {
    imagePreview.style.display = 'none';
    imagePlaceholder.style.display = 'flex';
  }
};

function openModal(editId = null) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  form.reset();
  document.getElementById('editId').value = '';
  imagePreview.style.display = 'none';
  imagePlaceholder.style.display = 'flex';
  currentImageData = null;

  if (editId) {
    const p = products.find(prod => prod.id === editId);
    document.getElementById('modalTitle').innerText = 'Edit Product';
    document.getElementById('editId').value = p.id;
    document.getElementById('pName').value = p.name;
    document.getElementById('pDesc').value = p.desc;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pTag').value = p.tag;
    document.getElementById('pStock').checked = p.isOutOfStock || false;
    document.getElementById('pImage').value = p.image;
    
    imagePreview.src = p.image;
    imagePreview.style.display = 'block';
    imagePlaceholder.style.display = 'none';
  } else {
    document.getElementById('modalTitle').innerText = 'Add New Item';
  }
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('addItemBtn').onclick = () => openModal();
document.getElementById('cancelBtn').onclick = () => closeModal();

form.onsubmit = async (e) => {
  e.preventDefault();
  const saveBtn = document.getElementById('saveBtn');
  const originalBtnText = saveBtn.innerText;
  
  const id = document.getElementById('editId').value;
  const name = document.getElementById('pName').value;
  const desc = document.getElementById('pDesc').value;
  const price = document.getElementById('pPrice').value;
  const tag = document.getElementById('pTag').value;
  const isOutOfStock = document.getElementById('pStock').checked;

  if (!currentImageData) {
    alert('Please select an image');
    return;
  }

  saveBtn.disabled = true;
  saveBtn.innerText = 'Uploading...';

  try {
    const imageUrl = document.getElementById('pImage').value;

    const productData = {
      name,
      desc,
      price,
      tag,
      isOutOfStock,
      image: imageUrl,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    console.log("Saving product data to Firestore...");
    if (id) {
      await db.collection('products').doc(id).update(productData);
    } else {
      productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('products').add(productData);
    }
    console.log("Product saved successfully!");

    closeModal();
    loadProducts();
  } catch (error) {
    console.error("Error saving product:", error);
    alert("❌ Error: " + error.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerText = originalBtnText;
  }
};

async function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      await db.collection('products').doc(id).delete();
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product.");
    }
  }
}

window.onclick = (e) => {
  if (e.target == modal) closeModal();
};
