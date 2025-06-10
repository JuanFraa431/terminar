import React from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";



import Home from './components/Home';

const pageTransition = {
    initial: { opacity: 0 }, 
    animate: { opacity: 1 },
    exit: { opacity: 0 }, 
    transition: { duration: 0.4 } 
};


const App: React.FC = () => {
    const location = useLocation();

    return (
        <>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <div>
                                <motion.div {...pageTransition}>
                                    <Home />
                                </motion.div>
                            </div>
                        }
                        
                    />
                </Routes>
            </AnimatePresence>
        </>
    );
};

export default App;