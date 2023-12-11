import { create } from "zustand";
import { userStore } from "./userStore";

export const advertStore = create((set) => ({
    adverts: [],
    setAdverts: (adverts) => set({ adverts }),
    addAdvert: (newAdvert) => set((state) => ({ adverts: [...state.adverts, newAdvert]})),
    userId: userStore.userId,

    // Function to fetch adverts belonging to a user based on their accessToken stored in the localStorage
    fetchAdverts: async () => {
        try {
            const response = await fetch("https://localhost:8000/get", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });
            
            const data = await response.json();

            console.log(data);

            if (data.success) {
                set({ adverts: data });
            } else {
                console.error("Failed to fetch adverts");
            }
        } catch (error) {
            console.error(error);
        }
    },

    // Function to add a new advert to the server and then to the store
    addAdvertToServer: async (advert) => {
        try {
            const response = await fetch("https://localhost:8000/add", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ advert: advert })
            });

            if (response.ok) {
                const data = await response.json();
                set((state) => ({ adverts: [...state.adverts, data]}));
            } else {
                console.error("Failed to add advert");
            }
        } catch (error) {
            console.error(error);
        }
    }
}));