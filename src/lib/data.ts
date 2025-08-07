
export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  imageUrl: string;
  location: string;
}

export interface Transaction {
  id: string;
  type: 'IN' | 'OUT';
  item: string;
  itemId: string;
  quantity: number;
  date: string;
  user: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  from?: string;
  description?: string;
}

export interface PreOrder {
  id: string;
  orderId?: string;
  company: string;
  item: string;
  itemId: string;
  quantity: number;
  orderDate: string;
  status: 'Pending' | 'Fulfilled' | 'Approved' | 'Rejected' | 'Awaiting Approval';
  location: 'Jakarta' | 'Surabaya';
}


export const locations = [
    { value: 'R1B1T1', label: 'R1B1T1' },
    { value: 'R1B1T2', label: 'R1B1T2' },
    { value: 'R1B1T3', label: 'R1B1T3' },
    { value: 'R1B1T4', label: 'R1B1T4' },
    { value: 'R1B2T1', label: 'R1B2T1' },
    { value: 'R1B2T2', label: 'R1B2T2' },
    { value: 'R1B2T3', label: 'R1B2T3' },
    { value: 'R1B2T4', label: 'R1B2T4' },
    { value: 'R2B1T1', label: 'R2B1T1' },
    { value: 'R2B1T2', label: 'R2B1T2' },
    { value: 'R2B1T3', label: 'R2B1T3' },
    { value: 'R2B1T4', label: 'R2B1T4' },
    { value: 'R2B2T1', label: 'R2B2T1' },
    { value: 'R2B2T2', label: 'R2B2T2' },
    { value: 'R2B2T3', label: 'R2B2T3' },
    { value: 'R2B2T4', label: 'R2B2T4' },
    { value: 'R3B1T1', label: 'R3B1T1' },
    { value: 'R3B1T2', label: 'R3B1T2' },
    { value: 'R3B1T3', label: 'R3B1T3' },
    { value: 'R3B1T4', label: 'R3B1T4' },
    { value: 'R3B2T1', label: 'R3B2T1' },
    { value: 'R3B2T2', label: 'R3B2T2' },
    { value: 'R3B2T3', label: 'R3B2T3' },
    { value: 'R3B2T4', label: 'R3B2T4' },
    { value: 'R3B3T1', label: 'R3B3T1' },
    { value: 'R3B3T2', label: 'R3B3T2' },
    { value: 'R3B3T3', label: 'R3B3T3' },
    { value: 'R3B3T4', label: 'R3B3T4' },
    { value: 'L4B1T1', label: 'L4B1T1' },
    { value: 'L4B1T2', label: 'L4B1T2' },
    { value: 'L4B1T3', label: 'L4B1T3' },
];

export const suppliers = [
    { value: "ADMARK", label: "ADMARK" },
    { value: "AILIDA", label: "AILIDA" },
    { value: "AOBAO", label: "AOBAO" },
    { value: "BETTERWAY", label: "BETTERWAY" },
    { value: "BOYONG", label: "BOYONG" },
    { value: "CMX", label: "CMX" },
    { value: "DSPPA", label: "DSPPA" },
    { value: "DTECH", label: "DTECH" },
    { value: "FALY", label: "FALY" },
    { value: "HAITIAN", label: "HAITIAN" },
    { value: "HANGZHOU GLOBE", label: "HANGZHOU GLOBE" },
    { value: "HENGNUO", label: "HENGNUO" },
    { value: "HONGXIN", label: "HONGXIN" },
    { value: "HUNTER", label: "HUNTER" },
    { value: "JBL", label: "JBL" },
    { value: "JINJUE", label: "JINJUE" },
    { value: "JOJO", label: "JOJO" },
    { value: "JOY", label: "JOY" },
    { value: "LAIKESI", label: "LAIKESI" },
    { value: "LANGTING", label: "LANGTING" },
    { value: "LESHENG", label: "LESHENG" },
    { value: "LONBON", label: "LONBON" },
    { value: "MEIVLE", label: "MEIVLE" },
    { value: "MRS YANG", label: "MRS YANG" },
    { value: "NINGBO LEON", label: "NINGBO LEON" },
    { value: "OKSN", label: "OKSN" },
    { value: "PHONSION", label: "PHONSION" },
    { value: "SBE", label: "SBE" },
    { value: "TANGDA", label: "TANGDA" },
    { value: "TIANYI", label: "TIANYI" },
    { value: "TONOCH", label: "TONOCH" },
    { value: "TOPWAY", label: "TOPWAY" },
    { value: "TRUEMAGIC", label: "TRUEMAGIC" },
    { value: "YIKE", label: "YIKE" },
    { value: "HENGXIN", label: "HENGXIN" },
    { value: "LISOUND", label: "LISOUND" }
];

export const companies = [
    { value: "SCS", label: "SCS" },
    { value: "ABOT", label: "ABOT" },
    { value: "KZT", label: "KZT" },
    { value: "SJ MANUAL", label: "SJ MANUAL" },
];
