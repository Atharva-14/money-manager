import BankModal from "@/components/Bank/BankModal";
import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";
import SkeletonBank from "@/components/Skeleton/SkeletonBank";
import { useAuth } from "@/context/AuthContext";
import { getBanks } from "@/store/async-thunk";
import { formatIndianCurrency } from "@/utils/utils";
import { IconBuildingBank, IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Bank = () => {
  const { token } = useAuth();

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  const dispatch = useDispatch();

  const banks = useSelector((state) => state.bank.bankList);
  const isLoading = useSelector((state) => state.bank.loading);

  useEffect(() => {
    if (token) {
      dispatch(getBanks(token));
    }
  }, [dispatch, token]);

  const openBankModal = (bank = null) => {
    setSelectedBank(bank);
    setModalOpen(true);
  };

  const closeBankModal = () => {
    setModalOpen(false);
    setSelectedBank(null);
  };

  const deleteBank = async (id) => {
    try {
      const res = await axios.delete(
        `https://money-manager-backend-bsdc.onrender.com/api/bank/${id}`,
        {
          headers: {
            Accept: "application/json",
          },
          params: {
            token,
          },
        }
      );

      console.log("Delete Response", res.data);
    } catch (error) {
      console.error("Unable to delete bank: ", error);
    }
  };

  return (
    <>
      <BankModal
        open={isModalOpen}
        onClose={closeBankModal}
        bankData={selectedBank}
        fetchBank={() => dispatch(getBanks(token))}
      />
      <div className="w-full h-full flex flex-col py-10 px-[150px]">
        <h1 className="font-bold text-2xl text-white mb-6">Bank</h1>

        <div>
          <h2 className="font-semibold text-white mb-6">Connected Accounts</h2>
          <div className="flex flex-col space-y-6 mb-6 mx-1">
            {isLoading ? (
              <div className="space-y-3">
                <SkeletonBank />
                <SkeletonBank />
                <SkeletonBank />
                <SkeletonBank />
              </div>
            ) : (
              banks &&
              banks.map((bank) => (
                <div
                  className="flex justify-between items-center"
                  key={bank.bank_id}
                >
                  <div className="flex space-x-2 items-center">
                    <IconBuildingBank className="text-zinc-800 rounded h-10 w-12 py-1 bg-white" />

                    <p className="text-zinc-200 text-lg">{bank.bank_name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <p className="text-zinc-200 font-mono">
                      {formatIndianCurrency(bank.total_balance)}
                    </p>
                    <IconEdit
                      className="text-zinc-500 rounded h-6 w-6 hover:text-zinc-300 cursor-pointer"
                      onClick={() => openBankModal(bank)}
                    />
                    <IconTrash
                      className="text-zinc-500 rounded h-6 w-6 hover:text-zinc-300 cursor-pointer"
                      onClick={() => deleteBank(bank.bank_id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div>
            <h2 className="font-semibold text-white mb-4">Add Account</h2>
            <button
              className="text-zinc-200 font-medium py-2 px-4 bg-[#333333] hover:bg-[#1f1f1d] rounded"
              onClick={() => openBankModal()}
            >
              Connect New Bank
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivateRoute(Bank);
