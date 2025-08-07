
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
  destination?: 'Jakarta' | 'Surabaya';
  supplier?: string;
}

export interface PreOrder {
  id: string;
  customer: string;
  item: string;
  itemId: string;
  quantity: number;
  orderDate: string;
  status: 'Pending' | 'Fulfilled';
  location: 'Jakarta' | 'Surabaya';
}

export interface ApprovalRequest {
  id: string;
  transactionId: string;
  item: string;
  quantity: number;
  destination: 'Jakarta' | 'Surabaya';
  requester: string;
  requestDate: string;
}

export const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Wireless Mouse',
    stock: 120,
    status: 'In Stock',
    imageUrl: 'https://placehold.co/100x100.png',
    location: 'R1B1T1',
  },
  {
    id: '2',
    name: 'Mechanical Keyboard',
    stock: 8,
    status: 'Low Stock',
    imageUrl: 'https://placehold.co/100x100.png',
    location: 'R1B1T2',
  },
  {
    id: '3',
    name: '27" 4K Monitor',
    stock: 35,
    status: 'In Stock',
    imageUrl: 'https://placehold.co/100x100.png',
    location: 'R1B1T3',
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    stock: 0,
    status: 'Out of Stock',
    imageUrl: 'https://placehold.co/100x100.png',
    location: 'R1B1T4',
  },
  {
    id: '5',
    name: 'USB-C Hub',
    stock: 250,
    status: 'In Stock',
    imageUrl: 'https://placehold.co/100x100.png',
    location: 'R1B2T1',
  },
  {
    id: '6',
    name: 'Standing Desk',
    stock: 5,
    status: 'Low Stock',
    imageUrl: 'https://placehold.co/100x100.png',
    location: 'R1B2T2',
  },
];

export const transactions: Transaction[] = [
  {
    id: 'T001',
    type: 'IN',
    item: 'Wireless Mouse',
    itemId: '1',
    quantity: 50,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user: 'John Doe',
    supplier: 'TechSupplies Inc.',
  },
  {
    id: 'T002',
    type: 'OUT',
    item: '27" 4K Monitor',
    itemId: '3',
    quantity: 5,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: 'Jane Smith',
    status: 'Approved',
    destination: 'Jakarta',
  },
  {
    id: 'T003',
    type: 'OUT',
    item: 'Mechanical Keyboard',
    itemId: '2',
    quantity: 10,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: 'Jane Smith',
    status: 'Pending',
    destination: 'Surabaya',
  },
  {
    id: 'T004',
    type: 'IN',
    item: 'USB-C Hub',
    itemId: '5',
    quantity: 100,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    user: 'John Doe',
    supplier: 'Gadgettronics',
  },
  {
    id: 'T005',
    type: 'OUT',
    item: 'Wireless Mouse',
    itemId: '1',
    quantity: 20,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    user: 'Mike Ross',
    status: 'Approved',
    destination: 'Jakarta',
  },
];

export const preOrders: PreOrder[] = [
  {
    id: 'PO-001',
    customer: 'Alpha Corp',
    item: 'Ergonomic Office Chair',
    itemId: '4',
    quantity: 20,
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    location: 'Jakarta',
  },
  {
    id: 'PO-002',
    customer: 'Beta LLC',
    item: 'Standing Desk',
    itemId: '6',
    quantity: 10,
    orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    location: 'Surabaya',
  },
  {
    id: 'PO-003',
    customer: 'Gamma Inc.',
    item: 'Mechanical Keyboard',
    itemId: '2',
    quantity: 50,
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Fulfilled',
    location: 'Jakarta',
  },
];

export const approvalRequests: ApprovalRequest[] = [
  {
    id: 'AR-001',
    transactionId: 'T003',
    item: 'Mechanical Keyboard',
    quantity: 10,
    destination: 'Surabaya',
    requester: 'Jane Smith',
    requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'AR-002',
    transactionId: 'T006',
    item: '27" 4K Monitor',
    quantity: 15,
    destination: 'Jakarta',
    requester: 'Mike Ross',
    requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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
