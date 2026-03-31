import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import getUserData from "../../http/getUserData";

const Context = createContext({ userData: null, setUserData: () => {} });

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);

  const updateUserData = useCallback(async (payload) => {

    let prevPayload = await AsyncStorage.getItem("UserData")

    if (!prevPayload) {
      return
    }

    prevPayload = JSON.parse(prevPayload)

    let newPayload = {
      ...prevPayload,
      ...payload
    }
    
    await AsyncStorage.setItem("UserData", JSON.stringify(newPayload))
    setUserData(newPayload)
  }, [setUserData])

  useEffect(() => {
    let retryCount = 0;

    async function load() {
      try {
        // 1. Buscar localmente el UserData primero
        const stored = await AsyncStorage.getItem("UserData");

        if (stored) {
          const parsed = JSON.parse(stored);
          console.log("📦 Loaded user from local:", parsed);
          setUserData(parsed);
          return;
        }

        // 2. Si no hay token, no hay sesión: no llamar API ni reintentar
        const token = await AsyncStorage.getItem("Token");
        if (!token) {
          setUserData(null);
          return;
        }

        // 3. Validar token y cargar usuario
        const data = await getUserData();

        if (data) {
          console.log("📥 Context loaded user data from API:", data);
          await AsyncStorage.setItem("UserData", JSON.stringify(data));
          setUserData(data);
        } else {
          retryCount++;
          if (retryCount < 5) {
            console.log("⚠️ No data, retrying...", retryCount);
            setTimeout(load, 500);
          } else {
            console.log("❌ No user data after retries");
            setUserData(null);
          }
        }
      } catch (error) {
        console.log("🛑 Error loading user:", error.message);
      }
    }

    load();
  }, []);



  return (
    <Context.Provider value={{ userData, setUserData, updateUserData }}>
      {children}
    </Context.Provider>
  );
}

export function useUserContext() {
  return useContext(Context);
}
