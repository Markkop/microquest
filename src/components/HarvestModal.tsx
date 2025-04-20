import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHarvest } from "../hooks/useHarvest";
import Button from "./ui/Button";
import Modal from "./ui/Modal";

const HarvestModal: React.FC = () => {
  const { t } = useTranslation();
  const { showModal, rewards, isHarvesting, handleClaim, closeModal } =
    useHarvest();

  // Custom footer for the modal
  const footer = (
    <Button
      variant="gradient"
      className="w-full py-3"
      onClick={handleClaim}
      isLoading={isHarvesting}
    >
      {isHarvesting ? t("harvest.claiming") : t("harvest.claimContinue")}
    </Button>
  );

  return (
    <Modal
      isOpen={showModal}
      onClose={closeModal}
      showCloseButton={false}
      footer={footer}
    >
      <div className="flex justify-center mb-4">
        <motion.div
          className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles size={32} />
        </motion.div>
      </div>

      <h2 className="text-xl font-bold text-center mb-4">
        {t("harvest.title")}
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{t("harvest.xpEarned")}</span>
          <span className="font-bold text-primary-700">+{rewards.xp} XP</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">{t("harvest.creditsEarned")}</span>
          <span className="font-bold text-accent-600">
            +{rewards.credits} {t("common.credits")}
          </span>
        </div>

        {rewards.strengthGain > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t("stats.strength")}:</span>
            <span className="font-bold text-error-500">
              +{rewards.strengthGain}
            </span>
          </div>
        )}

        {rewards.vitalityGain > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t("stats.vitality")}:</span>
            <span className="font-bold text-success-500">
              +{rewards.vitalityGain}
            </span>
          </div>
        )}

        {rewards.focusGain > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t("stats.focus")}:</span>
            <span className="font-bold text-warning-500">
              +{rewards.focusGain}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default HarvestModal;
