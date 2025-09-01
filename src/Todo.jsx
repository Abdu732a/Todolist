import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, setLogLevel } from 'firebase/firestore';

// Main App Component
const App = () => {
    // State for Firebase services and user data
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDate, setNewTaskDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [modal, setModal] = useState({ title: '', message: '', isVisible: false });
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }
        try {
            const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
            const appId = import.meta.env.VITE_APP_ID;

            if (!firebaseConfig || !appId) {
                showModal('Configuration Error', 'Firebase config or app ID is missing from environment variables.');
                return;
            }
            setLogLevel('debug');
            const app = initializeApp(firebaseConfig);
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);
            setDb(firestoreDb);
            setAuth(firebaseAuth);
            const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
                if (currentUser) {
                    setUser(currentUser);
                } else {
                    setUser(null);
                }
                setIsAuthReady(true);
                setAuthError('');
            });
            return () => unsubscribe();
        } catch (error) {
            console.error("Initialization error:", error);
            showModal('Initialization Error', 'An error occurred during app startup. Check your Firebase config.');
        }
    }, []);

    useEffect(() => {
        if (!user || !db) {
             setTasks([]);
             setIsLoading(false);
             return;
        }
        setIsLoading(true);
        const tasksColRef = collection(db, 'users', user.uid, 'tasks');
        const q = query(tasksColRef);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            fetchedTasks.sort((a, b) => a.created_at?.toDate() - b.created_at?.toDate());
            setTasks(fetchedTasks);
            setIsLoading(false);
        }, (error) => {
            console.error("Error listening to tasks:", error);
            showModal('Real-time Error', 'Could not fetch tasks in real-time. Please check your connection.');
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [user, db]);
    
    const showModal = (title, message) => {
        setModal({ title, message, isVisible: true });
    };
    const closeModal = () => {
        setModal({ ...modal, isVisible: false });
    };
    
    const handleAuthAction = async (e) => {
        e.preventDefault();
        setAuthError('');
        if (!email || !password) {
            setAuthError('Email and password cannot be empty.');
            return;
        }
        try {
            if (isLoginView) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            let errorMessage = 'An unknown authentication error occurred.';
            switch(error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'The email address is not valid.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled.';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password.';
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already in use.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters.';
                    break;
            }
            setAuthError(errorMessage);
        }
    };
    
    const handleSignOut = async () => {
        if (auth) {
            try {
                await signOut(auth);
            } catch (error) {
                console.error("Sign out error:", error);
                showModal('Sign Out Error', 'Failed to sign out. Please try again.');
            }
        }
    };
    
    const addTask = async (e) => {
        e.preventDefault();
        if (newTaskTitle.trim() === '') {
            showModal('Input Error', 'Task title cannot be empty.');
            return;
        }
        if (!user) {
            showModal('Authentication Error', 'You must be signed in to add tasks.');
            return;
        }
        try {
            const tasksColRef = collection(db, 'users', user.uid, 'tasks');
            await addDoc(tasksColRef, {
                user_id: user.uid,
                user_email: user.email,
                task_title: newTaskTitle,
                is_completed: false,
                created_at: new Date(),
                due_date: newTaskDate ? new Date(newTaskDate) : null,
            });
            setNewTaskTitle('');
            setNewTaskDate('');
        } catch (e) {
            console.error("Error adding document: ", e);
            showModal('Error', 'Failed to add the task. Please try again.');
        }
    };
    
    const toggleTaskCompletion = async (taskId, isCompleted) => {
        if (!user) {
            showModal('Authentication Error', 'You must be signed in to update tasks.');
            return;
        }
        try {
            const taskDocRef = doc(db, 'users', user.uid, 'tasks', taskId);
            await updateDoc(taskDocRef, { is_completed: isCompleted });
        } catch (e) {
            console.error("Error updating document: ", e);
            showModal('Error', 'Failed to update task status. Please try again.');
        }
    };
    
    const deleteTask = async (taskId) => {
        if (!user) {
            showModal('Authentication Error', 'You must be signed in to delete tasks.');
            return;
        }
        try {
            const taskDocRef = doc(db, 'users', user.uid, 'tasks', taskId);
            await deleteDoc(taskDocRef);
        } catch (e) {
            console.error("Error deleting document: ", e);
            showModal('Error', 'Failed to delete the task. Please try again.');
        }
    };
    
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };
    
    const renderContent = () => {
        if (!isAuthReady || isLoading) {
            return (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <svg className="animate-spin h-5 w-5 text-gray-400 dark:text-gray-300 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-2">Loading...</span>
                </div>
            );
        }
    
        if (user) {
            return (
                <div className="space-y-6 w-full p-4 md:p-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100">My Tasks</h1>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <button onClick={handleSignOut} className="text-red-500 dark:text-red-400 font-semibold hover:underline">Sign Out</button>
                        </div>
                    </div>
                    <form onSubmit={addTask} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Add a new task..."
                            className="p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 col-span-2 sm:col-span-2"
                        />
                        <input
                            type="date"
                            value={newTaskDate}
                            onChange={(e) => setNewTaskDate(e.target.value)}
                            className="p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 col-span-2 sm:col-span-1"
                        />
                        <button type="submit" className="bg-purple-600 text-white p-3 rounded-xl font-semibold hover:bg-purple-700 transition duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </form>
                    <ul className="space-y-3">
                        {tasks.length === 0 ? (
                            <li className="text-center text-gray-500 dark:text-gray-400 italic">No tasks yet. Add one above!</li>
                        ) : (
                            tasks.map(task => (
                                <li key={task.id} className={`task-card flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.01] ${task.is_completed ? 'opacity-60 line-through' : ''}`}>
                                    <div className="flex items-center flex-1 min-w-0">
                                        <input
                                            type="checkbox"
                                            checked={task.is_completed}
                                            onChange={() => toggleTaskCompletion(task.id, !task.is_completed)}
                                            className="w-6 h-6 text-purple-600 dark:text-purple-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-purple-500 mr-4 cursor-pointer"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="task-text text-gray-700 dark:text-gray-100 font-semibold text-lg">{task.task_title}</span>
                                            {task.due_date && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Due: {new Date(task.due_date.seconds * 1000).toLocaleDateString()}</div>
                                            )}
                                            {task.user_email && (
                                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Created by: {task.user_email}</div>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => deleteTask(task.id)} className="delete-btn flex items-center p-2 text-red-500 dark:text-red-400 hover:text-red-700 transition-colors duration-200 mt-3 sm:mt-0">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M16 9v10H8V9h8zm-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                                        </svg>
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            );
        } else {
            return (
                <div className="space-y-6 p-4 md:p-8 w-full max-w-lg mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100 text-center">
                        {isLoginView ? 'Welcome Back!' : 'Join the Community'}
                    </h1>
                    <form onSubmit={handleAuthAction} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full p-4 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-4 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                        />
                        {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
                        <button type="submit" className="w-full bg-purple-600 text-white p-4 rounded-xl font-bold hover:bg-purple-700 transition duration-300 shadow-lg">
                            {isLoginView ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                        {isLoginView ? 'Need an account?' : 'Already have an account?'}
                        <button onClick={() => setIsLoginView(!isLoginView)} className="ml-1 text-purple-600 dark:text-purple-500 font-semibold hover:underline">
                            {isLoginView ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            );
        }
    };
    
    return (
        <div className={`min-h-screen font-[Inter] transition-colors duration-500 ${isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gradient-to-tr from-blue-200 via-purple-300 to-pink-400 text-gray-900'}`}>
            <div className="flex flex-col items-center justify-center p-4">
                <div className={`w-full max-w-4xl bg-white/20 dark:bg-gray-800/50 rounded-3xl backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-2xl mt-12 mb-4 p-6 sm:p-10 transition-colors duration-500`}>
                    {renderContent()}
                </div>
                <button onClick={toggleDarkMode} className="fixed bottom-6 right-6 p-3 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-gray-100 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                    {isDarkMode ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 11a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4 4a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM7 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm7.146 2.854a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 011.414-1.414l1.414 1.414a1 1 0 010 1.414zm-4 10a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm-7.146-2.854a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414l-1.414-1.414a1 1 0 010-1.414zm-1.414-4a1 1 0 010-1.414l1.414-1.414a1 1 0 111.414 1.414L3.854 13.146a1 1 0 01-1.414 0zM10 8a2 2 0 11-4 0 2 2 0 014 0zM10 12a2 2 0 114 0 2 2 0 01-4 0z" />
                        </svg>
                    )}
                </button>
            </div>
            {modal.isVisible && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-lg text-center space-y-4 transition-colors duration-500">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{modal.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{modal.message}</p>
                        <button onClick={closeModal} className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;