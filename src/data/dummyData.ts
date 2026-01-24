export interface ProductVariant {
  id: string;
  name: string; // e.g., "S", "M", "L" or "Merah", "Biru"
  stock: number;
}

export interface ProductUnit {
  type: "pcs" | "box" | "pack";
  multiplier: number; // e.g., 1 box = 12 pcs
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  price: number;
  cost: number;
  margin: number;
  image: string;
  variants: ProductVariant[];
  units: ProductUnit[];
  stock: number;
  minStock: number;
}

export interface TransactionItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  cost: number;
}

export interface DetailedTransaction {
  id: string;
  date: string;
  cashier: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  total: number;
  profit: number;
  type: "Dine In" | "Take Away";
  paymentMethod: string;
}

export interface CashFlow {
  id: string;
  date: string;
  type: "Masuk" | "Keluar";
  category: string;
  amount: number;
  note: string;
}

export const initialTransactions: DetailedTransaction[] = [
  {
    id: "TRX-101",
    date: "2026-01-24 10:30",
    cashier: "Budi",
    items: [
      {
        productId: 1,
        name: "Espresso Arabica",
        quantity: 2,
        price: 25000,
        cost: 15000,
      },
    ],
    subtotal: 50000,
    tax: 5000,
    total: 55000,
    profit: 20000,
    type: "Dine In",
    paymentMethod: "Tunai",
  },
  {
    id: "TRX-102",
    date: "2026-01-24 11:15",
    cashier: "Siti",
    items: [
      {
        productId: 2,
        name: "Caffe Latte",
        quantity: 1,
        price: 35000,
        cost: 20000,
      },
      {
        productId: 3,
        name: "Croissant Butter",
        quantity: 1,
        price: 18000,
        cost: 10000,
      },
    ],
    subtotal: 53000,
    tax: 5300,
    total: 58300,
    profit: 23000,
    type: "Take Away",
    paymentMethod: "Debit",
  },
];

export const initialCashFlow: CashFlow[] = [
  {
    id: "c1",
    date: "2026-01-24",
    type: "Keluar",
    category: "Operasional",
    amount: 150000,
    note: "Bayar Listrik",
  },
  {
    id: "c2",
    date: "2026-01-24",
    type: "Masuk",
    category: "Modal",
    amount: 500000,
    note: "Suntikan Modal",
  },
];

export interface StockMovement {
  id: string;
  productId: number;
  date: string;
  type: "Masuk" | "Keluar" | "Opname";
  quantity: number;
  note: string;
}

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Espresso Arabica",
    sku: "KOP-001",
    barcode: "8991234567",
    category: "Kopi",
    price: 25000,
    cost: 15000,
    margin: 10000,
    image: "☕",
    stock: 50,
    minStock: 10,
    variants: [{ id: "v1", name: "Regular", stock: 50 }],
    units: [{ type: "pcs", multiplier: 1 }],
  },
  {
    id: 2,
    name: "Caffe Latte",
    sku: "KOP-002",
    barcode: "8992233445",
    category: "Kopi",
    price: 35000,
    cost: 20000,
    margin: 15000,
    image: "🥛",
    stock: 5,
    minStock: 10,
    variants: [
      { id: "v2", name: "Hot", stock: 3 },
      { id: "v3", name: "Ice", stock: 2 },
    ],
    units: [{ type: "pcs", multiplier: 1 }],
  },
  {
    id: 3,
    name: "Croissant Butter",
    sku: "KUE-001",
    barcode: "8993344556",
    category: "Kue",
    price: 18000,
    cost: 10000,
    margin: 8000,
    image: "🥐",
    stock: 25,
    minStock: 5,
    variants: [],
    units: [
      { type: "pcs", multiplier: 1 },
      { type: "box", multiplier: 10 },
    ],
  },
];

export const initialStockMovements: StockMovement[] = [
  {
    id: "m1",
    productId: 1,
    date: "2026-01-24",
    type: "Masuk",
    quantity: 50,
    note: "Restock supplier",
  },
  {
    id: "m2",
    productId: 2,
    date: "2026-01-24",
    type: "Keluar",
    quantity: 2,
    note: "Penjualan",
  },
];

export const categories = ["Semua", "Kopi", "Teh", "Kue", "Makanan"];
export const unitsList = ["pcs", "box", "pack"];

export interface BankAccount {
  id: number;
  bankName: string;
  accountNo: string;
  holderName: string;
}

export interface PaymentSettings {
  isCashEnabled: boolean;
  isQrisEnabled: boolean;
  isBankEnabled: boolean;
  bankAccounts: BankAccount[];
}

export const initialPaymentSettings: PaymentSettings = {
  isCashEnabled: true,
  isQrisEnabled: true,
  isBankEnabled: true,
  bankAccounts: [
    {
      id: 1,
      bankName: "BCA",
      accountNo: "1234567890",
      holderName: "Toko Kasir POS",
    },
  ],
};
