import {create} from "zustand";

interface TableData {
    name: string;
    items: string;
    price: number;
    friends: [];
}

export const useStore = create((set) => ({
    tableData: [] as TableData[],
    setTableData: (data: TableData[]) => set({ tableData: data }),
}));
