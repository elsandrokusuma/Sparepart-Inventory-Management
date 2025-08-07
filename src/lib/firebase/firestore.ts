import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore';
import { InventoryItem, Transaction, PreOrder } from '@/lib/data';

// ===== Inventory Functions =====

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
    const inventoryCol = collection(db, 'inventory');
    const inventorySnapshot = await getDocs(inventoryCol);
    return inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'inventory'), item);
    return docRef.id;
};

export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>): Promise<void> => {
    const itemRef = doc(db, 'inventory', id);
    await updateDoc(itemRef, item);
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
    const itemRef = doc(db, 'inventory', id);
    await deleteDoc(itemRef);
};


// ===== Transactions Functions =====

export const getTransactions = async (): Promise<Transaction[]> => {
    const transactionsCol = collection(db, 'transactions');
    const transactionSnapshot = await getDocs(transactionsCol);
    return transactionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'transactions'), transaction);
    return docRef.id;
};

// ===== Pre-Orders Functions =====

export const getPreOrders = async (): Promise<PreOrder[]> => {
    const preOrdersCol = collection(db, 'pre-orders');
    const preOrderSnapshot = await getDocs(preOrdersCol);
    return preOrderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PreOrder));
};

export const addPreOrder = async (preOrder: Omit<PreOrder, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'pre-orders'), preOrder);
    return docRef.id;
};

export const updatePreOrder = async (id: string, preOrder: Partial<PreOrder>): Promise<void> => {
    const preOrderRef = doc(db, 'pre-orders', id);
    await updateDoc(preOrderRef, preOrder);
};

export const updatePreOrderStatus = async (ids: string[], status: PreOrder['status']): Promise<void> => {
    const batch = writeBatch(db);
    ids.forEach(id => {
        const preOrderRef = doc(db, 'pre-orders', id);
        batch.update(preOrderRef, { status });
    });
    await batch.commit();
};

export const updatePreOrderStatusByOrderId = async (orderId: string, status: PreOrder['status']): Promise<void> => {
    const q = query(collection(db, 'pre-orders'), where('orderId', '==', orderId));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.forEach((document) => {
        batch.update(document.ref, { status });
    });
    await batch.commit();
};
