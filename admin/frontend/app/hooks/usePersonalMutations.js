import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

// GET EMPLOYEE PERSONAL DETAILS
export const useMyPersonalDetails = () =>
  useQuery({
    queryKey: ["myPersonalDetails"],

    queryFn: async () => {
      const res = await api.get("/personal-details/me");
      return res.data;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

// CREATE / UPDATE PERSONAL DETAILS
export const useUpdatePersonalDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/personal-details", {
        fatherName: data.fatherName,
        motherName: data.motherName,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        location: data.location,
        panNo: data.panNo,
        accountNo: data.accountNo,
        ifscNo: data.ifscNo,
        bankName: data.bankName,
        branchName: data.branchName,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPersonalDetails"] });
    },
  });
};
