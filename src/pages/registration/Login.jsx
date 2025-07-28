import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import myContext from '../../context/data/myContext'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, fireDB } from '../../firebase/FirebaseConfig';
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader';
import { collection, query, where, getDocs } from "firebase/firestore";
// import { signInWithEmailAndPassword } from "firebase/auth";
// 
// import { auth, db } from "../firebase"; // Make sure these are properly imported


function Login() {
    const context = useContext(myContext)
    const {loading, setLoading} = context;
     
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    // const login = async() => {
    //     setLoading(true)
    //     try{
    //         const result = await signInWithEmailAndPassword(auth,email,password);
    //         const usersRef = collection(db, "users");
    //         const q = query(usersRef, where("email", "==", result.user.email));
    //         toast.success("Login Successfully", {
    //             position: "top-right",
    //             autoClose: 2000,
    //             hideProgressBar: true,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "colored",
    //         })
    //         localStorage.setItem('user', JSON.stringify(result))
    //         navigate('/')
    //         setLoading(false)
    //     }
    //     catch(error){
    //         console.log(error)
    //         toast.error(error.message);
    //         setLoading(false)
    //     }
    //     finally{
    //             setLoading(false);
    //         }
    // }

    const login = async () => {
  setLoading(true);
  try {
    // 1. Authenticate user with email/password
    const authResult = await signInWithEmailAndPassword(auth, email, password);
    
    // 2. Query Firestore for additional user data
    const usersRef = collection(fireDB, "users");
    const q = query(usersRef, where("email", "==", authResult.user.email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("No user data found in database");
    }
    
    // 3. Get the user document data
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    // 4. Store both auth and additional user data
    const result = {
      ...authResult,
      userData
    };
    
    localStorage.setItem('user', JSON.stringify(result));
    
    // 5. Show success message
    toast.success("Login Successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    
    // 6. Navigate to home
    navigate('/');
  } catch (error) {
    console.error("Login error:", error);
    
    // Improved error messages
    let errorMessage = error.message;
    if (error.code === "auth/user-not-found") {
      errorMessage = "No user found with this email";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password";
    }
    
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  } finally {
    setLoading(false);
  }
};
    
    return (
        <div className=' flex justify-center items-center h-screen'>
            {loading && <Loader/>}
            <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
                <div className="">
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Login</h1>
                </div>
                <div>
                    <input type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                        name='email'
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Email'
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Password'
                    />
                </div>
                <div className=' flex justify-center mb-3'>
                    <button
                    onClick={login}
                        className=' bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg'>
                        Login
                    </button>
                </div>
                <div>
                    <h2 className='text-white'>Don't have an account <Link className=' text-yellow-500 font-bold' to={'/signup'}>Signup</Link></h2>
                </div>
            </div>
        </div>
    )
}

export default Login