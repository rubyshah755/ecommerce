import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import myContext from '../../context/data/myContext';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, fireDB } from '../../firebase/FirebaseConfig';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import Loader from '../../components/loader/Loader';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ name: "", email: "", password: "" });

    const context = useContext(myContext);
    const { loading, setLoading } = context;

    // Individual field validators
    const validateName = () => {
        if (!name.trim() || !/^[a-zA-Z\s'-]{2,40}$/.test(name.trim())) {
            setErrors(prev => ({ ...prev, name: 'Enter a valid name (2–40 letters)' }));
        } else {
            setErrors(prev => ({ ...prev, name: '' }));
        }
    };

    const validateEmail = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.trim()) {
            setErrors(prev => ({ ...prev, email: 'Email is required' }));
        } else if (!emailRegex.test(email)) {
            setErrors(prev => ({ ...prev, email: 'Enter a valid email address' }));
        } else {
            setErrors(prev => ({ ...prev, email: '' }));
        }
    };

    const validatePassword = () => {
        if (!password) {
            setErrors(prev => ({ ...prev, password: 'Password is required' }));
        } else if (password.length < 6) {
            setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
        } else {
            setErrors(prev => ({ ...prev, password: '' }));
        }
    };

    const validateForm = () => {
        validateName();
        validateEmail();
        validatePassword();

        // Wait briefly to allow state updates (alternatively, validate synchronously below)
        return (
            /^[a-zA-Z\s'-]{2,40}$/.test(name.trim()) &&
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim()) &&
            password.length >= 6
        );
    };

    const signup = async () => {
        if (!validateForm()) {
            toast.error("Please correct the errors in the form");
            return;
        }

        setLoading(true);
        try {
            const users = await createUserWithEmailAndPassword(auth, email, password);

            const user = {
                name: name.trim(),
                uid: users.user.uid,
                email: users.user.email,
                time: Timestamp.now()
            };

            await addDoc(collection(fireDB, "users"), user);

            toast.success("Signup Successfully");

            // Reset form
            setName("");
            setEmail("");
            setPassword("");
            setErrors({ name: "", email: "", password: "" });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            {loading && <Loader />}
            <div className='bg-gray-800 px-10 py-10 rounded-xl w-[22rem]'>
                <h1 className='text-center text-white text-xl mb-4 font-bold'>Signup</h1>

                {/* Name Field */}
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={validateName}
                        className='bg-gray-600 mb-1 px-2 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Name'
                    />
                    {errors.name && <p className="text-red-400 text-sm mb-2">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={validateEmail}
                        className='bg-gray-600 mb-1 px-2 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Email'
                    />
                    {errors.email && <p className="text-red-400 text-sm mb-2">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={validatePassword}
                        className='bg-gray-600 mb-1 px-2 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Password'
                    />
                    {errors.password && <p className="text-red-400 text-sm mb-2">{errors.password}</p>}
                </div>

                {/* Signup Button */}
                <div className='flex justify-center mb-3'>
                    <button
                        onClick={signup}
                        className='bg-red-500 w-full text-white font-bold px-2 py-2 rounded-lg'>
                        Signup
                    </button>
                </div>

                {/* Link to Login */}
                <div>
                    <h2 className='text-white'>
                        Have an account? <Link className='text-red-500 font-bold' to='/login'>Login</Link>
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default Signup;



// import { useContext, useState } from 'react'
// import { Link, useHref } from 'react-router-dom'
// import myContext from '../../context/data/myContext';
// import { toast } from 'react-toastify';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, fireDB } from '../../firebase/FirebaseConfig';
// import { addDoc, collection, Timestamp } from 'firebase/firestore';
// import Loader from '../../components/loader/Loader';

// function Signup() {
//    const [name, setName] = useState("");
//    const [email, setEmail] = useState("");
//    const [password, setPassword] = useState("");
//    const [errors, setErrors] = useState({});

//    const context = useContext(myContext);
//    const {loading, setLoading} = context;

//     const validateForm = () => {
//         const newErrors = {};

//         const nameRegex = /^[a-zA-Z\s'-]{2,40}$/;

//         if (!nameRegex.test(name.trim())) {
//             // toast.error("Please enter a valid name");
//             newErrors.name = 'Enter Valid Name';
//         } else if (name.trim().length < 2 || name.trim().length > 40) {
//             return false;
//         }
//         if (!email.trim()) {
//             // toast.error("Email is required");
//             newErrors.email = 'Email is required';
//         } else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
//             newErrors.email = 'Email is invalid';
//         }
//         if (!password) {
//             // toast.error("Password is required");
//             newErrors.password = 'Password is required';
//         } else if (password.length < 6) {
//             // toast.error("Password must be at least 6 characters");
//             newErrors.password = 'Password must be at least 6 characters';
//         }
//         // if (password !== confirmPassword) {
//         //     newErrors.confirmPassword = 'Passwords do not match';
//         // }

//         // if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
//         // // if (!formData.role.trim()) newErrors.role = 'Role is required';
//         // if (!formData.address.trim()) newErrors.address = 'Address is required';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const signup = async () => {
//         setLoading(true)
//         if(name ==="" || email ==="" || password ===""){
//             return toast.error("All fields are required")
//         }
//         // console.log(name, email, password);
//         try{
//             const users = await createUserWithEmailAndPassword(auth, email, password);

//             console.log(users)

//             const user = {
//                 name: name,
//                 uid: users.user.uid,
//                 email: users.user.email,
//                 time : Timestamp.now()
//             }

//             const userRef = collection(fireDB, "users")
//             await addDoc(userRef, user);
//             toast.success("Signup Succesfully")
//             setName("");
//             setEmail("");
//             setPassword("");
//             setLoading(false)
//         }
//         catch (error) {
//             console.log(error)
//             toast.error(error.message);
//             setLoading(false);
             
//         }
//         finally{
//             setLoading(false);
//         }
//     }

//     return (
//         <div className=' flex justify-center items-center h-screen'>
//             {loading && <Loader/>  }
//                <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
//                 <div className="">
//                     <h1 className='text-center text-white text-xl mb-4 font-bold'>Signup</h1>
//                 </div>
//                 <div>
//                     <input type="text"
//                     value={name}
//                     onChange={(e)=> {validateForm(e); setName(e.target.value); }}
//                     name='name'
//                     className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
//                     placeholder='Name'
//                     />
//                 </div>
//                 <div>
//                     <input type="email"
//                         value={email}
//                         onChange={(e)=> setEmail(e.target.value)}
//                         name='email'
//                         className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
//                         placeholder='Email'
//                         pattern='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
//                         required
//                         title='Please enter a valid email address'
//                     />
//                 </div>
//                 <div>
//                     <input 
//                     type="password"
//                     value={password}
//                     onChange={(e)=> setPassword(e.target.value)}
//                         className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
//                         placeholder='Password'
//                     />
//                 </div>
//                 <div className=' flex justify-center mb-3'>
//                     <button
//                     onClick={signup}
//                         className=' bg-red-500 w-full text-white font-bold  px-2 py-2 rounded-lg'>
//                         Signup
//                     </button>
//                 </div>
//                 <div>
//                     <h2 className='text-white'>Have an account <Link className=' text-red-500 font-bold' to={'/login'}>Login</Link></h2>
//                 </div>
//                 {/* {errors && <p style={{color:"Red", background:"white"}}>{errors.name}</p>} */}
//             </div>
//         </div>
//     )
// }

// export default Signup