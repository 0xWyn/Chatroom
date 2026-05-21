// Global context
// Persist user across the app using react hooks
// Relevant hooks = { createContext, useContext, useState }

import { createContext, useContext, useState } from "react";
// Step 1: Create a context
const UserContext = createContext(null);

// A context called UserContext has been created

// Step 2: Create a function that provides this context to the greater app
// That looks like wrapping the app in the function and providing the user, although I wonder if this cannot be achieved without user context

E.g, 

export const App = () => {
    const [user, setUser] = useState(null);

    return (
        {children}

        // Then which ever of the children call on user and setUser will recieve the info
    )
}