import React from "react";
import { Dialog } from "@headlessui/react";
import { useTranslation } from "react-i18next";

interface DeleteUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId: string | number;
}

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({ isOpen, onClose, onConfirm, userId }) => {
    const {t} = useTranslation();
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Manually handle background overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" aria-hidden="true" />
      )}

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
            Confirm Deletion
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            {t('delete.verification_user',{userId})}
          </Dialog.Description>

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DeleteUserForm;
