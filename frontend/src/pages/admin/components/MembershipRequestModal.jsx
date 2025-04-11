import React, { useState, useEffect } from "react";
import ModalHeader from "./ModalHeader";
import StatusUpdateForm from "./StatusUpdateForm";
import MemberFields from "./MemberFields";
import { getStatusChangeMessage } from "../../../utils/adminMessages";

const MembershipRequestModal = ({
  member,
  isOpen,
  onClose,
  statuses,
  onStatusUpdate,
}) => {
  const [newStatusId, setNewStatusId] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);

  useEffect(() => {
    if (isOpen && member && statuses.length > 0) {
      const currentStatusName = member.status?.name;
      if (currentStatusName) {
        const matchingStatus = statuses.find(
          (status) => status.name === currentStatusName
        );
        setNewStatusId(matchingStatus ? String(matchingStatus.id) : "");
      }
    } else {
      setNewStatusId("");
      setMessage("");
      setIsMessageExpanded(false);
    }
  }, [isOpen, member, statuses]);

  useEffect(() => {
    if (newStatusId && member) {
      const currentStatusId = statuses.find(
        (s) => s.name === member.status?.name
      )?.id;
      if (newStatusId !== String(currentStatusId)) {
        const selectedStatus = statuses.find(
          (status) => String(status.id) === newStatusId
        );
        if (selectedStatus) {
          setMessage(getStatusChangeMessage(selectedStatus.slug) || "");
        }
      } else {
        setMessage("");
      }
    }
  }, [newStatusId, member, statuses]);

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-80">
      <div className="bg-white rounded-xl shadow-2xl p-2 w-full max-w-2xl transform transition-all duration-300">
        <ModalHeader onClose={onClose} isSaving={isSaving} />
        <div className="space-y-2">
          <MemberFields
            member={member}
            isMessageExpanded={isMessageExpanded}
            setIsMessageExpanded={setIsMessageExpanded}
          />
          <StatusUpdateForm
            newStatusId={newStatusId}
            setNewStatusId={setNewStatusId}
            message={message}
            setMessage={setMessage}
            statuses={statuses}
            currentStatusId={
              statuses.find((s) => s.name === member.status?.name)?.id
            }
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            onSave={(userId, statusId, msg) => {
              onStatusUpdate(userId, statusId, msg);
              setIsSaving(false);
              onClose();
            }}
            onCancel={onClose}
            userId={member.id}
          />
        </div>
      </div>
    </div>
  );
};

export default MembershipRequestModal;
