// useLocaleStorage.tsx
import { useState, useEffect } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Vérifier si l'environnement est le navigateur
  const isBrowser = typeof window !== "undefined";

  // État pour stocker la valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (isBrowser) {
        // Tenter de récupérer l'item depuis le localStorage
        const item = window.localStorage.getItem(key);
        // Parser l'item ou retourner la valeur initiale
        return item ? (JSON.parse(item) as T) : initialValue;
      } else {
        return initialValue;
      }
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur dans le localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre à value d'être une fonction
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Mettre à jour l'état
      setStoredValue(valueToStore);
      // Mettre à jour le localStorage si possible
      if (isBrowser) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Effet pour écouter les changements du localStorage
  useEffect(() => {
    if (isBrowser) {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key) {
          try {
            const newValue = event.newValue
              ? (JSON.parse(event.newValue) as T)
              : initialValue;
            setStoredValue(newValue);
          } catch (error) {
            console.log(error);
          }
        }
      };

      window.addEventListener("storage", handleStorageChange);

      // Nettoyer l'écouteur lors du démontage
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
