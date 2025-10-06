import React, { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import * as storage from '../services/storageService';
import { Product, Order, User, ProductVariant, BlogPost, ContactSubmission, NewsletterSubscription } from '../types';
import Modal from '../components/Modal';

// --- ExportDataModal Component ---
interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  dataString: string;
  instructions: string;
}

const ExportDataModal: React.FC<ExportDataModalProps> = ({ isOpen, onClose, title, dataString, instructions }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(dataString).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-3xl font-serif text-brand-gold mb-4 text-center">{title}</h2>
      <p className="text-gray-300 text-center mb-6">{instructions}</p>
      <textarea
        readOnly
        value={dataString}
        className="w-full h-64 bg-gray-900 border border-gray-600 focus:border-brand-gold outline-none p-3 text-white rounded font-mono text-sm"
      />
      <button
        onClick={handleCopy}
        className="w-full mt-4 bg-brand-gold text-black py-3 font-bold uppercase tracking-wider rounded transition-opacity hover:opacity-90"
      >
        {isCopied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
    </Modal>
  );
};
// --- End ExportDataModal Component ---


type AdminTab = 'products' | 'orders' | 'customers' | 'blog' | 'contacts' | 'newsletter';

interface VariantFormData {
  tempId: number; // For React key
  id?: string;
  size: string;
  price: number;
  discountedPrice: number;
  stock: number;
}

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  image: string;
  isPreOrder?: boolean;
  variants: VariantFormData[];
}

const getNewEmptyProductForm = (): ProductFormData => ({ 
  name: '', description: '', image: '', isPreOrder: false,
  variants: [{ tempId: Date.now(), size: '', price: 0, discountedPrice: 0, stock: 0 }]
});

const emptyBlogForm: BlogPost = {
  id: '', title: '', author: '', date: '', summary: '', content: '', image: ''
};

const AdminDashboard: React.FC = () => {
  const { products: storeProducts, setProducts: setStoreProducts } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState<NewsletterSubscription[]>([]);

  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<ProductFormData>(getNewEmptyProductForm());

  const [isEditingBlog, setIsEditingBlog] = useState<BlogPost | null>(null);
  const [blogFormData, setBlogFormData] = useState<BlogPost>(emptyBlogForm);

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState({ title: '', dataString: '', instructions: '' });

  useEffect(() => {
    setProducts(storeProducts);
  }, [storeProducts]);

  useEffect(() => {
    setAllOrders(storage.getOrders().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setAllUsers(storage.getUsers());
    setBlogPosts(storage.getBlogPosts());
    setContactSubmissions(storage.getContactSubmissions());
    setNewsletterSubscriptions(storage.getNewsletterSubscriptions());
  }, [activeTab]);

  // Product Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          alert("File is too large. Please upload an image under 2MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setProductFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleVariantInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newVariants = [...productFormData.variants];
    const processedValue = name === 'size' ? value : (Number(value) >= 0 ? Number(value) : 0);
    newVariants[index] = { ...newVariants[index], [name]: processedValue };
    setProductFormData(prev => ({ ...prev, variants: newVariants }));
  };
  
  const addVariant = () => {
    setProductFormData(prev => ({
      ...prev, variants: [...prev.variants, { tempId: Date.now(), size: '', price: 0, discountedPrice: 0, stock: 0 }]
    }));
  };

  const removeVariant = (index: number) => {
    if (productFormData.variants.length > 1) {
      setProductFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
    } else {
      alert("A product must have at least one variant.");
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!productFormData.image) {
        alert("Please upload an image for the product.");
        return;
    }

    let updatedProducts;
    const mapVariants = (variants: VariantFormData[], pId: string): ProductVariant[] => variants
      .filter(v => v.size.trim() !== '' && v.price > 0)
      .map(v => ({
        id: v.id || `${pId}-${v.size.replace(/[^a-zA-Z0-9]/g, '')}`,
        size: v.size, price: v.price,
        discountedPrice: v.discountedPrice > 0 ? v.discountedPrice : undefined,
        stock: v.stock
      }));

    if (isEditingProduct && productFormData.id) {
      updatedProducts = products.map(p => p.id === productFormData.id ? {
        id: p.id, name: productFormData.name, description: productFormData.description, image: productFormData.image,
        isPreOrder: productFormData.isPreOrder, variants: mapVariants(productFormData.variants, p.id),
      } : p);
    } else {
      const newProductId = Date.now().toString();
      const newProduct: Product = {
        id: newProductId, name: productFormData.name, description: productFormData.description, image: productFormData.image,
        isPreOrder: productFormData.isPreOrder, variants: mapVariants(productFormData.variants, newProductId),
      };
      updatedProducts = [...products, newProduct];
    }
    
    storage.saveProducts(updatedProducts);
    setStoreProducts(updatedProducts);

    const dataStringForProducts = `export const mockProducts: Product[] = ${JSON.stringify(updatedProducts, null, 2)};`;
    setExportData({
        title: 'Update Products Data',
        dataString: dataStringForProducts,
        instructions: "To make these changes permanent for all users, copy the code below and replace the `mockProducts` variable in `services/mockData.ts`. Then, increment the `DATA_VERSION` in the same file.",
    });
    setExportModalOpen(true);

    setProductFormData(getNewEmptyProductForm());
    setIsEditingProduct(null);
  };

  const handleProductEdit = (product: Product) => {
    setActiveTab('products'); setIsEditingProduct(product);
    setProductFormData({
      id: product.id, name: product.name, description: product.description, image: product.image, isPreOrder: product.isPreOrder ?? false,
      variants: product.variants.map((v, i) => ({ 
        tempId: Date.now() + i,
        id: v.id, 
        size: v.size, 
        price: v.price, 
        discountedPrice: v.discountedPrice || 0, 
        stock: v.stock 
      }))
    });
  };

  const handleProductDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product? This will generate an export to make the change permanent.')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      storage.saveProducts(updatedProducts); 
      setStoreProducts(updatedProducts);

      const dataStringForProducts = `export const mockProducts: Product[] = ${JSON.stringify(updatedProducts, null, 2)};`;
      setExportData({
          title: 'Update Products Data',
          dataString: dataStringForProducts,
          instructions: "To permanently delete the product for all users, copy the code below and replace the `mockProducts` variable in `services/mockData.ts`. Then, increment the `DATA_VERSION` in the same file.",
      });
      setExportModalOpen(true);
    }
  };

  // Blog Handlers
  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          alert("File is too large. Please upload an image under 2MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlogInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBlogFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogFormData.image) {
        alert("Please upload an image for the blog post.");
        return;
    }
    let updatedPosts;
    if (isEditingBlog) {
      updatedPosts = blogPosts.map(p => p.id === isEditingBlog.id ? { ...blogFormData, date: new Date().toLocaleDateString() } : p);
    } else {
      updatedPosts = [...blogPosts, { ...blogFormData, id: Date.now().toString(), date: new Date().toLocaleDateString() }];
    }
    storage.saveBlogPosts(updatedPosts); 
    setBlogPosts(updatedPosts);
    
    const dataStringForBlog = `export const mockBlogPosts: BlogPost[] = ${JSON.stringify(updatedPosts, null, 2)};`;
    setExportData({
        title: 'Update Blog Posts Data',
        dataString: dataStringForBlog,
        instructions: "To make these changes permanent for all users, copy the code below and replace the `mockBlogPosts` variable in `services/mockData.ts`. Then, increment the `DATA_VERSION` in the same file.",
    });
    setExportModalOpen(true);

    setBlogFormData(emptyBlogForm); setIsEditingBlog(null);
  };

  const handleBlogEdit = (post: BlogPost) => {
    setActiveTab('blog'); setIsEditingBlog(post); setBlogFormData(post);
  };

  const handleBlogDelete = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post? This will generate an export to make the change permanent.')) {
      const updatedPosts = blogPosts.filter(p => p.id !== postId);
      storage.saveBlogPosts(updatedPosts); 
      setBlogPosts(updatedPosts);

      const dataStringForBlog = `export const mockBlogPosts: BlogPost[] = ${JSON.stringify(updatedPosts, null, 2)};`;
      setExportData({
          title: 'Update Blog Posts Data',
          dataString: dataStringForBlog,
          instructions: "To permanently delete the post for all users, copy the code below and replace the `mockBlogPosts` variable in `services/mockData.ts`. Then, increment the `DATA_VERSION` in the same file.",
      });
      setExportModalOpen(true);
    }
  };
  
  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = allOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setAllOrders(updatedOrders); storage.saveOrders(updatedOrders);
  };

  const handleExportCSV = () => {
    if (allOrders.length === 0) { alert("No orders to export."); return; }
    const headers = ["Order ID", "Razorpay Order ID", "Razorpay Payment ID", "Date", "Customer Name", "Customer Email", "Customer Phone", "Total Value", "Amount Paid", "Status", "Shipping Address", "Items"];
    const formatCsvField = (f: any): string => `"${String(f).replace(/"/g, '""')}"`;
    const rows = allOrders.map(o => [
      o.id, o.razorpayOrderId || 'N/A', o.razorpayPaymentId || 'N/A', new Date(o.date).toLocaleString(), o.shippingAddress.name, o.userId, o.shippingAddress.phone, o.totalValue.toFixed(2), o.amountPaid.toFixed(2), o.status,
      `${o.shippingAddress.address}, ${o.shippingAddress.city}, ${o.shippingAddress.zip}, ${o.shippingAddress.country}`,
      o.items.map(i => `${i.name} (${i.size}) x ${i.quantity}`).join(' | ')
    ].map(formatCsvField).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `velvet_nocturne_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const tabClasses = (tabName: AdminTab) => `px-4 py-3 text-base font-serif border-b-2 transition-colors duration-300 ${activeTab === tabName ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-400 hover:text-white'}`;
  const getStatusColor = (s: Order['status']) => ({ Pending: 'text-yellow-400 bg-yellow-900/50', 'Partially Paid': 'text-orange-400 bg-orange-900/50', Processing: 'text-blue-400 bg-blue-900/50', Shipped: 'text-green-400 bg-green-900/50', Delivered: 'text-gray-400 bg-gray-700/50' }[s] || 'text-gray-400');
  
  return (
    <div className="container mx-auto px-6 py-12 fade-in">
      <ExportDataModal 
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title={exportData.title}
        dataString={exportData.dataString}
        instructions={exportData.instructions}
      />
      <h1 className="text-4xl font-serif text-center mb-8">Admin Dashboard</h1>
      <div className="border-b border-gray-800 mb-8 flex justify-center flex-wrap">
        <button onClick={() => setActiveTab('products')} className={tabClasses('products')}>Products</button>
        <button onClick={() => setActiveTab('orders')} className={tabClasses('orders')}>Orders</button>
        <button onClick={() => setActiveTab('customers')} className={tabClasses('customers')}>Customers</button>
        <button onClick={() => setActiveTab('blog')} className={tabClasses('blog')}>Blog</button>
        <button onClick={() => setActiveTab('contacts')} className={tabClasses('contacts')}>Contacts</button>
        <button onClick={() => setActiveTab('newsletter')} className={tabClasses('newsletter')}>Newsletter</button>
      </div>
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 bg-brand-dark p-8 border border-gray-800 rounded-lg h-fit">
                <h2 className="text-2xl font-serif mb-6">{isEditingProduct ? 'Edit' : 'Add New'} Product</h2>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                    <input name="name" value={productFormData.name} onChange={handleProductInputChange} placeholder="Product Name" className="w-full bg-gray-800 p-2 border border-gray-600 rounded" required/>
                    <textarea name="description" value={productFormData.description} onChange={handleProductInputChange} placeholder="Description" className="w-full bg-gray-800 p-2 border border-gray-600 rounded" required/>
                    <div>
                      <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-1">Product Image</label>
                      {productFormData.image && <img src={productFormData.image} alt="Product preview" className="w-20 h-20 object-cover mb-2 rounded" onContextMenu={(e) => e.preventDefault()}/>}
                      <input 
                          id="image-upload"
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-black hover:file:bg-brand-gold/90"
                      />
                    </div>
                    <div className="flex items-center space-x-3"><input type="checkbox" id="isPreOrder" name="isPreOrder" checked={productFormData.isPreOrder} onChange={handleProductInputChange} className="h-4 w-4 bg-gray-900 border-gray-600 text-brand-gold focus:ring-brand-gold"/><label htmlFor="isPreOrder">Enable Pre-order</label></div>
                    <div className="border-t border-gray-700 pt-4 space-y-4">
                        <h3 className="text-xl font-serif text-brand-gold">Variants</h3>
                        {productFormData.variants.map((v, i) => (
                          <div key={v.tempId} className="p-4 border border-gray-700 rounded-md bg-gray-900/50 relative">
                             <input type="text" name="size" value={v.size} onChange={(e) => handleVariantInputChange(i, e)} placeholder="Size (e.g., 100ml)" className="w-full bg-gray-800 p-2 border border-gray-600 rounded mb-2 font-bold" required/>
                            <div className="space-y-2">
                               <input type="number" step="0.01" name="price" value={v.price} onChange={(e) => handleVariantInputChange(i, e)} placeholder="Price" className="w-full bg-gray-800 p-2 border border-gray-600 rounded" required/>
                               <input type="number" step="0.01" name="discountedPrice" value={v.discountedPrice} onChange={(e) => handleVariantInputChange(i, e)} placeholder="Discount Price (0 for none)" className="w-full bg-gray-800 p-2 border border-gray-600 rounded" />
                               <input type="number" name="stock" value={v.stock} onChange={(e) => handleVariantInputChange(i, e)} placeholder="Stock" className="w-full bg-gray-800 p-2 border border-gray-600 rounded" required/>
                            </div>
                            {productFormData.variants.length > 1 && (<button type="button" onClick={() => removeVariant(i)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 font-bold text-xl">&times;</button>)}
                          </div>
                        ))}
                        <button type="button" onClick={addVariant} className="w-full border-2 border-dashed border-gray-600 text-gray-400 py-2 hover:bg-gray-800 hover:text-white transition-colors">+ Add Variant</button>
                    </div>
                    <button type="submit" className="w-full bg-brand-gold text-black py-2 font-bold uppercase tracking-wider">{isEditingProduct ? 'Update' : 'Add'} Product</button>
                    {isEditingProduct && <button type="button" onClick={() => { setIsEditingProduct(null); setProductFormData(getNewEmptyProductForm()); }} className="w-full mt-2 bg-gray-600 text-white py-2 font-bold uppercase">Cancel</button>}
                </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
                {products.map(p => (<div key={p.id} className="flex items-center justify-between bg-brand-dark p-4 border border-gray-800 rounded-lg">
                    <div className="flex items-center"><img src={p.image} alt={p.name} className="w-16 h-16 object-cover mr-4 rounded" onContextMenu={(e) => e.preventDefault()}/><div>
                        <p className="font-bold">{p.name} {p.isPreOrder && <span className="text-xs bg-brand-gold text-black px-2 py-0.5 rounded ml-2">PRE-ORDER</span>}</p>
                        <p className="text-sm text-gray-400">{p.variants.map(v => `₹${v.discountedPrice ? v.discountedPrice : v.price} (${v.size}) - Stock: ${v.stock}`).join(' / ')}</p>
                    </div></div>
                    <div className="flex space-x-2"><button onClick={() => handleProductEdit(p)} className="bg-blue-600 text-white px-3 py-1 text-sm rounded">Edit</button><button onClick={() => handleProductDelete(p.id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded">Delete</button></div>
                </div>))}
            </div>
        </div>
      )}
      {activeTab === 'blog' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 bg-brand-dark p-8 border border-gray-800 rounded-lg h-fit">
                <h2 className="text-2xl font-serif mb-6">{isEditingBlog ? 'Edit' : 'Add New'} Blog Post</h2>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <input name="title" value={blogFormData.title} onChange={handleBlogInputChange} placeholder="Title" className="w-full bg-gray-800 p-2 border border-gray-600 rounded" required/>
                    <input name="author" value={blogFormData.author} onChange={handleBlogInputChange} placeholder="Author" className="w-full bg-gray-800 p-2 border border-gray-600 rounded" required/>
                     <div>
                      <label htmlFor="blog-image-upload" className="block text-sm font-medium text-gray-300 mb-1">Blog Post Image</label>
                      {blogFormData.image && <img src={blogFormData.image} alt="Blog post preview" className="w-20 h-20 object-cover mb-2 rounded" onContextMenu={(e) => e.preventDefault()}/>}
                      <input 
                          id="blog-image-upload"
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleBlogImageUpload}
                          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-black hover:file:bg-brand-gold/90"
                      />
                    </div>
                    <textarea name="summary" value={blogFormData.summary} onChange={handleBlogInputChange} placeholder="Summary" className="w-full bg-gray-800 p-2 border border-gray-600 rounded" required/>
                    <textarea name="content" value={blogFormData.content} onChange={handleBlogInputChange} placeholder="Full Content" rows={5} className="w-full bg-gray-800 p-2 border border-gray-600 rounded" required/>
                    <button type="submit" className="w-full bg-brand-gold text-black py-2 font-bold uppercase tracking-wider">{isEditingBlog ? 'Update' : 'Create'} Post</button>
                    {isEditingBlog && <button type="button" onClick={() => { setIsEditingBlog(null); setBlogFormData(emptyBlogForm); }} className="w-full mt-2 bg-gray-600 text-white py-2 font-bold uppercase">Cancel</button>}
                </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
                {blogPosts.map(p => (<div key={p.id} className="flex items-center justify-between bg-brand-dark p-4 border border-gray-800 rounded-lg">
                    <div className="flex items-center"><img src={p.image} alt={p.title} className="w-16 h-16 object-cover mr-4 rounded" onContextMenu={(e) => e.preventDefault()}/><div>
                        <p className="font-bold">{p.title}</p><p className="text-sm text-gray-400">By {p.author}</p>
                    </div></div>
                    <div className="flex space-x-2"><button onClick={() => handleBlogEdit(p)} className="bg-blue-600 text-white px-3 py-1 text-sm rounded">Edit</button><button onClick={() => handleBlogDelete(p.id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded">Delete</button></div>
                </div>))}
            </div>
        </div>
      )}
      {activeTab === 'orders' && (<>
          <div className="bg-brand-dark p-2 border border-gray-800 rounded-lg overflow-x-auto">
              <table className="w-full text-left min-w-[1200px]">
                  <thead><tr className="border-b border-gray-700"><th className="p-4">Order Details</th><th className="p-4">Date</th><th className="p-4">Customer</th><th className="p-4">Payment</th><th className="p-4">Address</th><th className="p-4">Items</th><th className="p-4">Status</th></tr></thead>
                  <tbody>{allOrders.map(o => (<tr key={o.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4 font-mono text-sm align-top">{o.id}<br/>{o.razorpayOrderId && <span className="block text-gray-500 text-xs mt-1 truncate" title={o.razorpayOrderId}>Rzp Order: {o.razorpayOrderId}</span>}{o.razorpayPaymentId && <span className="block text-gray-500 text-xs mt-1 truncate" title={o.razorpayPaymentId}>Rzp Pay: {o.razorpayPaymentId}</span>}</td><td className="p-4 text-sm align-top">{new Date(o.date).toLocaleDateString()}</td>
                    <td className="p-4 text-sm align-top"><p className="font-semibold">{o.shippingAddress.name}</p><p className="text-gray-400">{o.userId}</p><p className="text-gray-400">{o.shippingAddress.phone}</p></td>
                    <td className="p-4 align-top"><p className="font-bold text-brand-gold">₹{o.totalValue.toFixed(2)}</p><p className="text-sm text-gray-300">Paid: ₹{o.amountPaid.toFixed(2)}</p></td>
                    <td className="p-4 text-xs text-gray-400 align-top">{o.shippingAddress.address},<br/>{o.shippingAddress.city}, {o.shippingAddress.zip},<br/>{o.shippingAddress.country}</td>
                    <td className="p-4 text-xs text-gray-400 align-top">{o.items.map(i => (<div key={i.variantId} className="whitespace-nowrap">{i.name} ({i.size}) x {i.quantity}</div>))}</td>
                    <td className="p-4 align-top"><select value={o.status} onChange={(e) => handleOrderStatusChange(o.id, e.target.value as Order['status'])} className={`w-full p-2 rounded-md border text-sm ${getStatusColor(o.status)} border-gray-600 bg-gray-900`}><option value="Pending">Pending</option><option value="Partially Paid">Partially Paid</option><option value="Processing">Processing</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option></select></td>
                  </tr>))}</tbody>
              </table>
              {allOrders.length === 0 && (<p className="text-center p-8 text-gray-400">No orders found.</p>)}
          </div>
          {allOrders.length > 0 && (<div className="mt-6 flex justify-end"><button onClick={handleExportCSV} className="bg-brand-gold text-black py-2 px-6 font-bold uppercase tracking-widest transition-opacity hover:opacity-90 rounded-sm">Export All Orders (CSV)</button></div>)}
      </>)}
      {activeTab === 'customers' && (
        <div className="bg-brand-dark p-6 border border-gray-800 rounded-lg overflow-x-auto"><table className="w-full text-left">
            <thead><tr className="border-b border-gray-700"><th className="p-4">Email</th><th className="p-4">Shipping Address</th></tr></thead>
            <tbody>{allUsers.map(u => (<tr key={u.email} className="border-b border-gray-800 hover:bg-gray-800/50">
              <td className="p-4">{u.email} {u.isAdmin && <span className="text-xs text-brand-gold ml-2">(Admin)</span>}</td>
              <td className="p-4 text-sm text-gray-400">{u.shippingAddress ? <>{u.shippingAddress.name}<br/>{u.shippingAddress.phone}<br/>{u.shippingAddress.address}, {u.shippingAddress.city}, {u.shippingAddress.zip}, {u.shippingAddress.country}</> : 'No address saved'}</td>
            </tr>))}</tbody>
        </table></div>
      )}
      {activeTab === 'contacts' && (
         <div className="bg-brand-dark p-6 border border-gray-800 rounded-lg overflow-x-auto"><table className="w-full text-left">
            <thead><tr className="border-b border-gray-700"><th className="p-4">Date</th><th className="p-4">From</th><th className="p-4">Message</th></tr></thead>
            <tbody>{contactSubmissions.map(s => (<tr key={s.id} className="border-b border-gray-800 hover:bg-gray-800/50">
              <td className="p-4 text-sm align-top">{new Date(s.date).toLocaleString()}</td>
              <td className="p-4 align-top">{s.name}<br/><span className="text-xs text-gray-400">{s.email}</span></td>
              <td className="p-4 text-sm text-gray-300 align-top">{s.message}</td>
            </tr>))}</tbody>
        </table></div>
      )}
      {activeTab === 'newsletter' && (
        <div className="bg-brand-dark p-6 border border-gray-800 rounded-lg overflow-x-auto"><table className="w-full text-left">
            <thead><tr className="border-b border-gray-700"><th className="p-4">Subscription Date</th><th className="p-4">Email Address</th></tr></thead>
            <tbody>{newsletterSubscriptions.map(s => (<tr key={s.id} className="border-b border-gray-800 hover:bg-gray-800/50">
              <td className="p-4 text-sm">{new Date(s.date).toLocaleString()}</td>
              <td className="p-4">{s.email}</td>
            </tr>))}</tbody>
        </table></div>
      )}
    </div>
  );
};

export default AdminDashboard;
