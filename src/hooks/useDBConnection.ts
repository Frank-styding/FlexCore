import { setIsConnected } from "@/lib/redux/features/ConnectionSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useCallback } from "react";

export const useDBConnection = () => {
  const dispath = useAppDispatch();
  const isConnected = useAppSelector((state) => state.DBConnection.isConnected);

  const funSetIsConnected = useCallback(
    (value: boolean) => {
      dispath(setIsConnected(value));
    },
    [dispath]
  );

  return { setIsConnected: funSetIsConnected, isConnected };
};
