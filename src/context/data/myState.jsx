import { useEffect, useState } from 'react'
import MyContext from './myContext'
import { BiCategory } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

function myState(props) {
  const [mode, setMode] = useState('Light');

  const toogleMode = () => {
    if (mode === 'Light') {
      setMode('dark');
      document.body.style.backgroundColor = "rgb(17, 24, 39)"
    }
    else {
      setMode('Light');
      document.body.style.backgroundColor = "white"
    }
  }

  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState({
    title: null,
    price: null,
    imageUrl: null,
    category: null,
    description: null,
    time: new Date().toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    )
  });
  const addProduct = async () => {
    if (products.title == null || products.price == null || products.imageUrl == null || products.category == null || products.description == null) {
      return toast.error("all fields are required")
    }
    setLoading(true)
    try {
      const productRef = collection(fireDB, 'product')
      await addDoc(productRef, products)
      toast.success("Add product successfully")
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 800);
      getProductData();
      setLoading(false)
    }
    catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false)
    }
    finally {
      setLoading(false)
    }
//set products("")

  }
  const [product, setProduct] = useState([]);


  const getProductData = async () => {
    setLoading(true)
    try {
      const q = query(
        collection(fireDB, 'products'),
        orderBy('time')
      );
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productArray = [];
        QuerySnapshot.forEach((doc) => {
          productArray.push({ ...doc.data(), id: doc.id });
        });
        setproduct(productArray)
        setLoading(false)
      });
      return () => data;
    }
    catch {
      console.log(error)
      setLoading(false)
    }
  }
  useEffect(() => {
    getProductData();
  }, []);

  //update producys functions

  const edithandle = (item)=>{
    setProducts(item)
  }

  const updateProduct = async ()=>{
    setLoading(true)

    try {
      await setDoc(doc(fireDB, 'products',products.id), products)
      toast.success("Product Updated Successfully")
      // window.location.href = '/dashboard'
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 800);
      getProductData();
      setLoading(false)

    } 
    catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  // delete products

  const deleteProduct = async (item) => {
    setLoading(true)
    try {
      await deleteDoc(doc(fireDB, 'products', item.id))
      toast.success('Product Deleted Successfully')
      getProductData();
      setLoading(false)

    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <MyContext.Provider value={{
      mode, toogleMode, loading, setLoading,
      products, setProducts, addProduct, product
      edithandle, updateProduct, deleteProduct
    }}>
      {props.children}
    </MyContext.Provider >
  )
}

export default myState