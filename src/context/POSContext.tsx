import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { initialProducts, categories as initialCategories, initialTransactions, initialCashFlow, initialStockMovements, type Product, type StockMovement, type DetailedTransaction, type CashFlow } from '../data/dummyData';

interface POSContextType {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    categories: string[];
    setCategories: React.Dispatch<React.SetStateAction<string[]>>;
    transactions: DetailedTransaction[];
    setTransactions: React.Dispatch<React.SetStateAction<DetailedTransaction[]>>;
    cashFlow: CashFlow[];
    setCashFlow: React.Dispatch<React.SetStateAction<CashFlow[]>>;
    movements: StockMovement[];
    setMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [categories, setCategories] = useState<string[]>(initialCategories);
    const [transactions, setTransactions] = useState<DetailedTransaction[]>(initialTransactions);
    const [cashFlow, setCashFlow] = useState<CashFlow[]>(initialCashFlow);
    const [movements, setMovements] = useState<StockMovement[]>(initialStockMovements);

    return (
        <POSContext.Provider value={{
            products, setProducts,
            categories, setCategories,
            transactions, setTransactions,
            cashFlow, setCashFlow,
            movements, setMovements
        }}>
            {children}
        </POSContext.Provider>
    );
};

export const usePOS = () => {
    const context = useContext(POSContext);
    if (!context) throw new Error('usePOS must be used within a POSProvider');
    return context;
};
